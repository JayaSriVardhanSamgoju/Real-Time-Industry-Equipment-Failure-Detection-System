import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInsightStore } from '@/store/useInsightStore';
import { InsightContent } from './InsightContent';
import { insightPanelVariants } from '@/animations/variants';
import { COPY } from '@/config/copy';
import { Zap, MousePointerClick } from 'lucide-react';

interface Props {
  chartId?: string;
}

export const InsightPanel: React.FC<Props> = ({ chartId }) => {
  const { isActive, content } = useInsightStore();

  const isMatchingChart = !chartId || (content && content.chartId === chartId);
  const shouldShow = isActive && content && isMatchingChart;

  return (
    <div className="h-full min-h-[300px] flex flex-col">
      <AnimatePresence mode="wait">
        {shouldShow ? (
          <motion.div
            key={content.chartId + content.timestamp}
            variants={insightPanelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="h-full overflow-y-auto rounded-panel bg-bg-surface border border-bg-border"
          >
            <InsightContent content={content} />
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full flex flex-col items-center justify-center rounded-panel bg-bg-surface border border-bg-border p-6"
          >
            <div className="w-14 h-14 rounded-full bg-cyan/10 flex items-center justify-center mb-4">
              <MousePointerClick className="w-6 h-6 text-cyan" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-cyan" />
              <span className="text-xs font-display uppercase tracking-widest text-cyan">
                {COPY.insight.title}
              </span>
            </div>
            <p className="text-text-muted text-sm text-center font-body leading-relaxed max-w-[200px]">
              {COPY.insight.idle}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
