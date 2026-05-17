import React, { useMemo } from 'react';
import { GlowCard } from '@/components/ui/GlowCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { AlertCard } from '@/components/cards/AlertCard';
import { ChartInsightLayout } from '@/components/layout/ChartInsightLayout';
import { useInsightStore } from '@/store/useInsightStore';
import { useAlertStore } from '@/store/useAlertStore';
import { useSensorStore } from '@/store/useSensorStore';
import { COPY } from '@/config/copy';
import { Search } from 'lucide-react';

const FILTER_OPTIONS = [
  COPY.alerts.filterAll,
  COPY.alerts.filterCritical,
  COPY.alerts.filterHigh,
  COPY.alerts.filterMedium,
  COPY.alerts.filterLow,
];

export const AlertCenter: React.FC = () => {
  const { alerts, filter, searchQuery, setFilter, setSearchQuery, acknowledgeAlert } =
    useAlertStore();
  const selectedEquipmentId = useSensorStore((s) => s.selectedEquipmentId);

  const filteredAlerts = useMemo(() => {
    // First, filter by the globally selected equipment
    let filtered = alerts.filter(a => a.equipmentId === selectedEquipmentId);

    if (filter !== 'All') {
      filtered = filtered.filter(
        (a) => a.severity.toUpperCase() === filter.toUpperCase()
      );
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q)
      );
    }

    return filtered.sort((a, b) => {
      const order = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'NONE'];
      return order.indexOf(a.severity) - order.indexOf(b.severity);
    });
  }, [alerts, filter, searchQuery]);

  const handleMouseEnter = () => {
    useInsightStore.getState().setInsight({
      chartId: 'alert-center',
      timestamp: new Date().toISOString(),
      sensorValue: alerts.length,
      sensorUnit: 'alerts',
      sensorName: 'Alert System',
      operational: `${filteredAlerts.length} active alerts matching current filter. Highest severity is ${filteredAlerts[0]?.severity || 'NONE'}.`,
      mlReasoning: 'Alerts are triggered by a combination of Isolation Forest anomaly scores and physics-based validation rules.',
      statistical: `Total unacknowledged alerts: ${alerts.filter(a => !a.isAcknowledged).length}`,
      riskAssessment: alerts.some(a => a.severity === 'CRITICAL' && !a.isAcknowledged) ? 'Critical unacknowledged alerts require immediate attention.' : 'Alert backlog is manageable.',
      correlations: 'Review the latest critical alerts to determine specific sensor correlations.',
      severity: filteredAlerts[0]?.severity === 'CRITICAL' ? 'critical' : filteredAlerts[0]?.severity === 'HIGH' ? 'warning' : 'normal',
      anomalyScore: 0.9,
      thresholdValue: 0.5,
      isAnomaly: filteredAlerts.length > 0,
    });
  };

  const handleClick = () => {
    const insight = {
      chartId: 'alert-center',
      timestamp: new Date().toISOString(),
      sensorValue: alerts.length,
      sensorUnit: 'alerts',
      sensorName: 'Alert System',
      operational: `${filteredAlerts.length} active alerts matching current filter. Highest severity is ${filteredAlerts[0]?.severity || 'NONE'}.`,
      mlReasoning: 'Alerts are triggered by a combination of Isolation Forest anomaly scores and physics-based validation rules.',
      statistical: `Total unacknowledged alerts: ${alerts.filter(a => !a.isAcknowledged).length}`,
      riskAssessment: alerts.some(a => a.severity === 'CRITICAL' && !a.isAcknowledged) ? 'Critical unacknowledged alerts require immediate attention.' : 'Alert backlog is manageable.',
      correlations: 'Review the latest critical alerts to determine specific sensor correlations.',
      severity: filteredAlerts[0]?.severity === 'CRITICAL' ? 'critical' : filteredAlerts[0]?.severity === 'HIGH' ? 'warning' : 'normal',
      anomalyScore: 0.9,
      thresholdValue: 0.5,
      isAnomaly: filteredAlerts.length > 0,
    };
    useInsightStore.getState().togglePinInsight(insight);
  };

  const handleMouseLeave = () => {
    useInsightStore.getState().clearInsight();
  };

  return (
    <GlowCard className="p-5" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleClick}>
      <SectionHeader title={COPY.dashboard.sections.alertCenter} />
      <ChartInsightLayout chartId="alert-center">
        <div className="w-full">
          <div className="flex items-center gap-3 mb-4">
            <SegmentedControl options={FILTER_OPTIONS} value={filter} onChange={setFilter} />
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
              <input
                type="text"
                placeholder={COPY.alerts.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-card bg-bg-elevated border border-bg-border text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-cyan/30 transition-colors"
              />
            </div>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-8 text-text-muted text-sm">
                {alerts.length === 0 ? 'No anomalies detected yet' : 'No alerts match filter'}
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onAcknowledge={acknowledgeAlert}
                />
              ))
            )}
          </div>
        </div>
      </ChartInsightLayout>
    </GlowCard>
  );
};
