import React from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  delay: number;
  duration: number;
}

interface Props {
  count?: number;
  color?: string;
  className?: string;
}

export const DataFlowParticles: React.FC<Props> = ({ 
  count = 5, 
  color = '#00D4FF',
  className = '' 
}) => {
  const particles: Particle[] = Array.from({ length: count }, (_, i) => ({
    id: i,
    delay: Math.random() * 2,
    duration: 1.5 + Math.random() * 1,
  }));

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
          initial={{ left: '-5%', opacity: 0 }}
          animate={{ left: '105%', opacity: [0, 1, 1, 0] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};
