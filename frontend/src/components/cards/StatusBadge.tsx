import React from 'react';
import { getAlertLevelColor } from '@/utils/colorUtils';

interface Props {
  severity: string;
}

export const StatusBadge: React.FC<Props> = ({ severity }) => {
  const color = getAlertLevelColor(severity);

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-badge text-[10px] font-display uppercase tracking-wider font-bold"
      style={{
        backgroundColor: `${color}15`,
        color,
        border: `1px solid ${color}30`,
      }}
    >
      {severity}
    </span>
  );
};
