import React from 'react';
import type { MachineState } from '@/types/machine.types';
import { getMachineStateColor } from '@/utils/colorUtils';
import { MACHINE_STATES } from '@/config/constants';

interface Props {
  currentState: MachineState;
}

export const StateTransitionFlow: React.FC<Props> = ({ currentState }) => {
  const currentIndex = MACHINE_STATES.indexOf(currentState);

  return (
    <div className="flex items-center justify-between gap-1 py-3">
      {MACHINE_STATES.map((state, idx) => {
        const color = getMachineStateColor(state);
        const isActive = idx === currentIndex;
        const isPast = idx < currentIndex;

        return (
          <React.Fragment key={state}>
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[8px] font-display font-bold transition-all duration-300"
                style={{
                  backgroundColor: isActive ? `${color}30` : isPast ? `${color}15` : '#1E2D40',
                  border: `2px solid ${isActive ? color : isPast ? `${color}50` : '#2D4A6E'}`,
                  color: isActive ? color : isPast ? `${color}80` : '#4A5568',
                  boxShadow: isActive ? `0 0 12px ${color}40` : 'none',
                }}
              >
                {idx + 1}
              </div>
              <span
                className="text-[8px] font-display uppercase tracking-wider whitespace-nowrap"
                style={{ color: isActive ? color : '#4A5568' }}
              >
                {state}
              </span>
            </div>
            {idx < MACHINE_STATES.length - 1 && (
              <div
                className="flex-1 h-0.5 min-w-[12px]"
                style={{
                  backgroundColor: isPast ? `${getMachineStateColor(MACHINE_STATES[idx + 1])}40` : '#1E2D40',
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
