import React from 'react';
import type { Document } from '../../types/document.types';
import DocumentCard from './DocumentCard';
import EmptyState from './EmptyState';

interface DocumentListProps {
  documents: Document[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  onViewDetails: (doc: Document) => void;
  onDelete: (doc: Document) => void;
  onUploadClick: () => void;
  onRetry: () => void;
}

const SkeletonRow: React.FC = () => (
  <div className="flex items-center gap-3 border-b border-zinc-800 px-4 py-3.5">
    <div className="h-9 w-9 shrink-0 animate-pulse rounded border border-zinc-800 bg-zinc-800" />
    <div className="flex-1 space-y-2">
      <div className="h-3.5 w-48 animate-pulse rounded bg-zinc-800" />
      <div className="h-3 w-32 animate-pulse rounded bg-zinc-800" />
    </div>
    <div className="h-5 w-16 animate-pulse rounded bg-zinc-800" />
  </div>
);

const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  isLoading,
  error,
  searchQuery,
  onViewDetails,
  onDelete,
  onUploadClick,
  onRetry,
}) => {
  if (isLoading) {
    return (
      <div>
        {[...Array(4)].map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded border border-red-900 bg-zinc-900">
          <svg className="h-4 w-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="mb-1 text-sm font-medium text-white">Failed to load documents</p>
        <p className="mb-4 text-xs text-zinc-500">{error}</p>
        <button
          onClick={onRetry}
          className="rounded border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-white transition hover:bg-zinc-800"
        >
          Retry
        </button>
      </div>
    );
  }

  if (documents.length === 0 && !searchQuery) {
    return <EmptyState onUploadClick={onUploadClick} />;
  }

  if (documents.length === 0 && searchQuery) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm text-zinc-400">
          No documents match <span className="text-white">"{searchQuery}"</span>
        </p>
      </div>
    );
  }

  return (
    <div>
      {documents.map((doc) => (
        <DocumentCard
          key={doc.id}
          document={doc}
          onViewDetails={onViewDetails}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default DocumentList;