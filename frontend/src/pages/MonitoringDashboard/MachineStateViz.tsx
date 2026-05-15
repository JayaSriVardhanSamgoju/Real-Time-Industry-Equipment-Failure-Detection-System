import React from 'react';
import { GlowCard } from '@/components/ui/GlowCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { MachineStateDiagram } from '@/components/machine/MachineStateDiagram';
import { StateTransitionFlow } from '@/components/machine/StateTransitionFlow';
import { DegradationIndicator } from '@/components/machine/DegradationIndicator';
import { ChartInsightLayout } from '@/components/layout/ChartInsightLayout';
import { useInsightStore } from '@/store/useInsightStore';
import { useSensorStore } from '@/store/useSensorStore';
import { COPY } from '@/config/copy';
import { getSeverityFromSensorValues } from '@/utils/anomalyHelpers';

export const MachineStateViz: React.FC = () => {
  const { machineState, currentTemperature, currentVibration, currentHumidity } =
    useSensorStore();

  const severity = getSeverityFromSensorValues(
    currentTemperature,
    currentVibration,
    currentHumidity
  );
  const degradation =
    machineState === 'FAILURE'
      ? 1
      : machineState === 'UNSTABLE'
        ? 0.75
        : machineState === 'DEGRADING'
          ? 0.4
          : 0.05;

  const handleMouseEnter = () => {
    useInsightStore.getState().setInsight({
      chartId: 'machine-state',
      timestamp: new Date().toISOString(),
      sensorValue: currentTemperature,
      sensorUnit: '°C',
      sensorName: 'Machine State',
      operational: `Machine is currently in ${machineState} state. Degradation progress: ${(degradation * 100).toFixed(0)}%.`,
      mlReasoning: severity === 'normal' ? 'Isolation Forest confirms nominal behavior across all vectors.' : 'Isolation Forest detected correlated multi-sensor anomalies.',
      statistical: `Temp: ${currentTemperature.toFixed(1)}, Vib: ${currentVibration.toFixed(2)}, Hum: ${currentHumidity.toFixed(1)}.`,
      riskAssessment: severity === 'critical' ? 'High probability of imminent mechanical failure.' : 'Low risk of failure at current parameters.',
      correlations: 'State derived from multi-sensor fusion and adaptive threshold violations.',
      severity: severity,
      anomalyScore: degradation,
      thresholdValue: 0.5,
      isAnomaly: severity === 'critical',
    });
  };

  const handleClick = () => {
    const insight = {
      chartId: 'machine-state',
      timestamp: new Date().toISOString(),
      sensorValue: currentTemperature,
      sensorUnit: '°C',
      sensorName: 'Machine State',
      operational: `Machine is currently in ${machineState} state. Degradation progress: ${(degradation * 100).toFixed(0)}%.`,
      mlReasoning: severity === 'normal' ? 'Isolation Forest confirms nominal behavior across all vectors.' : 'Isolation Forest detected correlated multi-sensor anomalies.',
      statistical: `Temp: ${currentTemperature.toFixed(1)}, Vib: ${currentVibration.toFixed(2)}, Hum: ${currentHumidity.toFixed(1)}.`,
      riskAssessment: severity === 'critical' ? 'High probability of imminent mechanical failure.' : 'Low risk of failure at current parameters.',
      correlations: 'State derived from multi-sensor fusion and adaptive threshold violations.',
      severity: severity,
      anomalyScore: degradation,
      thresholdValue: 0.5,
      isAnomaly: severity === 'critical',
    };
    useInsightStore.getState().togglePinInsight(insight);
  };

  const handleMouseLeave = () => {
    useInsightStore.getState().clearInsight();
  };

  return (
    <GlowCard className="p-5" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleClick}>
      <SectionHeader title={COPY.dashboard.sections.machineState} />
      <ChartInsightLayout chartId="machine-state">
        <div className="w-full">
          <MachineStateDiagram
            state={machineState}
            temperature={currentTemperature}
            vibration={currentVibration}
            humidity={currentHumidity}
          />
          <div className="mt-4">
            <StateTransitionFlow currentState={machineState} />
          </div>
          <div className="mt-3">
            <DegradationIndicator severity={severity} progress={degradation} />
          </div>
        </div>
      </ChartInsightLayout>
    </GlowCard>
  );
};
