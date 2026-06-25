import { motion } from 'framer-motion';

const badges = ['RAG Architecture', 'pgvector', 'BullMQ', 'OpenRouter'];

export const HeroSection: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-8 rounded-lg border border-zinc-900 bg-zinc-950"
    >
      <div className="flex flex-wrap gap-2 mb-5">
        {badges.map((b) => (
          <span
            key={b}
            className="inline-flex items-center px-2 py-0.5 rounded text-xs text-zinc-400 border border-zinc-800 bg-black"
          >
            {b}
          </span>
        ))}
      </div>

      <h2 className="text-2xl font-semibold text-white leading-snug mb-3">
        AI Operations Copilot Platform
      </h2>

      <p className="text-zinc-400 text-sm max-w-2xl leading-relaxed mb-6">
        A production-grade intelligent operations platform combining semantic search, retrieval-augmented generation, and autonomous reasoning to surface insights, diagnose incidents, and accelerate engineering workflows.
      </p>

      <div className="flex flex-wrap gap-8 pt-4 border-t border-zinc-900">
        {[
          { value: 'RAG', label: 'Retrieval Architecture' },
          { value: 'pgvector', label: 'Vector Store' },
          { value: 'BullMQ', label: 'Job Queue' },
          { value: 'OpenRouter', label: 'LLM Gateway' },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col gap-0.5">
            <span className="text-white font-medium text-sm">{stat.value}</span>
            <span className="text-zinc-500 text-xs">{stat.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};