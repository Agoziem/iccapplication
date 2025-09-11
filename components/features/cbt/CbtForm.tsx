import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MultiSelectDropdown } from "@/components/custom/Multiselectinput/MultiSelect";
import Alert from "@/components/custom/Alert/Alert";

// Zod validation schema
const cbtFormSchema = z.object({
  test_id: z.number()
    .min(1, "Please select an exam")
    .refine(val => !isNaN(val), "Invalid exam selected"),
  
  examSubjects: z.array(z.any())
    .min(1, "Please select at least one subject")
    .max(10, "Maximum 10 subjects can be selected")
});

const CbtForm = ({
  OrganizationData,
  examdetails,
  setExamDetails,
  sendExamDetails,
}) => {
  const { data: session } = useSession();
  const [exams, setExams] = useState([]);
  const [examType, setExamType] = useState(null);
  const [examSubjects, setExamSubjects] = useState([]);
  const [loadingExams, setLoadingExams] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "",
  });

  // React Hook Form setup
  const {
    control,
    handleSubmit: handleFormSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm({
    resolver: zodResolver(cbtFormSchema),
    defaultValues: {
      test_id: 0,
      examSubjects: []
    },
    mode: "onChange"
  });

  const watchedTestId = watch("test_id");

  // Error handler
  const showAlert = useCallback((message, type = "danger") => {
    setAlert({
      show: true,
      message,
      type,
    });

    setTimeout(() => {
      setAlert({
        show: false,
        message: "",
        type: "",
      });
    }, 5000);
  }, []);

  // Safe fetch exams with error handling
  const fetchExams = useCallback(async () => {
    if (!OrganizationData?.id) {
      showAlert("Organization data not available", "warning");
      return;
    }

    setLoadingExams(true);
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/CBTapi/tests/${OrganizationData.id}`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (Array.isArray(data)) {
        setExams(data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching exam years:", error);
      showAlert("Failed to load exams. Please try again.", "danger");
      setExams([]);
    } finally {
      setLoadingExams(false);
    }
  }, [OrganizationData?.id, showAlert]);

  // Safe function to change the exam type
  const changeExamtype = useCallback((examid) => {
    try {
      const examIdNum = parseInt(examid);
      const exam = exams.find((exam) => exam?.id === examIdNum);
      
      if (exam?.texttype?.testtype) {
        setExamType(exam.texttype.testtype);
      } else {
        setExamType(null);
        console.warn("Exam type not found for exam ID:", examid);
      }
    } catch (error) {
      console.error("Error changing exam type:", error);
      setExamType(null);
    }
  }, [exams]);

  // Safe function to change the exam subjects
  const changeExamSubjects = useCallback((examid) => {
    try {
      const examIdNum = parseInt(examid);
      const exam = exams.find((exam) => exam?.id === examIdNum);
      
      if (exam?.testSubject && Array.isArray(exam.testSubject)) {
        setExamSubjects(exam.testSubject);
        setValue("examSubjects", []); // Reset selected subjects
      } else {
        setExamSubjects([]);
        setValue("examSubjects", []);
        console.warn("Exam subjects not found for exam ID:", examid);
      }
    } catch (error) {
      console.error("Error changing exam subjects:", error);
      setExamSubjects([]);
      setValue("examSubjects", []);
    }
  }, [exams, setValue]);

  // Fetch exams when component mounts or OrganizationData changes
  useEffect(() => {
    fetchExams();
    
    // Safely set exam details with user ID
    if (session?.user?.id && setExamDetails) {
      setExamDetails(prevDetails => ({
        ...prevDetails,
        user_id: session.user.id
      }));
    }
  }, [fetchExams, session?.user?.id, setExamDetails]);

  // Watch for test_id changes to update exam type and subjects
  useEffect(() => {
    if (watchedTestId && watchedTestId > 0) {
      changeExamtype(watchedTestId);
      changeExamSubjects(watchedTestId);
    } else {
      setExamType(null);
      setExamSubjects([]);
    }
  }, [watchedTestId, changeExamtype, changeExamSubjects]);

  // Submit handler with validation
  const onSubmit = useCallback(async (data) => {
    if (!session?.user) {
      showAlert("Please log in to take the exam", "warning");
      return;
    }

    if (!sendExamDetails || typeof sendExamDetails !== 'function') {
      showAlert("Unable to proceed. Please try again.", "danger");
      return;
    }

    setSubmitting(true);
    
    try {
      // Update exam details with validated form data
      const updatedExamDetails = {
        ...examdetails,
        test_id: data.test_id,
        examSubjects: data.examSubjects,
        user_id: session.user.id
      };

      setExamDetails(updatedExamDetails);
      
      // Call the parent's submit handler
      await sendExamDetails();
      
      showAlert("Exam started successfully!", "success");
    } catch (error) {
      console.error("Error submitting exam details:", error);
      showAlert("Failed to start exam. Please try again.", "danger");
    } finally {
      setSubmitting(false);
    }
  }, [session, examdetails, setExamDetails, sendExamDetails, showAlert]);

  return (
    <div
      className="row justify-content-between mx-auto my-4 mt-5"
      style={{
        width: "100%",
        maxWidth: "800px",
        borderRadius: "15px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        backgroundColor: "var(--bgLightColor)",
      }}
    >
      {/* The Image */}
      <div className="col-12 col-md-5 p-0 d-none d-md-block">
        <div
          className="p-0"
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <Image
            src="/back to School images.avif"
            alt="cbt practice image"
            style={{
              objectFit: "cover",
              width: "100%",
              height: "100%",
              borderRadius: "15px 0 0 15px",
            }}
            width={500}
            height={500}
            priority
          />
        </div>
      </div>

      {/* The Form */}
      <div className="col-12 col-md-7 p-3 py-5 px-md-5">
        <div className="px-3 px-md-5">
          <div className="my-3 text-center">
            <h3>CBT Practice Portal</h3>
            <p>
              Practice and prepare for any exam of your choice as much as you can
            </p>
          </div>
          
          <form onSubmit={handleFormSubmit(onSubmit)} noValidate>
            {/* Exam Selection */}
            <div className="my-3">
              <label className="form-label fw-bold">
                Exams Available <span className="text-danger">*</span>
              </label>
              <Controller
                name="test_id"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <select
                    className={`form-select ${errors.test_id ? 'is-invalid' : ''}`}
                    onChange={(e) => {
                      const selectedValue = parseInt(e.target.value) || 0;
                      onChange(selectedValue);
                    }}
                    value={value || ""}
                    disabled={loadingExams || submitting}
                  >
                    <option value="">Choose any Exam</option>
                    {!loadingExams ? (
                      exams?.length > 0 ? (
                        exams.map((exam) => (
                          <option key={exam?.id} value={exam?.id}>
                            {exam?.name || 'Unknown Exam'} {exam?.texttype?.testtype || ''}{" "}
                            {exam?.testYear?.year || ''}
                          </option>
                        ))
                      ) : (
                        <option disabled>No Exam Available</option>
                      )
                    ) : (
                      <option disabled>Loading exams...</option>
                    )}
                  </select>
                )}
              />
              {errors.test_id && (
                <div className="invalid-feedback">
                  {errors.test_id.message}
                </div>
              )}
            </div>

            {/* Exam Type Display */}
            <div className="my-3">
              <label className="form-label">Exam Type</label>
              <input
                type="text"
                className="form-control"
                value={examType || ""}
                placeholder="Select an exam to see type"
                readOnly
              />
            </div>

            {/* Subjects Selection */}
            <div className="my-3">
              <label className="form-label">
                Exam Subjects <span className="text-danger">*</span>
              </label>
              <Controller
                name="examSubjects"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <div>
                    {(!watchedTestId || submitting) ? (
                      <div className="form-control bg-light text-muted">
                        {!watchedTestId ? 'Please select an exam first to load subjects' : 'Loading subjects...'}
                      </div>
                    ) : (
                      <MultiSelectDropdown
                        initiallist={examSubjects}
                        currentlist={value || []}
                        setCurrentlist={onChange}
                        itemName="Subjects"
                      />
                    )}
                    {errors.examSubjects && (
                      <div className="invalid-feedback d-block">
                        {errors.examSubjects.message}
                      </div>
                    )}
                  </div>
                )}
              />
              {!watchedTestId && (
                <small className="text-muted">
                  Please select an exam first to load subjects
                </small>
              )}
            </div>

            {/* Alert Display */}
            <div className="my-2">
              {alert.show && (
                <div className="position-relative">
                  <Alert type={alert.type}>
                    {alert.message}
                  </Alert>
                  <button
                    type="button"
                    className="btn-close position-absolute top-0 end-0 mt-2 me-2"
                    onClick={() => setAlert({ show: false, message: "", type: "" })}
                    aria-label="Close"
                  ></button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="my-4">
              <button 
                type="submit"
                className="btn btn-primary w-100"
                disabled={loadingExams || submitting || !isValid}
              >
                {submitting && (
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                )}
                {submitting ? 'Starting Practice...' : 'Start Practice'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CbtForm;
