import { Helmet } from 'react-helmet-async';
import type { PageMeta } from '../utils/pageMeta';

export const SITE_ORIGIN = 'https://ff14-chcard.pages.dev';
const SITE_NAME = 'FF14 캐릭터 카드 생성기';
const OG_IMAGE_URL = `${SITE_ORIGIN}/og-image.png`;

interface SeoHeadProps {
    meta: PageMeta;
    path: string;
    structuredData?: Record<string, unknown>;
}

function serializeStructuredData(data: Record<string, unknown>) {
    // Prevent a future user-controlled value from closing the script element.
    return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function SeoHead({ meta, path, structuredData }: SeoHeadProps) {
    const canonicalUrl = new URL(path, SITE_ORIGIN).toString();

    return (
        <Helmet>
            <title>{meta.title}</title>
            <meta name="description" content={meta.description} />
            <link rel="canonical" href={canonicalUrl} />

            <meta property="og:type" content="website" />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:title" content={meta.title} />
            <meta property="og:description" content={meta.description} />
            <meta property="og:site_name" content={SITE_NAME} />
            <meta property="og:image" content={OG_IMAGE_URL} />
            <meta property="og:image:alt" content={meta.title} />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={canonicalUrl} />
            <meta name="twitter:title" content={meta.title} />
            <meta name="twitter:description" content={meta.description} />
            <meta name="twitter:image" content={OG_IMAGE_URL} />
            <meta name="twitter:image:alt" content={meta.title} />

            {structuredData && (
                <script type="application/ld+json">
                    {serializeStructuredData(structuredData)}
                </script>
            )}
        </Helmet>
    );
}
