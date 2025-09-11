"use client";
import React, { useState } from "react";
import Aggregator from "./Aggregator";
import CGPA from "./CGPA";

const Calculators = () => {
  const categories = ["Aggregator", "CGPA Calculator"];
  const [activeTab, setActiveTab] = useState(categories[0]);
  return (
    <div className="py-3">
      {/* Category Tabs */}
      {categories.map((category) => (
        <div
          key={category}
          className={`badge rounded-5 px-4 py-2 me-2 mb-2 mb-md-0`}
          style={{
            color:
              activeTab === category ? "var(--secondary)" : "var(--primary)",
            backgroundColor:
              activeTab === category ? "var(--secondary-300)" : " ",
            border:
              activeTab === category
                ? "1.5px solid var(--secondary)"
                : "1.5px solid var(--bgDarkerColor)",
            cursor: "pointer",
          }}
          onClick={() => setActiveTab(category)}
        >
          {category}
        </div>
      ))}

      {/* Calculators */}
      <div className="mt-4">
        {activeTab === "Aggregator" && <div><Aggregator /></div>}
        {activeTab === "CGPA Calculator" && <div><CGPA /></div>}
      </div>
    </div>
  );
};

export default Calculators;
