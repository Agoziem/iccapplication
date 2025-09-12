import React from "react";

interface ApplicationPlaceholderProps {
  width?: number;
  height?: number;
  fontSize?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

const ApplicationPlaceholder: React.FC<ApplicationPlaceholderProps> = ({
  width = 68,
  height = 68,
  fontSize = "1.5rem",
  className = "",
  style = {}
}) => {
  return (
    <div
      className={`d-flex justify-content-center align-items-center ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        borderRadius: "50%",
        backgroundColor: "var(--bgDarkColor)",
        color: "var(--bgDarkerColor)",
        fontSize: fontSize,
        overflow: "hidden",
        flexShrink: 0,
        ...style
      }}
    >
      <i className="bi bi-google-play h4 mb-0" />
    </div>
  );
};

export default ApplicationPlaceholder;
