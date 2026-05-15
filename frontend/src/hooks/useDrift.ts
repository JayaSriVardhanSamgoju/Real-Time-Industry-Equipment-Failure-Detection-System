import { usePolling } from './usePolling';
import { fetchDriftReport } from '@/services/drift.service';
import { useDriftStore } from '@/store/useDriftStore';
import { POLLING } from '@/config/constants';

export function useDrift(enabled = true) {
  const setReport = useDriftStore((s) => s.setReport);

  return usePolling({
    fetchFn: fetchDriftReport,
    interval: POLLING.DRIFT,
    enabled,
    onSuccess: setReport,
  });
}
