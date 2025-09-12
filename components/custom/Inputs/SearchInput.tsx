import React from "react";

interface SearchInputProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  itemlabel?: string;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

const SearchInput: React.FC<SearchInputProps> = ({ 
  searchQuery, 
  setSearchQuery, 
  itemlabel = "",
  className = "",
  placeholder,
  disabled = false,
  style = {}
}) => {
  const defaultPlaceholder = placeholder || `Search for ${itemlabel}`;

  return (
    <div
      className={`d-flex align-items-center rounded-pill overflow-hidden ${className}`}
      style={{
        border: "1.5px solid var(--bgDarkerColor)",
        background: "var(--bgDarkColor)",
        width: "100%",
        maxWidth: "400px",
        minWidth: "290px",
        ...style
      }}
    >
      <i className="bi bi-search text-primary ms-3" />
      <input
        type="text"
        className="form-control border-0"
        placeholder={defaultPlaceholder}
        value={searchQuery}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
        disabled={disabled}
        style={{
          color: "white",
        }}
      />
    </div>
  );
};

export default SearchInput;
