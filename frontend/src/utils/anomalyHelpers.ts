import type { Severity } from '@/types/anomaly.types';
import { THRESHOLDS } from '@/config/constants';

export function calculateSeverity(anomalyScore: number, threshold: number): Severity {
  if (anomalyScore >= threshold) return 'critical';
  if (anomalyScore >= threshold * 0.7) return 'warning';
  return 'normal';
}

export function getAnomalyDescription(score: number, threshold: number): string {
  const delta = score - threshold;
  if (delta > 0) {
    return `Score ${score.toFixed(3)} exceeds threshold by +${delta.toFixed(3)}`;
  }
  return `Score ${score.toFixed(3)} is ${Math.abs(delta).toFixed(3)} below threshold`;
}

export function computeSigmaDeviation(value: number, mean: number, std: number): number {
  if (std === 0) return 0;
  return (value - mean) / std;
}

export function getSeverityFromSensorValues(
  temp: number,
  vib: number,
  humidity: number
): Severity {
  if (
    temp > THRESHOLDS.TEMPERATURE.critical ||
    vib > THRESHOLDS.VIBRATION.critical ||
    humidity > THRESHOLDS.HUMIDITY.critical
  ) {
    return 'critical';
  }
  if (
    temp > THRESHOLDS.TEMPERATURE.warning ||
    vib > THRESHOLDS.VIBRATION.warning ||
    humidity > THRESHOLDS.HUMIDITY.warning
  ) {
    return 'warning';
  }
  return 'normal';
}
