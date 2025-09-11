import React, { useEffect, useState, useRef, useCallback } from 'react'

const CbtTimer = ({ time, handleSubmit }) => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);
  const isActiveRef = useRef(true);

  // Initialize timer with validation
  useEffect(() => {
    const initialTime = parseInt(time || 0);
    if (initialTime < 0 || isNaN(initialTime)) {
      console.warn('Invalid timer value provided:', time);
      setMinutes(0);
      setSeconds(0);
      return;
    }
    
    setMinutes(initialTime);
    setSeconds(0);
    isActiveRef.current = true;
  }, [time]);

  // Handle timer expiration safely
  const handleTimeExpire = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    isActiveRef.current = false;
    
    if (typeof handleSubmit === 'function') {
      handleSubmit();
    }
  }, [handleSubmit]);

  // Reduce the time by 1 second with proper cleanup
  const tick = useCallback(() => {
    if (!isActiveRef.current) return;
    
    setMinutes(prevMinutes => {
      setSeconds(prevSeconds => {
        // Check if timer should expire
        if (prevMinutes === 0 && prevSeconds === 0) {
          setTimeout(handleTimeExpire, 0); // Async to prevent state conflicts
          return 0;
        }
        
        // Update time
        if (prevSeconds === 0) {
          const newMinutes = Math.max(0, prevMinutes - 1);
          return 59;
        } else {
          return Math.max(0, prevSeconds - 1);
        }
      });
      
      // Return minutes after seconds calculation
      return seconds === 0 ? Math.max(0, prevMinutes - 1) : prevMinutes;
    });
  }, [handleTimeExpire, seconds]);

  // Set up the timer with proper cleanup
  useEffect(() => {
    if (!isActiveRef.current || (minutes === 0 && seconds === 0)) {
      return;
    }

    intervalRef.current = setInterval(tick, 1000);

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [tick, minutes, seconds]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      isActiveRef.current = false;
    };
  }, []);

  // Safe formatting for display
  const displayMinutes = Math.max(0, minutes);
  const displaySeconds = Math.max(0, seconds);
  const isTimeRunningOut = displayMinutes < 5;
  const isTimerExpired = displayMinutes === 0 && displaySeconds === 0;

  return (
    <div 
      className={`${
        isTimeRunningOut || isTimerExpired
          ? "badge bg-danger-light text-danger px-3 py-2" 
          : "badge bg-success-light text-success px-3 py-2"
      }`} 
      style={{
        borderRadius: '30px',
        border: `${
          isTimeRunningOut || isTimerExpired
            ? "1px solid var(--danger)" 
            : "1px solid var(--success)"
        }`,
      }}
    >
      <span className='fw-bold fs-4'>
        {displayMinutes.toString().padStart(2, '0')}
      </span>
      {" : "}
      <span className='fw-bold fs-6'>
        {displaySeconds.toString().padStart(2, '0')}
      </span>
      {isTimerExpired && (
        <div className="small text-danger mt-1">
          Time Expired!
        </div>
      )}
    </div>
  );
};

export default CbtTimer