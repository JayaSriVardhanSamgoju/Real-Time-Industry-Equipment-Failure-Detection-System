import { useState, useEffect, useRef } from 'react';

interface UseAnimatedCounterOptions {
  value: number;
  duration?: number;
  decimals?: number;
}

export function useAnimatedCounter({
  value,
  duration = 600,
  decimals = 0,
}: UseAnimatedCounterOptions): string {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValue = useRef(value);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const start = prevValue.current;
    const end = value;
    const diff = end - start;
    if (Math.abs(diff) < 0.001) {
      setDisplayValue(end);
      prevValue.current = end;
      return;
    }

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + diff * eased;
      setDisplayValue(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        prevValue.current = end;
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [value, duration]);

  return displayValue.toFixed(decimals);
}
