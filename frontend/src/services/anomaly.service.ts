import apiClient from './api.client';
import type { PredictionResult } from '@/types/api.types';

export const fetchRecentAnomalies = async (): Promise<PredictionResult[]> => {
  const response = await apiClient.get<PredictionResult[]>('/recent_anomalies/');
  return response.data;
};
