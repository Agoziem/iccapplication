"use client";
import React, { useCallback, useEffect, useState } from "react";
import "./Feedback.css";

interface FeedbackButtonProps {
  setShowModal: (show: boolean) => void;
}

const FeedbackButton: React.FC<FeedbackButtonProps> = ({ setShowModal }) => {
  const [scroll, setScroll] = useState<number>(0);

  // Memoized scroll handler to prevent unnecessary re-renders
  const handleScroll = useCallback(() => {
    setScroll(window.scrollY);
  }, []);

  useEffect(() => {
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const handleClick = useCallback(() => {
    setShowModal(true);
  }, [setShowModal]);

  return (
    <div 
      className={`feedback-button ${scroll > 100 ? 'active' : ''}`} 
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
      aria-label="Send Feedback"
    >
      <span className="feedback-button-text text-nowrap">Send Feedback</span>
    </div>
  );
};

export default FeedbackButton;
