import { create } from 'zustand';
import type { PredictionResult } from '@/types/api.types';
import type { ChartDataPoint } from '@/types/chart.types';
import type { MachineState } from '@/types/machine.types';
import { CHART, THRESHOLDS } from '@/config/constants';
import { format } from 'date-fns';

interface SensorStoreState {
  liveData: PredictionResult[];
  temperatureData: ChartDataPoint[];
  vibrationData: ChartDataPoint[];
  humidityData: ChartDataPoint[];
  currentTemperature: number;
  currentVibration: number;
  currentHumidity: number;
  machineState: MachineState;
  setLiveData: (data: PredictionResult[]) => void;
}

const determineMachineState = (
  temp: number,
  vib: number,
  humidity: number,
  anomalyRate: number
): MachineState => {
  if (
    temp > THRESHOLDS.TEMPERATURE.critical ||
    vib > THRESHOLDS.VIBRATION.critical ||
    anomalyRate > 30
  )
    return 'FAILURE';
  if (
    temp > THRESHOLDS.TEMPERATURE.warning ||
    vib > THRESHOLDS.VIBRATION.warning ||
    anomalyRate > 15
  )
    return 'UNSTABLE';
  if (
    temp > THRESHOLDS.TEMPERATURE.max ||
    vib > THRESHOLDS.VIBRATION.max ||
    humidity > THRESHOLDS.HUMIDITY.max ||
    anomalyRate > 5
  )
    return 'DEGRADING';
  return 'NORMAL';
};

const toChartPoints = (
  data: PredictionResult[],
  key: 'temperature' | 'vibration' | 'humidity'
): ChartDataPoint[] => {
  return data.slice(-CHART.MAX_DATA_POINTS).map((d) => ({
    timestamp: d.timestamp,
    value: d[key],
    formattedTime: formatTimestamp(d.timestamp),
  }));
};

const formatTimestamp = (ts: string): string => {
  try {
    return format(new Date(ts), 'HH:mm:ss');
  } catch {
    return ts.slice(11, 19) || ts;
  }
};

export const useSensorStore = create<SensorStoreState>((set) => ({
  liveData: [],
  temperatureData: [],
  vibrationData: [],
  humidityData: [],
  currentTemperature: 0,
  currentVibration: 0,
  currentHumidity: 0,
  machineState: 'NORMAL',
  setLiveData: (data: PredictionResult[]) => {
    if (data.length === 0) return;
    const latest = data[data.length - 1];
    const anomalyCount = data.filter((d) => d.is_anomaly).length;
    const anomalyRate = (anomalyCount / Math.max(data.length, 1)) * 100;

    set({
      liveData: data,
      temperatureData: toChartPoints(data, 'temperature'),
      vibrationData: toChartPoints(data, 'vibration'),
      humidityData: toChartPoints(data, 'humidity'),
      currentTemperature: latest.temperature,
      currentVibration: latest.vibration,
      currentHumidity: latest.humidity,
      machineState: determineMachineState(
        latest.temperature,
        latest.vibration,
        latest.humidity,
        anomalyRate
      ),
    });
  },
}));
