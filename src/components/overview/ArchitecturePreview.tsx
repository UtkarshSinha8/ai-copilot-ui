import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const layers = [
  { label: 'React Frontend' },
  { label: 'NestJS API' },
  { label: 'OpenRouter LLM' },
  { label: 'PostgreSQL + pgvector' },
];

export const ArchitecturePreview: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="p-5 rounded-lg bg-zinc-950 border border-zinc-900"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-white font-medium text-sm">Architecture Preview</h3>
          <p className="text-zinc-500 text-xs mt-0.5">Simplified system topology</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/architecture')}
          className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors"
        >
          Full diagram <ArrowRight size={11} />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {layers.map((layer, i) => (
          <div key={layer.label} className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-md bg-black border border-zinc-800 text-zinc-300 text-xs font-medium">
              {layer.label}
            </div>
            {i < layers.length - 1 && (
              <ArrowRight size={12} className="text-zinc-700 shrink-0" />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};