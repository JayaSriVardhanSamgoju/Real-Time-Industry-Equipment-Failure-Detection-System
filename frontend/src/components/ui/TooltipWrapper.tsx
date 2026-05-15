import React, { useState } from 'react';

interface Props {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom';
}

export const TooltipWrapper: React.FC<Props> = ({
  content,
  children,
  position = 'top',
}) => {
  const [show, setShow] = useState(false);

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          className={clsx(
            'absolute z-50 px-2.5 py-1.5 rounded-badge text-xs font-body text-text-primary bg-bg-elevated border border-bg-border shadow-lg whitespace-nowrap pointer-events-none',
            position === 'top' ? 'bottom-full mb-2 left-1/2 -translate-x-1/2' : 'top-full mt-2 left-1/2 -translate-x-1/2'
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
};

function clsx(...args: (string | boolean | undefined)[]): string {
  return args.filter(Boolean).join(' ');
}
