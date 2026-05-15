import React from 'react';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';

interface Props {
  value: number;
  decimals?: number;
  duration?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
}

export const AnimatedCounter: React.FC<Props> = ({
  value,
  decimals = 0,
  duration = 600,
  className = '',
  suffix = '',
  prefix = '',
}) => {
  const displayValue = useAnimatedCounter({ value, duration, decimals });

  return (
    <span className={`font-mono tabular-nums ${className}`}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
};
