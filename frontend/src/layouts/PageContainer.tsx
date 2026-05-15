import React from 'react';
import { motion } from 'framer-motion';
import { pageEnter } from '@/animations/pageTransitions';

interface Props {
  children: React.ReactNode;
}

export const PageContainer: React.FC<Props> = ({ children }) => {
  return (
    <motion.div
      variants={pageEnter}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-6 min-h-full"
    >
      {children}
    </motion.div>
  );
};
