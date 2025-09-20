"use client";
import React, { useCallback, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TiTimes } from "react-icons/ti";
import Modal from "@/components/custom/Modal/modal";
import Alert from "@/components/custom/Alert/Alert";
import { useRouter } from "next/navigation";
import { useOrganization } from "@/data/hooks/organization.hooks";
import { ORGANIZATION_ID } from "@/data/constants";
import { Subject, Test, CreateTest } from "@/types/cbt";
import { createTestSchema } from "@/schemas/cbt";
import { useCreateTest, useDeleteTest, useTests, useTestTypes, useYears } from "@/data/hooks/cbt.hooks";

interface TestFormData {
  testYear: number;
  texttype: number;
  testSubject: number[];
}

interface AlertState {
  show: boolean;
  message: string;
  type: "success" | "danger" | "warning" | "info";
}

const SettingsForm = () => {
  const router = useRouter();
  const { data: OrganizationData } = useOrganization(
    parseInt(ORGANIZATION_ID || "0")
  );
  const { data: tests, isLoading: loadingTests } = useTests(
    OrganizationData?.id || 0
  );

  const [alert, setAlert] = useState<AlertState>({
    show: false,
    message: "",
    type: "info",
  });
  const [showModal, setShowModal] = useState(false);
  const [testtoDelete, setTesttoDelete] = useState<Test | null>(null);
  const { data: years } = useYears();
  const { data: testtypes } = useTestTypes();
  // const [newSubject, setNewSubject] = useState("");
  // const [subjectsList, setSubjectsList] = useState<string[]>([]);

  const { mutateAsync: deleteTestMutation } = useDeleteTest();
  const { mutateAsync: addTestMutation } = useCreateTest();

  const form = useForm<TestFormData>({
    resolver: zodResolver(createTestSchema),
    defaultValues: {
      testYear: 0, // Will be set to first available year or current year
      texttype: 0, // Will be set to first available test type
      testSubject: [],
    },
  });

  // Show alert with timeout
  const showAlert = useCallback((message: string, type: AlertState["type"]) => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "info" });
    }, 3000);
  }, []);

  // Add subject to list
  // const addSubject = useCallback(() => {
  //   if (newSubject.trim()) {
  //     setSubjectsList(prev => [...prev, newSubject.trim()]);
  //     setNewSubject("");
  //   }
  // }, [newSubject]);

  // Remove subject from list
  // const removeSubject = useCallback((index: number) => {
  //   setSubjectsList(prev => prev.filter((_, i) => i !== index));
  // }, []);

  // Delete test
  const deleteTest = async (testId: number) => {
    try {
      await deleteTestMutation(testId);
      showAlert("Test deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting test", error);
      showAlert("Error deleting test", "danger");
    } finally {
      closeModal();
    }
  };

  // Close modal
  const closeModal = useCallback(() => {
    setShowModal(false);
    setTesttoDelete(null);
  }, []);

  // Submit form
  const onSubmit = async (data: TestFormData) => {
    try {
      // if (subjectsList.length === 0) {
      //   showAlert("Please add at least one subject", "danger");
      //   return;
      // }

      // For now, we'll use dummy subject IDs
      // In a real app, these would come from a subjects lookup
      // const subjectIds = subjectsList.map((_, index) => index + 1);

      const testPayload = {
        organizationId: OrganizationData?.id || 0,
        testData: {
          testYear: data.testYear,
          texttype: data.texttype,
          // testSubject: subjectIds,
        },
      };

      const response = await addTestMutation(testPayload);
      showAlert("Test added successfully", "success");

      // Reset form and subjects
      form.reset();
      // setSubjectsList([]);

      // Navigate to questions page
      router.push(`/dashboard/configuration/cbt/${response.id}/questions`);
    } catch (error) {
      console.error("Error adding test", error);
      showAlert("Error adding test", "danger");
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
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="form-group mb-4">
                <label className="fw-bold text-primary">Year</label>
                <Controller
                  name="testYear"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <>
                      <select
                        {...field}
                        className={`form-control ${
                          fieldState.error ? "is-invalid" : ""
                        }`}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                        disabled={!years || years.length === 0}
                      >
                        <option value="">Select a year</option>
                        {years?.map((year) => (
                          <option key={year.id} value={year.id}>
                            {year.year}
                          </option>
                        )) || <option disabled>Loading years...</option>}
                      </select>
                      {fieldState.error && (
                        <div className="invalid-feedback">
                          {fieldState.error.message}
                        </div>
                      )}
                    </>
                  )}
                />
              </div>

              <div className="form-group mb-4">
                <label className="fw-bold text-primary">Test Type</label>
                <Controller
                  name="texttype"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <>
                      <select
                        {...field}
                        className={`form-control ${
                          fieldState.error ? "is-invalid" : ""
                        }`}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                        disabled={!testtypes || testtypes.length === 0}
                      >
                        <option value="">Select a test type</option>
                        {testtypes?.map((testtype) => (
                          <option key={testtype.id} value={testtype.id}>
                            {testtype.testtype}
                          </option>
                        )) || <option disabled>Loading test types...</option>}
                      </select>
                      {fieldState.error && (
                        <div className="invalid-feedback">
                          {fieldState.error.message}
                        </div>
                      )}
                    </>
                  )}
                />
              </div>

              {/* <div className="form-group mb-4">
                <label className="fw-bold text-primary">Add a Subject</label>
                <div className="d-flex">
                  <input
                    type="text"
                    className="form-control me-2"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="Mathematics, English, etc."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSubject();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-primary rounded"
                    onClick={addSubject}
                    disabled={!newSubject.trim()}
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="form-group mb-4">
                <label className="fw-bold text-primary">Subjects Added</label>
                {subjectsList.length > 0 ? (
                  <div>
                    {subjectsList.map((subject, index) => (
                      <div
                        key={index}
                        className={`badge bg-secondary-light text-secondary mt-2 p-2 px-3 ${
                          subjectsList.length === index + 1 ? "" : "me-2"
                        }`}
                      >
                        {subject}
                        <TiTimes
                          className="ms-2"
                          style={{ cursor: "pointer" }}
                          onClick={() => removeSubject(index)}
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
              </div> */}

              <div>
                <button
                  type="button"
                  className="btn btn-accent-secondary rounded me-2"
                  onClick={() => {
                    form.reset();
                    // setSubjectsList([]);
                  }}
                  disabled={form.formState.isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary rounded"
                  disabled={form.formState.isSubmitting} // || subjectsList.length === 0}
                >
                  {form.formState.isSubmitting ? (
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
          {tests && tests.length > 0 ? (
            <div>
              {tests.map((test, index) => (
                <div
                  key={index}
                  className={`card p-4 ps-md-4 mt-3 ${
                    tests.length === index + 1 ? "" : "mb-2"
                  }`}
                >
                  <h6>
                    {test.testYear.year} - {test.texttype.testtype}
                  </h6>
                  <div className="mb-3">
                    <p className="fw-bold text-primary mb-0">Subjects</p>
                    <div>
                      {test.testSubject.length > 0 ? (
                        test.testSubject.map((subject, index) => (
                          <div
                            key={index}
                            className={`badge bg-secondary-light text-secondary mt-2 p-2 px-3 ${
                              test.testSubject.length === index + 1
                                ? ""
                                : "me-2"
                            }`}
                          >
                            {subject.subjectname}
                          </div>
                        ))
                      ) : (
                        <p
                          className="p-3 text-light text-center bg-primary-light my-3 rounded"
                          style={{ background: "var(--bgDarkerColor)" }}
                        >
                          No subjects added, subjects added will appear here
                        </p>
                      )}
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
                        setTesttoDelete(test);
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
            {testtoDelete?.testYear.year} - {testtoDelete?.texttype.testtype}
          </h5>
          <div className="mt-4">
            <button
              className="btn btn-primary me-2 rounded"
              onClick={() => {
                if (testtoDelete?.id) {
                  deleteTest(testtoDelete.id);
                }
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
