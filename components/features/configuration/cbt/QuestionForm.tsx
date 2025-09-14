import React, { useEffect, useState, useCallback } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import "./cbtconfig.css";
import Modal from "@/components/custom/Modal/modal";
import { TiTimesOutline } from "react-icons/ti";
import { TiTimes } from "react-icons/ti";
import QuestionsGrid from "./QuestionsGrid";
import Alert from "@/components/custom/Alert/Alert";
import { Question, Subject, Test, CreateQuestion, AnswerCreate } from "@/types/cbt";
import { createQuestionSchema } from "@/schemas/cbt";
import { useCreateQuestion, useUpdateQuestion } from "@/data/hooks/cbt.hooks";

interface QuestionFormProps {
  test: Test | null;
  setTest: React.Dispatch<React.SetStateAction<Test | null>>;
  currentSubject: Subject | null;
  setCurrentSubject: React.Dispatch<React.SetStateAction<Subject | null>>;
}

interface QuestionFormData {
  questiontext: string;
  questionMark: number;
  correctAnswerdescription: string;
  answers: Array<{
    answertext: string;
    isCorrect: boolean;
  }>;
}

interface AlertState {
  show: boolean;
  message: string;
  type: "success" | "danger" | "warning" | "info";
}

const QuestionForm: React.FC<QuestionFormProps> = ({ test, setTest, currentSubject, setCurrentSubject }) => {
  const [alert, setAlert] = useState<AlertState>({ show: false, message: "", type: "info" });
  const [editMode, setEditMode] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { mutateAsync: addQuestionMutation } = useCreateQuestion();
  const { mutateAsync: updateQuestionMutation } = useUpdateQuestion();

  const form = useForm<QuestionFormData>({
    resolver: zodResolver(
      createQuestionSchema.pick({
        questiontext: true,
        questionMark: true,
        correctAnswerdescription: true,
      }).extend({
        answers: createQuestionSchema.shape.answers,
      })
    ),
    defaultValues: {
      questiontext: "",
      questionMark: 1,
      correctAnswerdescription: "",
      answers: [
        { answertext: "", isCorrect: false },
        { answertext: "", isCorrect: false },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "answers",
  });

  // Show alert with timeout
  const showAlert = useCallback((message: string, type: AlertState["type"]) => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "info" });
    }, 3000);
  }, []);

  // Handle correct answer selection
  const handleCorrectAnswerChange = useCallback((index: number) => {
    const currentAnswers = form.getValues("answers");
    const updatedAnswers = currentAnswers.map((answer, i) => ({
      ...answer,
      isCorrect: i === index,
    }));
    
    form.setValue("answers", updatedAnswers);
    
    const selectedAnswer = updatedAnswers[index];
    setCorrectAnswer(selectedAnswer.answertext || null);
  }, [form]);

  // Add new answer
  const addAnswer = useCallback(() => {
    append({ answertext: "", isCorrect: false });
  }, [append]);

  // Remove answer
  const removeAnswer = useCallback((index: number) => {
    if (fields.length > 2) {
      remove(index);
      // Update correct answer if the removed answer was selected
      const currentAnswers = form.getValues("answers");
      const wasCorrect = currentAnswers[index]?.isCorrect;
      if (wasCorrect) {
        setCorrectAnswer(null);
      }
    }
  }, [fields.length, remove, form]);

  // Open modal for new question
  const openModal = useCallback(() => {
    setEditMode(false);
    setCurrentQuestion(null);
    setCorrectAnswer(null);
    form.reset({
      questiontext: "",
      questionMark: 1,
      correctAnswerdescription: "",
      answers: [
        { answertext: "", isCorrect: false },
        { answertext: "", isCorrect: false },
      ],
    });
    setShowModal(true);
  }, [form]);

  // Open modal for editing question
  const openEditModal = useCallback((question: Question) => {
    setEditMode(true);
    setCurrentQuestion(question);
    
    // Find correct answer by checking which answer has isCorrect = true
    const correctAnswerObj = question.answers.find(answer => answer.isCorrect);
    const correctAnswerText = correctAnswerObj?.answertext || null;
    setCorrectAnswer(correctAnswerText);
    
    const formattedAnswers = question.answers.map((answer) => ({
      answertext: answer.answertext,
      isCorrect: answer.isCorrect || false,
    }));

    form.reset({
      questiontext: question.questiontext,
      questionMark: question.questionMark,
      correctAnswerdescription: question.correctAnswerdescription || "",
      answers: formattedAnswers,
    });
    
    setShowModal(true);
  }, [form]);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setEditMode(false);
    setCurrentQuestion(null);
    setCorrectAnswer(null);
    form.reset();
  }, [form]);

  // Submit form
  const onSubmit = async (data: QuestionFormData) => {
    try {
      if (!currentSubject?.id) {
        showAlert("No subject selected", "danger");
        return;
      }

      // Find the correct answer
      const correctAnswerIndex = data.answers.findIndex(answer => answer.isCorrect);
      if (correctAnswerIndex === -1) {
        showAlert("Please select a correct answer", "danger");
        return;
      }

      if (editMode && currentQuestion?.id) {
        await updateQuestionMutation({
          questionId: currentQuestion.id,
          questionData: {
            questiontext: data.questiontext,
            questionMark: data.questionMark,
            answers: data.answers,
            correctAnswerdescription: data.correctAnswerdescription,
          },
        });
        showAlert("Question updated successfully", "success");
      } else {
        await addQuestionMutation({
          subjectId: currentSubject.id,
          questionData: {
            questiontext: data.questiontext,
            questionMark: data.questionMark,
            answers: data.answers,
            correctAnswerdescription: data.correctAnswerdescription,
          },
        });
        showAlert("Question created successfully", "success");
      }

      closeModal();
    } catch (error) {
      console.error("Error saving question:", error);
      showAlert(
        editMode ? "Failed to update question" : "Failed to create question",
        "danger"
      );
    }
  };

  // Update correct answer when answers change
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name?.includes("answers")) {
        const answers = value.answers || [];
        const correctIndex = answers.findIndex(answer => answer?.isCorrect);
        if (correctIndex >= 0) {
          setCorrectAnswer(answers[correctIndex]?.answertext || null);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <div className="mt-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h6 className="mb-0">
          Questions Management
          {currentSubject?.questions?.length !== undefined && (
            <span className="text-muted ms-2">
              ({currentSubject.questions.length} question{currentSubject.questions.length !== 1 ? 's' : ''})
            </span>
          )}
        </h6>
        <button
          className="btn btn-primary rounded"
          onClick={openModal}
          disabled={!currentSubject}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Add Question
        </button>
      </div>

      {alert.show && <Alert type={alert.type}>{alert.message}</Alert>}

      {!currentSubject ? (
        <div className="card p-4 text-center">
          <p className="mb-0 text-muted">Please select a subject to manage questions</p>
        </div>
      ) : (
        <QuestionsGrid
          currentSubject={currentSubject}
          setQuestion={openEditModal}
          setEditMode={setEditMode}
          setShowModal={setShowModal}
          setCorrectAnswer={() => {}}
          test={test}
          setTest={setTest}
          setCurrentSubject={setCurrentSubject}
        />
      )}

      <Modal showmodal={showModal} toggleModal={closeModal}>
        <div className="p-4">
          <h5 className="mb-4">
            {editMode ? "Edit Question" : "Add New Question"}
          </h5>

          <form onSubmit={form.handleSubmit(onSubmit)} className="row">
            <div className="col-12">
              <div className="mb-3">
                <label htmlFor="questionMark" className="form-label fw-bold">
                  Mark for Question
                </label>
                <Controller
                  name="questionMark"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <>
                      <input
                        {...field}
                        type="number"
                        className={`form-control ${fieldState.error ? "is-invalid" : ""}`}
                        id="questionMark"
                        min="1"
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                      {fieldState.error && (
                        <div className="invalid-feedback">
                          {fieldState.error.message}
                        </div>
                      )}
                    </>
                  )}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="question" className="form-label fw-bold">
                  Question
                </label>
                <Controller
                  name="questiontext"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <>
                      <textarea
                        {...field}
                        className={`form-control ${fieldState.error ? "is-invalid" : ""}`}
                        id="question"
                        rows={3}
                        placeholder="Enter the question text here..."
                      />
                      {fieldState.error && (
                        <div className="invalid-feedback">
                          {fieldState.error.message}
                        </div>
                      )}
                    </>
                  )}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Answers</label>
                {fields.map((field, index) => (
                  <div key={field.id} className="mb-3 p-3 border rounded">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <label htmlFor={`answer-${index}`} className="form-label">
                        Answer {index + 1}
                      </label>
                      {fields.length > 2 && (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => removeAnswer(index)}
                          title="Remove answer"
                        >
                          <TiTimes />
                        </button>
                      )}
                    </div>
                    
                    <Controller
                      name={`answers.${index}.answertext`}
                      control={form.control}
                      render={({ field: answerField, fieldState }) => (
                        <>
                          <input
                            {...answerField}
                            type="text"
                            className={`form-control ${fieldState.error ? "is-invalid" : ""}`}
                            id={`answer-${index}`}
                            placeholder="Enter answer text..."
                          />
                          {fieldState.error && (
                            <div className="invalid-feedback">
                              {fieldState.error.message}
                            </div>
                          )}
                        </>
                      )}
                    />

                    <div className="form-check mt-2">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="correctAnswer"
                        id={`correct-${index}`}
                        checked={form.watch(`answers.${index}.isCorrect`)}
                        onChange={() => handleCorrectAnswerChange(index)}
                      />
                      <label className="form-check-label" htmlFor={`correct-${index}`}>
                        Correct Answer
                      </label>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  onClick={addAnswer}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Add Answer
                </button>
              </div>

              {correctAnswer && (
                <div className="mb-3">
                  <p className="fw-bold mb-1 text-success">Selected Correct Answer:</p>
                  <p className="text-muted">{correctAnswer}</p>
                </div>
              )}

              <div className="mb-4">
                <label htmlFor="correctAnswerdescription" className="form-label fw-bold">
                  Correct Answer Description
                </label>
                <Controller
                  name="correctAnswerdescription"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <>
                      <textarea
                        {...field}
                        className={`form-control ${fieldState.error ? "is-invalid" : ""}`}
                        id="correctAnswerdescription"
                        rows={3}
                        placeholder="Explain why this is the correct answer..."
                      />
                      {fieldState.error && (
                        <div className="invalid-feedback">
                          {fieldState.error.message}
                        </div>
                      )}
                    </>
                  )}
                />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                  disabled={form.formState.isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <div className="spinner-border spinner-border-sm me-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      {editMode ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>{editMode ? "Update Question" : "Create Question"}</>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default QuestionForm;

