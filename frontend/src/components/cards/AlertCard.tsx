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
      className="rounded-card border bg-bg-surface overflow-hidden"
      style={{ borderColor: `${color}40` }}
    >
      <div className="p-3">
        <div className="flex items-start gap-3">
          <div
            className="w-1 self-stretch rounded-full flex-shrink-0"
            style={{ backgroundColor: color }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <StatusBadge severity={alert.severity} />
                <span className="text-sm font-body text-text-primary truncate">
                  {alert.title}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-text-muted font-mono">
              <span>{formatTime(alert.timestamp)}</span>
              <span>•</span>
              <span>Equipment: {alert.equipmentId}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {!alert.isAcknowledged && (
              <button
                onClick={() => onAcknowledge(alert.id)}
                className="p-1.5 rounded hover:bg-green/10 text-text-muted hover:text-green transition-colors"
                title="Acknowledge"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 rounded hover:bg-bg-elevated text-text-muted hover:text-text-secondary transition-colors"
            >
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
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
            <div className="px-3 pb-3 pt-1 space-y-3 border-t border-bg-border">
              <div>
                <div className="text-[10px] font-display uppercase tracking-wider text-text-muted mb-1">Root Cause</div>
                <p className="text-xs text-text-secondary font-body">{alert.rootCause}</p>
              </div>
              <div>
                <div className="text-[10px] font-display uppercase tracking-wider text-text-muted mb-1">Triggered Features</div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-xs">
                    <span className="text-text-muted">Temp: </span>
                    <span className="font-mono" style={{ color: tempSigma > 2 ? '#EF4444' : tempSigma > 1 ? '#F59E0B' : '#10B981' }}>
                      +{tempSigma.toFixed(1)}σ
                    </span>
                  </div>
                  <div className="text-xs">
                    <span className="text-text-muted">Vib: </span>
                    <span className="font-mono" style={{ color: vibSigma > 2 ? '#EF4444' : vibSigma > 1 ? '#F59E0B' : '#10B981' }}>
                      +{vibSigma.toFixed(1)}σ
                    </span>
                  </div>
                  <div className="text-xs">
                    <span className="text-text-muted">Hum: </span>
                    <span className="font-mono" style={{ color: humSigma > 2 ? '#EF4444' : humSigma > 1 ? '#F59E0B' : '#10B981' }}>
                      +{humSigma.toFixed(1)}σ
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-[10px] font-display uppercase tracking-wider text-text-muted mb-1">ML Confidence</div>
                <p className="text-xs text-text-secondary font-mono">{(alert.anomalyScore * 100).toFixed(1)}% anomaly probability</p>
              </div>
              <div>
                <div className="text-[10px] font-display uppercase tracking-wider text-cyan mb-1">Recommended Action</div>
                <p className="text-xs text-text-secondary font-body">{alert.recommendation}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
