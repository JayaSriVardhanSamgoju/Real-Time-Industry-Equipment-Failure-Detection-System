export type Severity = 'normal' | 'warning' | 'critical';
export type AlertLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';

export interface AnomalyEvent {
  id: string;
  timestamp: string;
  anomalyScore: number;
  threshold: number;
  severity: Severity;
  temperature: number;
  vibration: number;
  humidity: number;
  equipmentId: string;
  alertLevel: AlertLevel;
  isAcknowledged: boolean;
}

export interface AlertEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  severity: AlertLevel;
  equipmentId: string;
  anomalyScore: number;
  threshold: number;
  temperature: number;
  vibration: number;
  humidity: number;
  isAcknowledged: boolean;
  rootCause: string;
  recommendation: string;
}

export interface DriftInfo {
  driftDetected: boolean;
  driftShare: number;
  checkedAt: string;
  overallScore: number;
  featureDrifts: Record<string, number>;
  distributionDistance: number;
}
