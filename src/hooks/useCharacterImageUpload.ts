import { useCallback, useEffect, useRef, useState, type ChangeEvent, type DragEvent, type RefCallback } from 'react';
import { ImageFileError, readImageFile, type ImageFileErrorCode, type ImageReadPhase } from '../utils/imageFile';

export interface CharacterImageUploadCopy {
    dropPrompt: string;
    dropHint: string;
    reading: string;
    validating: string;
    ready: string;
    retry: string;
    cancel: string;
    invalidType: string;
    readFailed: string;
}

export type CharacterImageUploadPhase = ImageReadPhase | 'ready' | 'error';

export interface CharacterImageUploadJob {
    id: number;
    file: File;
    phase: CharacterImageUploadPhase;
    loaded: number;
    total: number;
    errorCode?: Exclude<ImageFileErrorCode, 'aborted'>;
}

interface CharacterImageUploadOptions {
    onImageReady: (dataUrl: string) => void;
    onSelectionStart?: () => void;
}

interface ActiveUploadSession {
    owner: symbol;
    requestId: number;
    controller: AbortController;
    invalidate: () => void;
}

let activeUploadSession: ActiveUploadSession | null = null;

export interface CharacterImageUploadController {
    setInputRef: RefCallback<HTMLInputElement>;
    job: CharacterImageUploadJob | null;
    openPicker: () => void;
    handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
    handleDrop: (event: DragEvent<HTMLElement>) => void;
    cancel: () => void;
    retry: () => void;
    dismissCompleted: () => void;
}

export function useCharacterImageUpload({ onImageReady, onSelectionStart }: CharacterImageUploadOptions): CharacterImageUploadController {
    const inputRef = useRef<HTMLInputElement>(null);
    const ownerRef = useRef(Symbol('character-image-upload'));
    const requestIdRef = useRef(0);
    const completedRequestIdRef = useRef<number | null>(null);
    const controllerRef = useRef<AbortController | null>(null);
    const onImageReadyRef = useRef(onImageReady);
    const onSelectionStartRef = useRef(onSelectionStart);
    const [job, setJob] = useState<CharacterImageUploadJob | null>(null);

    useEffect(() => { onImageReadyRef.current = onImageReady; }, [onImageReady]);
    useEffect(() => { onSelectionStartRef.current = onSelectionStart; }, [onSelectionStart]);

    const setInputRef = useCallback((element: HTMLInputElement | null) => {
        inputRef.current = element;
    }, []);

    const startFile = useCallback((file: File) => {
        if (activeUploadSession) {
            const previous = activeUploadSession;
            activeUploadSession = null;
            previous.invalidate();
        }

        controllerRef.current?.abort();
        completedRequestIdRef.current = null;
        onSelectionStartRef.current?.();

        const requestId = ++requestIdRef.current;
        const controller = new AbortController();
        controllerRef.current = controller;
        const initialJob: CharacterImageUploadJob = {
            id: requestId,
            file,
            phase: 'reading',
            loaded: 0,
            total: file.size,
        };
        setJob(initialJob);

        const invalidate = () => {
            controller.abort();
            if (controllerRef.current === controller) {
                requestIdRef.current++;
                controllerRef.current = null;
                setJob(null);
            }
            if (completedRequestIdRef.current === requestId) completedRequestIdRef.current = null;
            onSelectionStartRef.current?.();
        };
        activeUploadSession = { owner: ownerRef.current, requestId, controller, invalidate };

        void readImageFile(file, {
            signal: controller.signal,
            onProgress: (loaded, total) => {
                if (controller.signal.aborted || requestIdRef.current !== requestId) return;
                setJob(current => current?.id === requestId ? { ...current, loaded, total } : current);
            },
            onPhaseChange: (phase: ImageReadPhase) => {
                if (controller.signal.aborted || requestIdRef.current !== requestId) return;
                setJob(current => current?.id === requestId ? { ...current, phase } : current);
            },
        }).then(dataUrl => {
            if (controller.signal.aborted || requestIdRef.current !== requestId) return;
            completedRequestIdRef.current = requestId;
            setJob(current => current?.id === requestId ? null : current);
            onImageReadyRef.current(dataUrl);
        }).catch(error => {
            if (controller.signal.aborted || requestIdRef.current !== requestId) return;
            const errorCode = error instanceof ImageFileError && error.code === 'invalid-type'
                ? 'invalid-type'
                : 'read-failed';
            setJob(current => current?.id === requestId
                ? { ...current, phase: 'error', errorCode }
                : current);
        });
    }, []);

    const openPicker = useCallback(() => inputRef.current?.click(), []);
    const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const file = event.currentTarget.files?.[0];
        event.currentTarget.value = '';
        if (file) startFile(file);
    }, [startFile]);
    const handleDrop = useCallback((event: DragEvent<HTMLElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) startFile(file);
    }, [startFile]);
    const cancel = useCallback(() => {
        if (job?.phase !== 'reading' && job?.phase !== 'validating') return;
        requestIdRef.current++;
        controllerRef.current?.abort();
        if (activeUploadSession?.owner === ownerRef.current) activeUploadSession = null;
        controllerRef.current = null;
        completedRequestIdRef.current = null;
        setJob(null);
        onSelectionStartRef.current?.();
    }, [job?.phase]);
    const retry = useCallback(() => {
        if (job?.phase === 'error') startFile(job.file);
    }, [job, startFile]);
    const dismissCompleted = useCallback(() => {
        const requestId = completedRequestIdRef.current;
        if (requestId === null) return;

        completedRequestIdRef.current = null;
        const session = activeUploadSession;
        if (session?.owner === ownerRef.current && session.requestId === requestId) {
            activeUploadSession = null;
            if (controllerRef.current === session.controller) controllerRef.current = null;
        }
        setJob(current => current?.id === requestId && current.phase === 'ready' ? null : current);
    }, []);

    useEffect(() => () => {
        if (activeUploadSession?.owner === ownerRef.current) {
            activeUploadSession.controller.abort();
            activeUploadSession = null;
        }
        controllerRef.current?.abort();
        requestIdRef.current++;
    }, []);

    return { setInputRef, job, openPicker, handleFileChange, handleDrop, cancel, retry, dismissCompleted };
}
