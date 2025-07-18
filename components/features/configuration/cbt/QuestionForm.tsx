import React, { useEffect, useState } from "react";
import "./cbtconfig.css";
import Modal from "@/components/custom/Modal/modal";
import { TiTimesOutline } from "react-icons/ti";
import QuestionsGrid from "./QuestionsGrid";
import Alert from "@/components/custom/Alert/Alert";

const QuestionForm = ({ test, setTest, currentSubject, setCurrentSubject }) => {
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [editMode, setEditMode] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [question, setQuestion] = useState({
    id: "",
    questiontext: "",
    questionMark: "",
    answers: [
      {
        answertext: "",
        isCorrect: false,
      },
    ],
    correctAnswerdescription: "",
  });
  const [showModal, setShowModal] = useState(false);

  const closeModal = () => {
    setEditMode(false);
    setShowModal(false);
    setQuestion({
      id: "",
      questiontext: "",
      questionMark: "",
      answers: [
        {
          answertext: "",
          isCorrect: false,
        },
      ],
      correctAnswerdescription: "",
    });
    setCorrectAnswer("");
  };

  const handleCheckboxChange = (index) => {
    const updatedAnswers = question.answers.map((answer, i) => ({
      ...answer,
      isCorrect: i === index,
    }));

    setQuestion({
      ...question,
      answers: updatedAnswers,
    });
    setCorrectAnswer(updatedAnswers[index].answertext);
  };

  const handleSubmit = async (e, url) => {
    e.preventDefault();
    try {
      const response = await fetch(url, {
        method: editMode ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(question),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error("An error occurred while saving the question");
      }
      setAlert({
        show: true,
        message: "Question saved successfully",
        type: "success",
      });
      setCurrentSubject({
        ...currentSubject,
        questions: editMode
          ? currentSubject.questions.map((q) => (q.id === data.id ? data : q))
          : [...currentSubject.questions, data],
      });
      setTest({
        ...test,
        testSubject: test.testSubject.map((subject) =>
          subject.id === currentSubject.id
            ? {
                ...subject,
                questions: editMode
                  ? subject.questions.map((q) =>
                      q.id === data.id ? data : q
                    )
                  : [...subject.questions, data],
            }
            : subject
        ),
      });
    } catch (error) {
      setAlert({
        show: true,
        message: error.message || "An error occurred while saving the question",
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
    <div className="mt-3">
      <div className="d-flex justify-content-end align-items-center">
        <h6 className="me-3 mb-0">
          ({currentSubject?.questions?.length} question
          {currentSubject?.questions?.length > 1 && "s"})
        </h6>
        <button
          className="btn btn-primary border-0 rounded mb-2 mb-md-0 me-3 me-md-5"
          style={{ backgroundColor: "var(--bgDarkerColor)" }}
          onClick={() => {
            setShowModal(true);
          }}
        >
          <i className="bi bi-plus-circle me-2 h5 mb-0"></i> Add Question
        </button>
      </div>
      <div className="my-2">
        {alert.show && <Alert type={alert.type}>{alert.message}</Alert>}
      </div>
      {/* The QuestionsGrid */}
      <QuestionsGrid
        currentSubject={currentSubject}
        setQuestion={setQuestion}
        setEditMode={setEditMode}
        setShowModal={setShowModal}
        setCorrectAnswer={setCorrectAnswer}
        test={test}
        setTest={setTest}
        setCurrentSubject={setCurrentSubject}
      />

      <Modal
        showmodal={showModal}
        toggleModal={() => {
          closeModal();
        }}
      >
        <div className="mt-3">
          <div className="pb-4 px-3 px-md-4">
            <p className="mb-1">{currentSubject?.subjectname}</p>
            <h5>{editMode ? "Edit" : "Add"} Question</h5>
            <hr />
            <form
              onSubmit={(e) => {
                handleSubmit(
                  e,
                  editMode
                    ? `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/CBTapi/updateQuestion/${question.id}/`
                    : `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/CBTapi/addQuestion/${currentSubject?.id}/`
                );
              }}
            >
              <div className="mb-3">
                <label htmlFor="questionMark">Question Mark</label>
                <input
                  type="number"
                  className="form-control"
                  id="questionMark"
                  value={question.questionMark}
                  onChange={(e) =>
                    setQuestion({ ...question, questionMark: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label htmlFor="question">Question Text</label>
                <input
                  type="text"
                  className="form-control"
                  id="question"
                  value={question.questiontext}
                  onChange={(e) =>
                    setQuestion({ ...question, questiontext: e.target.value })
                  }
                />
              </div>

              {question?.answers.map((answer, index) => (
                <div className="mb-3" key={index}>
                  <label htmlFor={`answer${index}`}>Answer {index + 1}</label>
                  <div className="d-flex">
                    <input
                      type="text"
                      className="form-control"
                      id={`answer${index}`}
                      value={answer.answertext}
                      onChange={(e) => {
                        let answers = question.answers;
                        answers[index].answertext = e.target.value;
                        setQuestion({ ...question, answers });
                      }}
                    />
                    <TiTimesOutline
                      className="ms-2 h3 text-danger"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        let answers = question.answers;
                        answers.splice(index, 1);
                        setQuestion({ ...question, answers });
                      }}
                    />
                  </div>

                  <div className="form-check mt-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`flexCheckDefault${index}`}
                      checked={answer.isCorrect}
                      onChange={() => handleCheckboxChange(index)}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`flexCheckDefault${index}`}
                    >
                      Correct Answer
                    </label>
                  </div>
                </div>
              ))}
              <div className="mb-3">
                <button
                  className="btn btn-accent-primary shadow-none"
                  onClick={(e) => {
                    e.preventDefault();
                    let answers = question.answers;
                    answers.push({
                      answertext: "",
                      isCorrect: false,
                    });
                    setQuestion({ ...question, answers });
                  }}
                >
                  <i className="bi bi-plus-circle me-2 h5 mb-0"></i> Add Answer
                </button>
              </div>

              <div className="mb-3">
                <p className="fw-bold mb-1">Correct Answer</p>
                <p>{correctAnswer || "No answer selected yet"}</p>
              </div>
              <div className="mb-4">
                <label htmlFor="correctAnswerdescription">
                  Correct Answer Description
                </label>
                <textarea
                  className="form-control"
                  id="correctAnswerdescription"
                  value={question.correctAnswerdescription}
                  onChange={(e) =>
                    setQuestion({
                      ...question,
                      correctAnswerdescription: e.target.value,
                    })
                  }
                />
              </div>

              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-accent-secondary border-0 rounded me-2"
                  onClick={() => closeModal()}
                >
                  {" "}
                  Cancel{" "}
                </button>
                <button
                  type="submit"
                  className="btn btn-primary border-0 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default QuestionForm;

//   {
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

