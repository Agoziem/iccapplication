"use client";
import React, { useState } from "react";

const DatatableinputFilter = ({
  filterInput,
  setfilterInput,
  filteritemlabel,
}) => {
  const handleInputChange = (e) => {
    setfilterInput(e.target.value);
  };

  return (
    <div>
      <input
        type="text"
        placeholder={`Search by ${filteritemlabel}`}
        className="form-control"
        value={filterInput}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default DatatableinputFilter;
