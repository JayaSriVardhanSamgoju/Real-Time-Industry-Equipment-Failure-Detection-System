import React from 'react';
import { LiveIndicator } from '@/components/ui/LiveIndicator';
import { useSystemStore } from '@/store/useSystemStore';
import { COPY } from '@/config/copy';
import { formatDuration } from '@/utils/formatters';
import { Wifi, WifiOff } from 'lucide-react';

export const TopBar: React.FC = () => {
  const { isConnected, health, lastUpdated } = useSystemStore();

  return (
    <header className="h-10 flex items-center justify-between px-4 bg-bg-surface/80 backdrop-blur-glass border-b border-bg-border">
      <div className="flex items-center gap-4">
        <span className="text-xs font-display text-text-muted uppercase tracking-wider">
          {COPY.brand.tagline}
        </span>
      </div>
      <div className="flex items-center gap-4">
        {health && (
          <span className="text-[10px] font-mono text-text-muted">
            Uptime: {formatDuration(health.uptime_seconds)}
          </span>
        )}
        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <Wifi className="w-3.5 h-3.5 text-green" />
              <LiveIndicator />
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-red" />
              <span className="text-[10px] font-display uppercase tracking-wider text-red">
                Offline
              </span>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
