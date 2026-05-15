import { MACHINE_STATES } from '@/config/constants';

export type MachineState = (typeof MACHINE_STATES)[number];

export type SensorType = 'temperature' | 'vibration' | 'humidity';

export interface SensorReading {
  timestamp: string;
  temperature: number;
  vibration: number;
  humidity: number;
  equipmentId: string;
}

export interface SensorStatus {
  type: SensorType;
  currentValue: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  severity: 'normal' | 'warning' | 'critical';
}

export interface MachineInfo {
  state: MachineState;
  equipmentId: string;
  lastStateChange: string;
  sensors: SensorStatus[];
  healthScore: number;
}
