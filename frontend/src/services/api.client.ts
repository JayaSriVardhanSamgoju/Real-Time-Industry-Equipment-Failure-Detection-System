import axios from 'axios';
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@/config/constants';

const generateRequestId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers.set('X-Request-ID', generateRequestId());
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as InternalAxiosRequestConfig & {
      _retryCount?: number;
    };
    if (!config) return Promise.reject(error);

    config._retryCount = config._retryCount ?? 0;

    if (config._retryCount < 3 && (!error.response || error.response.status >= 500)) {
      config._retryCount += 1;
      const delay = Math.pow(2, config._retryCount) * 500;
      await new Promise((resolve) => setTimeout(resolve, delay));
      return apiClient(config);
    }

    return Promise.reject({
      message: error.message || 'Network error',
      status: error.response?.status ?? 0,
      timestamp: new Date().toISOString(),
    });
  }
);

export default apiClient;
