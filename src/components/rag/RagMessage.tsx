import { useState } from 'react';
import { Copy, Check, User, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import { RagSources } from './RagSources';
import type { RagConversationEntry } from '../../types/rag.types';

interface RagMessageProps {
  entry: RagConversationEntry;
  index: number;
}

export const RagMessage: React.FC<RagMessageProps> = ({ entry, index }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(entry.answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="space-y-3"
    >
      {/* Question */}
      <div className="flex items-start gap-2.5">
        <div className="w-6 h-6 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
          <User size={11} className="text-zinc-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-zinc-200 text-sm leading-relaxed">{entry.question}</p>
        </div>
      </div>

      {/* Answer */}
      <div className="flex items-start gap-2.5">
        <div className="w-6 h-6 rounded-md bg-black border border-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
          <Cpu size={11} className="text-zinc-400" />
        </div>
        <div className="flex-1 min-w-0">
          {entry.error ? (
            <div className="px-3 py-2.5 rounded-md border border-zinc-800 bg-zinc-950">
              <p className="text-zinc-500 text-xs">{entry.answer}</p>
            </div>
          ) : (
            <div className="group relative">
              <div className="px-3 py-3 rounded-md border border-zinc-900 bg-zinc-950">
                <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {entry.answer}
                </p>
              </div>
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity text-zinc-600 hover:text-zinc-300 hover:bg-zinc-900"
                title="Copy answer"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
              </button>

              <RagSources
                sources={entry.sources}
                chunks={entry.chunks}
                context={entry.context}
              />
            </div>
          )}

          <p className="text-zinc-700 text-xs mt-1.5">
            {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    </motion.div>
  );
};