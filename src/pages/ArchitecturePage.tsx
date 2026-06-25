import { motion } from 'framer-motion';
import { ArchitectureDiagram } from '../components/architecture/ArchitectureDiagram';
import { Network } from 'lucide-react';

const flowSections = [
  {
    title: 'Request Flow',
    steps: [
      'User interacts via React frontend',
      'JWT-authenticated request to NestJS',
      'API resolves via service layer',
      'Response returned with structured payload',
    ],
  },
  {
    title: 'RAG Pipeline',
    steps: [
      'Query embedded via OpenRouter',
      'pgvector similarity search executed',
      'Top-k chunks retrieved and ranked',
      'LLM synthesizes grounded response',
    ],
  },
  {
    title: 'Ingestion Pipeline',
    steps: [
      'Document submitted to BullMQ queue',
      'Worker picks up and chunks document',
      'Embeddings generated per chunk',
      'Vectors upserted into pgvector store',
    ],
  },
];

const ArchitecturePage: React.FC = () => {
  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-3"
      >
        <div className="p-2 rounded-md bg-zinc-950 border border-zinc-900">
          <Network size={16} className="text-zinc-400" />
        </div>
        <div>
          <h2 className="text-white font-semibold text-base">System Architecture</h2>
          <p className="text-zinc-500 text-xs mt-0.5">Full infrastructure topology and data flow</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <ArchitectureDiagram />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-3"
      >
        {flowSections.map((flow) => (
          <div
            key={flow.title}
            className="p-4 rounded-lg bg-zinc-950 border border-zinc-900"
          >
            <h4 className="text-zinc-300 text-xs font-medium mb-3">{flow.title}</h4>
            <ol className="space-y-2">
              {flow.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-zinc-700 text-xs font-mono shrink-0 mt-0.5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-zinc-500 text-xs leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default ArchitecturePage;