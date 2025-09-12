"use client";
import { useState, useEffect } from 'react';

interface WindowSize {
  width: number;
  height: number;
}

/**
 * Custom hook to track window resize events and return current window dimensions
 * @returns Object containing current window width and height
 */
const useWindowResize = (): WindowSize => {
  // Initialize with undefined dimensions to handle SSR
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    // Function to update window dimensions
    const handleResize = (): void => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Set initial window size on client side
    if (typeof window !== 'undefined') {
      handleResize();
    }

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency array to only run this effect once on mount

  return windowSize;
};

export default useWindowResize;
