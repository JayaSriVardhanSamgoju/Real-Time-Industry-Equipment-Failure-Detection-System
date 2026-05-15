import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';

interface DistBin {
  range: string;
  training: number;
  live: number;
}

interface Props {
  data?: DistBin[];
}

const defaultData: DistBin[] = [
  { range: '0-20', training: 5, live: 8 },
  { range: '20-40', training: 15, live: 12 },
  { range: '40-60', training: 35, live: 30 },
  { range: '60-80', training: 30, live: 28 },
  { range: '80-100', training: 12, live: 18 },
  { range: '100+', training: 3, live: 6 },
];

export const DistributionCompare: React.FC<Props> = ({ data = defaultData }) => {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1E2D40" vertical={false} />
        <XAxis
          dataKey="range"
          tick={{ fontSize: 10, fill: '#4A5568' }}
          tickLine={false}
          axisLine={{ stroke: '#1E2D40' }}
        />
        <YAxis
          tick={{ fontSize: 10, fill: '#4A5568' }}
          tickLine={false}
          axisLine={{ stroke: '#1E2D40' }}
        />
        <Area
          type="monotone"
          dataKey="training"
          stroke="#3B82F6"
          fill="#3B82F6"
          fillOpacity={0.2}
          strokeWidth={1.5}
          name="Training"
        />
        <Area
          type="monotone"
          dataKey="live"
          stroke="#00D4FF"
          fill="#00D4FF"
          fillOpacity={0.3}
          strokeWidth={1.5}
          name="Live"
        />
        <Legend
          iconType="circle"
          wrapperStyle={{ fontSize: 10, color: '#8B9CC8' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
