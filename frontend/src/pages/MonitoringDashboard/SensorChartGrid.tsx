import React from 'react';
import { SensorLineChart } from '@/components/charts/SensorLineChart';
import { ChartInsightLayout } from '@/components/layout/ChartInsightLayout';
import { InsightOverlay } from '@/components/insight/InsightOverlay';
import { GlowCard } from '@/components/ui/GlowCard';
import { useSensorStore } from '@/store/useSensorStore';
import { THRESHOLDS, CHART } from '@/config/constants';
import { COPY } from '@/config/copy';
import { SectionHeader } from '@/components/ui/SectionHeader';

export const SensorChartGrid: React.FC = () => {
  const {
    temperatureData,
    vibrationData,
    humidityData,
    currentTemperature,
    currentVibration,
    currentHumidity,
    liveData,
  } = useSensorStore();

  const charts = [
    {
      id: 'temperature-chart',
      title: COPY.dashboard.sensors.temperature,
      data: temperatureData,
      sensorType: 'temperature' as const,
      unit: THRESHOLDS.TEMPERATURE.unit,
      threshold: THRESHOLDS.TEMPERATURE.critical,
      currentValue: currentTemperature,
    },
    {
      id: 'vibration-chart',
      title: COPY.dashboard.sensors.vibration,
      data: vibrationData,
      sensorType: 'vibration' as const,
      unit: THRESHOLDS.VIBRATION.unit,
      threshold: THRESHOLDS.VIBRATION.critical,
      currentValue: currentVibration,
    },
    {
      id: 'humidity-chart',
      title: COPY.dashboard.sensors.humidity,
      data: humidityData,
      sensorType: 'humidity' as const,
      unit: THRESHOLDS.HUMIDITY.unit,
      threshold: THRESHOLDS.HUMIDITY.critical,
      currentValue: currentHumidity,
    },
  ];

  return (
    <div className="space-y-4 mb-6">
      {charts.map((chart) => (
        <GlowCard key={chart.id} className="p-4" animate={false}>
          <ChartInsightLayout chartId={chart.id}>
            <InsightOverlay chartId={chart.id}>
              <SensorLineChart
                data={chart.data}
                sensorType={chart.sensorType}
                unit={chart.unit}
                threshold={chart.threshold}
                liveData={liveData}
                title={chart.title}
                currentValue={chart.currentValue}
              />
            </InsightOverlay>
          </ChartInsightLayout>
        </GlowCard>
      ))}
    </div>
  );
};
