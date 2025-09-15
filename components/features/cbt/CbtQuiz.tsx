import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Test, Subject, Question, Answer } from "@/types/cbt";
import CbtInstructions from "./CbtInstructions";
import CbtTimer from "./CbtTimer";
import CbtResult from "./CbtResult";
import QuestionAndAnswers from "./CbtQuestionAndAnswers";

interface QuestionWithIndex extends Question {
  questionIndex: number;
  correctAnswer?: Answer;
}

interface SelectedAnswers {
  [subjectId: number]: {
    [questionId: number]: number;
  };
}

interface SubjectScore {
  id: number;
  subjectname: string;
  score: number;
}

interface ScoreData {
  subjectscores: SubjectScore[];
  totalscore: number;
}

interface CbtQuizProps {
  Test: Test;
  setTest: (test: Test | null) => void;
}

const CbtQuiz: React.FC<CbtQuizProps> = ({ Test, setTest }) => {
  const [startTest, setStartTest] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [Score, setScore] = useState<ScoreData>({
    subjectscores: [],
    totalscore: 0,
  });
  const [reviewAnswers, setReviewAnswers] = useState<boolean>(false);
  const [isCalculatingScore, setIsCalculatingScore] = useState<boolean>(false);
  
  // Refs to prevent memory leaks and race conditions
  const isMountedRef = useRef<boolean>(true);
  const scoreCalculationRef = useRef<boolean>(false);

  // Validate Test data
  const isValidTest = useMemo(() => {
    return Test && 
           Array.isArray(Test.testSubject) && 
           Test.testSubject.length > 0 &&
           Test.testSubject.some(subject => 
             Array.isArray(subject?.questions) && subject.questions.length > 0
           );
  }, [Test]);

  // Safe access to current subject and question
  const currentSubject = useMemo((): Subject | null => {
    if (!isValidTest || currentSubjectIndex >= Test.testSubject.length) {
      return null;
    }
    return Test.testSubject[currentSubjectIndex];
  }, [Test, currentSubjectIndex, isValidTest]);

  const currentQuestion = useMemo((): QuestionWithIndex | null => {
    if (!currentSubject || !Array.isArray(currentSubject.questions) || 
        currentQuestionIndex >= currentSubject.questions.length) {
      return null;
    }
    return {
      ...currentSubject.questions[currentQuestionIndex],
      questionIndex: currentQuestionIndex,
    };
  }, [currentSubject, currentQuestionIndex]);

  // Calculate total timer duration safely
  const totalTestDuration = useMemo(() => {
    if (!isValidTest) return 0;
    
    try {
      return Test.testSubject.reduce((acc, subject) => {
        const duration = subject?.subjectduration || 0;
        return acc + (isNaN(duration) ? 0 : duration);
      }, 0);
    } catch (error) {
      console.error('Error calculating test duration:', error);
      return 30; // Default 30 minutes
    }
  }, [Test, isValidTest]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Safe function to handle next question
  const handleNext = useCallback(() => {
    if (!currentSubject || !isMountedRef.current) return;

    try {
      const nextQuestionIndex = currentQuestionIndex + 1;
      const nextSubjectIndex = currentSubjectIndex;

      // Move to the next question if it exists in the current subject
      if (nextQuestionIndex < currentSubject.questions.length) {
        setCurrentQuestionIndex(nextQuestionIndex);
        return;
      }

      // Move to the next subject with questions if it exists
      for (let i = nextSubjectIndex + 1; i < Test.testSubject.length; i++) {
        const subject = Test.testSubject[i];
        if (subject?.questions && Array.isArray(subject.questions) && subject.questions.length > 0) {
          setCurrentSubjectIndex(i);
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
    } catch (error) {
      console.error('Error handling next question:', error);
    }
  }, [currentSubject, currentQuestionIndex, currentSubjectIndex, Test, reviewAnswers]);

  // Safe function to handle previous question
  const handlePrevious = useCallback(() => {
    if (!isMountedRef.current) return;

    try {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
      } else if (currentSubjectIndex > 0) {
        const prevSubjectIndex = currentSubjectIndex - 1;
        const prevSubject = Test.testSubject[prevSubjectIndex];
        
        if (prevSubject?.questions && Array.isArray(prevSubject.questions)) {
          setCurrentSubjectIndex(prevSubjectIndex);
          setCurrentQuestionIndex(prevSubject.questions.length - 1);
        }
      }
    } catch (error) {
      console.error('Error handling previous question:', error);
    }
  }, [currentQuestionIndex, currentSubjectIndex, Test]);

  // Safe function to handle answer selection
  const handleAnswerSelect = useCallback((subjectId: number, questionId: number, answerId: number) => {
    if (!subjectId || !questionId || !answerId || !isMountedRef.current) {
      console.warn('Invalid answer selection parameters');
      return;
    }

    try {
      setSelectedAnswers(prev => ({
        ...prev,
        [subjectId]: {
          ...prev[subjectId],
          [questionId]: answerId,
        },
      }));
    } catch (error) {
      console.error('Error selecting answer:', error);
    }
  }, []);

  // Safe function to handle subject selection
  const handleSubjectSelect = useCallback((subjectIndex: number) => {
    if (!isValidTest || subjectIndex < 0 || subjectIndex >= Test.testSubject.length) {
      console.warn('Invalid subject index:', subjectIndex);
      return;
    }

    const subject = Test.testSubject[subjectIndex];
    if (!subject?.questions || !Array.isArray(subject.questions) || subject.questions.length === 0) {
      console.warn('Subject has no questions:', subject);
      return;
    }

    try {
      setCurrentSubjectIndex(subjectIndex);
      setCurrentQuestionIndex(0);
    } catch (error) {
      console.error('Error selecting subject:', error);
    }
  }, [Test, isValidTest]);

  // Safe function to handle form submission
  const handleSubmit = useCallback(() => {
    if (isCalculatingScore || !isMountedRef.current) return;

    const confirmed = window.confirm("Are you sure you want to submit the test?");
    if (confirmed) {
      calculateScores();
    }
  }, [isCalculatingScore]);

  // Optimized function to calculate scores
  const calculateScores = useCallback(() => {
    if (scoreCalculationRef.current || isCalculatingScore || !isMountedRef.current) {
      return;
    }

    scoreCalculationRef.current = true;
    setIsCalculatingScore(true);

    try {
      const subjectScores: SubjectScore[] = [];
      let totalScore = 0;

      Test.testSubject.forEach((subject) => {
        if (!subject || !Array.isArray(subject.questions) || !subject.id) return;

        const subjectScore: SubjectScore = {
          id: subject.id,
          subjectname: subject.subjectname || 'Unknown Subject',
          score: 0,
        };

        subject.questions.forEach((question) => {
          if (!question || !question.id) return;

          // Find the correct answer from the answers array
          const correctAnswer = question.answers.find(answer => answer.isCorrect);
          if (!correctAnswer) return;

          const selectedAnswerId = selectedAnswers[subject.id!]?.[question.id!];
          const correctAnswerId = correctAnswer.id;
          
          if (selectedAnswerId === correctAnswerId) {
            const questionMark = parseInt(String(question.questionMark)) || 1;
            subjectScore.score += questionMark;
          }
        });

        subjectScores.push(subjectScore);
        totalScore += subjectScore.score;
      });

      if (isMountedRef.current) {
        setScore({
          subjectscores: subjectScores,
          totalscore: totalScore,
        });
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Error calculating scores:', error);
      // Set default score in case of error
      if (isMountedRef.current) {
        setScore({
          subjectscores: [],
          totalscore: 0,
        });
        setSubmitted(true);
      }
    } finally {
      scoreCalculationRef.current = false;
      setIsCalculatingScore(false);
    }
  }, [Test, selectedAnswers, isCalculatingScore]);

  // Function to review answers and feedback
  const ReviewAnswers = useCallback(() => {
    if (!isMountedRef.current) return;

    setSubmitted(false);
    setReviewAnswers(true);
    setCurrentQuestionIndex(0);
    setCurrentSubjectIndex(0);
  }, []);

  // Function to reset states safely
  const resetStates = useCallback(() => {
    if (!isMountedRef.current) return;

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
    setIsCalculatingScore(false);
    scoreCalculationRef.current = false;
  }, []);

  // Function to retake test
  const retaketest = useCallback(() => {
    resetStates();
  }, [resetStates]);

  // Function to take another test
  const takeanothertest = useCallback(() => {
    resetStates();
    setTest(null);
  }, [resetStates, setTest]);

  // Navigation state validation - moved before conditional returns
  const isFirstQuestion = currentSubjectIndex === 0 && currentQuestionIndex === 0;
  const isLastQuestion = useMemo(() => {
    if (!currentSubject) return false;
    
    // Check if this is the last question in the last subject
    let lastSubjectIndex = Test.testSubject.length - 1;
    while (lastSubjectIndex >= 0) {
      const subject = Test.testSubject[lastSubjectIndex];
      if (subject?.questions && Array.isArray(subject.questions) && subject.questions.length > 0) {
        return currentSubjectIndex === lastSubjectIndex && 
               currentQuestionIndex === subject.questions.length - 1;
      }
      lastSubjectIndex--;
    }
    return false;
  }, [Test, currentSubject, currentSubjectIndex, currentQuestionIndex]);

  // Error boundary for invalid test data
  if (!isValidTest) {
    return (
      <div className="alert alert-danger text-center">
        <h5>Invalid Test Data</h5>
        <p>The test data is not available or corrupted. Please try again.</p>
        <button
          className="btn btn-primary"
          onClick={() => setTest(null)}
        >
          Back to Test Selection
        </button>
      </div>
    );
  }

  return (
    <div className="pt-3">
      {!startTest ? (
        <div className="card mx-auto py-5 px-5" style={{ maxWidth: "500px" }}>
          <CbtInstructions Test={Test} setStartTest={setStartTest} />
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
                    time={totalTestDuration}
                    handleSubmit={calculateScores}
                  />
                </div>
              )}

              {currentQuestion && currentSubject ? (
                <QuestionAndAnswers
                  currentSubject={currentSubject}
                  currentQuestion={currentQuestion}
                  selectedAnswers={selectedAnswers}
                  handleAnswerSelect={handleAnswerSelect}
                  reviewAnswers={reviewAnswers}
                />
              ) : (
                <div className="alert alert-warning">
                  <p>Question data not available</p>
                </div>
              )}

              <hr />

              {/* Navigation buttons */}
              <div className="navigation-buttons mt-2">
                {!isFirstQuestion && (
                  <button
                    className="btn btn-secondary me-2"
                    onClick={handlePrevious}
                    disabled={isCalculatingScore}
                  >
                    Previous
                  </button>
                )}
                
                {isLastQuestion ? (
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
                    <button 
                      className="btn btn-success" 
                      onClick={handleSubmit}
                      disabled={isCalculatingScore}
                    >
                      {isCalculatingScore ? 'Submitting...' : 'Submit Test'}
                    </button>
                  )
                ) : (
                  <button 
                    className="btn btn-primary" 
                    onClick={handleNext}
                    disabled={isCalculatingScore}
                  >
                    Next
                  </button>
                )}
              </div>

              <hr />
              
              {/* Subject navigation */}
              <div className="subject-navigation mt-2">
                {Test.testSubject.map((subject, index) => {
                  if (!subject?.questions || !Array.isArray(subject.questions) || subject.questions.length === 0) {
                    return null;
                  }

                  return (
                    <button
                      key={subject.id || index}
                      onClick={() => handleSubjectSelect(index)}
                      className={`badge px-3 py-2 me-2 mb-2 ${
                        currentSubjectIndex === index
                          ? "bg-secondary-light text-secondary"
                          : "bg-light text-primary"
                      }`}
                      style={{
                        cursor: "pointer",
                        borderRadius: "30px",
                        border: `${
                          currentSubjectIndex === index
                            ? "1px solid var(--secondary)"
                            : "1px solid var(--light)"
                        }`,
                      }}
                      disabled={isCalculatingScore}
                    >
                      {subject.subjectname || `Subject ${index + 1}`}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CbtQuiz;
