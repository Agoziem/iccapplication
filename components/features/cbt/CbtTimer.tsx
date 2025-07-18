import React, { useEffect, useState } from 'react'

const CbtTimer = ({time,handleSubmit}) => {
  const [minutes, setMinutes] = useState(time);
  const [seconds, setSeconds] = useState(0);

  // reduce the time by 1 second
  const tick = () => {
    if (minutes === 0 && seconds === 0) {
      handleSubmit()
    } else if (seconds === 0) {
      setSeconds(59);
      setMinutes(minutes - 1);
    } else {
      setSeconds(seconds - 1);
    }
  };

  // set the timer
  useEffect(() => {
    const timerId = setInterval(() => tick(), 1000);
    return () => clearInterval(timerId);
  });

  return (
    <div className={`${
      minutes < 5 ? "badge bg-danger-light text-danger px-3 py-2" :
      "badge bg-success-light text-success px-3 py-2"}`} style={{
      borderRadius: '30px',
      border: `${
        minutes < 5 ? "1px solid var(--danger)" :
        "1px solid var(--success)"}`,
    }}>
      <span className='fw-bold fs-4'>{minutes}</span> : <span className='fw-bold fs-6'>{seconds}</span>
    </div>
  )
}

export default CbtTimer