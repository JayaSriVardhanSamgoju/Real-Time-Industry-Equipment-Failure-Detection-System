import React from 'react';
import { PageContainer } from '@/layouts/PageContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { GlobalMetricsHeader } from './GlobalMetricsHeader';
import { SensorChartGrid } from './SensorChartGrid';
import { AnomalyTimeline } from './AnomalyTimeline';
import { MachineStateViz } from './MachineStateViz';
import { AlertCenter } from './AlertCenter';
import { DriftPanel } from './DriftPanel';
import { CorrelationPanel } from './CorrelationPanel';
import { InfraPanel } from './InfraPanel';
import { EquipmentSelector } from './EquipmentSelector';
import { useLiveData } from '@/hooks/useLiveData';
import { useAnomalies } from '@/hooks/useAnomalies';
import { useSystemMetrics } from '@/hooks/useSystemMetrics';
import { useDrift } from '@/hooks/useDrift';
import { useAlerts } from '@/hooks/useAlerts';
import { COPY } from '@/config/copy';

const MonitoringDashboard: React.FC = () => {
  useLiveData();
  useAnomalies();
  useSystemMetrics();
  useDrift();
  useAlerts();

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <SectionHeader title={COPY.dashboard.title} subtitle={COPY.dashboard.subtitle} noMargin />
        <EquipmentSelector />
      </div>
      <GlobalMetricsHeader />
      <SensorChartGrid />
      <AnomalyTimeline />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
        <MachineStateViz />
        <AlertCenter />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
        <DriftPanel />
        <CorrelationPanel />
      </div>
      <InfraPanel />
    </PageContainer>
  );
};

export default MonitoringDashboard;
