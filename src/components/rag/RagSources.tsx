import { useState } from 'react';
import { ChevronDown, ChevronRight, FileText } from 'lucide-react';
import type { RagSource, RagChunk } from '../../types/rag.types';

interface RagSourcesProps {
  sources?: RagSource[];
  chunks?: RagChunk[];
  context?: string;
}

export const RagSources: React.FC<RagSourcesProps> = ({ sources, chunks, context }) => {
  const [open, setOpen] = useState(false);

  const hasSources =
    (sources && sources.length > 0) ||
    (chunks && chunks.length > 0) ||
    (context && context.trim().length > 0);

  if (!hasSources) return null;

  return (
    <div className="mt-3 border border-zinc-900 rounded-md overflow-hidden">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-3 py-2 bg-zinc-950 hover:bg-zinc-900 transition-colors duration-100"
      >
        <div className="flex items-center gap-2">
          <FileText size={12} className="text-zinc-500" />
          <span className="text-zinc-400 text-xs font-medium">
            {chunks && chunks.length > 0
              ? `Retrieved Context · ${chunks.length} chunk${chunks.length !== 1 ? 's' : ''}`
              : 'Sources Used'}
          </span>
        </div>
        {open ? (
          <ChevronDown size={12} className="text-zinc-600" />
        ) : (
          <ChevronRight size={12} className="text-zinc-600" />
        )}
      </button>

      {open && (
        <div className="bg-black px-3 py-3 space-y-3">
          {sources && sources.length > 0 && (
            <div className="space-y-1.5">
              {sources.map((source, i) => (
                <div
                  key={source.id ?? i}
                  className="flex items-center justify-between px-2.5 py-2 rounded border border-zinc-900 bg-zinc-950"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText size={11} className="text-zinc-600 shrink-0" />
                    <span className="text-zinc-300 text-xs truncate">
                      {source.filename ?? source.title ?? `Source ${i + 1}`}
                    </span>
                  </div>
                  {source.score !== undefined && (
                    <span className="text-zinc-600 text-xs shrink-0 ml-2 font-mono">
                      {(source.score * 100).toFixed(0)}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {chunks && chunks.length > 0 && (
            <div className="space-y-2">
              {chunks.map((chunk, i) => (
                <div
                  key={chunk.id ?? i}
                  className="px-2.5 py-2 rounded border border-zinc-900 bg-zinc-950"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-zinc-600 text-xs font-mono">
                      chunk_{String(i + 1).padStart(2, '0')}
                      {chunk.filename ? ` · ${chunk.filename}` : ''}
                    </span>
                    {chunk.score !== undefined && (
                      <span className="text-zinc-600 text-xs font-mono">
                        {(chunk.score * 100).toFixed(0)}%
                      </span>
                    )}
                  </div>
                  <p className="text-zinc-400 text-xs leading-relaxed line-clamp-4">
                    {chunk.content}
                  </p>
                </div>
              ))}
            </div>
          )}

          {context && context.trim().length > 0 && !chunks?.length && !sources?.length && (
            <div className="px-2.5 py-2 rounded border border-zinc-900 bg-zinc-950">
              <p className="text-zinc-400 text-xs leading-relaxed whitespace-pre-wrap">
                {context}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};