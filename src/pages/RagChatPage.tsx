import { useState, useRef, useEffect, useCallback } from 'react';
import { Cpu, Database, AlertCircle, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { RagSidebar } from '../components/rag/RagSidebar';
import { RagInput } from '../components/rag/RagInput';
import { RagMessage } from '../components/rag/RagMessage';
import { askQuestion } from '../services/rag.service';
import type { RagConversationEntry } from '../types/rag.types';

const RagChatPage: React.FC = () => {
  const [conversation, setConversation] = useState<RagConversationEntry[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | undefined>();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation, loading]);

  const handleSubmit = useCallback(async () => {
    const question = input.trim();
    if (!question || loading) return;

    setInput('');
    setError(null);
    setLoading(true);

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    try {
      const response = await askQuestion({ question });

      const entry: RagConversationEntry = {
        id,
        question,
        answer: response.data.answer,
        sources: response.data.sources,
        chunks: response.data.chunks,
        context: response.data.context,
        timestamp: new Date(),
      };

      setConversation((prev) => [...prev, entry]);
      setActiveId(id);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to get a response. Please try again.';
      setError(message);

      const errorEntry: RagConversationEntry = {
        id,
        question,
        answer: message,
        timestamp: new Date(),
        error: true,
      };

      setConversation((prev) => [...prev, errorEntry]);
      setActiveId(id);
    } finally {
      setLoading(false);
    }
  }, [input, loading]);

  const handleSelectFromSidebar = (entry: RagConversationEntry) => {
    setActiveId(entry.id);
    const el = document.getElementById(`rag-entry-${entry.id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleClearConversation = () => {
    setConversation([]);
    setActiveId(undefined);
    setError(null);
  };

  return (
    <div className="flex h-full bg-black overflow-hidden">
      <RagSidebar
        history={conversation}
        onSelect={handleSelectFromSidebar}
        onClear={handleClearConversation}
        activeId={activeId}
      />

      {/* Main panel */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Header */}
        <div className="shrink-0 px-6 py-4 border-b border-zinc-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-md bg-zinc-950 border border-zinc-900">
              <Cpu size={15} className="text-zinc-400" />
            </div>
            <div>
              <h2 className="text-white font-medium text-sm">RAG Chat</h2>
              <p className="text-zinc-500 text-xs mt-0.5">
                Grounded document intelligence powered by semantic retrieval.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Database size={11} className="text-zinc-600" />
                <span className="text-zinc-600 text-xs">Uploaded Documents</span>
              </div>
              <div className="w-px h-3 bg-zinc-900" />
              <div className="flex items-center gap-1.5">
                <Cpu size={11} className="text-zinc-600" />
                <span className="text-zinc-600 text-xs">OpenRouter</span>
              </div>
            </div>

            {conversation.length > 0 && (
              <button
                onClick={handleClearConversation}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-zinc-900 text-zinc-500 hover:text-zinc-300 hover:border-zinc-800 transition-colors text-xs"
              >
                <Trash2 size={11} />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="shrink-0 mx-6 mt-4 flex items-center gap-2.5 px-3 py-2.5 rounded-md border border-zinc-800 bg-zinc-950">
            <AlertCircle size={13} className="text-zinc-500 shrink-0" />
            <p className="text-zinc-400 text-xs">{error}</p>
          </div>
        )}

        {/* Conversation area */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {conversation.length === 0 && !loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center h-full text-center"
            >
              <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-900 flex items-center justify-center mb-4">
                <Cpu size={18} className="text-zinc-600" />
              </div>
              <p className="text-zinc-400 text-sm font-medium mb-1">Ask your documents</p>
              <p className="text-zinc-600 text-xs max-w-xs leading-relaxed">
                Ask any question. The system will retrieve relevant context from your uploaded documents and generate a grounded answer.
              </p>
            </motion.div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-8">
              {conversation.map((entry, i) => (
                <div key={entry.id} id={`rag-entry-${entry.id}`}>
                  <RagMessage entry={entry} index={i} />
                </div>
              ))}

              {loading && (
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-black border border-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Cpu size={11} className="text-zinc-400" />
                  </div>
                  <div className="px-3 py-3 rounded-md border border-zinc-900 bg-zinc-950">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-zinc-500 animate-bounce [animation-delay:0ms]" />
                      <span className="w-1 h-1 rounded-full bg-zinc-500 animate-bounce [animation-delay:150ms]" />
                      <span className="w-1 h-1 rounded-full bg-zinc-500 animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="shrink-0 px-6 pb-6 pt-2 max-w-3xl mx-auto w-full">
          <RagInput
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default RagChatPage;