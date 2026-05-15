import React from 'react';
import { InsightPanel } from '@/components/insight/InsightPanel';

interface Props {
  children: React.ReactNode;
  chartId?: string;
}

export const ChartInsightLayout: React.FC<Props> = ({ children, chartId }) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full">
      <div className="w-full lg:w-[65%] min-w-0">{children}</div>
      <div className="w-full lg:w-[35%] lg:min-w-[260px]">
        <InsightPanel chartId={chartId} />
      </div>
    </div>
  );
};
