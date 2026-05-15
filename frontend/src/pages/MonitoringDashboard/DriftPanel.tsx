import React from 'react';
import { GlowCard } from '@/components/ui/GlowCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { DriftGauge } from '@/components/charts/DriftGauge';
import { DistributionCompare } from '@/components/charts/DistributionCompare';
import { ChartInsightLayout } from '@/components/layout/ChartInsightLayout';
import { useInsightStore } from '@/store/useInsightStore';
import { useDriftStore } from '@/store/useDriftStore';
import { COPY } from '@/config/copy';

export const DriftPanel: React.FC = () => {
  const { driftInfo } = useDriftStore();

  const handleMouseEnter = () => {
    useInsightStore.getState().setInsight({
      chartId: 'drift-panel',
      timestamp: new Date().toISOString(),
      sensorValue: driftInfo.overallScore,
      sensorUnit: 'Score',
      sensorName: 'Data Drift',
      operational: `Drift share is currently ${(driftInfo.driftShare * 100).toFixed(0)}%. ${driftInfo.driftDetected ? 'Concept drift detected! Model retraining is recommended.' : 'Data distributions remain stable against training baselines.'}`,
      mlReasoning: 'EvidentlyAI monitors statistical distance between the live data stream and the original training dataset using Kolmogorov-Smirnov tests.',
      statistical: `Max KS Distance: ${driftInfo.distributionDistance.toFixed(2)}. Overall drift score: ${driftInfo.overallScore.toFixed(2)}.`,
      riskAssessment: driftInfo.driftDetected ? 'Model reliability is degraded. High risk of false positives/negatives.' : 'Model reliability is high.',
      correlations: 'Changes in environmental factors often precede structural feature drift.',
      severity: driftInfo.driftDetected ? 'critical' : 'normal',
      anomalyScore: driftInfo.overallScore,
      thresholdValue: 0.5,
      isAnomaly: driftInfo.driftDetected,
    });
  };

  const handleClick = () => {
    const insight = {
      chartId: 'drift-panel',
      timestamp: new Date().toISOString(),
      sensorValue: driftInfo.overallScore,
      sensorUnit: 'Score',
      sensorName: 'Data Drift',
      operational: `Drift share is currently ${(driftInfo.driftShare * 100).toFixed(0)}%. ${driftInfo.driftDetected ? 'Concept drift detected! Model retraining is recommended.' : 'Data distributions remain stable against training baselines.'}`,
      mlReasoning: 'EvidentlyAI monitors statistical distance between the live data stream and the original training dataset using Kolmogorov-Smirnov tests.',
      statistical: `Max KS Distance: ${driftInfo.distributionDistance.toFixed(2)}. Overall drift score: ${driftInfo.overallScore.toFixed(2)}.`,
      riskAssessment: driftInfo.driftDetected ? 'Model reliability is degraded. High risk of false positives/negatives.' : 'Model reliability is high.',
      correlations: 'Changes in environmental factors often precede structural feature drift.',
      severity: driftInfo.driftDetected ? 'critical' : 'normal',
      anomalyScore: driftInfo.overallScore,
      thresholdValue: 0.5,
      isAnomaly: driftInfo.driftDetected,
    };
    useInsightStore.getState().togglePinInsight(insight);
  };

  const handleMouseLeave = () => {
    useInsightStore.getState().clearInsight();
  };

  return (
    <GlowCard className="p-5" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleClick}>
      <SectionHeader title={COPY.dashboard.sections.driftPanel} />

      <ChartInsightLayout chartId="drift-panel">
        <div className="w-full">
          {/* Drift gauges */}
          <div className="flex items-center justify-around mb-5">
            <DriftGauge
              value={driftInfo.overallScore}
              label="Overall Drift"
              color={driftInfo.driftDetected ? '#EF4444' : '#10B981'}
            />
            <DriftGauge
              value={driftInfo.driftShare}
              label="Feature Drift"
              color={driftInfo.driftShare > 0.5 ? '#F59E0B' : '#00D4FF'}
            />
            <DriftGauge
              value={driftInfo.distributionDistance}
              label="KS Distance"
              color={driftInfo.distributionDistance > 0.5 ? '#EF4444' : '#3B82F6'}
            />
          </div>

          {/* Distribution comparison */}
          <div className="mb-4">
            <div className="text-xs font-display text-text-muted uppercase tracking-wider mb-2">
              Distribution Comparison
            </div>
            <DistributionCompare />
          </div>

          {/* Feature drift list */}
          <div>
            <div className="text-xs font-display text-text-muted uppercase tracking-wider mb-2">
              Feature Drift Scores
            </div>
            <div className="space-y-2">
              {Object.entries(driftInfo.featureDrifts).map(([feature, score]) => (
                <div key={feature} className="flex items-center gap-3">
                  <span className="text-xs text-text-secondary capitalize w-20">{feature}</span>
                  <div className="flex-1 h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(score * 100, 100)}%`,
                        backgroundColor:
                          score > 0.5 ? '#EF4444' : score > 0.3 ? '#F59E0B' : '#10B981',
                      }}
                    />
                  </div>
                  <span className="text-xs font-mono text-text-muted w-12 text-right">
                    {score.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ChartInsightLayout>
    </GlowCard>
  );
};
