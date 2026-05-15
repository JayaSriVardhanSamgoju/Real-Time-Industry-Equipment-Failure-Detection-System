import type { Transition } from 'framer-motion';

export const springDefault: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

export const springStiff: Transition = {
  type: 'spring',
  stiffness: 500,
  damping: 35,
};

export const springGentle: Transition = {
  type: 'spring',
  stiffness: 200,
  damping: 25,
};

export const tweenFast: Transition = {
  type: 'tween',
  duration: 0.2,
  ease: 'easeOut',
};

export const tweenMedium: Transition = {
  type: 'tween',
  duration: 0.4,
  ease: 'easeOut',
};

export const easeInOutCubic: Transition = {
  type: 'tween',
  duration: 0.5,
  ease: [0.645, 0.045, 0.355, 1.0],
};
