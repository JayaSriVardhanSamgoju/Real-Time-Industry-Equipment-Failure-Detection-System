import apiClient from './api.client';
import type { HealthCheck } from '@/types/api.types';

export const fetchHealth = async (): Promise<HealthCheck> => {
  const response = await apiClient.get<HealthCheck>('/health');
  return response.data;
};
