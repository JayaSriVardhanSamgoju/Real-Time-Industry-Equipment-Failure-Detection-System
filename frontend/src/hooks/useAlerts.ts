import { usePolling } from './usePolling';
import { fetchAlertSummary } from '@/services/alerts.service';
import { useAlertStore } from '@/store/useAlertStore';
import { POLLING } from '@/config/constants';

export function useAlerts(enabled = true) {
  const setSummary = useAlertStore((s) => s.setSummary);

  return usePolling({
    fetchFn: fetchAlertSummary,
    interval: POLLING.ALERTS,
    enabled,
    onSuccess: setSummary,
  });
}
