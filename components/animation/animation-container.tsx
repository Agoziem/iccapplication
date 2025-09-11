"use client";

import { motion } from "framer-motion";

const AnimationContainer = ({
  children,
  className = "",
  reverse = false,
  delay = 0,
  slideDirection = "none", // "left", "right", "up", "down", or "none"
  zoom = "none", // "in", "out", or "none"
}) => {
  // Determine the initial x and y based on slideDirection
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
