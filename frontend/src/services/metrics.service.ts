import apiClient from './api.client';
import type { SystemMetrics } from '@/types/api.types';

export const fetchSystemMetrics = async (): Promise<SystemMetrics> => {
  const response = await apiClient.get<SystemMetrics>('/system_metrics');
  return response.data;
};
