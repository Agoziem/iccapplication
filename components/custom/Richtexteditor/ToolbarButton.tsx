import React from 'react';

const ToolbarButton = ({ onClick, isActive, Icon }) => {
  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={
        isActive ? "bg-secondary-light p-2 rounded" : "rounded"
      }
      style={{ cursor: "pointer",
        color: isActive ? "var(--secondary)" : "var(--primary)",
       }}
    >
      <Icon className="h5 my-0" />
    </div>
  );
};

export default ToolbarButton;
