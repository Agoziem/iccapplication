import React from "react";

const CbtInstructions = ({ Test,setStartTest }) => {
  return (
    <div>
      <div>
        <h5 className="text-center">Practice {Test.texttype.testtype}</h5>
        <p className="text-center">Year: {Test.testYear.year}</p>
      </div>
      <h6 className="fw-bold text-center text-decoration-underline text-secondary">
        Instructions
      </h6>
      <p>
        Answer the following questions to the best of your ability. Good luck!
        you can cannot restart the test once you start, so make sure you are
        ready.
      </p>
      <div>
        <div className="text-primary">
          {" "}
          <i className="bi bi-check2-circle me-2 text-secondary"></i>Test Type:{" "}
          {Test.texttype.testtype}
        </div>
        <div className="text-primary">
          {" "}
          <i className="bi bi-check2-circle me-2 text-secondary"></i>Year:{" "}
          {Test.testYear.year}
        </div>
        <div className="text-primary">
          {" "}
          <i className="bi bi-check2-circle me-2 text-secondary"></i>Number of
          Subjects: {Test.testSubject.length}
        </div>
        <div className="text-primary">
          {" "}
          <i className="bi bi-check2-circle me-2 text-secondary"></i>Subjects:{" "}
          {Test.testSubject.length > 0 &&
            Test.testSubject.map((subject, index) => (
              <span key={index} className="fw-bold">
                {subject.subjectname}{" "}
                {index < Test.testSubject.length - 1 ? ", " : ""}
              </span>
            ))}
        </div>
        <div className="text-primary">
          {" "}
          <i className="bi bi-check2-circle me-2 text-secondary"></i>Time
          Allowed: {
            Test.testSubject.length > 0 &&
            Test.testSubject.reduce((acc, curr) => acc + parseInt(curr.subjectduration), 0)
          }{" "}
           minutes
        </div>
      </div>
      <div>
        <button className="btn btn-primary w-100 mt-4"
            onClick={() => setStartTest(true)}
        >Start Test</button>
      </div>
    </div>
  );
};

export default CbtInstructions;
