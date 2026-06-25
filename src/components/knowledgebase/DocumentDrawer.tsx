import React, { useEffect } from 'react';
import type { Document } from '../../types/document.types';
import {
  formatDate,
  formatFileSize,
  getFileTypeLabel,
} from "../../utils/document.utils";
interface DocumentDrawerProps {
  document: Document | null;
  onClose: () => void;
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const styles: Record<string, string> = {
    indexed: 'bg-zinc-900 text-zinc-300 border-zinc-700',
    processing: 'bg-zinc-900 text-zinc-400 border-zinc-700',
    failed: 'bg-zinc-900 text-red-400 border-red-900',
  };
  const dots: Record<string, string> = {
    indexed: 'bg-zinc-400',
    processing: 'bg-yellow-500',
    failed: 'bg-red-500',
  };
  const style = styles[status] ?? styles['processing'];
  const dot = dots[status] ?? dots['processing'];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-xs ${style}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const Field: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="py-3 border-b border-zinc-800 last:border-0">
    <p className="mb-1 text-xs text-zinc-500">{label}</p>
    <div className="text-sm text-white">{value}</div>
  </div>
);

const DocumentDrawer: React.FC<DocumentDrawerProps> = ({ document, onClose }) => {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const isOpen = document !== null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col border-l border-zinc-800 bg-zinc-950 shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <div>
            <p className="text-sm font-medium text-white">Document Details</p>
            <p className="text-xs text-zinc-500">Metadata and processing info</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded border border-zinc-800 text-zinc-400 transition hover:border-zinc-600 hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        {document && (
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {/* Icon + name */}
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-zinc-800 bg-zinc-900">
                <svg className="h-5 w-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="break-words text-sm font-medium text-white">{document.name}</p>
                <p className="text-xs text-zinc-500">{getFileTypeLabel(document.fileType)}</p>
              </div>
            </div>

            {/* Fields */}
            <div>
              <Field label="File Name" value={document.name} />
              <Field label="File Type" value={getFileTypeLabel(document.fileType)} />
              <Field
                label="File Size"
                value={document.fileSize ? formatFileSize(document.fileSize) : '—'}
              />
              <Field label="Upload Date" value={formatDate(document.uploadDate)} />
              <Field label="Processing Status" value={<StatusBadge status={document.status} />} />
              {document.chunks !== undefined && (
                <Field label="Number of Chunks" value={document.chunks} />
              )}
              {document.embeddingStatus && (
                <Field label="Embedding Status" value={document.embeddingStatus} />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DocumentDrawer;