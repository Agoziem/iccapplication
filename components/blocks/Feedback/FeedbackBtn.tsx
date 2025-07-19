import React, { useEffect, useState, useCallback } from "react";
import "./Feedback.css";

interface FeedbackButtonProps {
  setShowModal: (show: boolean) => void;
}

const FeedbackButton: React.FC<FeedbackButtonProps> = ({ setShowModal }) => {
  const [scroll, setScroll] = useState<number>(0);

  const handleScroll = useCallback(() => {
    setScroll(window.scrollY);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <div 
      className={`feedback-button ${scroll > 100 ? 'active' : ''}`} 
      onClick={() => setShowModal(true)}
    >
      <span className="feedback-button-text text-nowrap">Send Feedback</span>
    </div>
  );
};

export default FeedbackButton;
