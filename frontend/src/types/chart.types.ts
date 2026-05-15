export interface ChartDataPoint {
  timestamp: string;
  value: number;
  formattedTime: string;
}

export interface SensorChartData {
  temperature: ChartDataPoint[];
  vibration: ChartDataPoint[];
  humidity: ChartDataPoint[];
}

export interface AnomalyChartPoint {
  timestamp: string;
  formattedTime: string;
  anomalyScore: number;
  threshold: number;
  isAnomaly: boolean;
  temperature: number;
  vibration: number;
  humidity: number;
}

export interface CorrelationCell {
  row: string;
  col: string;
  value: number;
}

export interface SparklinePoint {
  value: number;
  index: number;
}

export interface DistributionBin {
  binStart: number;
  binEnd: number;
  trainingCount: number;
  liveCount: number;
}

export interface ChartExplanation {
  chartId: string;
  title: string;
  description: string;
  dataSource: string;
  updateFrequency: string;
}
