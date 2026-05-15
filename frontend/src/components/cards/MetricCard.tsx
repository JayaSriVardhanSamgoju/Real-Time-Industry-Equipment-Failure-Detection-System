import React from 'react';
import { motion } from 'framer-motion';
import { GlowCard } from '@/components/ui/GlowCard';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { ThroughputSparkline } from '@/components/charts/ThroughputSparkline';
import { getSeverityColor, getSeverityGlow } from '@/utils/colorUtils';
import type { Severity } from '@/types/anomaly.types';
import type { SparklinePoint } from '@/types/chart.types';
import { fadeInUp } from '@/animations/variants';

interface Props {
  title: string;
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  icon: React.ReactNode;
  severity?: Severity;
  sparklineData?: SparklinePoint[];
  subtitle?: string;
}

export const MetricCard: React.FC<Props> = ({
  title,
  value,
  suffix = '',
  prefix = '',
  decimals = 0,
  icon,
  severity = 'normal',
  sparklineData,
  subtitle,
}) => {
  const color = getSeverityColor(severity);
  const glow = getSeverityGlow(severity);

  return (
    <motion.div variants={fadeInUp}>
      <GlowCard glowColor={`${color}20`} className="p-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: color }} />
        <div className="flex items-start justify-between mb-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${color}15` }}
          >
            <span style={{ color }}>{icon}</span>
          </div>
          <span className="text-[10px] font-display uppercase tracking-wider text-text-muted">
            {title}
          </span>
        </div>
        <div className="mb-1">
          <AnimatedCounter
            value={value}
            decimals={decimals}
            prefix={prefix}
            suffix={suffix}
            className="text-2xl font-bold text-text-primary"
          />
        </div>
        {subtitle && (
          <p className="text-[10px] text-text-muted font-body">{subtitle}</p>
        )}
        {sparklineData && sparklineData.length > 2 && (
          <div className="mt-2 h-8">
            <ThroughputSparkline data={sparklineData} color={color} />
          </div>
        )}
      </GlowCard>
    </motion.div>
  );
};
