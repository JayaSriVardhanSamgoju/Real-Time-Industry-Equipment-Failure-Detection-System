import { create } from 'zustand';
import type { SystemMetrics, HealthCheck } from '@/types/api.types';

interface SystemStoreState {
  metrics: SystemMetrics | null;
  health: HealthCheck | null;
  isConnected: boolean;
  lastUpdated: string | null;
  metricsHistory: SystemMetrics[];
  setMetrics: (metrics: SystemMetrics) => void;
  setHealth: (health: HealthCheck) => void;
  setConnected: (connected: boolean) => void;
}

export const useSystemStore = create<SystemStoreState>((set, get) => ({
  metrics: null,
  health: null,
  isConnected: false,
  lastUpdated: null,
  metricsHistory: [],
  setMetrics: (metrics: SystemMetrics) => {
    const history = [...get().metricsHistory, metrics].slice(-20);
    set({ metrics, lastUpdated: new Date().toISOString(), metricsHistory: history });
  },
  setHealth: (health: HealthCheck) =>
    set({ health, isConnected: health.status === 'healthy' }),
  setConnected: (connected: boolean) => set({ isConnected: connected }),
}));
