"use client";
import React from 'react';
import './main.css';


function Main({children}) {
  return (
    <main id="main" className="main">
      {children}
    </main>
  );
}

export default Main;
