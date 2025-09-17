"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

interface AnimationContainerProps {
  children: React.ReactNode;
  className?: string;
  reverse?: boolean;
  delay?: number;
  slideDirection?: "left" | "right" | "up" | "down" | "none";
  zoom?: "in" | "out" | "none";
}

const AnimationContainer: React.FC<AnimationContainerProps> = React.memo(({
  children,
  className = "",
  reverse = false,
  delay = 0,
  slideDirection = "none",
  zoom = "none",
}) => {
  // Memoized initial position calculation
  const initialPosition = useMemo(() => ({
    x: slideDirection === "left" ? -50 : slideDirection === "right" ? 50 : 0,
    y: slideDirection === "up" ? -50 : slideDirection === "down" ? 50 : 0,
    scale: zoom === "in" ? 0.8 : zoom === "out" ? 1.2 : 1,
  }), [slideDirection, zoom]);

  // Memoized transition config
  const transitionConfig = useMemo(() => ({
    duration: 0.5,
    delay,
    ease: "easeInOut" as const,
    type: "spring" as const,
    stiffness: 260,
    damping: 20,
  }), [delay]);

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...initialPosition }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      exit={{ opacity: 0, ...initialPosition }}
      viewport={{ once: false, amount: 0.1, margin: "0px 0px -50px 0px" }}
      transition={transitionConfig}
      role="presentation"
      aria-hidden="true"
    >
      {children}
    </motion.div>
  );
});

AnimationContainer.displayName = "AnimationContainer";

export default AnimationContainer;
