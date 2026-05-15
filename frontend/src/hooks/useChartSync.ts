import { create } from 'zustand';

interface ChartSyncState {
  hoveredTimestamp: string | null;
  activeChartId: string | null;
  setHover: (chartId: string, timestamp: string) => void;
  clearHover: () => void;
}

const useChartSyncStore = create<ChartSyncState>((set) => ({
  hoveredTimestamp: null,
  activeChartId: null,
  setHover: (chartId: string, timestamp: string) =>
    set({ activeChartId: chartId, hoveredTimestamp: timestamp }),
  clearHover: () => set({ activeChartId: null, hoveredTimestamp: null }),
}));

export function useChartSync(chartId: string) {
  const { hoveredTimestamp, activeChartId, setHover, clearHover } = useChartSyncStore();

  return {
    hoveredTimestamp: activeChartId !== chartId ? hoveredTimestamp : null,
    isActive: activeChartId === chartId,
    onHover: (timestamp: string) => setHover(chartId, timestamp),
    onLeave: clearHover,
  };
}
