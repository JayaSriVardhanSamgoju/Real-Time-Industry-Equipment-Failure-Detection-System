import React, { useState, useEffect } from 'react';
import { GlowCard } from '@/components/ui/GlowCard';

export const AdaptiveThresholdExplainer: React.FC = () => {
  const [time, setTime] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => setTime(t => t + 1), 100);
    return () => clearInterval(interval);
  }, []);

  const generateData = () => {
    const data = [];
    let base = 30;
    for (let i = 0; i < 50; i++) {
      const isShift = i > 25;
      if (isShift) base = 60; // Simulate an operational shift
      const val = base + Math.sin((time + i) * 0.2) * 10 + Math.random() * 5;
      data.push(val);
    }
    return data;
  };

  const data = generateData();
  const rollingMean = data.map((_, i) => {
    const window = data.slice(Math.max(0, i - 10), i + 1);
    return window.reduce((a, b) => a + b, 0) / window.length;
  });

  return (
    <GlowCard className="p-6 h-full flex flex-col">
      <h3 className="text-lg font-display text-text-primary mb-2">Adaptive Thresholding</h3>
      <p className="text-sm font-body text-text-secondary mb-4 flex-1">
        Why adaptive? Fixed thresholds fail when machine behavior shifts normally (e.g., load changes). Adaptive thresholds follow the operational baseline using <code>mean + 2σ</code>.
      </p>

      <div className="relative h-40 w-full bg-bg-elevated rounded border border-bg-border flex items-end overflow-hidden px-2">
        {/* Draw data points */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 50 100">
          {/* Static Threshold (fails) */}
          <line x1="0" y1="50" x2="50" y2="50" stroke="#EF4444" strokeWidth="0.5" strokeDasharray="1 1" />
          
          {/* Adaptive Threshold */}
          <polyline
            points={rollingMean.map((val, i) => `${i},${100 - (val + 15)}`).join(' ')}
            fill="none"
            stroke="#F59E0B"
            strokeWidth="1"
            strokeDasharray="2 1"
          />
          
          {/* Data Line */}
          <polyline
            points={data.map((val, i) => `${i},${100 - val}`).join(' ')}
            fill="none"
            stroke="#00D4FF"
            strokeWidth="1"
          />
        </svg>
      </div>
      
      <div className="flex justify-between items-center mt-3 text-xs font-mono">
        <div className="flex items-center gap-2"><span className="w-3 h-0.5 bg-red" /> Fixed Threshold (False Alarms)</div>
        <div className="flex items-center gap-2"><span className="w-3 h-0.5 bg-amber" /> Adaptive Threshold</div>
      </div>
    </GlowCard>
  );
};
