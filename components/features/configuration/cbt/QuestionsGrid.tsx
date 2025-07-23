import React, { useState } from "react";
import Modal from "@/components/custom/Modal/modal";
import Alert from "@/components/custom/Alert/Alert";

type AlertType = "success" | "danger" | "warning" | "info";

interface AlertState {
  show: boolean;
  message: string;
  type: AlertType;
}

interface Answer {
  answertext: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  questiontext: string;
  questionMark: string;
  answers: Answer[];
  correctAnswerdescription: string;
}

interface Subject {
  id: string;
  name: string;
  questions?: Question[];
  [key: string]: any;
}

interface Test {
  id: string;
  testSubject: Subject[];
  [key: string]: any;
}

interface QuestionToDelete {
  id: string;
  questionnumber: string;
}

interface QuestionsGridProps {
  currentSubject: Subject;
  setQuestion: (value: Question) => void;
  setEditMode: (value: boolean) => void;
  setShowModal: (value: boolean) => void;
  setCorrectAnswer: (value: string) => void;
  test: Test;
  setTest: (value: Test) => void;
  setCurrentSubject: (value: Subject) => void;
}

const QuestionsGrid: React.FC<QuestionsGridProps> = ({
  currentSubject,
  setQuestion,
  setEditMode,
  setShowModal,
  setCorrectAnswer,
  test,
  setTest,
  setCurrentSubject,
}) => {
  const [questiontodelete, setQuestionToDelete] = useState<QuestionToDelete>({
    id: "",
    questionnumber: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertState>({ show: true, message: "", type: "info" });
  
  const closeModal = (): void => {
    setShowDeleteModal(false);
    setQuestionToDelete({
      id: "",
      questionnumber: "",
    });
  };
  
  const deleteQuestion = async (questionID: string): Promise<void> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/CBTapi/deleteQuestion/${questionID}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("An error occurred while deleting the question");
      }
      setAlert({
        show: true,
        message: "Question deleted successfully",
        type: "success",
      });
      setCurrentSubject({
        ...currentSubject,
        questions: currentSubject.questions?.filter(
          (question) => question.id !== questionID
        ) || [],
      });
      setTest({
        ...test,
        testSubject: test.testSubject.map((subject) =>
          subject.id === currentSubject.id
            ? { ...subject, questions: subject.questions?.filter((q) => q.id !== questionID) || [] }
            : subject
        ),
      });
    } catch (error) {
      console.error(error);
      setAlert({
        show: true,
        message: "An error occurred while deleting the question",
        type: "danger",
      });
    } finally {
      closeModal();
      setTimeout(() => {
        setAlert({ show: false, message: "", type: "info" });
      }, 3000);
    }
  };

  return (
    <>
      {alert.show && <Alert type={alert.type}>{alert.message}</Alert>}
      <div className="my-4">
        {(currentSubject?.questions?.length || 0) > 0 ? (
          <div className="">
            {currentSubject.questions?.map((question, index) => (
              <div
                className="card p-4 px-md-5 mx-auto"
                key={index}
                style={{ maxWidth: "600px" }}
              >
                <div className="d-flex flex-wrap align-items-center">
                  <div className="flex-fill">
                    <h6 className="text-primary">Question {index + 1}</h6>
                    <div className="">{question.questiontext}</div>
                  </div>

                  <div className="ms-2 ms-md-0 mt-3 mt-md-0">
                    <button
                      className="btn btn-primary border-0 rounded me-2"
                      style={{ backgroundColor: "var(--bgDarkerColor)" }}
                      onClick={() => {
                        setQuestion({
                          ...question,
                          answers: question.answers.map((a) => ({
                            ...a,
                            isCorrect: a.isCorrect,
                          })),
                        });
                        const correctAnswer = question.answers.find(a => a.isCorrect);
                        setCorrectAnswer(correctAnswer?.answertext || "");
                        setEditMode(true);
                        setShowModal(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger border-0 rounded"
                      onClick={() => {
                        setQuestionToDelete({
                          id: question.id,
                          questionnumber: (index + 1).toString(),
                        });
                        setShowDeleteModal(true);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="d-flex justify-content-center">
            <h6 className="text-primary">No questions added yet</h6>
          </div>
        )}
        <Modal
          showmodal={showDeleteModal}
          toggleModal={() => {
            closeModal();
          }}
        >
          <div className="p-3">
            <h6 className="text-primary">Delete Question</h6>
            <p>
              Are you sure you want to delete{" "}
              <span className="fw-bold">
                question {questiontodelete.questionnumber}?
              </span>
            </p>
            <div className="d-flex justify-content-end">
              <button
                className="btn btn-secondary me-2"
                onClick={() => {
                  closeModal();
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  deleteQuestion(questiontodelete.id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default QuestionsGrid;

///   {
//     "id": 8,
//     "answers": [
//         {
//             "id": 14,
//             "answertext": "True"
//         },
//         {
//             "id": 15,
//             "answertext": "False"
//         }
//     ],
//     "correctAnswer": null,
//     "questiontext": "The Lord is Good",
//     "questionMark": 2,
//     "required": true,
//     "correctAnswerdescription": "The Lord is indeed Good"
// } from the database

// {
//   id: "",
//   questiontext: "",
//   questionMark: "",
//   answers: [
//     {
//       answertext: "",
//       isCorrect: false,
//     },
//   ],
//   correctAnswerdescription: "",
// } for the form
