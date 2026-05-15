import { create } from 'zustand';
import type { DriftReport } from '@/types/api.types';
import type { DriftInfo } from '@/types/anomaly.types';

interface DriftStoreState {
  report: DriftReport | null;
  driftInfo: DriftInfo;
  setReport: (report: DriftReport) => void;
}

export const useDriftStore = create<DriftStoreState>((set) => ({
  report: null,
  driftInfo: {
    driftDetected: false,
    driftShare: 0,
    checkedAt: 'N/A',
    overallScore: 0,
    featureDrifts: { temperature: 0, vibration: 0, humidity: 0 },
    distributionDistance: 0,
  },
  setReport: (report: DriftReport) => {
    const details = (report.details || {}) as Record<string, unknown>;
    set({
      report,
      driftInfo: {
        driftDetected: report.drift_detected,
        driftShare: report.drift_share,
        checkedAt: report.checked_at,
        overallScore: report.drift_share,
        featureDrifts: {
          temperature: (details.temperature as number) ?? report.drift_share * 0.4,
          vibration: (details.vibration as number) ?? report.drift_share * 0.35,
          humidity: (details.humidity as number) ?? report.drift_share * 0.25,
        },
        distributionDistance: (details.ks_statistic as number) ?? report.drift_share * 0.8,
      },
    });
  },
}));
