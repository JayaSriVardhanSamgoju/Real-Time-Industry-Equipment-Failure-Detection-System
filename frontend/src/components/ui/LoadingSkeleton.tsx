import React from 'react';

interface Props {
  lines?: number;
  className?: string;
}

export const LoadingSkeleton: React.FC<Props> = ({ lines = 3, className = '' }) => {
  return (
    <div className={`space-y-3 animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div
            className="h-4 bg-bg-border rounded"
            style={{ width: `${100 - i * 15}%` }}
          />
        </div>
      ))}
      <div className="h-32 bg-bg-border rounded-card mt-2" />
    </div>
  );
};

export const ChartSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="flex items-center gap-2 mb-3">
      <div className="h-4 w-24 bg-bg-border rounded" />
      <div className="h-3 w-16 bg-bg-border rounded" />
    </div>
    <div className="h-48 bg-bg-border rounded-card relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-bg-elevated/50 to-transparent animate-scan-line" />
    </div>
  </div>
);
