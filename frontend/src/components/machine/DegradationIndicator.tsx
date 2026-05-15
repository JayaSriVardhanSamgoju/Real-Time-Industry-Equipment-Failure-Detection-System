import React from 'react';
import type { Severity } from '@/types/anomaly.types';
import { getSeverityColor } from '@/utils/colorUtils';

interface Props {
  severity: Severity;
  progress: number; // 0 to 1
}

export const DegradationIndicator: React.FC<Props> = ({ severity, progress }) => {
  const color = getSeverityColor(severity);
  const pct = Math.min(Math.max(progress * 100, 0), 100);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-display uppercase tracking-wider text-text-muted">
          Degradation
        </span>
        <span className="text-xs font-mono" style={{ color }}>
          {pct.toFixed(0)}%
        </span>
      </div>
      <div className="h-1.5 bg-bg-elevated rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}60`,
          }}
        />
      </div>
    </div>
  );
};
