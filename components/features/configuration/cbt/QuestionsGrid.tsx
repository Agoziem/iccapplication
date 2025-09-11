import React, { useState } from "react";
import Modal from "@/components/custom/Modal/modal";
import Alert from "@/components/custom/Alert/Alert";
const QuestionsGrid = ({
  currentSubject,
  setQuestion,
  setEditMode,
  setShowModal,
  setCorrectAnswer,
  test,
  setTest,
  setCurrentSubject,
}) => {
  const [questiontodelete, setQuestionToDelete] = useState({
    id: "",
    questionnumber: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [alert, setAlert] = useState({ show: true, message: "", type: "" });
  const closeModal = () => {
    setShowDeleteModal(false);
    setQuestionToDelete({
      id: "",
      questionnumber: "",
    });
  };
  const deleteQuestion = async (questionID) => {
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
        questions: currentSubject.questions.filter(
          (question) => question.id !== questionID
        ),
      });
      setTest({
        ...test,
        testSubject: test.testSubject.map((subject) =>
          subject.id === currentSubject.id
            ? { ...subject, questions: subject.questions.filter((q) => q.id !== questionID) }
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
        setAlert({ show: false, message: "", type: "" });
      }, 3000);
    }
  };

  return (
    <>
      {alert.show && <Alert type={alert.type}>{alert.message}</Alert>}
      <div className="my-4">
        {currentSubject?.questions?.length > 0 ? (
          <div className="">
            {currentSubject.questions.map((question, index) => (
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
                            isCorrect: a.id === question?.correctAnswer?.id,
                          })),
                        });
                        setCorrectAnswer(question?.correctAnswer?.answertext);
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
                          questionnumber: index + 1,
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
