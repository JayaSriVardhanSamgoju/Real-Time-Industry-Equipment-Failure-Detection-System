import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StatusBadge } from './StatusBadge';
import { getAlertLevelColor } from '@/utils/colorUtils';
import type { AlertEvent } from '@/types/anomaly.types';
import { formatTime } from '@/utils/formatters';
import { ChevronDown, ChevronUp, Check, Search } from 'lucide-react';

interface Props {
  alert: AlertEvent;
  onAcknowledge: (id: string) => void;
}

export const AlertCard: React.FC<Props> = ({ alert, onAcknowledge }) => {
  const [expanded, setExpanded] = useState(false);
  const color = getAlertLevelColor(alert.severity);
  const tempSigma = Math.abs(alert.temperature - 68) / 5;
  const vibSigma = Math.abs(alert.vibration - 4) / 1.5;
  const humSigma = Math.abs(alert.humidity - 55) / 8;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-card border bg-bg-surface overflow-hidden group hover:border-cyan/50 transition-colors shadow-sm"
      style={{ borderColor: expanded ? color : `${color}40` }}
    >
      <div 
        className="p-3 cursor-pointer hover:bg-bg-elevated/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-1.5 self-stretch rounded-full flex-shrink-0"
            style={{ backgroundColor: color, boxShadow: expanded ? `0 0 10px ${color}` : 'none' }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <StatusBadge severity={alert.severity} />
                <span className="text-sm font-body font-medium text-text-primary truncate group-hover:text-cyan transition-colors">
                  {alert.title}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-text-muted font-mono mt-1">
              <span>{formatTime(alert.timestamp)}</span>
              <span className="text-cyan/50">•</span>
              <span className="bg-bg-base px-1.5 py-0.5 rounded border border-bg-border">EQ: {alert.equipmentId}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {!alert.isAcknowledged && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAcknowledge(alert.id);
                }}
                className="p-1.5 rounded-md hover:bg-green/20 text-text-muted hover:text-green transition-colors border border-transparent hover:border-green/30"
                title="Acknowledge"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            )}
            <div
              className={`p-1.5 rounded-md transition-colors ${expanded ? 'bg-cyan/10 text-cyan' : 'text-text-muted group-hover:text-cyan'}`}
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 space-y-4 border-t border-bg-border bg-bg-base/50">
              <div className="bg-red/5 border border-red/20 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Search className="w-3 h-3 text-red" />
                  <div className="text-[10px] font-display uppercase tracking-wider text-red font-bold">Root Cause Analysis</div>
                </div>
                <p className="text-sm text-text-primary font-body leading-relaxed">{alert.rootCause}</p>
              </div>
              
              <div className="bg-bg-surface border border-bg-border rounded-lg p-3">
                <div className="text-[10px] font-display uppercase tracking-wider text-text-muted mb-2">Triggered Features (Deviation from Baseline)</div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col bg-bg-base p-2 rounded border border-bg-border">
                    <span className="text-[10px] text-text-muted uppercase mb-1">Temp</span>
                    <span className="font-mono text-xs font-bold" style={{ color: tempSigma > 2 ? '#EF4444' : tempSigma > 1 ? '#F59E0B' : '#10B981' }}>
                      +{tempSigma.toFixed(1)}σ
                    </span>
                  </div>
                  <div className="flex flex-col bg-bg-base p-2 rounded border border-bg-border">
                    <span className="text-[10px] text-text-muted uppercase mb-1">Vibration</span>
                    <span className="font-mono text-xs font-bold" style={{ color: vibSigma > 2 ? '#EF4444' : vibSigma > 1 ? '#F59E0B' : '#10B981' }}>
                      +{vibSigma.toFixed(1)}σ
                    </span>
                  </div>
                  <div className="flex flex-col bg-bg-base p-2 rounded border border-bg-border">
                    <span className="text-[10px] text-text-muted uppercase mb-1">Humidity</span>
                    <span className="font-mono text-xs font-bold" style={{ color: humSigma > 2 ? '#EF4444' : humSigma > 1 ? '#F59E0B' : '#10B981' }}>
                      +{humSigma.toFixed(1)}σ
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-1 bg-purple-500/5 border border-purple-500/20 rounded-lg p-3">
                  <div className="text-[10px] font-display uppercase tracking-wider text-purple-400 mb-1">ML Confidence</div>
                  <p className="text-lg text-text-primary font-mono font-bold">
                    {(alert.anomalyScore * 100).toFixed(1)}% <span className="text-xs text-text-muted font-normal uppercase">Probability</span>
                  </p>
                </div>
              </div>

              <div className="bg-cyan/5 border border-cyan/20 rounded-lg p-3">
                <div className="text-[10px] font-display uppercase tracking-wider text-cyan mb-1 font-bold">Recommended Action</div>
                <p className="text-sm text-text-primary font-body">{alert.recommendation}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
