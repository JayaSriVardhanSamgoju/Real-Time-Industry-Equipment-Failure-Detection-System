import type { Severity } from '@/types/anomaly.types';
import type { MachineState } from '@/types/machine.types';

export function getSeverityColor(severity: Severity): string {
  switch (severity) {
    case 'critical':
      return '#EF4444';
    case 'warning':
      return '#F59E0B';
    case 'normal':
      return '#10B981';
  }
}

export function getSeverityGlow(severity: Severity): string {
  switch (severity) {
    case 'critical':
      return '0 0 24px rgba(239,68,68,0.30), 0 0 48px rgba(239,68,68,0.15)';
    case 'warning':
      return '0 0 20px rgba(245,158,11,0.20), 0 0 40px rgba(245,158,11,0.10)';
    case 'normal':
      return '0 0 20px rgba(0,212,255,0.12), 0 0 40px rgba(0,212,255,0.06)';
  }
}

export function getAlertLevelColor(level: string): string {
  switch (level) {
    case 'CRITICAL':
      return '#EF4444';
    case 'HIGH':
      return '#F97316';
    case 'MEDIUM':
      return '#F59E0B';
    case 'LOW':
      return '#3B82F6';
    default:
      return '#10B981';
  }
}

export function getMachineStateColor(state: MachineState): string {
  switch (state) {
    case 'NORMAL':
      return '#10B981';
    case 'DEGRADING':
      return '#F59E0B';
    case 'UNSTABLE':
      return '#F97316';
    case 'FAILURE':
      return '#EF4444';
    case 'RESET':
      return '#00D4FF';
  }
}

export function getValueColor(value: number, warning: number, critical: number): string {
  if (value >= critical) return '#EF4444';
  if (value >= warning) return '#F59E0B';
  return '#00D4FF';
}

export function getCorrelationColor(value: number): string {
  if (value > 0.5) return `rgba(239,68,68,${Math.abs(value) * 0.8})`;
  if (value > 0) return `rgba(245,158,11,${Math.abs(value) * 0.8})`;
  if (value < -0.5) return `rgba(59,130,246,${Math.abs(value) * 0.8})`;
  if (value < 0) return `rgba(59,130,246,${Math.abs(value) * 0.5})`;
  return 'rgba(139,156,200,0.2)';
}
