import React from "react";

const QuestionAndAnswers = ({
  currentSubject,
  currentQuestion,
  selectedAnswers,
  handleAnswerSelect,
  reviewAnswers,
}) => {
  return (
    <div>
      {/* Question & Answers */}
      <h6>Subject: {currentSubject.subjectname}</h6>
      <h5 className="mb-3">
        Question {currentQuestion.questionIndex + 1}/{currentSubject.questions.length}
      </h5>
      <div
        dangerouslySetInnerHTML={{
          __html: currentQuestion.questiontext,
        }}
      />

      {/* Answers */}
      <ul className="list-unstyled">
        {currentQuestion.answers.map((answer, index) => {
          const answerSelectedID =
            selectedAnswers[currentSubject.id] &&
            selectedAnswers[currentSubject.id][currentQuestion.id];
          const isSelectedAnswer = answerSelectedID === answer.id;
          const isCorrectAnswer = answer.id === currentQuestion.correctAnswer.id;
          const answerClassName =
            reviewAnswers && answerSelectedID
              ? isCorrectAnswer
                ? "text-success fw-bold"
                : isSelectedAnswer && !isCorrectAnswer
                ? "text-danger fw-bold"
                : ""
              : "";
          const inputClassName =
            reviewAnswers && answerSelectedID
              ? isCorrectAnswer
                ? "bg-success"
                : isSelectedAnswer && !isCorrectAnswer
                ? "bg-danger"
                : ""
              : "";

          return (
            <li key={answer.id} className={`my-2 ${answerClassName}`}>
              <input
                type="radio"
                id={`subject-${currentSubject.id}-question-${currentQuestion.id}-answer-${answer.id}`}
                name={`subject-${currentSubject.id}-question-${currentQuestion.id}`}
                value={answer.id}
                checked={isSelectedAnswer}
                className={`form-check-input me-3 ${inputClassName}`}
                onChange={() =>
                  handleAnswerSelect(currentSubject.id, currentQuestion.id, answer.id)
                }
                disabled={reviewAnswers}
              />
              <label
                htmlFor={`subject-${currentSubject.id}-question-${currentQuestion.id}-answer-${answer.id}`}
              >
                {answer.answertext}
              </label>
              {index === currentQuestion.answers.length - 1 &&
              reviewAnswers &&
              !answerSelectedID ? (
                <div className="text-danger fw-bold mt-2">No Answer Selected</div>
              ) : reviewAnswers && isSelectedAnswer && !isCorrectAnswer ? (
                <div className="text-danger fw-bold small mt-2">
                  Your Answer is Incorrect <i className="bi bi-x-circle"></i>
                </div>
              ) : (
                reviewAnswers &&
                isSelectedAnswer &&
                isCorrectAnswer && (
                  <div className="text-success fw-bold small mt-2">
                    Your Answer is Correct <i className="bi bi-check2-circle"></i>
                  </div>
                )
              )}
            </li>
          );
        })}
      </ul>

      {/* Question feedback */}
      {reviewAnswers && (
        <div className="bg-success-light text-success rounded p-3">
          <h6 className="text-success">Correct Answer</h6>
          <div
            dangerouslySetInnerHTML={{
              __html: currentQuestion.correctAnswerdescription,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default QuestionAndAnswers;
