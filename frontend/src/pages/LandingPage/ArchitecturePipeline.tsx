import React from 'react';
import { motion } from 'framer-motion';

const nodes = [
  { id: 'sensor', label: 'Sensor' },
  { id: 'kafka', label: 'Kafka' },
  { id: 'consumer', label: 'Consumer' },
  { id: 'feature', label: 'Feature Eng.' },
  { id: 'model', label: 'Isolation Forest' },
  { id: 'alerts', label: 'Alerts' },
  { id: 'api', label: 'FastAPI' },
  { id: 'dashboard', label: 'Dashboard' },
];

export const ArchitecturePipeline: React.FC = () => {
  return (
    <div className="py-12 px-4 max-w-6xl mx-auto w-full overflow-hidden">
      <div className="relative flex justify-between items-center h-24">
        {/* Connection line */}
        <div className="absolute left-[5%] right-[5%] h-0.5 bg-bg-border top-1/2 -translate-y-1/2 z-0">
          <div className="h-full bg-cyan/30 w-full relative overflow-hidden">
            <motion.div
              className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-cyan to-transparent"
              animate={{ left: ['-10%', '110%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        </div>

        {/* Nodes */}
        {nodes.map((node, i) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-lg bg-bg-surface border border-bg-border flex items-center justify-center transition-all group-hover:border-cyan group-hover:shadow-[0_0_15px_rgba(0,212,255,0.3)]">
              <div className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
            </div>
            <span className="text-[10px] font-display uppercase text-text-muted group-hover:text-cyan transition-colors whitespace-nowrap">
              {node.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
