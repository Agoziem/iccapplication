"use client";
import { useState, useEffect } from 'react';

interface WindowSize {
  width: number;
  height: number;
}

const useWindowResize = (): WindowSize => {
  const [windowSize, setWindowSize] = useState<WindowSize>(() => {
    // Initialize with current window size if available
    if (typeof window !== 'undefined') {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    }
    // Fallback for SSR
    return {
      width: 0,
      height: 0,
    };
  });

  useEffect(() => {
    // Early return if window is not available (SSR)
    if (typeof window === 'undefined') return;

    const handleResize = (): void => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency array to only run this effect once on mount

  return windowSize;
};

export default useWindowResize;
