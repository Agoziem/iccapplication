"use client";
import React, { useEffect, useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import SubjectDetails from "./SubjectDetails";
import QuestionForm from "./QuestionForm";
import { useOrganization } from "@/data/hooks/organization.hooks";
import { ORGANIZATION_ID } from "@/data/constants";
import { useTest } from "@/data/hooks/cbt.hooks";
import { Subject, Test as TestType } from "@/types/cbt";
import { useParams } from "next/navigation";

const Test: React.FC = () => {
  const { testID } = useParams() as { testID: string };
  const { data: OrganizationData } = useOrganization(parseInt(ORGANIZATION_ID || "0"));
  const [currentSubject, setCurrentSubject] = useState<Subject | null>(null);
  const { data: testData } = useTest(testID ? parseInt(testID) : 0);
  const [test, setTest] = useState<TestType | null>(null);

  useEffect(() => {
    if (testData) {
      setTest(testData);
    }
  }, [testData]);

  useEffect(() => {
    if (test && test.testSubject && test.testSubject.length > 0) {
      setCurrentSubject(test.testSubject[0]);
    }
  }, [test]);

  return (
    <>
      {!test ? (
        <div className="card p-3">No test available</div>
      ) : (
        <div className="row mt-5">
          <div className="col-12 col-md-4">
            {/* The test details Card */}
            <div className="card p-3">
              <h6 className="mb-1">{OrganizationData?.name || "Organization"}</h6>
              <hr />
              <div className="d-flex">
                <div
                  className="rounded-circle d-flex justify-content-center align-items-center bg-secondary-light text-secondary me-3"
                  style={{ width: "50px", height: "50px", fontSize: "20px" }}
                >
                  <FaQuestionCircle className="mb-0" />
                </div>
                <div className="flex-fill">
                  <p className="mb-1 text-secondary">{test.testYear?.year}</p>
                  <h6>{test.texttype?.testtype}</h6>
                </div>
              </div>
            </div>
            {/* The test Subjects details */}
            <div className="mt-2">
              {test && (
                <SubjectDetails
                  test={test}
                  setTest={setTest as any}
                  subjects={test.testSubject || []}
                  setCurrentSubject={setCurrentSubject}
                />
              )}
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
              {test && (
                <QuestionForm
                  test={test}
                  setTest={setTest}
                  currentSubject={currentSubject}
                  setCurrentSubject={setCurrentSubject}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Test;

