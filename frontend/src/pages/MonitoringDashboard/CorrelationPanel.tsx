import React, { useMemo } from 'react';
import { GlowCard } from '@/components/ui/GlowCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CorrelationHeatmap } from '@/components/charts/CorrelationHeatmap';
import { ChartInsightLayout } from '@/components/layout/ChartInsightLayout';
import { InsightOverlay } from '@/components/insight/InsightOverlay';
import { useSensorStore } from '@/store/useSensorStore';
import { computeCorrelationMatrix } from '@/utils/chartHelpers';
import { COPY } from '@/config/copy';

export const CorrelationPanel: React.FC = () => {
  const liveData = useSensorStore((s) => s.liveData);
  const correlationData = useMemo(() => computeCorrelationMatrix(liveData), [liveData]);

  return (
    <GlowCard className="p-5">
      <SectionHeader title={COPY.dashboard.sections.correlationPanel} />
      <ChartInsightLayout chartId="correlation-heatmap">
        <InsightOverlay chartId="correlation-heatmap">
          <CorrelationHeatmap data={correlationData} />
        </InsightOverlay>
      </ChartInsightLayout>
    </GlowCard>
  );
};
