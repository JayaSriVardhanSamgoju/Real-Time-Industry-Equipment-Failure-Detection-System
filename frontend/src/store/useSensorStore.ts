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
  selectedEquipmentId: string;
  availableEquipments: string[];
  setLiveData: (data: PredictionResult[]) => void;
  setSelectedEquipmentId: (id: string) => void;
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

export const useSensorStore = create<SensorStoreState>((set, get) => ({
  liveData: [],
  temperatureData: [],
  vibrationData: [],
  humidityData: [],
  currentTemperature: 0,
  currentVibration: 0,
  currentHumidity: 0,
  machineState: 'NORMAL',
  selectedEquipmentId: 'EQP-001',
  availableEquipments: [],
  setLiveData: (data: PredictionResult[]) => {
    if (data.length === 0) return;
    
    // Identify all unique equipments in the stream
    const uniqueEquips = Array.from(new Set(data.map(d => d.equipment_id)));
    
    // Filter data for the selected equipment
    const filteredData = data.filter(d => d.equipment_id === get().selectedEquipmentId);
    if (filteredData.length === 0) {
      set({ availableEquipments: uniqueEquips });
      return;
    }

    const latest = filteredData[filteredData.length - 1];
    const anomalyCount = filteredData.filter((d) => d.is_anomaly).length;
    const anomalyRate = (anomalyCount / Math.max(filteredData.length, 1)) * 100;

    set({
      liveData: filteredData,
      availableEquipments: uniqueEquips,
      temperatureData: toChartPoints(filteredData, 'temperature'),
      vibrationData: toChartPoints(filteredData, 'vibration'),
      humidityData: toChartPoints(filteredData, 'humidity'),
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
  setSelectedEquipmentId: (id: string) => set({ selectedEquipmentId: id }),
}));
