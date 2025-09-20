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
  const { id } = useParams() as { id: string };
  const { data: OrganizationData } = useOrganization(
    parseInt(ORGANIZATION_ID || "0")
  );
  const [currentSubject, setCurrentSubject] = useState<Subject | null>(null);
  const { data: testData } = useTest(id ? parseInt(id) : 0);

  useEffect(() => {
    if (testData && testData.testSubject && testData.testSubject.length > 0) {
      setCurrentSubject(testData.testSubject[0]);
    }
  }, [testData]);

  return (
    <>
      {!testData ? (
        <div className="card p-3">No test available</div>
      ) : (
        <div className="row mt-5">
          <div className="col-12 col-md-5">
            {/* The test details Card */}
            <div className="card p-3">
              <h6 className="mb-1">
                {OrganizationData?.name || "Organization"}
              </h6>
              <hr />
              <div className="d-flex">
                <div
                  className="rounded-circle d-flex justify-content-center align-items-center bg-secondary-light text-secondary me-3"
                  style={{ width: "50px", height: "50px", fontSize: "20px" }}
                >
                  <FaQuestionCircle className="mb-0" />
                </div>
                <div className="flex-fill">
                  <p className="mb-1 text-secondary">
                    {testData.testYear?.year}
                  </p>
                  <h6>{testData.texttype?.testtype}</h6>
                </div>
              </div>
            </div>
            {/* The test Subjects details */}
            <div className="mt-2">
              {testData && (
                <SubjectDetails
                  currentSubject={currentSubject}
                  setCurrentSubject={setCurrentSubject}
                />
              )}
            </div>
          </div>
          <div className="col-12 col-md-7">
            <h4 className="text-center">
              {currentSubject?.subjectname}{" "}
              {currentSubject?.subjectduration &&
                `| ${currentSubject?.subjectduration} minutes`}
            </h4>
            {/* The QuestionForm */}
            <div>
              {testData && (
                <QuestionForm
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
