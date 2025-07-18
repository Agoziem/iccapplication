"use client";
import PageTitle from "@/components/custom/PageTitle/PageTitle";
import React, { useContext, useEffect, useState } from "react";
import CbtForm from "@/components/features/cbt/CbtForm";
import CbtQuiz from "@/components/features/cbt/CbtQuiz";
import { useFetchOrganization } from "@/data/organization/organization.hook";

const CbtPage = () => {
  const { data: OrganizationData } = useFetchOrganization();
  const [examdetails, setExamDetails] = useState({
    user_id: "",
    test_id: "",
    examSubjects: [],
  });
  const [loading, setLoading] = useState(false);
  const [testmode, setTestMode] = useState(false);
  const [Test, setTest] = useState({});

  // --------------------------------------------------------
  // send Exam details to backend to fetch the Test
  // --------------------------------------------------------
  const sendExamDetails = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/CBTapi/practicetest/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(examdetails),
        }
      );
      const data = await response.json();
      setTest(data);
      setTestMode(true);
      setLoading(false)
    } catch (error) {
      console.error("Error sending exam details", error);
      setLoading(false)
    }
  };

  return (
    <div style={{minHeight:"100vh"}}>
      <PageTitle pathname="CBT practice" />

      {/* quiz component */}
      {loading ? <div>Loading...</div> : null}

      <section className="h-100">
      {!testmode ? (
        <CbtForm
          OrganizationData={OrganizationData}
          sendExamDetails={sendExamDetails}
          examdetails={examdetails}
          setExamDetails={setExamDetails}
        />
      ) : (
        <CbtQuiz Test={Test} setTestMode={setTestMode} />
      )}
      </section>
      
    </div>
  );
};

export default CbtPage;
