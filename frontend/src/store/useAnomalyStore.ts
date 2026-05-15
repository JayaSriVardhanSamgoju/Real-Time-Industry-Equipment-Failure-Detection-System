import { create } from 'zustand';
import type { PredictionResult } from '@/types/api.types';
import type { AnomalyEvent } from '@/types/anomaly.types';
import { THRESHOLDS } from '@/config/constants';

interface AnomalyStoreState {
  anomalies: PredictionResult[];
  anomalyEvents: AnomalyEvent[];
  selectedAnomaly: AnomalyEvent | null;
  setAnomalies: (data: PredictionResult[]) => void;
  selectAnomaly: (event: AnomalyEvent | null) => void;
  acknowledgeAnomaly: (id: string) => void;
}

const toAnomalyEvent = (p: PredictionResult, index: number): AnomalyEvent => {
  const score = p.anomaly_score;
  const threshold = p.dynamic_threshold || THRESHOLDS.ANOMALY_SCORE.critical;
  let severity: 'normal' | 'warning' | 'critical' = 'normal';
  if (score >= threshold) severity = 'critical';
  else if (score >= THRESHOLDS.ANOMALY_SCORE.warning) severity = 'warning';

  return {
    id: `anomaly-${index}-${p.timestamp}`,
    timestamp: p.timestamp,
    anomalyScore: score,
    threshold,
    severity,
    temperature: p.temperature,
    vibration: p.vibration,
    humidity: p.humidity,
    equipmentId: p.equipment_id,
    alertLevel: p.alert_level || 'NONE',
    isAcknowledged: false,
  };
};

export const useAnomalyStore = create<AnomalyStoreState>((set) => ({
  anomalies: [],
  anomalyEvents: [],
  selectedAnomaly: null,
  setAnomalies: (data: PredictionResult[]) =>
    set({
      anomalies: data,
      anomalyEvents: data.map(toAnomalyEvent),
    }),
  selectAnomaly: (event: AnomalyEvent | null) => set({ selectedAnomaly: event }),
  acknowledgeAnomaly: (id: string) =>
    set((state) => ({
      anomalyEvents: state.anomalyEvents.map((e) =>
        e.id === id ? { ...e, isAcknowledged: true } : e
      ),
    })),
}));
