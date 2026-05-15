import apiClient from './api.client';
import type { PredictionResult } from '@/types/api.types';

export const fetchLiveData = async (): Promise<PredictionResult[]> => {
  const response = await apiClient.get<PredictionResult[]>('/live_data/');
  return response.data;
};
