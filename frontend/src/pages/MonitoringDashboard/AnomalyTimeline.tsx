import React, { useMemo } from 'react';
import { AnomalyScoreChart } from '@/components/charts/AnomalyScoreChart';
import { ChartInsightLayout } from '@/components/layout/ChartInsightLayout';
import { InsightOverlay } from '@/components/insight/InsightOverlay';
import { AnomalyDetailCard } from '@/components/cards/AnomalyDetailCard';
import { GlowCard } from '@/components/ui/GlowCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useSensorStore } from '@/store/useSensorStore';
import { useAnomalyStore } from '@/store/useAnomalyStore';
import { predictionToAnomalyPoints } from '@/utils/chartHelpers';
import { COPY } from '@/config/copy';
import type { AnomalyChartPoint } from '@/types/chart.types';

export const AnomalyTimeline: React.FC = () => {
  const liveData = useSensorStore((s) => s.liveData);
  const { selectedAnomaly, selectAnomaly, anomalyEvents } = useAnomalyStore();

  const chartData = useMemo(() => predictionToAnomalyPoints(liveData), [liveData]);

  const handlePointClick = (point: AnomalyChartPoint) => {
    const matchedEvent = anomalyEvents.find(
      (e) => e.timestamp === point.timestamp
    );
    if (matchedEvent) selectAnomaly(matchedEvent);
  };

  return (
    <div className="mb-6">
      <SectionHeader
        title={COPY.dashboard.sections.anomalyTimeline}
        subtitle="Isolation Forest anomaly scores with adaptive threshold"
      />
      <GlowCard className="p-4" animate={false}>
        <ChartInsightLayout chartId="anomaly-timeline">
          <InsightOverlay chartId="anomaly-timeline">
            <AnomalyScoreChart data={chartData} onPointClick={handlePointClick} />
          </InsightOverlay>
        </ChartInsightLayout>
      </GlowCard>
      <AnomalyDetailCard
        anomaly={selectedAnomaly}
        onClose={() => selectAnomaly(null)}
      />
    </div>
  );
};
