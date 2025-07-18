// Context.js
"use client";
import React, { createContext, useRef } from 'react';

export const RefContext = createContext(null);

export const SidebartoggleRefProvider = ({ children }) => {
  const sidebartoggleref = useRef(null);

  return (
    <RefContext.Provider value={sidebartoggleref}>
      {children}
    </RefContext.Provider>
  );
};
