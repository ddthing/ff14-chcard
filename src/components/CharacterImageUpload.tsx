// Lucian UX/UI Prompt #032 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#032
import { useRef, useState, type ChangeEvent, type CSSProperties, type DragEvent, type Ref, type RefCallback } from 'react';
import type { CharacterImageUploadCopy, CharacterImageUploadJob } from '../hooks/useCharacterImageUpload';
import './character-image-upload.css';

function formatBytes(bytes: number): string {
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    if (bytes >= 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    return `${bytes} B`;
}

interface CharacterImageUploadProps {
    inputRef: RefCallback<HTMLInputElement>;
    job: CharacterImageUploadJob | null;
    openPicker: () => void;
    handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
    handleDrop: (event: DragEvent<HTMLElement>) => void;
    cancel: () => void;
    retry: () => void;
    ariaLabel: string;
    triggerRef?: Ref<HTMLButtonElement>;
    messages: CharacterImageUploadCopy;
    mode?: 'dropzone' | 'compact' | 'status-only';
    className?: string;
}

export function CharacterImageUpload({ inputRef, job, openPicker, handleFileChange, handleDrop, cancel, retry, ariaLabel, triggerRef, messages, mode = 'dropzone', className = '' }: CharacterImageUploadProps) {
    const [isOver, setIsOver] = useState(false);
    const dragDepthRef = useRef(0);
    const percent = job && job.total > 0 ? Math.min(100, Math.floor((job.loaded / job.total) * 100)) : 0;
    const isBusy = job?.phase === 'reading' || job?.phase === 'validating';
    const isFailed = job?.phase === 'error';

    const onDragEnter = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        dragDepthRef.current++;
        setIsOver(true);
    };
    const onDragLeave = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
        if (dragDepthRef.current === 0) setIsOver(false);
    };
    const onDrop = (event: DragEvent<HTMLDivElement>) => {
        dragDepthRef.current = 0;
        setIsOver(false);
        handleDrop(event);
    };

    return (
        <div
            className={`ux u032 ${mode === 'status-only' ? 'u032--status-only' : ''} ${mode === 'compact' ? 'u032--compact' : ''} ${mode === 'compact' && job ? 'u032--has-job' : ''} ${isOver ? 'is-over' : ''} ${className}`.trim()}
            aria-busy={isBusy || undefined}
            onDragEnter={mode === 'dropzone' ? onDragEnter : undefined}
            onDragOver={mode === 'dropzone' ? event => event.preventDefault() : undefined}
            onDragLeave={mode === 'dropzone' ? onDragLeave : undefined}
            onDrop={mode === 'dropzone' ? onDrop : undefined}
        >
            <input
                ref={inputRef}
                className="u032-file"
                type="file"
                accept="image/*"
                aria-label={ariaLabel}
                tabIndex={-1}
                onChange={handleFileChange}
            />
            {mode === 'dropzone' && (
                <button ref={triggerRef} className="u032-zone" type="button" aria-label={ariaLabel} onClick={openPicker}>
                    <svg className="u032-dash" aria-hidden="true"><rect width="100%" height="100%" rx="25" /></svg>
                    <span className="u032-orb" aria-hidden="true">
                        <svg viewBox="0 0 28 28"><path d="M8.5 20.5H7a5 5 0 0 1-.6-10 7 7 0 0 1 13.4-1.6A5.5 5.5 0 0 1 21 20.5h-1.5M14 13v10M10.5 16.5L14 13l3.5 3.5" /></svg>
                    </span>
                    <b>{messages.dropPrompt}</b>
                    <small>{messages.dropHint}</small>
                </button>
            )}

            <ul className="u032-list" aria-live="off">
                {job && (
                    <li
                        className={`u032-row${job.phase === 'ready' ? ' done' : ''}${isFailed ? ' fail' : ''}`}
                        key={job.id}
                        style={{ '--p': `${job.phase === 'reading' ? percent / 100 : isFailed ? percent / 100 : 1}` } as CSSProperties}
                        aria-busy={isBusy || undefined}
                    >
                        <span className="u032-ic" aria-hidden="true">{(job.file.name.split('.').pop() || 'IMG').slice(0, 3).toUpperCase()}</span>
                        <span className="u032-meta">
                            <b title={job.file.name}>{job.file.name}</b>
                            {job.phase === 'reading' && (
                                <small>{messages.reading} · {formatBytes(job.loaded)} / {formatBytes(job.total)} · {percent}%</small>
                            )}
                            {job.phase === 'validating' && <small>{messages.validating}</small>}
                            {job.phase === 'ready' && <small>{messages.ready} · {formatBytes(job.file.size)}</small>}
                            {isFailed && <small role="alert">{job.errorCode === 'invalid-type' ? messages.invalidType : messages.readFailed}</small>}
                        </span>
                        {isBusy && <span className="u032-st" aria-hidden="true"><span className="u032-spin" /></span>}
                        {job.phase === 'ready' && (
                            <span className="u032-st" aria-hidden="true">
                                <svg viewBox="0 0 16 16"><path d="M3.5 8.4l3 3 6-6.4" /></svg>
                            </span>
                        )}
                        {isFailed && <button className="u032-retry" type="button" onClick={retry}>{messages.retry}</button>}
                        {isBusy && <button className="u032-cancel" type="button" onClick={cancel}>{messages.cancel}</button>}
                        <span
                            className="u032-bar"
                            aria-hidden={!isBusy ? true : undefined}
                            role={isBusy ? 'progressbar' : undefined}
                            aria-label={job.phase === 'reading' ? messages.reading : job.phase === 'validating' ? messages.validating : undefined}
                            aria-valuemin={job.phase === 'reading' ? 0 : undefined}
                            aria-valuemax={job.phase === 'reading' ? 100 : undefined}
                            aria-valuenow={job.phase === 'reading' ? percent : undefined}
                            aria-valuetext={job.phase === 'reading'
                                ? `${formatBytes(job.loaded)} / ${formatBytes(job.total)} · ${percent}%`
                                : job.phase === 'validating' ? messages.validating : undefined}
                        />
                    </li>
                )}
            </ul>
        </div>
    );
}
