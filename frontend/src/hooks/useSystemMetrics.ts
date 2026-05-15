import { usePolling } from './usePolling';
import { fetchSystemMetrics } from '@/services/metrics.service';
import { fetchHealth } from '@/services/health.service';
import { useSystemStore } from '@/store/useSystemStore';
import { POLLING } from '@/config/constants';

export function useSystemMetrics(enabled = true) {
  const setMetrics = useSystemStore((s) => s.setMetrics);
  const setHealth = useSystemStore((s) => s.setHealth);
  const setConnected = useSystemStore((s) => s.setConnected);

  const metricsPolling = usePolling({
    fetchFn: fetchSystemMetrics,
    interval: POLLING.METRICS,
    enabled,
    onSuccess: (data) => {
      setMetrics(data);
      setConnected(true);
    },
    onError: () => setConnected(false),
  });

  usePolling({
    fetchFn: fetchHealth,
    interval: POLLING.HEALTH,
    enabled,
    onSuccess: setHealth,
  });

  return metricsPolling;
}
