import React, { ChangeEvent } from "react";

interface SearchInputProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  itemlabel?: string;
}

const SearchInput = ({ searchQuery, setSearchQuery, itemlabel = "" }: SearchInputProps) => {
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div
      className="d-flex align-items-center rounded-pill overflow-hidden"
      style={{
        border: "1.5px solid var(--bgDarkerColor)",
        background: "var(--bgDarkColor)",
        width: "100%",
        maxWidth: "400px",
        minWidth: "290px",
      }}
    >
      <i className="bi bi-search text-primary ms-3"></i>
      <input
        type="text"
        className="form-control border-0"
        placeholder={`Search for ${itemlabel}`}
        value={searchQuery}
        onChange={handleSearchChange}
        style={{
          color: "white",
        }}
      />
    </div>
  );
};

export default SearchInput;
