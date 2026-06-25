import { useRef, useEffect } from 'react';
import { ArrowUp, Loader2 } from 'lucide-react';

interface RagInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  disabled?: boolean;
}

export const RagInput: React.FC<RagInputProps> = ({
  value,
  onChange,
  onSubmit,
  loading,
  disabled = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!loading && value.trim()) onSubmit();
    }
  };

  return (
    <div className="border border-zinc-900 rounded-lg bg-zinc-950 focus-within:border-zinc-700 transition-colors duration-150">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask a question about your documents..."
        disabled={disabled || loading}
        rows={1}
        className="w-full bg-transparent px-3.5 pt-3 pb-1 text-sm text-zinc-200 placeholder-zinc-600 resize-none focus:outline-none disabled:opacity-50"
      />
      <div className="flex items-center justify-between px-3 pb-2.5 pt-1">
        <span className="text-zinc-700 text-xs">Shift + Enter for new line</span>
        <button
          onClick={onSubmit}
          disabled={!value.trim() || loading || disabled}
          className="flex items-center justify-center w-7 h-7 rounded-md bg-white text-black hover:bg-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-100"
        >
          {loading ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <ArrowUp size={13} />
          )}
        </button>
      </div>
    </div>
  );
};