import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { COPY } from '@/config/copy';
import {
  LayoutDashboard,
  Activity,
  GitBranch,
  Brain,
  ChevronLeft,
  ChevronRight,
  Cpu,
} from 'lucide-react';
import { clsx } from 'clsx';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { path: '/', label: COPY.nav.landing, icon: <Cpu className="w-5 h-5" /> },
  { path: '/dashboard', label: COPY.nav.dashboard, icon: <LayoutDashboard className="w-5 h-5" /> },
  { path: '/architecture', label: COPY.nav.architecture, icon: <GitBranch className="w-5 h-5" /> },
  { path: '/explainability', label: COPY.nav.explainability, icon: <Brain className="w-5 h-5" /> },
];

interface Props {
  collapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<Props> = ({ collapsed, onToggle }) => {
  return (
    <aside
      className={clsx(
        'fixed left-0 top-0 bottom-0 z-30 flex flex-col bg-bg-surface border-r border-bg-border transition-all duration-300',
        collapsed ? 'w-16' : 'w-56'
      )}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 h-14 border-b border-bg-border">
        <div className="w-8 h-8 rounded-lg bg-cyan/10 flex items-center justify-center flex-shrink-0">
          <Activity className="w-4 h-4 text-cyan" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <div className="text-sm font-display font-bold text-text-primary tracking-wider">
              {COPY.brand.name}
            </div>
            <div className="text-[9px] font-display uppercase tracking-widest text-text-muted">
              {COPY.brand.version}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-card text-sm font-body transition-all',
                isActive
                  ? 'bg-cyan/10 text-cyan border border-cyan/20'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated border border-transparent'
              )
            }
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="flex items-center justify-center h-10 border-t border-bg-border text-text-muted hover:text-cyan transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
};
