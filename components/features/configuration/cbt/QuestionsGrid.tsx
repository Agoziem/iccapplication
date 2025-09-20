import React, { useState } from "react";
import Modal from "@/components/custom/Modal/modal";
import Alert from "@/components/custom/Alert/Alert";
import { Answer, Question, Subject, Test } from "@/types/cbt";
import { useDeleteQuestion, useTestQuestions } from "@/data/hooks/cbt.hooks";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

interface QuestionsGridProps {
  currentSubject: Subject | null;
  setQuestion: (question: Question) => void;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}
const QuestionsGrid = ({
  currentSubject,
  setQuestion,
  setEditMode,
  setShowModal,
}: QuestionsGridProps) => {
  const { id: testId } = useParams() as { id: string };
  const [questiontodelete, setQuestionToDelete] = useState<Question | null>(
    null
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [alert, setAlert] = useState<{
    show: boolean;
    message: string;
    type: "success" | "danger" | "warning" | "info";
  }>({ show: false, message: "", type: "info" });
  const { mutateAsync: deleteQuestionMutation } = useDeleteQuestion();
  const { data: questions } = useTestQuestions(
    currentSubject && currentSubject.id ? currentSubject.id : 0
  );

  const closeModal = () => {
    setShowDeleteModal(false);
    setQuestionToDelete(null);
  };

  const deleteQuestion = async (questionID: number) => {
    if (!currentSubject && !testId) {
      toast.error("Subject or Test information is missing");
      return;
    }
    try {
      await deleteQuestionMutation({
        questionId: questionID,
        subjectId: currentSubject?.id!,
        testId: testId ? parseInt(testId) : 0,
      });
      setAlert({
        show: true,
        message: "Question deleted successfully",
        type: "success",
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
        {questions && questions.length > 0 ? (
          <div className="">
            {questions.map((question, index) => (
              <div
                className="card p-4 px-md-5 mx-auto"
                key={index}
                style={{ maxWidth: "600px" }}
              >
                <div className="d-flex flex-wrap align-items-center">
                  <div className="flex-fill">
                    <h6 className="text-primary">Question {index + 1}</h6>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: question.questiontext,
                      }}
                      style={{
                        whiteSpace: "pre-wrap",
                        wordWrap: "break-word",
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                      }}
                    />
                  </div>

                  <div className="ms-2 ms-md-0 mt-3 mt-md-0">
                    <button
                      className="btn btn-primary border-0 rounded me-2"
                      style={{ backgroundColor: "var(--bgDarkerColor)" }}
                      onClick={() => {
                        setQuestion(question);
                        setEditMode(true);
                        setShowModal(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger border-0 rounded"
                      onClick={() => {
                        setQuestionToDelete(question);
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
          <div className={"card p-4 ps-md-4 mt-3  mb-2"}>
            <p
              className="p-3 text-light text-center bg-primary-light my-3 rounded"
              style={{ background: "var(--bgDarkerColor)" }}
            >
              No questions added yet.
            </p>
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
              <span className="fw-bold">question {questiontodelete?.id}?</span>
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
                  if (questiontodelete?.id) {
                    deleteQuestion(questiontodelete.id);
                  }
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
