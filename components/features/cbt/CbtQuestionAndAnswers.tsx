import React from "react";

const QuestionAndAnswers = ({
  currentSubject,
  currentQuestion,
  selectedAnswers,
  handleAnswerSelect,
  reviewAnswers,
}) => {
  // Safe access to subject and question data
  const subjectName = currentSubject?.subjectname || 'Unknown Subject';
  const questions = currentSubject?.questions || [];
  const questionIndex = currentQuestion?.questionIndex ?? 0;
  const questionText = currentQuestion?.questiontext || 'Question not available';
  const answers = currentQuestion?.answers || [];
  const correctAnswer = currentQuestion?.correctAnswer;
  const correctAnswerDescription = currentQuestion?.correctAnswerdescription || '';

  // Validate required data
  if (!currentSubject || !currentQuestion) {
    return (
      <div className="alert alert-warning">
        <h6>Question not available</h6>
        <p>Unable to load question data. Please try refreshing the page.</p>
      </div>
    );
  }

  // Safe access to selected answers with validation
  const getSelectedAnswerId = () => {
    try {
      return selectedAnswers?.[currentSubject.id]?.[currentQuestion.id] || null;
    } catch (error) {
      console.error('Error accessing selected answers:', error);
      return null;
    }
  };

  const answerSelectedID = getSelectedAnswerId();

  // Safe answer selection handler
  const safeHandleAnswerSelect = (subjectId, questionId, answerId) => {
    if (typeof handleAnswerSelect !== 'function') {
      console.warn('handleAnswerSelect function not provided');
      return;
    }

    if (!subjectId || !questionId || !answerId) {
      console.error('Invalid IDs provided for answer selection');
      return;
    }

    try {
      handleAnswerSelect(subjectId, questionId, answerId);
    } catch (error) {
      console.error('Error selecting answer:', error);
    }
  };

  return (
    <div>
      {/* Question Header */}
      <h6>Subject: {subjectName}</h6>
      <h5 className="mb-3">
        Question {questionIndex + 1}/{Math.max(1, questions.length)}
      </h5>

      {/* Question Text */}
      <div
        dangerouslySetInnerHTML={{
          __html: questionText,
        }}
      />

      {/* Answers */}
      {answers.length > 0 ? (
        <ul className="list-unstyled">
          {answers.map((answer, index) => {
            if (!answer || !answer.id) {
              return null; // Skip invalid answers
            }

            const isSelectedAnswer = answerSelectedID === answer.id;
            const isCorrectAnswer = correctAnswer?.id === answer.id;
            
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

            const inputId = `subject-${currentSubject.id}-question-${currentQuestion.id}-answer-${answer.id}`;
            const inputName = `subject-${currentSubject.id}-question-${currentQuestion.id}`;

            return (
              <li key={answer.id} className={`my-2 ${answerClassName}`}>
                <input
                  type="radio"
                  id={inputId}
                  name={inputName}
                  value={answer.id}
                  checked={isSelectedAnswer}
                  className={`form-check-input me-3 ${inputClassName}`}
                  onChange={() =>
                    safeHandleAnswerSelect(currentSubject.id, currentQuestion.id, answer.id)
                  }
                  disabled={reviewAnswers}
                />
                <label htmlFor={inputId}>
                  {answer.answertext || 'Answer text not available'}
                </label>
                
                {/* Answer feedback for last item if no answer selected */}
                {index === answers.length - 1 &&
                reviewAnswers &&
                !answerSelectedID && (
                  <div className="text-danger fw-bold mt-2">No Answer Selected</div>
                )}
                
                {/* Incorrect answer feedback */}
                {reviewAnswers && isSelectedAnswer && !isCorrectAnswer && (
                  <div className="text-danger fw-bold small mt-2">
                    Your Answer is Incorrect <i className="bi bi-x-circle"></i>
                  </div>
                )}
                
                {/* Correct answer feedback */}
                {reviewAnswers && isSelectedAnswer && isCorrectAnswer && (
                  <div className="text-success fw-bold small mt-2">
                    Your Answer is Correct <i className="bi bi-check2-circle"></i>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="alert alert-warning">
          <p>No answer options available for this question.</p>
        </div>
      )}

      {/* Question feedback */}
      {reviewAnswers && correctAnswerDescription && (
        <div className="bg-success-light text-success rounded p-3">
          <h6 className="text-success">Correct Answer</h6>
          <div
            dangerouslySetInnerHTML={{
              __html: correctAnswerDescription,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default QuestionAndAnswers;
