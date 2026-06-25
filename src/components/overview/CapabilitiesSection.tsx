import { motion } from 'framer-motion';
import { Search, Brain, GitMerge, AlertTriangle, FileText, Layers } from 'lucide-react';

interface Capability {
  icon: React.ReactNode;
  title: string;
  description: string;
  tag: string;
}

const capabilities: Capability[] = [
  {
    icon: <Search size={15} />,
    title: 'Semantic Search',
    description: 'Vector-embedded knowledge retrieval across runbooks, incidents, and documentation using pgvector similarity search.',
    tag: 'RAG Core',
  },
  {
    icon: <Brain size={15} />,
    title: 'Contextual Reasoning',
    description: 'LLM-powered analysis via OpenRouter that synthesizes retrieved context to produce grounded, accurate responses.',
    tag: 'LLM',
  },
  {
    icon: <GitMerge size={15} />,
    title: 'Async Ingestion Pipeline',
    description: 'BullMQ-driven document processing pipeline that chunks, embeds, and indexes knowledge artifacts at scale.',
    tag: 'Pipeline',
  },
  {
    icon: <AlertTriangle size={15} />,
    title: 'Incident Correlation',
    description: 'Automated correlation of live alerts with historical incidents to surface root cause hypotheses in real time.',
    tag: 'AIOps',
  },
  {
    icon: <FileText size={15} />,
    title: 'Runbook Automation',
    description: 'Structured runbook execution with step tracking, LLM-assisted decision branching, and audit logging.',
    tag: 'Automation',
  },
  {
    icon: <Layers size={15} />,
    title: 'Multi-tenant Scoping',
    description: 'Namespace-aware retrieval that isolates knowledge domains per team, service, or environment boundary.',
    tag: 'Isolation',
  },
];

export const CapabilitiesSection: React.FC = () => {
  return (
    <div>
      <div className="mb-5">
        <h3 className="text-white font-medium text-sm">Platform Capabilities</h3>
        <p className="text-zinc-500 text-xs mt-1">Core features powering the AI operations loop</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {capabilities.map((cap, i) => (
          <motion.div
            key={cap.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="p-4 rounded-lg bg-zinc-950 border border-zinc-900 hover:border-zinc-800 transition-colors duration-150"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-1.5 rounded-md bg-black border border-zinc-900 text-zinc-400">
                {cap.icon}
              </div>
              <span className="text-xs text-zinc-600 border border-zinc-900 px-1.5 py-0.5 rounded">
                {cap.tag}
              </span>
            </div>
            <h4 className="text-zinc-200 text-sm font-medium mb-1.5">{cap.title}</h4>
            <p className="text-zinc-500 text-xs leading-relaxed">{cap.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};