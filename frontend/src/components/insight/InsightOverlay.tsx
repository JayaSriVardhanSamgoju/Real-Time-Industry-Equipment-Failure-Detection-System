import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInsightStore } from '@/store/useInsightStore';

interface Props {
  chartId: string;
  children: React.ReactNode;
}

export const InsightOverlay: React.FC<Props> = ({ chartId, children }) => {
  const { isActive, chartId: activeChartId } = useInsightStore();
  const isThisChartActive = isActive && activeChartId === chartId;

  return (
    <div className="relative">
      {children}
      <AnimatePresence>
        {isThisChartActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-2 right-2 z-10"
          >
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-badge bg-cyan/10 border border-cyan/20">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
              <span className="text-[10px] font-display uppercase tracking-wider text-cyan">
                Analyzing
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
