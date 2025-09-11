import React from "react";
import { FaCheckCircle } from "react-icons/fa";

const CbtResult = ({ Score, retaketest, ReviewAnswers, takeanothertest }) => {
  // Safe access to Score object with fallbacks
  const totalScore = Score?.totalscore ?? 0;
  const subjectScores = Score?.subjectscores || [];

  // Validate score data
  const isValidScoreData = () => {
    return Score && typeof totalScore === 'number' && Array.isArray(subjectScores);
  };

  if (!isValidScoreData()) {
    return (
      <div className="text-center text-danger">
        <h6>Error: Invalid score data</h6>
        <p>Unable to display test results. Please try again.</p>
        <button 
          className="btn btn-primary w-100 mt-3" 
          onClick={takeanothertest}
        >
          Take another Test
        </button>
      </div>
    );
  }

  return (
    <div>
      <h6 className="text-center">
        Test Completed <FaCheckCircle className="h4 ms-2 text-success" />
      </h6>
      <div className="text-center">
        <h4>Your Total Score: {totalScore}</h4>
      </div>

      {subjectScores.length > 0 ? (
        <ul>
          {subjectScores.map((result, index) => (
            <li key={result?.id || index} className="text-primary">
              {result?.subjectname || 'Unknown Subject'}{" "}
              <span className="fw-bold float-end text-primary">
                Score: {result?.score ?? 0}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center text-muted">
          <p>No subject scores available</p>
        </div>
      )}

      <div>
        <button 
          className="btn btn-accent-secondary w-100 mt-4" 
          onClick={ReviewAnswers}
          disabled={!ReviewAnswers}
        >
          Review Answers
        </button>
        <button 
          className="btn btn-accent-primary rounded-5 w-100 mt-3" 
          onClick={retaketest}
          disabled={!retaketest}
        >
          Retake Test 
        </button>
        <button 
          className="btn btn-primary w-100 mt-3" 
          onClick={takeanothertest}
          disabled={!takeanothertest}
        >
          Take another Test
        </button>
      </div>
    </div>
  );
};

export default CbtResult;
