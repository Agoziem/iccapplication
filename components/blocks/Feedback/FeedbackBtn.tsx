import React, { useEffect, useState } from "react";
import "./Feedback.css";

const FeedbackButton = ({ setShowModal }) => {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    window.addEventListener('scroll', () => {
      setScroll(window.scrollY);
    });
    return () => {
      window.removeEventListener('scroll', () => {
        setScroll(window.scrollY);
      });
    };
  }, [scroll]);

  return (
    <div className={`feedback-button ${scroll > 100 ? 'active' : undefined}`} onClick={() => setShowModal(true)} >
      <span className="feedback-button-text text-nowrap">Send Feedback</span>
    </div>
  );
};

export default FeedbackButton;
