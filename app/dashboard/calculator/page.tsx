import Calculators from "@/components/features/Calc/Calculators";
import PageTitle from "@/components/custom/PageTitle/PageTitle";
import React from "react";

const CalculatorPage = () => {
  return (
    <div style={{ minHeight: "100vh" }}>
      <PageTitle pathname="Calculators" />
      <div>
        <Calculators />
      </div>
    </div>
  );
};

export default CalculatorPage;
