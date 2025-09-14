"use client";
import PageTitle from "@/components/custom/PageTitle/PageTitle";
import React, { useContext, useEffect, useState } from "react";
import CbtForm from "@/components/features/cbt/CbtForm";
import CbtQuiz from "@/components/features/cbt/CbtQuiz";
import { Test } from "@/types/cbt";

const CbtPage = () => {
  const [loading, setLoading] = useState(false);
  const [Test, setTest] = useState<Test | null>(null);

  return (
    <div style={{ minHeight: "100vh" }}>
      <PageTitle pathname="CBT practice" />

      {/* quiz component */}
      {loading ? <div>Loading...</div> : null}

      <section className="h-100">
        {!Test ? (
          <CbtForm setTest={setTest} />
        ) : (
          <CbtQuiz Test={Test} setTest={} />
        )}
      </section>
    </div>
  );
};

export default CbtPage;
