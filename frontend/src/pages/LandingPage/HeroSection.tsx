import React from 'react';
import { useNavigate } from 'react-router-dom';
import { COPY } from '@/config/copy';
import { ParticleBackground } from './ParticleBackground';
import { ArchitecturePipeline } from './ArchitecturePipeline';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/animations/variants';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[70vh] flex flex-col justify-center overflow-hidden">
      <ParticleBackground />
      
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6 mt-12">
        <motion.h1
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="text-5xl md:text-7xl font-display font-bold text-white mb-6 tracking-tight"
        >
          {COPY.hero.headline}
        </motion.h1>
        
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-text-secondary font-body mb-10 max-w-2xl mx-auto"
        >
          {COPY.hero.subHeadline}
        </motion.p>
        
        <motion.button
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center justify-center px-8 py-4 text-base font-display font-bold text-bg-base bg-cyan rounded-lg hover:bg-cyan-dim transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(0,212,255,0.4)]"
        >
          {COPY.hero.cta}
        </motion.button>
      </div>

      <div className="mt-20">
        <ArchitecturePipeline />
      </div>
    </div>
  );
};
