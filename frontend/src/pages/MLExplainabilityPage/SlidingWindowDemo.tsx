import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlowCard } from '@/components/ui/GlowCard';

export const SlidingWindowDemo: React.FC = () => {
  const [windowPos, setWindowPos] = useState(0);
  const dataPoints = Array.from({ length: 40 }, (_, i) => Math.sin(i * 0.4) * 20 + 50 + (Math.random() * 5));
  const windowSize = 10;

  useEffect(() => {
    const interval = setInterval(() => {
      setWindowPos((prev) => (prev + 1) % (dataPoints.length - windowSize));
    }, 1000);
    return () => clearInterval(interval);
  }, [dataPoints.length]);

  const currentWindow = dataPoints.slice(windowPos, windowPos + windowSize);
  const mean = currentWindow.reduce((a, b) => a + b, 0) / windowSize;
  const std = Math.sqrt(currentWindow.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / windowSize);
  const max = Math.max(...currentWindow);

  return (
    <GlowCard className="p-6 h-full flex flex-col">
      <h3 className="text-lg font-display text-text-primary mb-2">Sliding Window</h3>
      <p className="text-sm font-body text-text-secondary mb-4 flex-1">
        The sliding window computes rolling statistics that form the feature vector for each ML inference, providing temporal context to point-in-time readings.
      </p>

      <div className="relative h-32 w-full bg-bg-elevated rounded border border-bg-border flex items-end px-2 pb-2">
        {dataPoints.map((val, i) => (
          <div
            key={i}
            className="flex-1 mx-[1px] bg-cyan/20 rounded-t transition-colors"
            style={{ 
              height: `${val}%`,
              backgroundColor: i >= windowPos && i < windowPos + windowSize ? '#00D4FF' : undefined
            }}
          />
        ))}
        {/* Window Highlight Box */}
        <motion.div
          className="absolute bottom-0 h-full border-2 border-cyan bg-cyan/10 pointer-events-none"
          animate={{
            left: `${(windowPos / dataPoints.length) * 100}%`,
            width: `${(windowSize / dataPoints.length) * 100}%`
          }}
          transition={{ type: 'tween', ease: 'linear', duration: 1 }}
        />
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4">
        <div className="bg-bg-elevated p-2 rounded text-center">
          <div className="text-[10px] text-text-muted font-display uppercase">Mean</div>
          <div className="text-sm font-mono text-cyan">{mean.toFixed(1)}</div>
        </div>
        <div className="bg-bg-elevated p-2 rounded text-center">
          <div className="text-[10px] text-text-muted font-display uppercase">Std Dev</div>
          <div className="text-sm font-mono text-amber">{std.toFixed(2)}</div>
        </div>
        <div className="bg-bg-elevated p-2 rounded text-center">
          <div className="text-[10px] text-text-muted font-display uppercase">Max</div>
          <div className="text-sm font-mono text-purple-400">{max.toFixed(1)}</div>
        </div>
      </div>
    </GlowCard>
  );
};
