import React, { useCallback, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  Tooltip,
} from 'recharts';
import type { AnomalyChartPoint } from '@/types/chart.types';
import { useInsightStore } from '@/store/useInsightStore';
import type { ChartExplanation } from '@/types/chart.types';

interface Props {
  data: AnomalyChartPoint[];
  onPointClick?: (point: AnomalyChartPoint) => void;
}

export const anomalyChartExplanation: ChartExplanation = {
  chartId: 'anomaly-timeline',
  title: 'Anomaly Score Timeline',
  description: 'Isolation Forest anomaly scores over time with adaptive threshold',
  dataSource: '/recent_anomalies/',
  updateFrequency: '3s polling',
};

const AnomalyDot: React.FC<Record<string, unknown>> = (props) => {
  const { cx, cy, payload } = props as { cx: number; cy: number; payload: AnomalyChartPoint };
  if (!payload.isAnomaly) return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r={6} fill="#EF4444" opacity={0.3}>
        <animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx={cx} cy={cy} r={3} fill="#EF4444" />
    </g>
  );
};

export const AnomalyScoreChart: React.FC<Props> = ({ data, onPointClick }) => {
  const setInsight = useInsightStore((s) => s.setInsight);
  const clearInsight = useInsightStore((s) => s.clearInsight);

  const avgThreshold = useMemo(() => {
    if (data.length === 0) return 0.72;
    return data.reduce((acc, d) => acc + d.threshold, 0) / data.length;
  }, [data]);

  const handleMouseMove = useCallback(
    (state: Record<string, unknown>) => {
      if (!state || !state.activePayload) return;
      const payload = (state.activePayload as Array<{ payload: AnomalyChartPoint }>)[0]?.payload;
      if (!payload) return;

      const severity = payload.isAnomaly ? 'critical' : payload.anomalyScore > 0.5 ? 'warning' : 'normal';

      setInsight({
        chartId: 'anomaly-timeline',
        timestamp: payload.timestamp,
        sensorValue: payload.anomalyScore,
        sensorUnit: '',
        sensorName: 'Anomaly Score',
        operational: payload.isAnomaly
          ? `Anomaly detected at ${payload.formattedTime}. Score ${payload.anomalyScore.toFixed(3)} exceeds threshold ${payload.threshold.toFixed(3)}.`
          : `Normal operation at ${payload.formattedTime}. Score ${payload.anomalyScore.toFixed(3)} is below threshold.`,
        mlReasoning: payload.isAnomaly
          ? `Isolation Forest classified this as HIGH CONFIDENCE anomaly. The feature vector combining temperature (${payload.temperature.toFixed(1)}°C), vibration (${payload.vibration.toFixed(2)} mm/s), and humidity (${payload.humidity.toFixed(1)}%) deviates significantly from learned baselines.`
          : `Feature vector is within the learned normal distribution. Isolation Forest assigns low anomaly probability.`,
        statistical: `Score: ${payload.anomalyScore.toFixed(3)}, Threshold: ${payload.threshold.toFixed(3)}, Δ: ${(payload.anomalyScore - payload.threshold).toFixed(3)}`,
        riskAssessment: payload.isAnomaly
          ? 'Elevated risk detected. Multi-sensor analysis indicates potential equipment degradation.'
          : 'No elevated risk. Equipment operating within normal parameters.',
        correlations: `Temp: ${payload.temperature.toFixed(1)}°C, Vib: ${payload.vibration.toFixed(2)} mm/s, Hum: ${payload.humidity.toFixed(1)}%`,
        severity,
        anomalyScore: payload.anomalyScore,
        thresholdValue: payload.threshold,
        isAnomaly: payload.isAnomaly,
      });
    },
    [setInsight]
  );

  const handleClick = useCallback(
    (state: Record<string, unknown>) => {
      if (!state || !state.activePayload || !onPointClick) return;
      const payload = (state.activePayload as Array<{ payload: AnomalyChartPoint }>)[0]?.payload;
      if (payload?.isAnomaly) onPointClick(payload);
    },
    [onPointClick]
  );

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart
        data={data}
        onMouseMove={handleMouseMove}
        onMouseLeave={clearInsight}
        onClick={handleClick}
        margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
      >
        <defs>
          <linearGradient id="anomalyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EF4444" stopOpacity={0.3} />
            <stop offset="50%" stopColor="#F59E0B" stopOpacity={0.1} />
            <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1E2D40" vertical={false} />
        <XAxis
          dataKey="formattedTime"
          tick={{ fontSize: 10, fill: '#4A5568' }}
          tickLine={false}
          axisLine={{ stroke: '#1E2D40' }}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 10, fill: '#4A5568' }}
          tickLine={false}
          axisLine={{ stroke: '#1E2D40' }}
          domain={[0, 1]}
        />
        <ReferenceLine
          y={avgThreshold}
          stroke="#F59E0B"
          strokeDasharray="6 3"
          label={{
            value: 'Adaptive Threshold',
            position: 'right',
            style: { fontSize: 9, fill: '#F59E0B' },
          }}
        />
        <Area
          type="monotone"
          dataKey="anomalyScore"
          stroke="#EF4444"
          strokeWidth={2}
          fill="url(#anomalyGrad)"
          dot={<AnomalyDot />}
          activeDot={{ r: 6, stroke: '#00D4FF', strokeWidth: 2, fill: '#fff' }}
          isAnimationActive={false}
        />
        <Tooltip content={() => null} />
      </AreaChart>
    </ResponsiveContainer>
  );
};
