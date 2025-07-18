"use client";
import React, { useContext, useEffect, useState } from "react";
import { TiTimes } from "react-icons/ti";
import Modal from "@/components/custom/Modal/modal";
import Alert from "@/components/custom/Alert/Alert";
import { useRouter } from "next/navigation";
import { useFetchOrganization } from "@/data/organization/organization.hook";

const SettingsForm = () => {
  const router = useRouter();
  const { data: OrganizationData } = useFetchOrganization();
  const [tests, setTests] = useState([]);
  const [loadingTests, setLoadingTests] = useState(false);
  const [test, setTest] = useState({
    year: "",
    textType: "",
    subjects: [],
  });
  const [subject, setSubject] = useState("");
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [testtoDelete, setTesttoDelete] = useState({
    id: "",
    year: "",
    textType: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // ----------------------------------
  //   Delete test
  // ----------------------------------
  const deleteTest = async (testId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/CBTapi/deletetest/${testId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setTests(tests.filter((test) => test.id !== testId));
        setAlert({
          show: true,
          message: "Test deleted successfully",
          type: "success",
        });
      }
    } catch (error) {
      console.error("Error deleting test", error);
      setAlert({
        show: true,
        message: "Error deleting test",
        type: "danger",
      });
    } finally {
      setTimeout(() => {
        setAlert({ show: false, message: "", type: "" });
      }, 3000);
      closeModal();
    }
  };

  // ----------------------------------
  //   Fetch tests
  // ----------------------------------
  const fetchTests = async () => {
    setLoadingTests(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/CBTapi/tests/${OrganizationData?.id}`
      );
      const data = await response.json();
      setTests(data);
      setLoadingTests(false);
    } catch (error) {
      console.error("Error fetching exam years", error);
      setLoadingTests(false);
    }
  };

  useEffect(() => {
    if (OrganizationData?.id) fetchTests();
  }, [OrganizationData?.id]);

  // ----------------------------------
  //   Close modal
  // ----------------------------------
  const closeModal = () => {
    setShowModal(false);
    setTesttoDelete({
      id: "",
      year: "",
      textType: "",
    });
  };

  // ----------------------------------
  // Add test
  // ----------------------------------
  const addTest = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/CBTapi/addtest/${OrganizationData?.id}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            testYear: test.year,
            texttype: test.textType,
            testSubject: test.subjects,
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setAlert({
          show: true,
          message: "Test added successfully",
          type: "success",
        });
        setTest({
          year: "",
          textType: "",
          subjects: [],
        });
        setTests([...tests, data]);
        router.push(`/dashboard/configuration/cbt/${data.id}/questions`);
      } else if (response.status === 400) {
        setAlert({
          show: true,
          message: "Test already exists",
          type: "danger",
        });
      }
    } catch (error) {
      console.error("Error adding test", error);
      setAlert({
        show: true,
        message: "Error adding test",
        type: "danger",
      });
    } finally {
      setSubmitting(false);
      setTest({
        year: "",
        textType: "",
        subjects: [],
      });
      setTimeout(() => {
        setAlert({ show: false, message: "", type: "" });
      }, 3000);
    }
  };

  return (
    <div className="row justify-content-between">
      <div className="col-12 col-md-6">
        <div className="card mt-4 mx-auto p-4" style={{ maxWidth: "500px" }}>
          <div className="card-body">
            <p className="mb-0">Add new Test</p>
            <h5 className="mb-2">Test Settings</h5>
            <hr />
            <form onSubmit={() => {}}>
              <div className="form-group mb-4">
                <label className="fw-bold text-primary">Year</label>
                <input
                  type="text"
                  className="form-control"
                  value={test.year}
                  onChange={(e) => setTest({ ...test, year: e.target.value })}
                  placeholder="2021, 2022, etc."
                />
              </div>
              <div className="form-group mb-4">
                <label className="fw-bold text-primary ">Text Type</label>
                <input
                  type="text"
                  className="form-control"
                  value={test.textType}
                  onChange={(e) =>
                    setTest({ ...test, textType: e.target.value })
                  }
                  placeholder="jamb, waec, neco, etc."
                />
              </div>
              <div className="form-group mb-4">
                <label className="fw-bold text-primary">Add a Subject</label>
                <div className="d-flex">
                  <input
                    type="text"
                    className="form-control me-2"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Mathematics, English, etc."
                  />
                  <button
                    className="btn btn-primary rounded"
                    onClick={(e) => {
                      e.preventDefault();
                      setTest({
                        ...test,
                        subjects: [...test.subjects, subject],
                      });
                      setSubject("");
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
              <div className="form-group mb-4">
                <label className="fw-bold text-primary">Subjects Added</label>
                {test.subjects.length > 0 ? (
                  <div>
                    {test.subjects.map((subject, index) => (
                      <div
                        key={index}
                        className={`badge bg-secondary-light text-secondary mt-2 p-2 px-3  ${
                          test.subjects.length === index + 1 ? "" : "me-2"
                        }`}
                      >
                        {subject}
                        <TiTimes
                          className="ms-2"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            const newSubjects = test.subjects.filter(
                              (subj) => subj !== subject
                            );
                            setTest({ ...test, subjects: newSubjects });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p
                    className="fst-italic small p-3"
                    style={{ background: "var(--bgDarkColor)" }}
                  >
                    No subjects added, subjects added will appear here{" "}
                  </p>
                )}
              </div>
              <div>
                <button
                  className="btn btn-accent-secondary rounded me-2"
                  onClick={() => {
                    setTest({
                      year: "",
                      textType: "",
                      subjects: [],
                    });
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary rounded"
                  disabled={submitting}
                  onClick={addTest}
                >
                  {submitting ? (
                    <div className="spinner-border text-light" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    "Save & Add Questions"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="col-12 col-md-6">
        <h5 className="mt-4">Tests Added</h5>
        {alert.show && <Alert type={alert.type}>{alert.message}</Alert>}
        <div>
          {tests.length > 0 ? (
            <div>
              {tests.map((test, index) => (
                <div
                  key={index}
                  className={`card p-4 ps-md-4 mt-3 ${
                    tests.length === index + 1 ? "" : "mb-2"
                  }`}
                >
                  <h6>
                    {test.name} {test.testYear.year} - {test.texttype.testtype}
                  </h6>
                  <div className="mb-3">
                    <p className="fw-bold text-primary mb-0">Subjects</p>
                    <div>
                      {test.testSubject.map((subject, index) => (
                        <div
                          key={index}
                          className={`badge bg-secondary-light text-secondary mt-2 p-2 px-3 ${
                            test.testSubject.length === index + 1 ? "" : "me-2"
                          }`}
                        >
                          {subject.subjectname}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="d-flex justify-content-end">
                    <button
                      className="btn btn-sm btn-accent-primary me-3 px-3 py-1 rounded"
                      onClick={() => {
                        router.push(
                          `/dashboard/configuration/cbt/${test.id}/questions`
                        );
                      }}
                    >
                      edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger me-2 px-3 py-1 rounded"
                      onClick={() => {
                        setTesttoDelete({
                          id: test.id,
                          year: test.testYear.year,
                          textType: test.texttype.testtype,
                        });
                        setShowModal(true);
                      }}
                    >
                      delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p
              className="p-3 text-light text-center bg-primary-light my-3 rounded"
              style={{ background: "var(--bgDarkerColor)" }}
            >
              No tests added, tests added will appear here{" "}
            </p>
          )}

          {loadingTests && (
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          )}
        </div>
      </div>
      <Modal
        showmodal={showModal}
        toggleModal={() => {
          closeModal();
        }}
      >
        <div>
          <p className="mb-0">Are you sure you want to delete this test?</p>
          <h5>
            {testtoDelete.year} - {testtoDelete.textType}
          </h5>
          <div className="mt-4">
            <button
              className="btn btn-primary me-2 rounded"
              onClick={() => {
                deleteTest(testtoDelete.id);
              }}
            >
              Yes
            </button>
            <button
              className="btn btn-accent-secondary rounded"
              onClick={() => {
                closeModal();
              }}
            >
              No
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SettingsForm;
