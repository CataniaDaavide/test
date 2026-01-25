"use client"

import { motion } from "motion/react";

// Componente per animare i div con 
// una dissolvenza dal basso verso l'alto
export function FadeUp({ children, className }) {
  return (
    <motion.div
      className={className}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}