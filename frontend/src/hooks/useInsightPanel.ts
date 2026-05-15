import { useCallback } from 'react';
import { useInsightStore } from '@/store/useInsightStore';
import type { InsightContent } from '@/types/insight.types';

export function useInsightPanel() {
  const { isActive, content, chartId, setInsight, clearInsight } = useInsightStore();

  const showInsight = useCallback(
    (insightContent: InsightContent) => {
      setInsight(insightContent);
    },
    [setInsight]
  );

  const hideInsight = useCallback(() => {
    clearInsight();
  }, [clearInsight]);

  return {
    isActive,
    content,
    chartId,
    showInsight,
    hideInsight,
  };
}
