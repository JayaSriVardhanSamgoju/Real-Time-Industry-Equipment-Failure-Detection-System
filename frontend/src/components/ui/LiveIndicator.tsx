import React from 'react';

interface Props {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LiveIndicator: React.FC<Props> = ({ label = 'LIVE', size = 'sm' }) => {
  const dotSizes = { sm: 'w-1.5 h-1.5', md: 'w-2 h-2', lg: 'w-2.5 h-2.5' };
  const textSizes = { sm: 'text-[10px]', md: 'text-xs', lg: 'text-sm' };

  return (
    <div className="flex items-center gap-1.5">
      <div className="relative">
        <div className={`${dotSizes[size]} rounded-full bg-green`} />
        <div className={`absolute inset-0 ${dotSizes[size]} rounded-full bg-green animate-ping opacity-75`} />
      </div>
      <span className={`${textSizes[size]} font-display uppercase tracking-widest text-green`}>
        {label}
      </span>
    </div>
  );
};
