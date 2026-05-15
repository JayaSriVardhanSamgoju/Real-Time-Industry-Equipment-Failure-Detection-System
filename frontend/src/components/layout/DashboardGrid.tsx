import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const DashboardGrid: React.FC<Props> = ({ children, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4 ${className}`}>
      {children}
    </div>
  );
};
