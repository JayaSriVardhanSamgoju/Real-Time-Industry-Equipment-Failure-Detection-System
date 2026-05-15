import { useEffect, useRef, useCallback, useState } from 'react';

interface UsePollingOptions<T> {
  fetchFn: () => Promise<T>;
  interval: number;
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: unknown) => void;
  maxRetries?: number;
}

interface UsePollingReturn {
  isLoading: boolean;
  isError: boolean;
  lastUpdated: string | null;
  retryCount: number;
}

export function usePolling<T>({
  fetchFn,
  interval,
  enabled = true,
  onSuccess,
  onError,
  maxRetries = 5,
}: UsePollingOptions<T>): UsePollingReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);
  const consecutiveFailures = useRef(0);

  const execute = useCallback(async () => {
    if (!mountedRef.current) return;
    try {
      const data = await fetchFn();
      if (!mountedRef.current) return;
      setIsLoading(false);
      setIsError(false);
      setLastUpdated(new Date().toISOString());
      consecutiveFailures.current = 0;
      setRetryCount(0);
      onSuccess?.(data);
    } catch (err) {
      if (!mountedRef.current) return;
      consecutiveFailures.current += 1;
      setIsLoading(false);
      setRetryCount(consecutiveFailures.current);

      if (consecutiveFailures.current >= maxRetries) {
        setIsError(true);
        onError?.(err);
      }
    }
  }, [fetchFn, onSuccess, onError, maxRetries]);

  useEffect(() => {
    mountedRef.current = true;

    if (!enabled) {
      setIsLoading(false);
      return;
    }

    execute();

    const scheduleNext = () => {
      const backoff = Math.min(
        interval * Math.pow(2, consecutiveFailures.current),
        interval * 16
      );
      const delay = consecutiveFailures.current > 0 ? backoff : interval;

      timerRef.current = setTimeout(async () => {
        await execute();
        if (mountedRef.current && enabled) {
          scheduleNext();
        }
      }, delay);
    };

    scheduleNext();

    return () => {
      mountedRef.current = false;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [execute, interval, enabled]);

  return { isLoading, isError, lastUpdated, retryCount };
}
