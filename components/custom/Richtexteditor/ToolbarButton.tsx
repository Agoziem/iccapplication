import React, { MouseEvent } from 'react';

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  Icon: React.ComponentType<any>;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ onClick, isActive, Icon }) => {
  return (
    <div
      onClick={(e: MouseEvent) => {
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
