export const API_BASE_URL =
  (typeof import.meta !== 'undefined' &&
    (import.meta as Record<string, Record<string, string>>).env?.VITE_API_BASE_URL) ||
  'http://localhost:8000';

export const POLLING = {
  LIVE_DATA: 2000,
  ANOMALIES: 3000,
  METRICS: 5000,
  DRIFT: 30000,
  ALERTS: 5000,
  HEALTH: 10000,
} as const;

export const THRESHOLDS = {
  TEMPERATURE: { min: 60, max: 75, warning: 80, critical: 85, unit: '°C' },
  VIBRATION: { min: 2, max: 6, warning: 7.5, critical: 8.5, unit: 'mm/s' },
  HUMIDITY: { min: 40, max: 65, warning: 70, critical: 75, unit: '%' },
  ANOMALY_SCORE: { warning: 0.5, critical: 0.72 },
} as const;

export const CHART = {
  MAX_DATA_POINTS: 60,
  SPARKLINE_POINTS: 20,
  ANIMATION_DURATION: 300,
} as const;

export const MACHINE_STATES = [
  'NORMAL',
  'DEGRADING',
  'UNSTABLE',
  'FAILURE',
  'RESET',
] as const;

export const SEVERITY_ORDER = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'NONE'] as const;
