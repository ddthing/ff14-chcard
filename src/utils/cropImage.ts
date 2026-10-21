import { readBlobAsDataUrl } from './imageFile'
import { canvasToPngBlob } from './png'

export const createImage = (url: string, signal?: AbortSignal): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    let settled = false
    const finish = (callback: () => void) => {
      if (settled) return
      settled = true
      signal?.removeEventListener('abort', abort)
      image.onload = null
      image.onerror = null
      callback()
    }
    const abort = () => finish(() => {
      image.src = ''
      reject(signal?.reason)
    })
    if (signal?.aborted) {
      abort()
      return
    }
    image.onload = () => finish(() => resolve(image))
    image.onerror = error => finish(() => reject(error))
    signal?.addEventListener('abort', abort, { once: true })
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })

export function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
export function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation)

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  }
}

class CropProcessingError extends Error {}

/**
 * Draw the requested crop directly into its final canvas. This avoids a full
 * rotated-source canvas and the additional ImageData copy used by the old path.
 */
export default async function getCroppedImg(
  imageSrc: string | HTMLImageElement,
  pixelCrop: { x: number; y: number; width: number; height: number },
  rotation = 0,
  flip = { horizontal: false, vertical: false },
  signal?: AbortSignal
): Promise<string | null> {
  let image: HTMLImageElement
  try {
    signal?.throwIfAborted()
    image = typeof imageSrc === 'string' ? await createImage(imageSrc, signal) : imageSrc
  } catch {
    signal?.throwIfAborted()
    throw new CropProcessingError('The source image could not be decoded for cropping.')
  }

  const cropX = Math.trunc(pixelCrop.x)
  const cropY = Math.trunc(pixelCrop.y)
  const cropWidth = Math.trunc(pixelCrop.width)
  const cropHeight = Math.trunc(pixelCrop.height)
  // Canvas width/height attributes are unsigned 32-bit values; reject values
  // that would wrap when assigned, while leaving actual limits to the browser.
  const maxCanvasDimension = 0xffffffff

  if (
    !Number.isFinite(rotation) ||
    !Number.isFinite(pixelCrop.x) ||
    !Number.isFinite(pixelCrop.y) ||
    !Number.isFinite(pixelCrop.width) ||
    !Number.isFinite(pixelCrop.height) ||
    !Number.isFinite(cropX) ||
    !Number.isFinite(cropY) ||
    image.naturalWidth <= 0 ||
    image.naturalHeight <= 0 ||
    cropWidth <= 0 ||
    cropHeight <= 0 ||
    cropWidth > maxCanvasDimension ||
    cropHeight > maxCanvasDimension
  ) {
    throw new CropProcessingError('The selected crop has invalid dimensions.')
  }

  const canvas = document.createElement('canvas')
  try {
    canvas.width = cropWidth
    canvas.height = cropHeight
    if (canvas.width !== cropWidth || canvas.height !== cropHeight) {
      throw new CropProcessingError('The browser cannot allocate a canvas at the selected crop size.')
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) throw new CropProcessingError('The browser could not create a crop canvas.')

    const rotRad = getRadianAngle(rotation)
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
      image.naturalWidth,
      image.naturalHeight,
      rotation
    )

    // Map the source through the same rotate/flip transform as before, offset
    // by the selected crop so only pixels in the output rectangle are rasterized.
    ctx.translate(-cropX, -cropY)
    ctx.translate(bBoxWidth / 2, bBoxHeight / 2)
    ctx.rotate(rotRad)
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1)
    ctx.translate(-image.naturalWidth / 2, -image.naturalHeight / 2)
    ctx.drawImage(image, 0, 0)

    const blob = await canvasToPngBlob(canvas, signal)
    // The raster is no longer needed while FileReader builds the storage value.
    canvas.width = 0
    canvas.height = 0
    const output = await readBlobAsDataUrl(blob, { signal })
    if (!output.startsWith('data:image/png;base64,')) {
      throw new CropProcessingError('The browser could not encode the crop as a full-resolution PNG.')
    }
    return output
  } catch (error) {
    signal?.throwIfAborted()
    if (error instanceof CropProcessingError) throw error
    throw new CropProcessingError('The browser could not render or encode the crop at its original resolution.')
  } finally {
    canvas.width = 0
    canvas.height = 0
  }
}
