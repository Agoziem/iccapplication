"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface NormalAnimationContainerProps {
  children: ReactNode;
  className?: string;
  reverse?: boolean;
  delay?: number;
}

const NormalAnimationContainer = ({ 
  children, 
  className = "", 
  reverse = false, 
  delay = 0 
}: NormalAnimationContainerProps) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reverse ? -20 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: delay,
        ease: "easeInOut",
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
    >
      {children}
    </motion.div>
  );
};

export default NormalAnimationContainer;
