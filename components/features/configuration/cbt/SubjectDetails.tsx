import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "@/components/custom/Modal/modal";
import Alert from "@/components/custom/Alert/Alert";
import { Subject, Test } from "@/types/cbt";
import {
  useCreateSubject,
  useDeleteSubject,
  useSubjects,
  useUpdateSubject,
} from "@/data/hooks/cbt.hooks";
import { createSubjectSchema } from "@/schemas/cbt";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

type SubjectFormData = z.infer<typeof createSubjectSchema>;

type SubjectDetailsProps = {
  currentSubject: Subject | null;
  setCurrentSubject: React.Dispatch<React.SetStateAction<Subject | null>>;
};

interface AlertState {
  show: boolean;
  message: string;
  type: "success" | "danger" | "warning" | "info";
}

const SubjectDetails: React.FC<SubjectDetailsProps> = ({
  currentSubject,
  setCurrentSubject,
}) => {
  const { id: testId } = useParams() as { id: string };
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    message: "",
    type: "info",
  });
  const [showModal, setShowModal] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editSubjectId, setEditSubjectId] = useState<number | null>(null);
  const { data: subjects } = useSubjects(testId ? parseInt(testId) : 0);
  const { mutateAsync: deleteSubjectMutation } = useDeleteSubject();
  const { mutateAsync: updateSubjectMutation } = useUpdateSubject();
  const { mutateAsync: createSubjectMutation } = useCreateSubject();

  const form = useForm<SubjectFormData>({
    resolver: zodResolver(createSubjectSchema),
    defaultValues: {
      subjectname: "",
      subjectduration: 0,
      questions: [],
    },
  });

  // Delete subject
  const deleteSubject = async (id: number) => {
    try {
      await deleteSubjectMutation(id);
      setAlert({
        show: true,
        message: "Subject deleted Successfully",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      setAlert({
        show: true,
        message: "Could not delete subject",
        type: "danger",
      });
    } finally {
      toggleModal(false);
      setCurrentSubject(subjects && subjects.length > 0 ? subjects[0] : null);
      setTimeout(() => {
        setAlert({ show: false, message: "", type: "info" });
      }, 3000);
    }
  };

  // Toggle modal
  const toggleModal = (show: boolean) => {
    setShowDeleteModal(show);
    setShowModal(show);
    setEditMode(false);
    setSubjectToDelete(null);
  };

  // Open edit modal
  const openEditModal = (subject: Subject) => {
    form.reset({
      subjectname: subject.subjectname,
      subjectduration: subject.subjectduration,
      questions: subject.questions,
    });
    setEditSubjectId(subject.id || null);
    setEditMode(true);
    setShowModal(true);
  };

  // Submit form
  const onSubmit = async (formData: SubjectFormData) => {
    try {
      if (editMode && !editSubjectId) {
        throw new Error("Invalid subject ID");
      }
      editMode
        ? await updateSubjectMutation({
            subjectId: editSubjectId!,
            subjectData: formData,
          })
        : await createSubjectMutation({
            testId: Number(testId),
            subjectData: formData,
          });

      setAlert({
        show: true,
        message: editMode
          ? "Subject updated Successfully"
          : "Subject added Successfully",
        type: "success",
      });
      form.reset();
    } catch (error) {
      console.error(error);
      setAlert({
        show: true,
        message: editMode
          ? "Could not update subject"
          : "Could not add subject",
        type: "danger",
      });
    } finally {
      toggleModal(false);
      setTimeout(() => {
        setAlert({ show: false, message: "", type: "info" });
      }, 3000);
    }
  };

  return (
    <div>
      <h5 className="">
        {subjects?.length} Test Subject
        {subjects && subjects.length > 0 ? "s" : ""}
      </h5>
      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn btn-sm btn-primary rounded"
          onClick={() => setShowModal(true)}
        >
          Add New Subject
        </button>
      </div>
      {alert.show && <Alert type={alert.type}>{alert.message}</Alert>}
      {subjects && subjects.length > 0 ? (
        <div className="my-2">
          {subjects.map((subject, index) => (
            <div key={subject.id} className="card p-4">
              <div className="mb-3">
                <div className="d-flex">
                  <div className="mb-0 fw-bold text-primary me-2">
                    {index + 1}
                  </div>
                  <h6 className="mb-0">{subject.subjectname}</h6>
                </div>
                <div className="mb-0" style={{ color: "var(--bgDarkerColor)" }}>
                  {subject.questions.length} questions {subject.subjectduration}{" "}
                  mins
                </div>
              </div>
              <div className="d-flex justify-content-end">
                <button
                  className="btn btn-sm btn-accent-primary rounded py-1 shadow-none me-3"
                  onClick={() => {
                    toast.success(`${subject.subjectname} selected`);
                    setCurrentSubject(subject);
                  }}
                >
                  questions
                </button>
                <button
                  className="btn btn-sm btn-accent-secondary rounded py-1 shadow-none me-3"
                  onClick={() => openEditModal(subject)}
                >
                  edit
                </button>
                <button
                  className="btn btn-sm btn-accent-danger rounded"
                  onClick={() => {
                    setSubjectToDelete(subject);
                    setShowDeleteModal(true);
                  }}
                >
                  delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-3">No subjects available</div>
      )}
      <Modal showmodal={showDeleteModal} toggleModal={() => toggleModal(false)}>
        <div className="p-3">
          <p className="mb-0">Are you sure you want to delete this subject?</p>
          <h6 className="mb-3">{subjectToDelete?.subjectname}</h6>
          <div className="d-flex justify-content-end">
            <button
              className="btn btn-sm btn-accent-secondary rounded py-1 shadow-none me-3"
              onClick={() => setShowDeleteModal(false)}
            >
              No
            </button>
            <button
              className="btn btn-sm btn-danger rounded"
              onClick={() => {
                if (subjectToDelete?.id) {
                  deleteSubject(subjectToDelete.id);
                }
              }}
            >
              Yes
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        showmodal={showModal}
        toggleModal={() => {
          toggleModal(false);
        }}
      >
        <h5 className="mb-3">
          {editMode ? "Edit Subject" : "Add New Subject"}
        </h5>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="subjectname" className="form-label">
              Subject Name
            </label>
            <Controller
              name="subjectname"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <input
                    {...field}
                    type="text"
                    className={`form-control ${
                      fieldState.error ? "is-invalid" : ""
                    }`}
                    id="subjectname"
                    placeholder="Enter subject name"
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
            <label htmlFor="subjectduration" className="form-label">
              Subject Duration (minutes)
            </label>
            <Controller
              name="subjectduration"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <input
                    {...field}
                    type="number"
                    className={`form-control ${
                      fieldState.error ? "is-invalid" : ""
                    }`}
                    id="subjectduration"
                    placeholder="Enter subject duration"
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
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
          <div className="d-flex justify-content-end mt-4">
            <button
              type="button"
              className="btn btn-sm btn-accent-secondary rounded me-3"
              onClick={() => toggleModal(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-sm btn-primary rounded"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <div
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : null}
              {editMode ? "Update Subject" : "Add Subject"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SubjectDetails;
