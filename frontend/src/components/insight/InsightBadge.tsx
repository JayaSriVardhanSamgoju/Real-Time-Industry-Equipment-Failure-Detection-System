import React from 'react';
import { Zap } from 'lucide-react';
import { getSeverityColor } from '@/utils/colorUtils';
import type { Severity } from '@/types/anomaly.types';

interface Props {
  severity: Severity;
  label?: string;
  onClick?: () => void;
}

export const InsightBadge: React.FC<Props> = ({ severity, label = 'AI Insight', onClick }) => {
  const color = getSeverityColor(severity);

  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-badge text-[10px] font-display uppercase tracking-wider transition-all hover:scale-105 cursor-pointer"
      style={{
        backgroundColor: `${color}15`,
        border: `1px solid ${color}30`,
        color,
      }}
    >
      <Zap className="w-2.5 h-2.5" />
      {label}
    </button>
  );
};
