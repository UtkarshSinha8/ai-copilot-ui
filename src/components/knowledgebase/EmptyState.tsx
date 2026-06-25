import React from 'react';

interface EmptyStateProps {
  onUploadClick: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onUploadClick }) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900">
        <svg
          className="h-7 w-7 text-zinc-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <p className="mb-1 text-sm font-medium text-white">No documents uploaded</p>
      <p className="mb-6 text-sm text-zinc-500">
        Upload documents to build your knowledge base.
      </p>
      <button
        onClick={onUploadClick}
        className="rounded border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-white transition hover:bg-zinc-800"
      >
        Upload Document
      </button>
    </div>
  );
};

export default EmptyState;