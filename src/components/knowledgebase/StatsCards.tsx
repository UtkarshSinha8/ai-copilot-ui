import React from 'react';
import type { Document } from '../../types/document.types';

interface StatsCardsProps {
  documents: Document[];
}

interface StatCardProps {
  label: string;
  value: number;
  description: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, description }) => (
  <div className="rounded border border-zinc-800 bg-zinc-950 px-5 py-4">
    <p className="mb-1 text-xs text-zinc-500">{label}</p>
    <p className="mb-0.5 text-2xl font-semibold text-white">{value}</p>
    <p className="text-xs text-zinc-600">{description}</p>
  </div>
);

const StatsCards: React.FC<StatsCardsProps> = ({ documents }) => {
  const total = documents.length;
  const indexed = documents.filter((d) => d.status === 'indexed').length;
  const processing = documents.filter((d) => d.status === 'processing').length;
  const failed = documents.filter((d) => d.status === 'failed').length;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <StatCard label="Total Documents" value={total} description="All uploaded files" />
      <StatCard label="Indexed" value={indexed} description="Ready for RAG queries" />
      <StatCard label="Processing" value={processing} description="Currently ingesting" />
      <StatCard label="Failed" value={failed} description="Require attention" />
    </div>
  );
};

export default StatsCards;