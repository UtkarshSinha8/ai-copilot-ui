import { useLocation } from 'react-router-dom';
import { Bell, User } from 'lucide-react';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Overview', subtitle: 'Platform summary and capabilities' },
  '/dashboard/copilot': { title: 'AI Copilot', subtitle: 'Intelligent operations assistant' },
  '/dashboard/knowledge-base': { title: 'Knowledge Base', subtitle: 'Indexed documentation and runbooks' },
  '/dashboard/architecture': { title: 'Architecture', subtitle: 'System design and infrastructure topology' },
};

export const TopBar: React.FC = () => {
  const location = useLocation();
  const meta = pageTitles[location.pathname] ?? { title: 'Dashboard', subtitle: '' };

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-zinc-900 bg-black shrink-0">
      <div>
        <h1 className="text-white font-medium text-sm">{meta.title}</h1>
        <p className="text-zinc-500 text-xs mt-0.5">{meta.subtitle}</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-zinc-800">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-zinc-400 text-xs">Operational</span>
        </div>

        <button className="p-1.5 rounded-md text-zinc-600 hover:text-zinc-300 hover:bg-zinc-950 transition-colors">
          <Bell size={15} />
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-zinc-900">
          <div className="w-7 h-7 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            <User size={13} className="text-zinc-400" />
          </div>
        </div>
      </div>
    </header>
  );
};