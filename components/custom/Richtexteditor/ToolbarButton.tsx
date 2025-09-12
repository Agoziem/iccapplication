import React from 'react';
import { IconType } from 'react-icons';

interface ToolbarButtonProps {
  onClick: () => void;
  isActive: boolean;
  Icon: IconType;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  title?: string;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ 
  onClick, 
  isActive, 
  Icon,
  className = "",
  style = {},
  disabled = false,
  title
}) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`${
        isActive ? "bg-secondary-light p-2 rounded" : "rounded p-2"
      } ${disabled ? "opacity-50" : ""} ${className}`}
      style={{ 
        cursor: disabled ? "not-allowed" : "pointer",
        color: isActive ? "var(--secondary)" : "var(--primary)",
        ...style
      }}
      role="button"
      tabIndex={disabled ? -1 : 0}
      title={title}
      aria-pressed={isActive}
      aria-disabled={disabled}
    >
      <Icon className="h5 my-0" />
    </div>
  );
};

export default ToolbarButton;
