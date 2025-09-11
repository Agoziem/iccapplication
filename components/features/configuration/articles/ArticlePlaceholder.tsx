import React from "react";
import { MdOutlineArticle } from "react-icons/md";

const ArticlePlaceholder = ({
  width = 90,
  height = 90,
  fontSize = "2rem",
}) => {
  return (
    <div
      className="d-flex justify-content-center align-items-center rounded"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        fontSize: fontSize,
        backgroundColor: "var(--bgDarkColor)",
        color: "var(--bgDarkerColor)",
        flexShrink: 0, // Prevents shrinking
        overflow: "hidden", // Ensures content fits within the container
      }}
    >
      <MdOutlineArticle />
    </div>
  );
};

export default ArticlePlaceholder;
