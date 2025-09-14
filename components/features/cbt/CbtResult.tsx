import React, { useCallback } from "react";
import { FaCheckCircle } from "react-icons/fa";

interface SubjectScore {
  id: number;
  subjectname: string;
  score: number;
}

interface ScoreData {
  totalscore: number;
  subjectscores: SubjectScore[];
}

interface CbtResultProps {
  Score: ScoreData;
  retaketest: () => void;
  ReviewAnswers: () => void;
  takeanothertest: () => void;
}

const CbtResult: React.FC<CbtResultProps> = ({ 
  Score, 
  retaketest, 
  ReviewAnswers, 
  takeanothertest 
}) => {
  // Safe access to Score object with fallbacks
  const totalScore = Score?.totalscore ?? 0;
  const subjectScores = Score?.subjectscores || [];

  // Validate score data
  const isValidScoreData = useCallback(() => {
    return Score && typeof totalScore === 'number' && Array.isArray(subjectScores);
  }, [Score, totalScore, subjectScores]);

  const handleRetakeTest = useCallback(() => {
    if (retaketest) {
      retaketest();
    }
  }, [retaketest]);

  const handleReviewAnswers = useCallback(() => {
    if (ReviewAnswers) {
      ReviewAnswers();
    }
  }, [ReviewAnswers]);

  const handleTakeAnotherTest = useCallback(() => {
    if (takeanothertest) {
      takeanothertest();
    }
  }, [takeanothertest]);

  if (!isValidScoreData()) {
    return (
      <div className="text-center text-danger">
        <h6>Error: Invalid score data</h6>
        <p>Unable to display test results. Please try again.</p>
        <button 
          className="btn btn-primary w-100 mt-3" 
          onClick={handleTakeAnotherTest}
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
          onClick={handleReviewAnswers}
          disabled={!ReviewAnswers}
        >
          Review Answers
        </button>
        <button 
          className="btn btn-accent-primary rounded-5 w-100 mt-3" 
          onClick={handleRetakeTest}
          disabled={!retaketest}
        >
          Retake Test 
        </button>
        <button 
          className="btn btn-primary w-100 mt-3" 
          onClick={handleTakeAnotherTest}
          disabled={!takeanothertest}
        >
          Take another Test
        </button>
      </div>
    </div>
  );
};

export default CbtResult;
