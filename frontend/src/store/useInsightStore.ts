import { create } from 'zustand';
import type { InsightContent } from '@/types/insight.types';

interface InsightStoreState {
  isActive: boolean;
  content: InsightContent | null;
  chartId: string | null;
  isPinned: boolean;
  setInsight: (content: InsightContent) => void;
  clearInsight: () => void;
  togglePinInsight: (content: InsightContent) => void;
  unpinInsight: () => void;
}

export const useInsightStore = create<InsightStoreState>((set, get) => ({
  isActive: false,
  content: null,
  chartId: null,
  isPinned: false,
  setInsight: (content: InsightContent) => {
    if (get().isPinned) return;
    set({ isActive: true, content, chartId: content.chartId });
  },
  clearInsight: () => {
    if (get().isPinned) return;
    set({ isActive: false, content: null, chartId: null });
  },
  togglePinInsight: (content: InsightContent) => {
    const isCurrentlyPinned = get().isPinned;
    // If clicking again while pinned, unpin.
    if (isCurrentlyPinned) {
      set({ isPinned: false });
    } else {
      set({ isActive: true, content, chartId: content.chartId, isPinned: true });
    }
  },
  unpinInsight: () => set({ isPinned: false }),
}));
