"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

interface NormalAnimationContainerProps {
  children: React.ReactNode;
  className?: string;
  reverse?: boolean;
  delay?: number;
}

const NormalAnimationContainer: React.FC<NormalAnimationContainerProps> = React.memo(({
  children,
  className = "",
  reverse = false,
  delay = 0,
}) => {
  // Memoized animation values
  const animationValues = useMemo(() => ({
    initial: { opacity: 0, y: reverse ? -20 : 20 },
    animate: { opacity: 1, y: 0 },
  }), [reverse]);

  // Memoized transition config
  const transitionConfig = useMemo(() => ({
    duration: 0.4,
    delay,
    ease: "easeInOut" as const,
    type: "spring" as const,
    stiffness: 260,
    damping: 20,
  }), [delay]);

  return (
    <motion.div
      className={className}
      initial={animationValues.initial}
      animate={animationValues.animate}
      transition={transitionConfig}
      role="presentation"
      aria-hidden="true"
    >
      {children}
    </motion.div>
  );
});

NormalAnimationContainer.displayName = "NormalAnimationContainer";

export default NormalAnimationContainer;
