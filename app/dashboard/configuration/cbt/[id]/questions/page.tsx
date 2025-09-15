import PageTitle from "@/components/custom/PageTitle/PageTitle";
import Test from "@/components/features/configuration/cbt/Test";
import React from "react";

const AddingQuestionPage = () => {
  return (
    <div style={{ minHeight: "100vh" }}>
      <PageTitle pathname="subject-questions" />
      <div>
        <Test />
      </div>
    </div>
  );
};

export default AddingQuestionPage;
