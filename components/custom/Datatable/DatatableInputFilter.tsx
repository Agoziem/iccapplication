"use client";
import React, { ChangeEvent } from "react";

interface DatatableInputFilterProps {
  filterInput: string;
  setfilterInput: (value: string) => void;
  filteritemlabel: string;
}

const DatatableinputFilter: React.FC<DatatableInputFilterProps> = ({
  filterInput,
  setfilterInput,
  filteritemlabel,
}) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
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
