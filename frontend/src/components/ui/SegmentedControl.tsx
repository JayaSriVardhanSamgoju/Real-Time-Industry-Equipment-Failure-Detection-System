import React from 'react';
import { clsx } from 'clsx';

interface Props {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export const SegmentedControl: React.FC<Props> = ({ options, value, onChange }) => {
  return (
    <div className="flex items-center bg-bg-elevated rounded-card border border-bg-border p-0.5">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={clsx(
            'px-3 py-1 text-xs font-display rounded transition-all',
            value === option
              ? 'bg-cyan/15 text-cyan border border-cyan/20'
              : 'text-text-muted hover:text-text-secondary border border-transparent'
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
};
