"use client";
import React, { ReactNode } from 'react';
import './main.css';

interface MainProps {
  children: ReactNode;
}

const Main: React.FC<MainProps> = ({ children }) => {
  return (
    <main id="main" className="main">
      {children}
    </main>
  );
};

export default Main;
