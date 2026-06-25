import React from 'react';
import type { Document } from '../../types/document.types';
import {
  formatDate,
  formatFileSize,
  getFileTypeLabel,
} from "../../utils/document.utils";

interface DocumentCardProps {
  document: Document;
  onViewDetails: (doc: Document) => void;
  onDelete: (doc: Document) => void;
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string, { dot: string; text: string; border: string }> = {
    indexed: { dot: 'bg-zinc-400', text: 'text-zinc-300', border: 'border-zinc-700' },
    processing: { dot: 'bg-yellow-500', text: 'text-zinc-400', border: 'border-zinc-700' },
    failed: { dot: 'bg-red-500', text: 'text-red-400', border: 'border-red-900' },
  };
  const s = map[status] ?? map['processing'];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border bg-zinc-900 px-2 py-0.5 text-xs ${s.text} ${s.border}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const FileTypeTag: React.FC<{ type: string }> = ({ type }) => (
  <span className="rounded border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 text-xs text-zinc-400">
    {getFileTypeLabel(type)}
  </span>
);

const DocumentCard: React.FC<DocumentCardProps> = ({ document, onViewDetails, onDelete }) => {
  return (
    <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3.5 transition hover:bg-zinc-900/40">
      {/* Left: icon + info */}
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-zinc-800 bg-zinc-900">
          <svg className="h-4 w-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">{document.name}</p>
          <div className="mt-1 flex items-center gap-2">
            <FileTypeTag type={document.fileType} />
            {document.fileSize && (
              <span className="text-xs text-zinc-500">{formatFileSize(document.fileSize)}</span>
            )}
            <span className="text-xs text-zinc-600">·</span>
            <span className="text-xs text-zinc-500">{formatDate(document.uploadDate)}</span>
          </div>
        </div>
      </div>

      {/* Right: status + actions */}
      <div className="ml-4 flex shrink-0 items-center gap-3">
        <StatusBadge status={document.status} />

        <button
          onClick={() => onViewDetails(document)}
          className="rounded border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-300 transition hover:border-zinc-600 hover:text-white"
        >
          View Details
        </button>

        <button
          onClick={() => onDelete(document)}
          className="rounded border border-zinc-800 bg-zinc-900 p-1.5 text-zinc-500 transition hover:border-red-900 hover:text-red-400"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default DocumentCard;