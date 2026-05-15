import React from 'react';
import { motion } from 'framer-motion';
import { MetricCard } from '@/components/cards/MetricCard';
import { useSystemStore } from '@/store/useSystemStore';
import { useSensorStore } from '@/store/useSensorStore';
import { useDriftStore } from '@/store/useDriftStore';
import { useAlertStore } from '@/store/useAlertStore';
import { COPY } from '@/config/copy';
import { toSparklineData } from '@/utils/chartHelpers';
import { staggerChildren } from '@/animations/variants';
import { Database, Percent, Gauge, Cog, TrendingUp, Bell } from 'lucide-react';
import type { Severity } from '@/types/anomaly.types';

export const GlobalMetricsHeader: React.FC = () => {
  const { metrics, metricsHistory } = useSystemStore();
  const machineState = useSensorStore((s) => s.machineState);
  const driftInfo = useDriftStore((s) => s.driftInfo);
  const summary = useAlertStore((s) => s.summary);

  const anomalyRate = metrics?.anomaly_rate_percent ?? 0;
  const totalAlerts = summary ? summary.HIGH + summary.MEDIUM + summary.LOW : 0;

  const anomalySeverity: Severity =
    anomalyRate > 15 ? 'critical' : anomalyRate > 5 ? 'warning' : 'normal';
  const driftSeverity: Severity = driftInfo.driftDetected ? 'critical' : 'normal';
  const alertSeverity: Severity =
    totalAlerts > 10 ? 'critical' : totalAlerts > 3 ? 'warning' : 'normal';

  const throughputSpark = toSparklineData(
    metricsHistory.map((m) => m.throughput_records_per_sec)
  );

  return (
    <motion.div
      variants={staggerChildren}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-6"
    >
      <MetricCard
        title={COPY.dashboard.metrics.totalRecords}
        value={metrics?.total_records_processed ?? 0}
        icon={<Database className="w-4 h-4" />}
        sparklineData={toSparklineData(
          metricsHistory.map((m) => m.total_records_processed)
        )}
      />
      <MetricCard
        title={COPY.dashboard.metrics.anomalyRate}
        value={anomalyRate}
        suffix="%"
        decimals={1}
        icon={<Percent className="w-4 h-4" />}
        severity={anomalySeverity}
      />
      <MetricCard
        title={COPY.dashboard.metrics.throughput}
        value={metrics?.throughput_records_per_sec ?? 0}
        suffix="/s"
        decimals={1}
        icon={<Gauge className="w-4 h-4" />}
        sparklineData={throughputSpark}
      />
      <MetricCard
        title={COPY.dashboard.metrics.machineState}
        value={0}
        icon={<Cog className="w-4 h-4" />}
        severity={
          machineState === 'FAILURE' || machineState === 'UNSTABLE'
            ? 'critical'
            : machineState === 'DEGRADING'
              ? 'warning'
              : 'normal'
        }
        subtitle={machineState}
      />
      <MetricCard
        title={COPY.dashboard.metrics.driftStatus}
        value={driftInfo.driftShare}
        decimals={2}
        icon={<TrendingUp className="w-4 h-4" />}
        severity={driftSeverity}
        subtitle={driftInfo.driftDetected ? 'Drift Detected' : 'Stable'}
      />
      <MetricCard
        title={COPY.dashboard.metrics.activeAlerts}
        value={totalAlerts}
        icon={<Bell className="w-4 h-4" />}
        severity={alertSeverity}
      />
    </motion.div>
  );
};
