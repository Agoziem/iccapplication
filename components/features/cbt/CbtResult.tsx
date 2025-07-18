import React from "react";
import { FaCheckCircle } from "react-icons/fa";

const CbtResult = ({ Score , retaketest,ReviewAnswers,takeanothertest }) => {
  return (
    <div>
      <h6 className="text-center">
        Test Completed <FaCheckCircle className="h4 ms-2 text-success" />
      </h6>
      <div className="text-center">
        <h4>Your Total Score: {Score.totalscore}</h4>
      </div>

      <ul>
        {Score.subjectscores.map((result, index) => (
          <li key={index} className="text-primary">
            {result.subjectname}{" "}
            <span className="fw-bold float-end text-primary">Score: {result.score}</span>
          </li>
        ))}
      </ul>

      <div>
        <button className="btn btn-accent-secondary w-100 mt-4" onClick={ReviewAnswers}>Review Answers</button>
        <button className="btn btn-accent-primary rounded-5 w-100 mt-3" onClick={retaketest} >Retake Test </button>
        <button className="btn btn-primary w-100 mt-3" onClick={takeanothertest} >Take another Test</button>
      </div>
    </div>
  );
};

export default CbtResult;
