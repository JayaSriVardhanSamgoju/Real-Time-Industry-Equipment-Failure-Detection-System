import type { Severity } from './anomaly.types';

export interface InsightContent {
  chartId: string;
  timestamp: string;
  sensorValue: number;
  sensorUnit: string;
  sensorName: string;
  operational: string;
  mlReasoning: string;
  statistical: string;
  riskAssessment: string;
  correlations: string;
  severity: Severity;
  anomalyScore: number;
  thresholdValue: number;
  isAnomaly: boolean;
  technicalDetails?: {
    featureVector: Record<string, number>;
    isolationDepth: number;
    slidingWindowSize: number;
    adaptiveThresholdMethod: string;
  };
}

export interface InsightPanelState {
  isActive: boolean;
  content: InsightContent | null;
  chartId: string | null;
}
