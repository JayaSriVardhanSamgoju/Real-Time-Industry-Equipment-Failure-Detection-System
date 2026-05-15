import React from 'react';
import { motion } from 'framer-motion';
import type { MachineState } from '@/types/machine.types';
import { getMachineStateColor } from '@/utils/colorUtils';
import { THRESHOLDS } from '@/config/constants';

interface Props {
  state: MachineState;
  temperature: number;
  vibration: number;
  humidity: number;
}

export const MachineStateDiagram: React.FC<Props> = ({
  state,
  temperature,
  vibration,
  humidity,
}) => {
  const stateColor = getMachineStateColor(state);
  const heatOpacity = Math.min((temperature - 60) / 40, 0.8);
  const vibrateClass =
    state === 'FAILURE'
      ? 'animate-vibrate-fast'
      : state === 'UNSTABLE'
        ? 'animate-vibrate-slow'
        : state === 'DEGRADING'
          ? 'animate-vibrate-slow'
          : '';

  const sensorIndicators = [
    {
      label: 'T',
      value: temperature,
      color:
        temperature > THRESHOLDS.TEMPERATURE.critical
          ? '#EF4444'
          : temperature > THRESHOLDS.TEMPERATURE.warning
            ? '#F59E0B'
            : '#10B981',
    },
    {
      label: 'V',
      value: vibration,
      color:
        vibration > THRESHOLDS.VIBRATION.critical
          ? '#EF4444'
          : vibration > THRESHOLDS.VIBRATION.warning
            ? '#F59E0B'
            : '#10B981',
    },
    {
      label: 'H',
      value: humidity,
      color:
        humidity > THRESHOLDS.HUMIDITY.critical
          ? '#EF4444'
          : humidity > THRESHOLDS.HUMIDITY.warning
            ? '#F59E0B'
            : '#10B981',
    },
  ];

  return (
    <div className="flex flex-col items-center">
      {/* State badge */}
      <motion.div
        animate={{ boxShadow: `0 0 20px ${stateColor}40` }}
        className="px-4 py-1.5 rounded-badge mb-4 font-display text-sm font-bold uppercase tracking-wider"
        style={{
          backgroundColor: `${stateColor}15`,
          color: stateColor,
          border: `1px solid ${stateColor}40`,
        }}
      >
        {state}
      </motion.div>

      {/* Machine SVG */}
      <div className={`relative ${vibrateClass}`}>
        <svg width="200" height="140" viewBox="0 0 200 140" className="mx-auto">
          {/* Base platform */}
          <rect x="20" y="110" width="160" height="20" rx="4" fill="#1E2D40" stroke="#2D4A6E" strokeWidth="1" />
          {/* Motor housing */}
          <rect x="40" y="50" width="80" height="60" rx="6" fill="#0D1420" stroke="#2D4A6E" strokeWidth="1.5" />
          {/* Motor cylinder */}
          <ellipse cx="80" cy="80" rx="25" ry="20" fill="#111827" stroke={stateColor} strokeWidth="1.5" opacity="0.8" />
          {/* Shaft */}
          <rect x="120" y="72" width="50" height="16" rx="3" fill="#111827" stroke="#2D4A6E" strokeWidth="1" />
          {/* Shaft detail */}
          <circle cx="155" cy="80" r="10" fill="#0D1420" stroke={stateColor} strokeWidth="1.5" />
          {/* Cooling fins */}
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={45 + i * 18} y="45" width="2" height="8" fill="#2D4A6E" rx="1" />
          ))}
          {/* Heat overlay */}
          <rect
            x="40"
            y="50"
            width="80"
            height="60"
            rx="6"
            fill="#EF4444"
            opacity={heatOpacity * 0.3}
            style={{ mixBlendMode: 'screen' }}
          />
        </svg>

        {/* Sensor indicators */}
        <div className="flex items-center justify-center gap-4 mt-3">
          {sensorIndicators.map((s) => (
            <div key={s.label} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: s.color, boxShadow: `0 0 8px ${s.color}60` }}
              />
              <span className="text-[10px] font-mono text-text-muted">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
