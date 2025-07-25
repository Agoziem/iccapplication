import React from "react";
import { MdOutlineArticle } from "react-icons/md";

interface ArticlePlaceholderProps {
  width?: number;
  height?: number;
  fontSize?: string;
}

const ArticlePlaceholder: React.FC<ArticlePlaceholderProps> = ({
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
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      <MdOutlineArticle />
    </div>
  );
};

export default ArticlePlaceholder;
