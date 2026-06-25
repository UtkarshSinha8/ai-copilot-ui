import { motion } from 'framer-motion';

interface TechItem {
  name: string;
  role: string;
  category: string;
}

const stack: TechItem[] = [
  { name: 'React', role: 'Frontend UI', category: 'Frontend' },
  { name: 'TypeScript', role: 'Type Safety', category: 'Frontend' },
  { name: 'TailwindCSS', role: 'Styling', category: 'Frontend' },
  { name: 'NestJS', role: 'API Framework', category: 'Backend' },
  { name: 'PostgreSQL', role: 'Primary Database', category: 'Backend' },
  { name: 'pgvector', role: 'Vector Store', category: 'Backend' },
  { name: 'Redis', role: 'Cache & Sessions', category: 'Backend' },
  { name: 'BullMQ', role: 'Job Queue', category: 'Backend' },
  { name: 'OpenRouter', role: 'LLM Gateway', category: 'AI' },
  { name: 'JWT', role: 'Authentication', category: 'Security' },
];

const categoryOrder = ['Frontend', 'Backend', 'AI', 'Security'];

export const TechStackSection: React.FC = () => {
  const grouped = categoryOrder.reduce<Record<string, TechItem[]>>((acc, cat) => {
    acc[cat] = stack.filter((t) => t.category === cat);
    return acc;
  }, {});

  return (
    <div>
      <div className="mb-5">
        <h3 className="text-white font-medium text-sm">Technology Stack</h3>
        <p className="text-zinc-500 text-xs mt-1">Infrastructure and toolchain breakdown</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {categoryOrder.map((category, ci) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: ci * 0.06 }}
            className="p-4 rounded-lg bg-zinc-950 border border-zinc-900"
          >
            <div className="text-xs font-medium text-zinc-600 uppercase tracking-widest mb-3">
              {category}
            </div>
            <div className="space-y-2">
              {grouped[category].map((tech) => (
                <div key={tech.name} className="flex items-center justify-between">
                  <span className="text-zinc-300 text-xs font-medium">{tech.name}</span>
                  <span className="text-zinc-600 text-xs">{tech.role}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};