import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { getCorrelationColor } from '@/utils/colorUtils';
import type { CorrelationCell } from '@/types/chart.types';
import { useInsightStore } from '@/store/useInsightStore';

interface Props {
  data: CorrelationCell[];
}

const SENSORS = ['Temperature', 'Vibration', 'Humidity'];

export const CorrelationHeatmap: React.FC<Props> = ({ data }) => {
  const setInsight = useInsightStore((s) => s.setInsight);
  const clearInsight = useInsightStore((s) => s.clearInsight);

  const grid = useMemo(() => {
    const map = new Map<string, number>();
    data.forEach((d) => map.set(`${d.row}-${d.col}`, d.value));
    return map;
  }, [data]);

  const handleCellHover = (row: string, col: string, value: number) => {
    const meaning =
      Math.abs(value) > 0.7
        ? `Strong ${value > 0 ? 'positive' : 'negative'} correlation (${value.toFixed(2)}) indicates these sensors are highly coupled during equipment operation.`
        : Math.abs(value) > 0.3
          ? `Moderate ${value > 0 ? 'positive' : 'negative'} correlation (${value.toFixed(2)}) suggests partial dependency between sensors.`
          : `Weak correlation (${value.toFixed(2)}) — sensors are largely independent.`;

    setInsight({
      chartId: 'correlation-heatmap',
      timestamp: new Date().toISOString(),
      sensorValue: value,
      sensorUnit: '',
      sensorName: `${row} × ${col}`,
      operational: `Correlation between ${row} and ${col}: ${value.toFixed(3)}`,
      mlReasoning: meaning,
      statistical: `Pearson correlation coefficient r = ${value.toFixed(3)}. R² = ${(value * value).toFixed(3)}.`,
      riskAssessment:
        Math.abs(value) > 0.7 && row !== col
          ? 'High correlation may indicate cascading failure mode — degradation in one sensor likely accompanies degradation in the other.'
          : 'No correlated degradation pattern detected.',
      correlations: `${row} vs ${col}: r = ${value.toFixed(3)}`,
      severity: 'normal',
      anomalyScore: 0,
      thresholdValue: 0,
      isAnomaly: false,
    });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="grid gap-1" style={{ gridTemplateColumns: `60px repeat(3, 1fr)` }}>
        {/* Header row */}
        <div />
        {SENSORS.map((s) => (
          <div key={s} className="text-[10px] font-display text-text-muted text-center px-1 truncate">
            {s.slice(0, 4)}
          </div>
        ))}
        {/* Data rows */}
        {SENSORS.map((row) => (
          <React.Fragment key={row}>
            <div className="text-[10px] font-display text-text-muted flex items-center truncate">
              {row.slice(0, 4)}
            </div>
            {SENSORS.map((col) => {
              const value = grid.get(`${row}-${col}`) ?? 0;
              return (
                <motion.div
                  key={`${row}-${col}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.05 }}
                  onMouseEnter={() => handleCellHover(row, col, value)}
                  onMouseLeave={clearInsight}
                  className="w-14 h-14 rounded flex items-center justify-center cursor-pointer border border-bg-border hover:border-cyan/30 transition-colors"
                  style={{ backgroundColor: getCorrelationColor(value) }}
                >
                  <span className="text-xs font-mono text-text-primary font-bold">
                    {value.toFixed(2)}
                  </span>
                </motion.div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
