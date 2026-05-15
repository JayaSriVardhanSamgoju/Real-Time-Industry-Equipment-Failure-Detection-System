import React, { useCallback, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  Tooltip,
} from 'recharts';
import type { ChartDataPoint } from '@/types/chart.types';
import type { SensorType } from '@/types/machine.types';
import type { PredictionResult } from '@/types/api.types';
import { useInsightStore } from '@/store/useInsightStore';
import { generateInsight, computeRollingStats, determineSeverity } from '@/utils/insightGenerator';
import { getCorrelationValues } from '@/utils/chartHelpers';
import { getValueColor } from '@/utils/colorUtils';
import { THRESHOLDS } from '@/config/constants';
import type { ChartExplanation } from '@/types/chart.types';

interface Props {
  data: ChartDataPoint[];
  sensorType: SensorType;
  unit: string;
  threshold: number;
  liveData: PredictionResult[];
  title: string;
  currentValue: number;
}

export const explanation: Record<SensorType, ChartExplanation> = {
  temperature: {
    chartId: 'temperature-chart',
    title: 'Temperature Monitor',
    description: 'Real-time temperature readings from equipment thermal sensors',
    dataSource: '/live_data/',
    updateFrequency: '2s polling',
  },
  vibration: {
    chartId: 'vibration-chart',
    title: 'Vibration Monitor',
    description: 'Real-time vibration readings from accelerometer sensors',
    dataSource: '/live_data/',
    updateFrequency: '2s polling',
  },
  humidity: {
    chartId: 'humidity-chart',
    title: 'Humidity Monitor',
    description: 'Environmental humidity readings from hygrometer sensors',
    dataSource: '/live_data/',
    updateFrequency: '2s polling',
  },
};

const CustomActiveDot: React.FC<Record<string, unknown>> = (props) => {
  const { cx, cy } = props as { cx: number; cy: number };
  return (
    <g>
      <circle cx={cx} cy={cy} r={8} fill="transparent" stroke="#00D4FF" strokeWidth={2} opacity={0.6} />
      <circle cx={cx} cy={cy} r={4} fill="#fff" />
    </g>
  );
};

const AnomalyDot: React.FC<Record<string, unknown>> = (props) => {
  const { cx, cy, payload } = props as { cx: number; cy: number; payload: ChartDataPoint };
  const thresholdMap: Record<SensorType, number> = {
    temperature: THRESHOLDS.TEMPERATURE.critical,
    vibration: THRESHOLDS.VIBRATION.critical,
    humidity: THRESHOLDS.HUMIDITY.critical,
  };
  const sensorType = (props as Record<string, unknown>).sensorType as SensorType || 'temperature';
  const isAboveThreshold = payload.value > thresholdMap[sensorType];

  if (!isAboveThreshold) return null;

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

export const SensorLineChart: React.FC<Props> = ({
  data,
  sensorType,
  unit,
  threshold,
  liveData,
  title,
  currentValue,
}) => {
  const setInsight = useInsightStore((s) => s.setInsight);
  const clearInsight = useInsightStore((s) => s.clearInsight);
  const togglePinInsight = useInsightStore((s) => s.togglePinInsight);

  const valueColor = useMemo(() => {
    const t = THRESHOLDS[sensorType.toUpperCase() as keyof typeof THRESHOLDS];
    if (t && typeof t === 'object' && 'warning' in t && 'critical' in t) {
      return getValueColor(currentValue, (t as { warning: number; critical: number }).warning, (t as { warning: number; critical: number }).critical);
    }
    return '#00D4FF';
  }, [currentValue, sensorType]);

  const trend = useMemo(() => {
    if (data.length < 3) return '→';
    const last = data[data.length - 1].value;
    const prev = data[data.length - 3].value;
    if (last > prev + 0.5) return '↑';
    if (last < prev - 0.5) return '↓';
    return '→';
  }, [data]);

  const handleMouseMove = useCallback(
    (state: Record<string, unknown>) => {
      if (!state || !state.activePayload) return;
      const payload = (state.activePayload as Array<{ payload: ChartDataPoint }>)[0]?.payload;
      if (!payload) return;

      const values = data.map((d) => d.value);
      const { mean, std } = computeRollingStats(values.slice(-10));
      const severity = determineSeverity(sensorType, payload.value);
      const correlations = getCorrelationValues(liveData);

      const matchingPred = liveData.find((l) => l.timestamp === payload.timestamp);
      const anomalyScore = matchingPred?.anomaly_score ?? 0;
      const isAnomaly = matchingPred?.is_anomaly ?? false;
      const dynThreshold = matchingPred?.dynamic_threshold ?? threshold;

      const insight = generateInsight(
        sensorType,
        {
          timestamp: payload.timestamp,
          value: payload.value,
          anomalyScore,
          threshold: dynThreshold,
          isAnomaly,
        },
        { rollingMean: mean, rollingStd: std, severity },
        correlations
      );
      setInsight(insight);
    },
    [data, liveData, sensorType, threshold, setInsight]
  );

  const handleChartClick = useCallback(
    (state: Record<string, unknown>) => {
      if (!state || !state.activePayload) return;
      const payload = (state.activePayload as Array<{ payload: ChartDataPoint }>)[0]?.payload;
      if (!payload) return;

      const values = data.map((d) => d.value);
      const { mean, std } = computeRollingStats(values.slice(-10));
      const severity = determineSeverity(sensorType, payload.value);
      const correlations = getCorrelationValues(liveData);

      const matchingPred = liveData.find((l) => l.timestamp === payload.timestamp);
      const anomalyScore = matchingPred?.anomaly_score ?? 0;
      const isAnomaly = matchingPred?.is_anomaly ?? false;
      const dynThreshold = matchingPred?.dynamic_threshold ?? threshold;

      const insight = generateInsight(
        sensorType,
        {
          timestamp: payload.timestamp,
          value: payload.value,
          anomalyScore,
          threshold: dynThreshold,
          isAnomaly,
        },
        { rollingMean: mean, rollingStd: std, severity },
        correlations
      );
      togglePinInsight(insight);
    },
    [data, liveData, sensorType, threshold, togglePinInsight]
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-display text-text-primary">{title}</span>
          <span className="font-mono text-lg font-bold" style={{ color: valueColor }}>
            {currentValue.toFixed(sensorType === 'vibration' ? 2 : 1)}
            <span className="text-xs text-text-muted ml-0.5">{unit}</span>
          </span>
          <span className="text-sm" style={{ color: valueColor }}>{trend}</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart
          data={data}
          onClick={handleChartClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={clearInsight}
          margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
        >
          <defs>
            <linearGradient id={`grad-${sensorType}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00D4FF" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#00D4FF" stopOpacity={0} />
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
            domain={['auto', 'auto']}
          />
          <ReferenceLine
            y={threshold}
            stroke="#F59E0B"
            strokeDasharray="6 3"
            label={{
              value: 'Threshold',
              position: 'right',
              style: { fontSize: 9, fill: '#F59E0B' },
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#00D4FF"
            strokeWidth={2}
            dot={(props) => <AnomalyDot {...props} sensorType={sensorType} />}
            activeDot={<CustomActiveDot />}
            isAnimationActive={false}
          />
          <Tooltip content={() => null} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
