import React, { useState } from "react";
import CbtInstructions from "./CbtInstructions";
import CbtTimer from "./CbtTimer";
import CbtResult from "./CbtResult";
import QuestionAndAnswers from "./CbtQuestionAndAnswers"; // Import the new component

interface Answer {
  id: string | number;
  answertext: string;
  [key: string]: any;
}

interface Question {
  id: string | number;
  questiontext: string;
  answers: Answer[];
  correctAnswer: {
    id: string | number;
  };
  [key: string]: any;
  questionIndex?: number;
}

interface Subject {
  id: string | number;
  subjectname: string;
  questions: Question[];
  [key: string]: any;
}

interface Test {
  testSubject: Subject[];
  texttype: {
    testtype: string;
  };
  testYear: {
    year: string;
  };
  [key: string]: any;
}

interface Score {
  subjectscores: any[];
  totalscore: number;
}

interface SelectedAnswers {
  [key: string]: any;
}

interface CbtQuizProps {
  Test: Test;
  setTestMode: (mode: boolean) => void;
}

const CbtQuiz: React.FC<CbtQuizProps> = ({ Test, setTestMode }) => {
  const [startTest, setStartTest] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [Score, setScore] = useState<Score>({
    subjectscores: [],
    totalscore: 0,
  });
  const [reviewAnswers, setReviewAnswers] = useState<boolean>(false);

  const currentSubject = Test.testSubject[currentSubjectIndex];
  const currentQuestion = {
    ...currentSubject.questions[currentQuestionIndex],
    questionIndex: currentQuestionIndex,
  } as Question & { questionIndex: number };

  // -------------------------------------------
  // function to handle next question
  // -------------------------------------------
  const handleNext = () => {
    let nextQuestionIndex = currentQuestionIndex + 1;
    let nextSubjectIndex = currentSubjectIndex;

    // Move to the next question if it exists in the current subject
    if (nextQuestionIndex < currentSubject.questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      // Move to the next subject with questions if it exists
      while (nextSubjectIndex < Test.testSubject.length - 1) {
        nextSubjectIndex += 1;
        if (Test.testSubject[nextSubjectIndex].questions.length > 0) {
          setCurrentSubjectIndex(nextSubjectIndex);
          setCurrentQuestionIndex(0);
          return;
        }
      }

      // If no more subjects with questions, handle submit or back to score review
      if (reviewAnswers) {
        setReviewAnswers(false);
        setSubmitted(true);
      } else {
        handleSubmit();
      }
    }
  };

  // -------------------------------------------
  // function to handle previous question
  // -------------------------------------------
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentSubjectIndex > 0) {
      setCurrentSubjectIndex(currentSubjectIndex - 1);
      setCurrentQuestionIndex(
        Test.testSubject[currentSubjectIndex - 1].questions.length - 1
      );
    }
  };

  // -------------------------------------------
  // function to handle answer selection
  // -------------------------------------------
  const handleAnswerSelect = (subjectId: string | number, questionId: string | number, answerId: string | number): void => {
    setSelectedAnswers({
      ...selectedAnswers,
      [subjectId]: {
        ...selectedAnswers[subjectId],
        [questionId]: answerId,
      },
    });
  };

  // -------------------------------------------
  // function to handle subject selection
  // -------------------------------------------
  const handleSubjectSelect = (subjectIndex: number): void => {
    setCurrentSubjectIndex(subjectIndex);
    setCurrentQuestionIndex(0);
  };

  // -------------------------------------------
  // function to handle form submission
  // -------------------------------------------
  const handleSubmit = () => {
    if (window.confirm("Are you sure you want to submit the test?")) {
      calculateScores();
    }
  };

  // -------------------------------------------
  // function to calculate scores
  // -------------------------------------------
  const calculateScores = () => {
    Test.testSubject.forEach((subject) => {
      let subjectScore = {
        subjectname: subject.subjectname,
        score: 0,
      };

      subject.questions.length > 0 &&
        subject.questions.forEach((question) => {
          if (
            selectedAnswers[subject.id] &&
            selectedAnswers[subject.id][question.id] ===
              question.correctAnswer.id
          ) {
            subjectScore.score += question.questionMark;
          }
        });

      setScore((prev) => ({
        subjectscores: [...prev.subjectscores, subjectScore],
        totalscore: prev.totalscore + subjectScore.score,
      }));
    });
    setSubmitted(true);
  };

  // -------------------------------------------
  // function to review answers and feedback
  // -------------------------------------------
  const ReviewAnswers = () => {
    setSubmitted(false);
    setReviewAnswers(true);
    setCurrentQuestionIndex(0);
    setCurrentSubjectIndex(0);
  };

  // function to reset States
  const resetStates = () => {
    setReviewAnswers(false);
    setStartTest(false);
    setSubmitted(false);
    setScore({
      subjectscores: [],
      totalscore: 0,
    });
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setCurrentSubjectIndex(0);
  };

  // -------------------------------------------
  // function to retake test
  // -------------------------------------------
  const retaketest = () => {
    resetStates();
  };

  // -------------------------------------------
  // function to take another test
  // -------------------------------------------
  const takeanothertest = () => {
    resetStates();
    setTestMode(false);
  };

  return (
    <div className="pt-3">
      {!startTest ? (
        <div className="card mx-auto py-5 px-5" style={{ maxWidth: "500px" }}>
          <CbtInstructions Test={Test as any} setStartTest={setStartTest} />
        </div>
      ) : (
        <div className="card mx-auto py-5 px-5" style={{ maxWidth: "500px" }}>
          {submitted ? (
            <div>
              <CbtResult
                Score={Score}
                ReviewAnswers={ReviewAnswers}
                retaketest={retaketest}
                takeanothertest={takeanothertest}
              />
            </div>
          ) : (
            <>
              {reviewAnswers ? (
                <h6 className="text-center">Review Answers</h6>
              ) : (
                <div className="text-center mb-3">
                  <CbtTimer
                    time={
                      Test.testSubject.length > 0
                        ? Test.testSubject.reduce(
                            (acc, curr) => acc + parseInt(curr.subjectduration),
                            0
                          )
                        : 0
                    }
                    handleSubmit={calculateScores}
                  />
                </div>
              )}

              <QuestionAndAnswers
                currentSubject={currentSubject as any}
                currentQuestion={currentQuestion as any}
                selectedAnswers={selectedAnswers}
                handleAnswerSelect={handleAnswerSelect}
                reviewAnswers={reviewAnswers}
              />

              <hr />

              {/* navigation buttons */}
              <div className="navigation-buttons mt-2">
                {currentSubjectIndex === 0 &&
                currentQuestionIndex === 0 ? null : (
                  <button
                    className="btn btn-secondary me-2"
                    onClick={handlePrevious}
                  >
                    Previous
                  </button>
                )}
                {currentSubjectIndex === Test.testSubject.length - 1 &&
                currentQuestionIndex === currentSubject.questions.length - 1 ? (
                  reviewAnswers ? (
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        setReviewAnswers(false);
                        setSubmitted(true);
                      }}
                    >
                      Back to Score
                    </button>
                  ) : (
                    <button className="btn btn-success" onClick={handleSubmit}>
                      Submit Test
                    </button>
                  )
                ) : (
                  <button className="btn btn-primary" onClick={handleNext}>
                    Next
                  </button>
                )}
              </div>

              <hr />
              {/* Subject navigation */}
              <div className="subject-navigation mt-2">
                {Test.testSubject.map((subject, index) => (
                  <div
                    key={subject.id}
                    onClick={
                      subject.questions.length > 0
                        ? () => handleSubjectSelect(index)
                        : undefined
                    }
                    className={`badge px-3 py-2 ${
                      currentSubjectIndex === index
                        ? "bg-secondary-light text-secondary"
                        : "text-primary"
                    }`}
                    style={{
                      cursor: "pointer",
                      borderRadius: "30px",
                      border: `${
                        currentSubjectIndex === index
                          ? "1px solid var(--secondary)"
                          : "none"
                      }`,
                    }}
                  >
                    {subject.subjectname}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CbtQuiz;
