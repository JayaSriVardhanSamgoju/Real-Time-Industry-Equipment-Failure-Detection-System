import React from 'react';
import { useSystemStore } from '@/store/useSystemStore';
import { usePolling } from '@/hooks/usePolling';
import { fetchHealth } from '@/services/health.service';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

export const LivePreviewMetrics: React.FC = () => {
  const { health, setHealth } = useSystemStore();

  usePolling({
    fetchFn: fetchHealth,
    interval: 10000,
    onSuccess: setHealth,
  });

  if (!health) return null;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-center gap-8 md:gap-16 border-y border-bg-border py-6 bg-bg-surface/50 backdrop-blur-sm rounded-lg">
        <div className="text-center">
          <div className="text-xs font-display uppercase tracking-wider text-text-muted mb-1">Status</div>
          <div className="text-green font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green animate-pulse" />
            {health.status.toUpperCase()}
          </div>
        </div>
        <div className="w-px h-10 bg-bg-border" />
        <div className="text-center">
          <div className="text-xs font-display uppercase tracking-wider text-text-muted mb-1">Uptime</div>
          <div className="text-cyan font-mono text-lg">
            <AnimatedCounter value={health.uptime_seconds} />s
          </div>
        </div>
        <div className="w-px h-10 bg-bg-border" />
        <div className="text-center">
          <div className="text-xs font-display uppercase tracking-wider text-text-muted mb-1">Service</div>
          <div className="text-text-primary font-mono text-sm">{health.service}</div>
        </div>
      </div>
    </div>
  );
};
