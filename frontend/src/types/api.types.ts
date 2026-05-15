export interface PredictionResult {
  equipment_id: string;
  is_anomaly: boolean;
  anomaly_score: number;
  alert_level: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
  dynamic_threshold: number;
  timestamp: string;
  temperature: number;
  vibration: number;
  humidity: number;
}

export interface SystemMetrics {
  uptime_seconds: number;
  total_records_processed: number;
  total_anomalies_detected: number;
  throughput_records_per_sec: number;
  anomaly_rate_percent: number;
}

export interface DriftReport {
  drift_detected: boolean;
  drift_share: number;
  checked_at: string;
  details: Record<string, unknown>;
}

export interface AlertSummary {
  HIGH: number;
  MEDIUM: number;
  LOW: number;
  NONE: number;
}

export interface HealthCheck {
  status: string;
  service: string;
  uptime_seconds: number;
}

export interface ApiError {
  message: string;
  status: number;
  timestamp: string;
}
