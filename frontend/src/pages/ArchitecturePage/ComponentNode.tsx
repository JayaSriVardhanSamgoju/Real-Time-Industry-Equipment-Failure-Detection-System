import React from 'react';
import { clsx } from 'clsx';
import { Activity, Network, Database, Cpu, Server, AlertTriangle, Monitor } from 'lucide-react';

interface Props {
  id: string;
  label: string;
  type: string;
  isActive: boolean;
  onClick: () => void;
}

export const ComponentNode: React.FC<Props> = ({ id, label, type, isActive, onClick }) => {
  const getStyles = () => {
    switch (type) {
      case 'source': return 'border-cyan text-cyan hover:shadow-[0_0_15px_rgba(0,212,255,0.3)]';
      case 'stream': return 'border-blue text-blue hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]';
      case 'compute': return 'border-amber text-amber hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]';
      case 'ml': return 'border-purple-400 text-purple-400 hover:shadow-[0_0_15px_rgba(192,132,252,0.3)]';
      case 'alert': return 'border-red text-red hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]';
      case 'api': return 'border-green text-green hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]';
      default: return 'border-bg-border text-text-primary';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'source': return <Activity className="w-6 h-6" />;
      case 'stream': return <Network className="w-6 h-6" />;
      case 'compute': return <Cpu className="w-6 h-6" />;
      case 'ml': return <Server className="w-6 h-6" />;
      case 'alert': return <AlertTriangle className="w-6 h-6" />;
      case 'api': return <Monitor className="w-6 h-6" />;
      default: return <Database className="w-6 h-6" />;
    }
  };

  return (
    <button
      onClick={onClick}
      className={clsx(
        'relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 bg-bg-surface transition-all duration-300 min-w-[120px]',
        getStyles(),
        isActive ? 'scale-110 z-10 bg-bg-elevated' : 'hover:scale-105'
      )}
    >
      {isActive && (
        <div className="absolute inset-0 rounded-xl bg-current opacity-10 animate-pulse pointer-events-none" />
      )}
      <div className="p-3 rounded-lg bg-bg-base border border-current/30">
        {getIcon()}
      </div>
      <div className="text-center">
        <div className="text-xs font-display font-bold uppercase tracking-wider">{label}</div>
      </div>
    </button>
  );
};
