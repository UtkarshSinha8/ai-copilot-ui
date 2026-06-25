import React, { useCallback, useRef, useState } from 'react';
import type { UploadState } from '../../types/document.types';


interface UploadZoneProps {
  onFileSelect: (file: File) => Promise<void>;
  isUploading: boolean;
  uploadProgress: number;
  uploadState: UploadState;
  uploadError: string | null;
}

const ACCEPTED = ['.pdf', '.docx', '.txt'];
const ACCEPTED_MIME = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];

const UploadZone: React.FC<UploadZoneProps> = ({
  onFileSelect,
  isUploading,
  uploadProgress,
  uploadState,
  uploadError,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!ACCEPTED_MIME.includes(file.type)) return;
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const stateLabel: Record<UploadState, string> = {
    idle: '',
   
    uploading: `Uploading... ${uploadProgress}%`,
    processing: 'Processing document...',
    success: 'Document indexed successfully',
    error: uploadError ?? 'Upload failed',
  };

  const borderColor = isDragging
    ? 'border-zinc-500'
    : uploadState === 'error'
    ? 'border-red-900'
    : uploadState === 'success'
    ? 'border-zinc-700'
    : 'border-zinc-800';

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => !isUploading && inputRef.current?.click()}
      className={`relative cursor-pointer rounded border-2 border-dashed ${borderColor} bg-zinc-950 px-6 py-8 text-center transition-colors hover:border-zinc-600 ${
        isUploading ? 'pointer-events-none' : ''
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(',')}
        onChange={onInputChange}
        className="hidden"
      />

      {/* Icon */}
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded border border-zinc-800 bg-zinc-900">
        {isUploading ? (
          <svg className="h-4 w-4 animate-spin text-zinc-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        ) : (
          <svg className="h-4 w-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        )}
      </div>

      {/* Labels */}
      {!isUploading && uploadState === 'idle' && (
        <>
          <p className="mb-1 text-sm text-white">
            Drag and drop or{' '}
            <span className="underline underline-offset-2">click to browse</span>
          </p>
          <p className="text-xs text-zinc-500">Supports PDF, DOCX, TXT</p>
        </>
      )}

      {(isUploading || uploadState !== 'idle') && (
        <p
          className={`text-sm ${
            uploadState === 'error'
              ? 'text-red-400'
              : uploadState === 'success'
              ? 'text-zinc-300'
              : 'text-zinc-400'
          }`}
        >
          {stateLabel[uploadState]}
        </p>
      )}

      {/* Progress bar */}
      {uploadState === 'uploading' && (
        <div className="mx-auto mt-3 h-1 w-48 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full bg-zinc-400 transition-all duration-200"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default UploadZone;
