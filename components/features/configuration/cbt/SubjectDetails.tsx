import React, { useState } from "react";
import Modal from "@/components/custom/Modal/modal";
import Alert from "@/components/custom/Alert/Alert";

const SubjectDetails = ({ test, setTest, subjects, setCurrentSubject }) => {
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState({
    id: "",
    subjectname: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [subjectToEdit, setSubjectToEdit] = useState({
    id: "",
    subjectname: "",
    subjectduration: 0,
    questions: [],
  });

//   delete subject
  const deleteSubject = async (id) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/CBTapi/deletesubject/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Could not delete subject");
      }
      setTest({
        ...test,
        testSubject: test.testSubject.filter((subject) => subject.id !== id),
      });
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
      setCurrentSubject(test.testSubject.length > 0 ? test.testSubject[0] : {});
      setTimeout(() => {
        setAlert({ show: false, message: "", type: "" });
      }, 3000);
    }
  };


//   toggle modal
  const toggleModal = (show) => {
    setShowDeleteModal(show);
    setShowModal(show);
    setEditMode(false);
    setSubjectToEdit({
      id: "",
      subjectname: "",
      subjectduration: 0,
      questions: [],
    });
    setSubjectToDelete({
      id: "",
      subjectname: "",
    });
  };


//   add or update subject
  const addorUpdateSubject = async (e, url) => {
    e.preventDefault();
    try {
      const response = await fetch(url, {
        method: editMode ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subjectToEdit),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Could not add subject");
      } else {
        if (editMode) {
          // Update subject in the subjects array
          const updatedSubjects = subjects.map((subject) => {
            if (subject.id === data.id) {
              return data;
            }
            return subject;
          });
          setTest({ ...test, testSubject: updatedSubjects });
        } else {
          setTest({ ...test, testSubject: [...test.testSubject, data] });
        }
        setAlert({
          show: true,
          message: editMode
            ? "Subject updated Successfully"
            : "Subject added Successfully",
          type: "success",
        });
      }
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
        setAlert({ show: false, message: "", type: "" });
      }, 3000);
    }
  };

  return (
    <div>
      <h5 className="">
        {subjects?.length} Test Subject{subjects?.length > 0 ? "s" : ""}
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
      {subjects?.length > 0 ? (
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
                  onClick={() => setCurrentSubject(subject)}
                >
                  questions
                </button>
                <button
                  className="btn btn-sm btn-accent-secondary rounded py-1 shadow-none me-3"
                  onClick={() => {
                    setSubjectToEdit({
                      id: subject.id,
                      subjectname: subject.subjectname,
                      subjectduration: parseInt(subject.subjectduration),
                      questions: subject.questions,
                    });
                    setEditMode(true);
                    setShowModal(true);
                  }}
                >
                  edit
                </button>
                <button
                  className="btn btn-sm btn-accent-danger rounded"
                  onClick={() => {
                    setSubjectToDelete({
                      id: subject.id,
                      subjectname: subject.subjectname,
                    });
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
          <h6 className="mb-3">{subjectToDelete.subjectname}</h6>
          <div className="d-flex justify-content-end">
            <button
              className="btn btn-sm btn-accent-secondary rounded py-1 shadow-none me-3"
              onClick={() => setShowDeleteModal(false)}
            >
              No
            </button>
            <button
              className="btn btn-sm btn-danger rounded"
              onClick={() => deleteSubject(subjectToDelete.id)}
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
        <form
          onSubmit={(e) => {
            addorUpdateSubject(
              e,
              editMode
                ? `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/CBTapi/updatesubject/${subjectToEdit.id}/`
                : `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/CBTapi/addsubject/${test.id}/`
            );
          }}
        >
          <div className="mb-3">
            <label htmlFor="subjectname" className="form-label">
              Subject Name
            </label>
            <input
              type="text"
              className="form-control"
              id="subjectname"
              placeholder="Enter subject name"
              value={subjectToEdit.subjectname}
              onChange={(e) =>
                setSubjectToEdit({
                  ...subjectToEdit,
                  subjectname: e.target.value,
                })
              }
            />
          </div>
          <div className="mb-3">
            <label htmlFor="subjectduration" className="form-label">
              Subject Duration
            </label>
            <input
              type="number"
              className="form-control"
              id="subjectduration"
              placeholder="Enter subject duration"
              value={subjectToEdit.subjectduration}
              onChange={(e) =>
                setSubjectToEdit({
                  ...subjectToEdit,
                  subjectduration: parseInt(e.target.value),
                })
              }
            />
          </div>
          <div className="d-flex justify-content-end mt-4">
            <button
              className="btn btn-sm btn-accent-secondary rounded me-3"
              onClick={() => {
                toggleModal(false);
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-sm btn-primary rounded">
              {editMode ? "Update Subject" : "Add Subject"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SubjectDetails;
