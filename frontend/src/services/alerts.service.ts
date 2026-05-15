import apiClient from './api.client';
import type { AlertSummary } from '@/types/api.types';

export const fetchAlertSummary = async (): Promise<AlertSummary> => {
  const response = await apiClient.get<AlertSummary>('/alert_summary');
  return response.data;
};
