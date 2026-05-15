import { usePolling } from './usePolling';
import { fetchLiveData } from '@/services/liveData.service';
import { useSensorStore } from '@/store/useSensorStore';
import { useAlertStore } from '@/store/useAlertStore';
import { POLLING } from '@/config/constants';

export function useLiveData(enabled = true) {
  const setLiveData = useSensorStore((s) => s.setLiveData);
  const setAlerts = useAlertStore((s) => s.setAlerts);

  return usePolling({
    fetchFn: fetchLiveData,
    interval: POLLING.LIVE_DATA,
    enabled,
    onSuccess: (data) => {
      setLiveData(data);
      setAlerts(data);
    },
  });
}
