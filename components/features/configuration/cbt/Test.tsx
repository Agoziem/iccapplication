"use client";
import React, { useContext, useEffect, useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import SubjectDetails from "./SubjectDetails";
import QuestionForm from "./QuestionForm";
import { useFetchOrganization } from "@/data/organization/organization.hook";

const Test = ({ testID }) => {
  const { data: OrganizationData } = useFetchOrganization();
  const [test, setTest] = useState(null);
  const [currentSubject, setCurrentSubject] = useState(null);

  const fetchTest = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/CBTapi/test/${testID}`
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error("An error occurred while fetching the test");
      }
      setTest(data);
      setCurrentSubject(data.testSubject[0]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (testID && OrganizationData.id) fetchTest();
  }, [testID, OrganizationData.id]);

  return (
    <>
      {Object.keys.length === 0 ? (
        <div className="card p-3">No test available</div>
      ) : (
        <div className="row mt-5">
          <div className="col-12 col-md-4">
            {/* The test details Card */}
            <div className="card p-3">
              <h6 className="mb-1">{OrganizationData.name}</h6>
              <hr />
              <div className="d-flex">
                <div
                  className="rounded-circle d-flex justify-content-center align-items-center bg-secondary-light text-secondary me-3"
                  style={{ width: "50px", height: "50px", fontSize: "20px" }}
                >
                  <FaQuestionCircle className="mb-0" />
                </div>
                <div className="flex-fill">
                  <p className="mb-1 text-secondary">{test?.testYear?.year}</p>
                  <h6>{test?.texttype?.testtype}</h6>
                </div>
              </div>
            </div>
            {/* The test Subjects details */}
            <div className="mt-2">
              <SubjectDetails
                test={test}
                setTest={setTest}
                subjects={test?.testSubject}
                setCurrentSubject={setCurrentSubject}
              />
            </div>
          </div>
          <div className="col-12 col-md-8">
            <h4 className="text-center">
              {currentSubject?.subjectname}{" "}
              {currentSubject?.subjectduration &&
                `| ${currentSubject?.subjectduration} minutes`}
            </h4>
            {/* The QuestionForm */}
            <div>
              <QuestionForm
                test={test}
                setTest={setTest}
                currentSubject={currentSubject}
                setCurrentSubject={setCurrentSubject}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Test;

// //   {
//     "id": 3,
//     "testYear": {
//         "id": 3,
//         "year": 2021
//     },
//     "texttype": {
//         "id": 4,
//         "testtype": "WEAC"
//     },
//     "testSubject": [
//         {
//             "id": 6,
//             "questions": [],
//             "subjectduration": 0,
//             "subjectname": "Mathematics"
//         },
//         {
//             "id": 7,
//             "questions": [],
//             "subjectduration": 0,
//             "subjectname": "English"
//         },
//         {
//             "id": 8,
//             "questions": [],
//             "subjectduration": 0,
//             "subjectname": "Igbo language"
//         },
//         {
//             "id": 9,
//             "questions": [],
//             "subjectduration": 0,
//             "subjectname": "Chemistry"
//         }
//     ],
//     "testorganization": 1
// }
