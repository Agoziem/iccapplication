"use client";
import React, { useState, useEffect } from 'react';
import './backToTop.css';

const BackToTop: React.FC = () => {
  const [scroll, setScroll] = useState<number>(0);

  useEffect(() => {
    const handleScroll = (): void => {
      setScroll(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const backToTop = (): void => {
    window.scrollTo(0, 0);
  };

  return (
    <a
      onClick={backToTop}
      className={`back-to-top d-flex align-items-center justify-content-center
      ${scroll > 100 ? 'active' : undefined}`}
    >
      <i className="bi bi-arrow-up-short"></i>
    </a>
  );
}

export default BackToTop;
