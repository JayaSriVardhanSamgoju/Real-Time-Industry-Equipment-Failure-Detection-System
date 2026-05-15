import apiClient from './api.client';
import type { DriftReport } from '@/types/api.types';

export const fetchDriftReport = async (): Promise<DriftReport> => {
  const response = await apiClient.get<DriftReport>('/drift_report');
  return response.data;
};
