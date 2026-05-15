import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlowCard } from '@/components/ui/GlowCard';

export const IsolationForestViz: React.FC = () => {
  const [points, setPoints] = useState<Array<{ x: number; y: number; isAnomaly: boolean }>>([]);
  const [splits, setSplits] = useState<Array<{ x: number; y: number; isVertical: boolean }>>([]);
  const [activePoint, setActivePoint] = useState<number | null>(null);

  useEffect(() => {
    // Generate cluster of normal points
    const newPoints = Array.from({ length: 40 }, () => ({
      x: 30 + Math.random() * 40,
      y: 30 + Math.random() * 40,
      isAnomaly: false,
    }));
    // Generate a few anomalies
    newPoints.push(
      { x: 10, y: 15, isAnomaly: true },
      { x: 85, y: 90, isAnomaly: true },
      { x: 90, y: 20, isAnomaly: true }
    );
    setPoints(newPoints);
  }, []);

  const handlePointClick = (index: number) => {
    setActivePoint(index);
    const point = points[index];
    
    // Simulate random splits to isolate the point
    const newSplits = [];
    let minX = 0, maxX = 100, minY = 0, maxY = 100;
    
    const depth = point.isAnomaly ? Math.floor(Math.random() * 2) + 2 : Math.floor(Math.random() * 4) + 6;
    
    for (let i = 0; i < depth; i++) {
      const isVertical = Math.random() > 0.5;
      if (isVertical) {
        const splitX = minX + Math.random() * (maxX - minX);
        newSplits.push({ x: splitX, y: 0, isVertical });
        if (point.x < splitX) maxX = splitX;
        else minX = splitX;
      } else {
        const splitY = minY + Math.random() * (maxY - minY);
        newSplits.push({ x: 0, y: splitY, isVertical });
        if (point.y < splitY) maxY = splitY;
        else minY = splitY;
      }
    }
    setSplits(newSplits);
  };

  return (
    <GlowCard className="p-6 h-full flex flex-col">
      <h3 className="text-lg font-display text-text-primary mb-2">Isolation Forest</h3>
      <p className="text-sm font-body text-text-secondary mb-4 flex-1">
        Isolation Forest builds an ensemble of random decision trees.
        Anomalous points are isolated near the root because they are rare
        and statistically different — requiring fewer random splits to isolate.
      </p>
      
      <div className="relative w-full aspect-square bg-bg-elevated rounded-lg border border-bg-border overflow-hidden">
        {/* Draw splits */}
        {splits.map((split, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.2, duration: 0.3 }}
            className="absolute bg-cyan/30"
            style={{
              left: split.isVertical ? `${split.x}%` : '0',
              top: split.isVertical ? '0' : `${split.y}%`,
              width: split.isVertical ? '1px' : '100%',
              height: split.isVertical ? '100%' : '1px',
            }}
          />
        ))}

        {/* Draw points */}
        {points.map((p, i) => (
          <motion.button
            key={i}
            onClick={() => handlePointClick(i)}
            className="absolute w-3 h-3 -ml-1.5 -mt-1.5 rounded-full cursor-pointer transition-transform hover:scale-150"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              backgroundColor: p.isAnomaly ? '#EF4444' : '#00D4FF',
              boxShadow: activePoint === i ? `0 0 0 4px ${p.isAnomaly ? 'rgba(239,68,68,0.3)' : 'rgba(0,212,255,0.3)'}` : 'none',
              zIndex: activePoint === i ? 10 : 1,
            }}
          />
        ))}
        
        {activePoint !== null && (
          <div className="absolute top-2 left-2 bg-bg-surface/80 backdrop-blur text-[10px] font-mono p-2 rounded border border-bg-border">
            Path Length: {splits.length} (Depth)
            <br/>
            {points[activePoint].isAnomaly ? <span className="text-red">Anomaly Detected</span> : <span className="text-cyan">Normal Point</span>}
          </div>
        )}
      </div>
      <p className="text-xs text-text-muted mt-4 text-center">Click a point to visualize its isolation path</p>
    </GlowCard>
  );
};
