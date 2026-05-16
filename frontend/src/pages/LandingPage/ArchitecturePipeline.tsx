import React from 'react';
import { motion } from 'framer-motion';

const phases = [
  { id: 'ingestion', label: 'Phase 1: Ingestion', nodes: [{ id: 'sensor', label: 'Sensor' }] },
  { id: 'streaming', label: 'Phase 2: Streaming', nodes: [{ id: 'kafka', label: 'Kafka' }, { id: 'consumer', label: 'Consumer' }] },
  { id: 'ml', label: 'Phase 3: AI Core', nodes: [{ id: 'feature', label: 'Feature Eng.' }, { id: 'model', label: 'Isolation Forest' }] },
  { id: 'serving', label: 'Phase 4: Serving', nodes: [{ id: 'alerts', label: 'Alerts' }, { id: 'api', label: 'FastAPI' }, { id: 'dashboard', label: 'Dashboard' }] },
];

export const ArchitecturePipeline: React.FC = () => {
  return (
    <div className="py-16 px-4 max-w-6xl mx-auto w-full overflow-hidden relative">
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)',
        backgroundSize: '50px 50px',
      }} />

      <div className="flex flex-col md:flex-row justify-between items-stretch gap-6 relative z-10">
        {phases.map((phase, pIdx) => (
          <React.Fragment key={phase.id}>
            <div className="flex-1 min-w-[200px] border border-cyan/40 bg-bg-surface/90 backdrop-blur-md rounded-2xl p-6 relative flex flex-col items-center justify-center group hover:border-cyan/80 hover:shadow-[0_0_30px_rgba(0,212,255,0.25)] transition-all duration-300 shadow-[0_0_15px_rgba(0,212,255,0.1)]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-bg-elevated px-4 py-1 text-[10px] font-display uppercase tracking-wider text-cyan font-bold border border-cyan/50 rounded-full shadow-[0_0_15px_rgba(0,212,255,0.3)]">
                {phase.label}
              </div>
              
              <div className="flex flex-row md:flex-col justify-center items-center gap-4 w-full pt-2">
                {phase.nodes.map((node, i) => (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (pIdx * 0.2) + (i * 0.1) }}
                    className="flex flex-col items-center gap-2 cursor-pointer w-full"
                  >
                    <div className="w-12 h-12 rounded-xl bg-bg-base border border-cyan/30 flex items-center justify-center transition-all group-hover:border-cyan/60 hover:border-cyan hover:shadow-[0_0_20px_rgba(0,212,255,0.5)] shadow-[inset_0_0_10px_rgba(0,212,255,0.05)]">
                      <div className="w-2.5 h-2.5 rounded-full bg-cyan shadow-[0_0_8px_rgba(0,212,255,0.8)] animate-pulse" />
                    </div>
                    <span className="text-[10px] font-display uppercase text-text-secondary font-semibold text-center leading-tight">
                      {node.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Connecting lines between phases */}
            {pIdx < phases.length - 1 && (
              <div className="flex justify-center items-center">
                <div className="relative w-[2px] md:w-8 h-8 md:h-[2px] bg-bg-border/60">
                  <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                      className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-r md:bg-gradient-to-b from-transparent via-cyan to-transparent opacity-80"
                      animate={window.innerWidth >= 768 ? { left: ['-100%', '100%'] } : { top: ['-100%', '100%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    />
                  </div>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
