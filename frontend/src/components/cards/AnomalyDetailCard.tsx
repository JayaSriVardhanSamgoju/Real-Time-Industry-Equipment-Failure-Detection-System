import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AnomalyEvent } from '@/types/anomaly.types';
import { StatusBadge } from './StatusBadge';
import { formatTime } from '@/utils/formatters';
import { slideInRight } from '@/animations/variants';
import { X, AlertTriangle, Activity, Cpu, Wrench } from 'lucide-react';

interface Props {
  anomaly: AnomalyEvent | null;
  onClose: () => void;
}

export const AnomalyDetailCard: React.FC<Props> = ({ anomaly, onClose }) => {
  const tempSigma = anomaly ? Math.abs(anomaly.temperature - 68) / 5 : 0;
  const vibSigma = anomaly ? Math.abs(anomaly.vibration - 4) / 1.5 : 0;
  const humSigma = anomaly ? Math.abs(anomaly.humidity - 55) / 8 : 0;

  return (
    <AnimatePresence>
      {anomaly && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />
          <motion.div
            variants={slideInRight}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed right-0 top-0 bottom-0 w-96 bg-bg-surface border-l border-bg-border z-50 overflow-y-auto"
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red" />
                  <span className="font-display text-text-primary font-bold">
                    ANOMALY EVENT
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded hover:bg-bg-elevated text-text-muted hover:text-text-primary transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs text-text-muted font-mono mb-4">
                {formatTime(anomaly.timestamp)}
              </div>

              {/* Scores */}
              <div className="space-y-3 mb-5">
                <div className="flex justify-between items-center p-3 rounded-card bg-bg-elevated border border-bg-border">
                  <span className="text-xs text-text-muted">Anomaly Score</span>
                  <span className="font-mono text-lg text-red font-bold">{anomaly.anomalyScore.toFixed(3)}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-card bg-bg-elevated border border-bg-border">
                  <span className="text-xs text-text-muted">Threshold</span>
                  <span className="font-mono text-text-secondary">{anomaly.threshold.toFixed(3)}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-card bg-red/5 border border-red/20">
                  <span className="text-xs text-text-muted">Δ Above Threshold</span>
                  <span className="font-mono text-red font-bold">
                    +{(anomaly.anomalyScore - anomaly.threshold).toFixed(3)}
                  </span>
                </div>
              </div>

              {/* Triggered Features */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="w-4 h-4 text-cyan" />
                  <span className="text-xs font-display uppercase tracking-wider text-cyan">
                    Triggered Features
                  </span>
                </div>
                <div className="space-y-2">
                  {[
                    { name: 'Temperature', value: `${anomaly.temperature.toFixed(1)}°C`, sigma: tempSigma },
                    { name: 'Vibration', value: `${anomaly.vibration.toFixed(2)} mm/s`, sigma: vibSigma },
                    { name: 'Humidity', value: `${anomaly.humidity.toFixed(1)}%`, sigma: humSigma },
                  ].map((f) => (
                    <div
                      key={f.name}
                      className="flex items-center justify-between p-2 rounded bg-bg-elevated border border-bg-border"
                    >
                      <span className="text-xs text-text-secondary">{f.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-text-primary">{f.value}</span>
                        <span
                          className="text-xs font-mono font-bold"
                          style={{
                            color: f.sigma > 2 ? '#EF4444' : f.sigma > 1 ? '#F59E0B' : '#10B981',
                          }}
                        >
                          +{f.sigma.toFixed(1)}σ
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Validation */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <Cpu className="w-4 h-4 text-amber" />
                  <span className="text-xs font-display uppercase tracking-wider text-amber">
                    Rule-Based Validation
                  </span>
                </div>
                <div className="space-y-1.5">
                  {[
                    { label: 'Physics threshold', status: anomaly.temperature > 85 || anomaly.vibration > 8.5 ? 'EXCEEDED' : 'PASSED' },
                    { label: 'ML threshold', status: 'EXCEEDED' },
                    { label: 'Confidence', status: anomaly.anomalyScore > 0.8 ? 'HIGH' : 'MEDIUM' },
                  ].map((r) => (
                    <div key={r.label} className="flex justify-between text-xs">
                      <span className="text-text-muted">{r.label}:</span>
                      <span className={r.status === 'EXCEEDED' || r.status === 'HIGH' ? 'text-red font-bold' : 'text-amber'}>
                        {r.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Action */}
              <div className="p-3 rounded-card bg-cyan/5 border border-cyan/20">
                <div className="flex items-center gap-2 mb-2">
                  <Wrench className="w-4 h-4 text-cyan" />
                  <span className="text-xs font-display uppercase tracking-wider text-cyan">
                    Recommended Action
                  </span>
                </div>
                <p className="text-xs text-text-secondary font-body leading-relaxed">
                  Schedule maintenance inspection. Reduce operational load by 20% until equipment is cleared. Monitor temperature and vibration closely for escalation patterns.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
