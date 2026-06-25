import { MessageSquare, Trash2 } from 'lucide-react';
import type { RagConversationEntry } from '../../types/rag.types';

interface RagSidebarProps {
  history: RagConversationEntry[];
  onSelect: (entry: RagConversationEntry) => void;
  onClear: () => void;
  activeId?: string;
}

export const RagSidebar: React.FC<RagSidebarProps> = ({
  history,
  onSelect,
  onClear,
  activeId,
}) => {
  return (
    <aside className="w-56 shrink-0 border-r border-zinc-900 bg-black flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-3 border-b border-zinc-900">
        <span className="text-zinc-500 text-xs font-medium uppercase tracking-widest">
          Recent
        </span>
        {history.length > 0 && (
          <button
            onClick={onClear}
            className="p-1 rounded text-zinc-700 hover:text-zinc-400 hover:bg-zinc-950 transition-colors"
            title="Clear history"
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-2 space-y-0.5 px-2">
        {history.length === 0 ? (
          <div className="px-2 py-4 text-center">
            <p className="text-zinc-700 text-xs">No questions yet</p>
          </div>
        ) : (
          [...history].reverse().map((entry) => (
            <button
              key={entry.id}
              onClick={() => onSelect(entry)}
              className={`w-full text-left px-2.5 py-2 rounded-md transition-colors duration-100 group ${
                activeId === entry.id
                  ? 'bg-zinc-900 text-zinc-200'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-950'
              }`}
            >
              <div className="flex items-start gap-2">
                <MessageSquare size={11} className="shrink-0 mt-0.5 opacity-50" />
                <span className="text-xs leading-snug line-clamp-2 break-words">
                  {entry.question}
                </span>
              </div>
              <p className="text-zinc-700 text-xs mt-1 pl-[18px]">
                {entry.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </button>
          ))
        )}
      </div>
    </aside>
  );
};