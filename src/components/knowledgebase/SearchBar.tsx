import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
  totalCount: number;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, resultCount, totalCount }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1">
        <svg
          className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search documents..."
          className="w-full rounded border border-zinc-800 bg-zinc-950 py-2 pl-9 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-zinc-600"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {value && (
        <p className="shrink-0 text-xs text-zinc-500">
          {resultCount} of {totalCount}
        </p>
      )}
    </div>
  );
};

export default SearchBar;