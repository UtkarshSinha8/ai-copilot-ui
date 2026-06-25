import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight } from 'lucide-react';

interface ArchNode {
  id: string;
  label: string;
  sublabel: string;
}

const frontendNode: ArchNode = {
  id: 'frontend',
  label: 'React Frontend',
  sublabel: 'Vite · TypeScript · TailwindCSS',
};

const backendNode: ArchNode = {
  id: 'backend',
  label: 'NestJS Backend',
  sublabel: 'REST API · Guards · Interceptors',
};

const authNode: ArchNode = {
  id: 'auth',
  label: 'JWT Auth',
  sublabel: 'Access & Refresh Tokens',
};

const llmNode: ArchNode = {
  id: 'llm',
  label: 'OpenRouter',
  sublabel: 'LLM Gateway · Model Routing',
};

const queueNode: ArchNode = {
  id: 'queue',
  label: 'BullMQ',
  sublabel: 'Async Job Queue · Workers',
};

const redisNode: ArchNode = {
  id: 'redis',
  label: 'Redis',
  sublabel: 'Cache · Session Store · Queue Backend',
};

const pgNode: ArchNode = {
  id: 'postgres',
  label: 'PostgreSQL',
  sublabel: 'Primary Relational Database',
};

const pgvectorNode: ArchNode = {
  id: 'pgvector',
  label: 'pgvector',
  sublabel: 'Vector Embeddings · Similarity Search',
};

const cicdNode: ArchNode = {
  id: 'cicd',
  label: 'CI/CD Pipeline',
  sublabel: 'GitHub Actions · Lint · Test · Deploy',
};

const Node: React.FC<{ node: ArchNode; delay?: number }> = ({ node, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3, delay }}
    className="flex flex-col items-center gap-1.5 px-4 py-3 rounded-lg border border-zinc-800 bg-zinc-950 min-w-[148px]"
  >
    <span className="text-white text-xs font-medium">{node.label}</span>
    <span className="text-zinc-600 text-xs text-center leading-snug">{node.sublabel}</span>
  </motion.div>
);

const VArrow: React.FC = () => (
  <div className="flex justify-center py-1">
    <ArrowDown size={13} className="text-zinc-700" />
  </div>
);

const HArrow: React.FC = () => (
  <div className="flex items-center px-1">
    <ArrowRight size={12} className="text-zinc-700" />
  </div>
);

export const ArchitectureDiagram: React.FC = () => {
  return (
    <div className="p-6 rounded-lg border border-zinc-900 bg-black overflow-x-auto">
      <div className="min-w-[600px] flex flex-col items-center">

        <Node node={frontendNode} delay={0.05} />
        <VArrow />

        <div className="flex items-center gap-2">
          <Node node={backendNode} delay={0.1} />
          <HArrow />
          <Node node={authNode} delay={0.15} />
        </div>
        <VArrow />

        <div className="flex items-center gap-2">
          <Node node={llmNode} delay={0.2} />
          <HArrow />
          <Node node={queueNode} delay={0.25} />
          <HArrow />
          <Node node={redisNode} delay={0.3} />
        </div>
        <VArrow />

        <div className="flex items-center gap-2">
          <Node node={pgNode} delay={0.35} />
          <HArrow />
          <Node node={pgvectorNode} delay={0.4} />
        </div>
        <VArrow />

        <Node node={cicdNode} delay={0.45} />
      </div>
    </div>
  );
};