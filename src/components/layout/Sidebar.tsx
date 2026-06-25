import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Bot,
  Database,
  Network,
  ChevronLeft,
  ChevronRight,
  Cpu,
  MessageSquare,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: SidebarItem[] = [
  { id: 'overview', label: 'Overview', path: '/dashboard', icon: <LayoutDashboard size={16} /> },
  { id: 'copilot', label: 'AI Copilot', path: '/dashboard/copilot', icon: <Bot size={16} /> },
  { id: 'rag-chat', label: 'RAG Chat', path: '/dashboard/rag-chat', icon: <MessageSquare size={16} /> },
  { id: 'knowledge-base', label: 'Knowledge Base', path: '/dashboard/knowledge-base', icon: <Database size={16} /> },
  { id: 'architecture', label: 'Architecture', path: '/dashboard/architecture', icon: <Network size={16} /> },
];

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <motion.aside
      animate={{ width: collapsed ? 56 : 220 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="relative flex flex-col h-screen bg-black border-r border-zinc-900 shrink-0 overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 py-4 border-b border-zinc-900">
        <div className="flex items-center justify-center w-7 h-7 rounded-md bg-white shrink-0">
          <Cpu size={14} className="text-black" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col min-w-0"
            >
              <span className="text-white font-semibold text-sm leading-tight truncate">OpsCore</span>
              <span className="text-zinc-500 text-xs truncate">AI Platform</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-hidden">
        {navItems.map((item) => {
          const isActive =
            item.path === '/dashboard'
              ? location.pathname === '/dashboard'
              : location.pathname.startsWith(item.path);

          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md transition-colors duration-100 ${
                isActive
                  ? 'bg-zinc-900 text-white'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-950'
              }`}
            >
              <span className="shrink-0">{item.icon}</span>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-sm truncate"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="px-2 py-3 border-t border-zinc-900">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full py-1.5 rounded-md text-zinc-600 hover:text-zinc-400 hover:bg-zinc-950 transition-colors duration-100"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>
    </motion.aside>
  );
};