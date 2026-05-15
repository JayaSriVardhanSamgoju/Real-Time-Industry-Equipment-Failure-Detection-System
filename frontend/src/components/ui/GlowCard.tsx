import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface Props {
  children: React.ReactNode;
  glowColor?: string;
  className?: string;
  onClick?: () => void;
  animate?: boolean;
}

export const GlowCard: React.FC<Props> = ({
  children,
  glowColor = 'rgba(0,212,255,0.12)',
  className = '',
  onClick,
  animate = true,
}) => {
  return (
    <motion.div
      whileHover={animate ? { y: -2, scale: 1.01 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={onClick}
      className={clsx(
        'rounded-card border border-bg-border bg-bg-surface relative overflow-hidden transition-all duration-300',
        onClick && 'cursor-pointer',
        className
      )}
      style={{
        boxShadow: `0 0 0 1px rgba(0,212,255,0.04), 0 0 20px ${glowColor}`,
      }}
    >
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${glowColor}, transparent 40%)`,
        }}
      />
      {children}
    </motion.div>
  );
};
