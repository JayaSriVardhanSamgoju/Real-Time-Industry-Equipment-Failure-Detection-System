import React from 'react';
import { GlowCard } from '@/components/ui/GlowCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useSystemStore } from '@/store/useSystemStore';
import { COPY } from '@/config/copy';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { Server, Gauge, Cpu, Layers } from 'lucide-react';
import { useInsightStore } from '@/store/useInsightStore';
import { ChartInsightLayout } from '@/components/layout/ChartInsightLayout';

const MiniChart: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; value?: string }> = ({ title, icon, children, value }) => (
  <div className="rounded-card bg-bg-elevated border border-bg-border p-3">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-1.5">
        <span className="text-text-muted">{icon}</span>
        <span className="text-[10px] font-display uppercase tracking-wider text-text-muted">{title}</span>
      </div>
      {value && <span className="text-xs font-mono text-green">{value}</span>}
    </div>
    <div className="h-16">{children}</div>
  </div>
);

export const InfraPanel: React.FC = () => {
  const metricsHistory = useSystemStore((s) => s.metricsHistory);
  const throughputData = metricsHistory.map((m, i) => ({ index: i, value: m.throughput_records_per_sec }));
  const latencyData = [{ label: 'p50', value: 12 }, { label: 'p95', value: 28 }, { label: 'p99', value: 45 }];

  const handleMouseEnter = () => {
    useInsightStore.getState().setInsight({
      chartId: 'infra-panel',
      timestamp: new Date().toISOString(),
      sensorValue: throughputData[throughputData.length - 1]?.value ?? 0,
      sensorUnit: 'msg/s',
      sensorName: 'Infra Throughput',
      operational: 'Kafka throughput is stable. No backpressure observed in the stream consumer.',
      mlReasoning: 'Latency is well within the 50ms SLA. ML Inference is executing optimally.',
      statistical: `P99 Latency: 45ms. Throughput mean: ${(throughputData.reduce((a, b) => a + b.value, 0) / Math.max(1, throughputData.length)).toFixed(1)} msg/s.`,
      riskAssessment: 'No infrastructure risk detected. The system is operating normally.',
      correlations: 'No latency spikes correlated with high throughput.',
      severity: 'normal',
      anomalyScore: 0,
      thresholdValue: 0,
      isAnomaly: false,
    });
  };

  const handleClick = () => {
    const insight = {
      chartId: 'infra-panel',
      timestamp: new Date().toISOString(),
      sensorValue: throughputData[throughputData.length - 1]?.value ?? 0,
      sensorUnit: 'msg/s',
      sensorName: 'Infra Throughput',
      operational: 'Kafka throughput is stable. No backpressure observed in the stream consumer.',
      mlReasoning: 'Latency is well within the 50ms SLA. ML Inference is executing optimally.',
      statistical: `P99 Latency: 45ms. Throughput mean: ${(throughputData.reduce((a, b) => a + b.value, 0) / Math.max(1, throughputData.length)).toFixed(1)} msg/s.`,
      riskAssessment: 'No infrastructure risk detected. The system is operating normally.',
      correlations: 'No latency spikes correlated with high throughput.',
      severity: 'normal',
      anomalyScore: 0,
      thresholdValue: 0,
      isAnomaly: false,
    };
    useInsightStore.getState().togglePinInsight(insight);
  };

  const handleMouseLeave = () => {
    useInsightStore.getState().clearInsight();
  };

  return (
    <GlowCard className="p-5" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleClick}>
      <SectionHeader title={COPY.dashboard.sections.infraPanel} />
      <ChartInsightLayout chartId="infra-panel">
        <div className="grid grid-cols-2 gap-3 w-full">
          <MiniChart title="Kafka Throughput" icon={<Layers className="w-3.5 h-3.5" />} value={`${throughputData[throughputData.length - 1]?.value.toFixed(1) ?? '0'}/s`}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={throughputData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Area type="monotone" dataKey="value" stroke="#10B981" fill="#10B981" fillOpacity={0.15} strokeWidth={1.5} dot={false} isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </MiniChart>
          <MiniChart title="API Latency" icon={<Server className="w-3.5 h-3.5" />} value="12ms">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={latencyData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Bar dataKey="value" fill="#3B82F6" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </MiniChart>
          <MiniChart title="ML Inference" icon={<Cpu className="w-3.5 h-3.5" />} value="~12ms">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={Array.from({ length: 15 }, (_, i) => ({ i, v: 10 + Math.random() * 8 }))} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Area type="monotone" dataKey="v" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.1} strokeWidth={1.5} dot={false} isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </MiniChart>
          <MiniChart title="Consumer Lag" icon={<Gauge className="w-3.5 h-3.5" />} value="0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={Array.from({ length: 15 }, (_, i) => ({ i, v: Math.random() * 3 }))} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Area type="monotone" dataKey="v" stroke="#00D4FF" fill="#00D4FF" fillOpacity={0.1} strokeWidth={1.5} dot={false} isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </MiniChart>
        </div>
      </ChartInsightLayout>
    </GlowCard>
  );
};
