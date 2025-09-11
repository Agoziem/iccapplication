import React from "react";

const CbtInstructions = ({ Test, setStartTest }) => {
  // Safe property access with fallbacks
  const testType = Test?.texttype?.testtype || 'Unknown Test';
  const testYear = Test?.testYear?.year || 'Unknown Year';
  const subjects = Test?.testSubject || [];
  
  // Calculate total duration with error handling
  const calculateTotalDuration = () => {
    if (!subjects.length) return 0;
    
    try {
      return subjects.reduce((acc, curr) => {
        const duration = parseInt(curr?.subjectduration || 0);
        return acc + (isNaN(duration) ? 0 : duration);
      }, 0);
    } catch (error) {
      console.error('Error calculating test duration:', error);
      return 0;
    }
  };

  const totalDuration = calculateTotalDuration();

  return (
    <div>
      <div>
        <h5 className="text-center">Practice {testType}</h5>
        <p className="text-center">Year: {testYear}</p>
      </div>
      <h6 className="fw-bold text-center text-decoration-underline text-secondary">
        Instructions
      </h6>
      <p>
        Answer the following questions to the best of your ability. Good luck!
        You cannot restart the test once you start, so make sure you are ready.
      </p>
      <div>
        <div className="text-primary">
          <i className="bi bi-check2-circle me-2 text-secondary"></i>Test Type:{" "}
          {testType}
        </div>
        <div className="text-primary">
          <i className="bi bi-check2-circle me-2 text-secondary"></i>Year:{" "}
          {testYear}
        </div>
        <div className="text-primary">
          <i className="bi bi-check2-circle me-2 text-secondary"></i>Number of
          Subjects: {subjects.length}
        </div>
        <div className="text-primary">
          <i className="bi bi-check2-circle me-2 text-secondary"></i>Subjects:{" "}
          {subjects.length > 0 ? (
            subjects.map((subject, index) => (
              <span key={subject?.id || index} className="fw-bold">
                {subject?.subjectname || 'Unknown Subject'}{" "}
                {index < subjects.length - 1 ? ", " : ""}
              </span>
            ))
          ) : (
            <span className="text-muted">No subjects available</span>
          )}
        </div>
        <div className="text-primary">
          <i className="bi bi-check2-circle me-2 text-secondary"></i>Time
          Allowed: {totalDuration} minutes
        </div>
      </div>
      <div>
        <button 
          className="btn btn-primary w-100 mt-4"
          onClick={() => setStartTest?.(true)}
          disabled={!subjects.length}
        >
          Start Test
        </button>
      </div>
    </div>
  );
};

export default CbtInstructions;
