import { create } from 'zustand';
import type { AlertSummary } from '@/types/api.types';
import type { AlertEvent } from '@/types/anomaly.types';
import type { PredictionResult } from '@/types/api.types';
import { THRESHOLDS } from '@/config/constants';

interface AlertStoreState {
  summary: AlertSummary | null;
  alerts: AlertEvent[];
  filter: string;
  searchQuery: string;
  setSummary: (summary: AlertSummary) => void;
  setAlerts: (predictions: PredictionResult[]) => void;
  setFilter: (filter: string) => void;
  setSearchQuery: (query: string) => void;
  acknowledgeAlert: (id: string) => void;
}

const predictionToAlert = (p: PredictionResult, index: number): AlertEvent => {
  const score = p.anomaly_score;
  const threshold = p.dynamic_threshold || THRESHOLDS.ANOMALY_SCORE.critical;
  const tempSigma = Math.abs(p.temperature - 68) / 5;
  const vibSigma = Math.abs(p.vibration - 4) / 1.5;
  const humSigma = Math.abs(p.humidity - 55) / 8;

  let title = 'Sensor Anomaly Detected';
  let rootCause = `Anomaly score ${score.toFixed(3)} exceeded threshold ${threshold.toFixed(3)}`;
  let recommendation = 'Monitor closely and schedule inspection if pattern persists.';

  if (p.temperature > THRESHOLDS.TEMPERATURE.critical) {
    title = `Thermal Anomaly — Equipment ${p.equipment_id}`;
    rootCause = `Temperature exceeded ${p.temperature.toFixed(1)}°C (threshold: ${THRESHOLDS.TEMPERATURE.critical}°C)`;
    recommendation = 'Reduce load by 20% and schedule bearing inspection.';
  } else if (p.vibration > THRESHOLDS.VIBRATION.critical) {
    title = `Vibration Anomaly — Equipment ${p.equipment_id}`;
    rootCause = `Vibration exceeded ${p.vibration.toFixed(1)} mm/s (threshold: ${THRESHOLDS.VIBRATION.critical} mm/s)`;
    recommendation = 'Check mechanical components for wear or misalignment.';
  }

  return {
    id: `alert-${index}-${p.timestamp}`,
    timestamp: p.timestamp,
    title,
    description: `Anomaly detected with score ${score.toFixed(3)} on equipment ${p.equipment_id}`,
    severity: p.alert_level || 'NONE',
    equipmentId: p.equipment_id,
    anomalyScore: score,
    threshold,
    temperature: p.temperature,
    vibration: p.vibration,
    humidity: p.humidity,
    isAcknowledged: false,
    rootCause,
    recommendation,
  };
};

export const useAlertStore = create<AlertStoreState>((set) => ({
  summary: null,
  alerts: [],
  filter: 'All',
  searchQuery: '',
  setSummary: (summary: AlertSummary) => set({ summary }),
  setAlerts: (predictions: PredictionResult[]) => {
    const anomalies = predictions.filter((p) => p.is_anomaly);
    set({ alerts: anomalies.map(predictionToAlert) });
  },
  setFilter: (filter: string) => set({ filter }),
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  acknowledgeAlert: (id: string) =>
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === id ? { ...a, isAcknowledged: true } : a
      ),
    })),
}));
