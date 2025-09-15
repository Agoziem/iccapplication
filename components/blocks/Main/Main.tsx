"use client";
import React, { memo } from 'react';
import './main.css';

interface MainProps {
  children: React.ReactNode;
}

const Main: React.FC<MainProps> = memo(({ children }) => {
  return (
    <main id="main" className="main">
      {children}
    </main>
  );
});

Main.displayName = 'Main';

export default Main;
