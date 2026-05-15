import React from 'react';
import { GlowCard } from '@/components/ui/GlowCard';
import { Activity, Target, Network, TrendingUp, Search, Server } from 'lucide-react';
import { staggerChildren, fadeInUp } from '@/animations/variants';
import { motion } from 'framer-motion';

const capabilities = [
  {
    title: 'Real-Time Anomaly Detection',
    description: 'Isolation Forest ML inference at <50ms latency',
    icon: <Activity className="w-6 h-6 text-cyan" />,
  },
  {
    title: 'Adaptive Thresholding',
    description: 'Dynamic thresholds using rolling statistical baselines',
    icon: <Target className="w-6 h-6 text-cyan" />,
  },
  {
    title: 'Multi-Sensor Fusion',
    description: 'Temperature, vibration, humidity correlation analysis',
    icon: <Network className="w-6 h-6 text-cyan" />,
  },
  {
    title: 'Drift Detection',
    description: 'EvidentlyAI-powered concept drift monitoring',
    icon: <TrendingUp className="w-6 h-6 text-cyan" />,
  },
  {
    title: 'Explainable AI',
    description: 'Every anomaly explained with ML reasoning and risk assessment',
    icon: <Search className="w-6 h-6 text-cyan" />,
  },
  {
    title: 'Production MLOps',
    description: 'MLflow tracking, Kafka streaming, FastAPI backend',
    icon: <Server className="w-6 h-6 text-cyan" />,
  },
];

export const CapabilityCards: React.FC = () => {
  return (
    <div className="py-16 max-w-6xl mx-auto px-6">
      <motion.div
        variants={staggerChildren}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {capabilities.map((cap, i) => (
          <motion.div key={i} variants={fadeInUp}>
            <GlowCard className="p-6 h-full flex flex-col justify-center">
              <div className="w-12 h-12 rounded-lg bg-cyan/10 flex items-center justify-center mb-4">
                {cap.icon}
              </div>
              <h3 className="text-lg font-display text-text-primary mb-2">{cap.title}</h3>
              <p className="text-sm font-body text-text-secondary">{cap.description}</p>
            </GlowCard>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
