"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type SlideDirection = "left" | "right" | "up" | "down" | "none";
type ZoomType = "in" | "out" | "none";

interface AnimationContainerProps {
  children: ReactNode;
  className?: string;
  reverse?: boolean;
  delay?: number;
  slideDirection?: SlideDirection;
  zoom?: ZoomType;
}

const AnimationContainer = ({
  children,
  className = "",
  reverse = false,
  delay = 0,
  slideDirection = "none",
  zoom = "none",
}: AnimationContainerProps) => {
  const initialPosition = {
    x: slideDirection === "left" ? -50 : slideDirection === "right" ? 50 : 0,
    y: slideDirection === "up" ? -50 : slideDirection === "down" ? 50 : 0,
    scale: zoom === "in" ? 0.8 : zoom === "out" ? 1.2 : 1,
  };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...initialPosition }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: false }}
      transition={{
        duration: 0.5,
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

export default AnimationContainer;
