"use client";
import React from 'react';

const { createContext, useRef, useMemo } = React;
type ReactNode = React.ReactNode;

// Create context with proper typing
export const RefContext = createContext<React.RefObject<HTMLElement | null> | null>(null);

interface SidebartoggleRefProviderProps {
  children: ReactNode;
}

export const SidebartoggleRefProvider: React.FC<SidebartoggleRefProviderProps> = ({ children }) => {
  const sidebartoggleref = useRef<HTMLElement>(null);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => sidebartoggleref, []);

  return (
    <RefContext.Provider value={contextValue}>
      {children}
    </RefContext.Provider>
  );
};
