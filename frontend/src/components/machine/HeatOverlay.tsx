import React from 'react';

interface Props {
  temperature: number;
  maxTemp?: number;
}

export const HeatOverlay: React.FC<Props> = ({ temperature, maxTemp = 100 }) => {
  const intensity = Math.min(Math.max((temperature - 60) / (maxTemp - 60), 0), 1);

  return (
    <div
      className="absolute inset-0 rounded-card pointer-events-none transition-opacity duration-500"
      style={{
        background: `radial-gradient(ellipse at center, rgba(239,68,68,${intensity * 0.15}) 0%, transparent 70%)`,
      }}
    />
  );
};
