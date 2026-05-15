import { usePolling } from './usePolling';
import { fetchRecentAnomalies } from '@/services/anomaly.service';
import { useAnomalyStore } from '@/store/useAnomalyStore';
import { POLLING } from '@/config/constants';

export function useAnomalies(enabled = true) {
  const setAnomalies = useAnomalyStore((s) => s.setAnomalies);

  return usePolling({
    fetchFn: fetchRecentAnomalies,
    interval: POLLING.ANOMALIES,
    enabled,
    onSuccess: setAnomalies,
  });
}
