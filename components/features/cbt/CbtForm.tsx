import Image from "next/image";
import React, { useEffect, useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MultiSelectDropdown } from "@/components/custom/Multiselectinput/MultiSelect";
import Alert from "@/components/custom/Alert/Alert";
import { Test, Subject, StudentTestRequest } from "@/types/cbt";
import { useMyProfile } from "@/data/hooks/user.hooks";
import { usePracticeTest, useTests } from "@/data/hooks/cbt.hooks";
import { ORGANIZATION_ID } from "@/data/constants";

interface MultiSelectItem {
  id: number;
  subjectname: string;
}

interface AlertState {
  show: boolean;
  message: string;
  type: "success" | "danger" | "warning" | "info";
}


interface CbtFormProps {
  setTest: (test: Test | null) => void;
}

// Zod validation schema
const cbtFormSchema = z.object({
  test_id: z
    .number()
    .min(1, "Please select an exam")
    .refine((val) => !isNaN(val), "Invalid exam selected"),

  examSubjects: z
    .array(z.any())
    .min(1, "Please select at least one subject")
    .max(10, "Maximum 10 subjects can be selected"),
});

type CbtFormData = z.infer<typeof cbtFormSchema>;

const CbtForm: React.FC<CbtFormProps> = ({
  setTest,
}) => {
  const { data: user } = useMyProfile();
  const [examType, setExamType] = useState<string | null>(null);
  const [examSubjects, setExamSubjects] = useState<Subject[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    message: "",
    type: "info",
  });
  const { data: exams , isLoading: loadingExams } = useTests(parseInt(ORGANIZATION_ID) || null);
  const { mutateAsync: startExam, isLoading: startingExam } = usePracticeTest(); // hook to start Exam

  // Helper function to convert Subject[] to MultiSelectItem[]
  const subjectsToMultiSelectItems = (
    subjects: Subject[]
  ): MultiSelectItem[] => {
    return subjects
      .filter(
        (subject): subject is Subject & { id: number } =>
          subject.id !== undefined
      )
      .map((subject) => ({
        id: subject.id,
        subjectname: subject.subjectname,
      }));
  };

  // React Hook Form setup
  const {
    control,
    handleSubmit: handleFormSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<CbtFormData>({
    resolver: zodResolver(cbtFormSchema),
    defaultValues: {
      test_id: 0,
      examSubjects: [],
    },
    mode: "onChange",
  });

  const watchedTestId = watch("test_id");

  // Error handler
  const showAlert = useCallback(
    (message: string, type: AlertState["type"] = "danger") => {
      setAlert({
        show: true,
        message,
        type,
      });

      setTimeout(() => {
        setAlert({
          show: false,
          message: "",
          type: "info",
        });
      }, 5000);
    },
    []
  );


  // Safe function to change the exam type
  const changeExamtype = useCallback(
    (examid: number) => {
      try {
        if (!exams || !Array.isArray(exams)) {
          setExamType(null);
          return;
        }

        const examIdNum =
          typeof examid === "number" ? examid : parseInt(String(examid));
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
    },
    [exams]
  );

  // Safe function to change the exam subjects
  const changeExamSubjects = useCallback(
    (examid: number) => {
      try {
        if (!exams || !Array.isArray(exams)) {
          setExamSubjects([]);
          setValue("examSubjects", []);
          return;
        }

        const examIdNum =
          typeof examid === "number" ? examid : parseInt(String(examid));
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
    },
    [exams, setValue]
  );



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
  const onSubmit = useCallback(
    async (data: CbtFormData) => {
      if (!user) {
        showAlert("Please log in to take the exam", "warning");
        return;
      }

      setSubmitting(true);

      try {
        // Update exam details with validated form data
        const updatedExamDetails: StudentTestRequest = {
          test_id: data.test_id,
          examSubjects: data.examSubjects,
          user_id: user.id as number,
        };

        
        // Use the startExam mutation to start the exam
        const result = await startExam(updatedExamDetails);
        setTest(result);

        showAlert("Exam started successfully!", "success");
        
        // You can handle the result here if needed
        // For example, redirect to exam page or update state
        console.log("Exam started with result:", result);
        
      } catch (error) {
        console.error("Error submitting exam details:", error);
        showAlert("Failed to start exam. Please try again.", "danger");
      } finally {
        setSubmitting(false);
      }
    },
    [user, startExam, showAlert]
  );

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
              Practice and prepare for any exam of your choice as much as you
              can
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
                    className={`form-select ${
                      errors.test_id ? "is-invalid" : ""
                    }`}
                    onChange={(e) => {
                      const selectedValue = parseInt(e.target.value) || 0;
                      onChange(selectedValue);
                    }}
                    value={value || ""}
                    disabled={loadingExams || submitting}
                  >
                    <option value="">Choose any Exam</option>
                    {!loadingExams ? (
                      exams && exams.length > 0 ? (
                        exams.map((exam) => (
                          <option key={exam?.id} value={exam?.id}>
                            {exam?.texttype?.testtype || "Unknown Exam"}{" "}
                            {exam?.testYear?.year || ""}
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
                <div className="invalid-feedback">{errors.test_id.message}</div>
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
                    {!watchedTestId || submitting ? (
                      <div className="form-control bg-light text-muted">
                        {!watchedTestId
                          ? "Please select an exam first to load subjects"
                          : "Loading subjects..."}
                      </div>
                    ) : (
                      <MultiSelectDropdown
                        initiallist={subjectsToMultiSelectItems(examSubjects)}
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
                  <Alert type={alert.type}>{alert.message}</Alert>
                  <button
                    type="button"
                    className="btn-close position-absolute top-0 end-0 mt-2 me-2"
                    onClick={() =>
                      setAlert({ show: false, message: "", type: "info" })
                    }
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
                disabled={loadingExams || submitting || startingExam || !isValid}
              >
                {(submitting || startingExam) && (
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )}
                {submitting || startingExam ? "Starting Practice..." : "Start Practice"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CbtForm;
