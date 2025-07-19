"use client";
import React, { createContext, useRef, ReactNode, RefObject } from 'react';

export const RefContext = createContext<RefObject<HTMLElement | null> | null>(null);

interface SidebartoggleRefProviderProps {
  children: ReactNode;
}

export const SidebartoggleRefProvider: React.FC<SidebartoggleRefProviderProps> = ({ children }) => {
  const sidebartoggleref = useRef<HTMLElement>(null);

  return (
    <RefContext.Provider value={sidebartoggleref}>
      {children}
    </RefContext.Provider>
  );
};
