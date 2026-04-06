"use client";

import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

export function AnimatedBackground() {
  const { currentColor } = useTheme();

  return (
    <motion.div
      className="fixed inset-0 -z-10"
      animate={{ backgroundColor: currentColor }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    />
  );
}
