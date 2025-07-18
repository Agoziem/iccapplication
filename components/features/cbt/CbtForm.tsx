import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { MultiSelectDropdown } from "@/components/custom/Multiselectinput/MultiSelect";
import Alert from "@/components/custom/Alert/Alert";

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
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "",
  });

  const fetchExams = async () => {
    setLoadingExams(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/CBTapi/tests/${OrganizationData?.id}`
      );
      const data = await response.json();
      setExams(data);
      setLoadingExams(false);
    } catch (error) {
      console.error("Error fetching exam years", error);
      setLoadingExams(false);
    }
  };

  // -------------------------------------------------------
  // function to change the exam type
  // -------------------------------------------------------
  const changeExamtype = (examid) => {
    const exam = exams.find((exam) => exam.id === parseInt(examid));
    setExamType(exam?.texttype.testtype);
  };

  // -------------------------------------------------------
  // function to change the exam subjects
  // -------------------------------------------------------
  const changeExamSubjects = (examid) => {
    const exam = exams.find((exam) => exam.id === parseInt(examid));
    setExamSubjects(exam?.testSubject);
  };

  // -------------------------------------------------------
  // fetch exams
  // -------------------------------------------------------
  useEffect(() => {
    if (!OrganizationData?.id) return;
    fetchExams();
    setExamDetails({ ...examdetails, user_id: session?.user.id });
  }, [OrganizationData?.id, session?.user.id]);

  // -------------------------------------------------------
  // Submit the exam details
  // -------------------------------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!examdetails.test_id || examdetails.examSubjects.length === 0) {
      setAlert({
        show: true,
        message: "Please select an exam or exam subjects to continue",
        type: "danger",
      });
      setTimeout(() => {
        setAlert({
          show: false,
          message: "",
          type: "",
        });
      }, 3000)
      return;
    }
    setExamDetails((prev) => ({
      ...prev,
      examSubjects: [],
    }));
    sendExamDetails();
  };

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
          />
        </div>
      </div>

      {/* The Form */}
      <div className="col-12 col-md-7 p-3 py-5 px-md-5">
        <div className="px-3 px-md-5">
          <div className="my-3 text-center">
            <h3>CBT practice portal</h3>
            <p>
              practice and prepare for any Exam of your choice as much as you
              can
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="my-3">
              <label className="form-label fw-bold">Exams Available</label>
              <select
                className="form-select"
                onChange={(e) => {
                  setExamDetails({
                    ...examdetails,
                    test_id: parseInt(e.target.value),
                  });
                  changeExamtype(e.target.value);
                  changeExamSubjects(e.target.value);
                }}
              >
                <option>Choose any Exam </option>
                {!loadingExams ? (
                  exams?.length > 0 ? (
                    exams.map((exam) => (
                      <option key={exam.id} value={exam.id}>
                        {exam.name} {exam.texttype.testtype}{" "}
                        {exam.testYear.year}
                      </option>
                    ))
                  ) : (
                    <option> No Exam Available</option>
                  )
                ) : (
                  <option> loading exams...</option>
                )}
              </select>
            </div>

            <div className="my-3">
              <label className="form-label">Exam Type</label>
              <input
                type="text"
                className="form-control"
                value={examType ? examType : ""}
                placeholder="Exam Type"
                readOnly
              />
            </div>

            <div className="my-3">
              <label className="form-label">Exams Subjects</label>
              <MultiSelectDropdown
                initiallist={examSubjects}
                currentlist={examdetails.examSubjects}
                setCurrentlist={(list) =>
                  setExamDetails({ ...examdetails, examSubjects: list })
                }
                itemName="Subjects"
              />
            </div>
            <div className="my-2">
              {alert.show && <Alert type={alert.type}>{alert.message}</Alert>}
            </div>

            <div className="my-4">
              <button className="btn btn-primary w-100">Start Practice</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CbtForm;
