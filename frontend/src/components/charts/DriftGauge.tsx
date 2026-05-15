import React from 'react';
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

interface Props {
  value: number;
  maxValue?: number;
  label: string;
  color?: string;
}

export const DriftGauge: React.FC<Props> = ({
  value,
  maxValue = 1,
  label,
  color = '#00D4FF',
}) => {
  const pct = Math.min((value / maxValue) * 100, 100);
  const data = [{ value: pct, fill: color }];
  const gaugeColor = pct > 70 ? '#EF4444' : pct > 40 ? '#F59E0B' : color;

  return (
    <div className="flex flex-col items-center">
      <div className="w-24 h-24 relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="70%"
            outerRadius="100%"
            data={data}
            startAngle={180}
            endAngle={0}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar
              dataKey="value"
              cornerRadius={10}
              fill={gaugeColor}
              background={{ fill: '#1E2D40' }}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-lg font-bold text-text-primary mt-2">
            {value.toFixed(2)}
          </span>
        </div>
      </div>
      <span className="text-[10px] font-display uppercase tracking-wider text-text-muted mt-1 text-center">
        {label}
      </span>
    </div>
  );
};
