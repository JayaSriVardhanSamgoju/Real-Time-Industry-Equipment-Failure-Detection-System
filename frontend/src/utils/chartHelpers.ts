import type { PredictionResult } from '@/types/api.types';
import type { AnomalyChartPoint, ChartDataPoint, CorrelationCell, SparklinePoint } from '@/types/chart.types';
import { format } from 'date-fns';

export function predictionToAnomalyPoints(data: PredictionResult[]): AnomalyChartPoint[] {
  return data.map((d) => ({
    timestamp: d.timestamp,
    formattedTime: safeFormatTime(d.timestamp),
    anomalyScore: d.anomaly_score,
    threshold: d.dynamic_threshold || 0.72,
    isAnomaly: d.is_anomaly,
    temperature: d.temperature,
    vibration: d.vibration,
    humidity: d.humidity,
  }));
}

export function toSparklineData(values: number[]): SparklinePoint[] {
  return values.map((value, index) => ({ value, index }));
}

export function computeCorrelationMatrix(data: PredictionResult[]): CorrelationCell[] {
  if (data.length < 2) {
    return [
      { row: 'Temperature', col: 'Temperature', value: 1 },
      { row: 'Temperature', col: 'Vibration', value: 0 },
      { row: 'Temperature', col: 'Humidity', value: 0 },
      { row: 'Vibration', col: 'Temperature', value: 0 },
      { row: 'Vibration', col: 'Vibration', value: 1 },
      { row: 'Vibration', col: 'Humidity', value: 0 },
      { row: 'Humidity', col: 'Temperature', value: 0 },
      { row: 'Humidity', col: 'Vibration', value: 0 },
      { row: 'Humidity', col: 'Humidity', value: 1 },
    ];
  }

  const temps = data.map((d) => d.temperature);
  const vibs = data.map((d) => d.vibration);
  const hums = data.map((d) => d.humidity);

  const corrTV = pearsonCorrelation(temps, vibs);
  const corrTH = pearsonCorrelation(temps, hums);
  const corrVH = pearsonCorrelation(vibs, hums);

  return [
    { row: 'Temperature', col: 'Temperature', value: 1 },
    { row: 'Temperature', col: 'Vibration', value: corrTV },
    { row: 'Temperature', col: 'Humidity', value: corrTH },
    { row: 'Vibration', col: 'Temperature', value: corrTV },
    { row: 'Vibration', col: 'Vibration', value: 1 },
    { row: 'Vibration', col: 'Humidity', value: corrVH },
    { row: 'Humidity', col: 'Temperature', value: corrTH },
    { row: 'Humidity', col: 'Vibration', value: corrVH },
    { row: 'Humidity', col: 'Humidity', value: 1 },
  ];
}

function pearsonCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  if (n < 2) return 0;
  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let denX = 0;
  let denY = 0;
  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }
  const den = Math.sqrt(denX * denY);
  return den === 0 ? 0 : Number((num / den).toFixed(3));
}

function safeFormatTime(ts: string): string {
  try {
    return format(new Date(ts), 'HH:mm:ss');
  } catch {
    return ts.slice(11, 19) || ts;
  }
}

export function getCorrelationValues(data: PredictionResult[]) {
  if (data.length < 2) return { tempVib: 0, tempHum: 0, vibHum: 0 };
  const temps = data.map((d) => d.temperature);
  const vibs = data.map((d) => d.vibration);
  const hums = data.map((d) => d.humidity);
  return {
    tempVib: pearsonCorrelation(temps, vibs),
    tempHum: pearsonCorrelation(temps, hums),
    vibHum: pearsonCorrelation(vibs, hums),
  };
}
