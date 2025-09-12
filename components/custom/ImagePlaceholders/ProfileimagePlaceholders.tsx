import React from 'react';

interface ProfileImagePlaceholderProps {
  firstname?: string;
  width?: number;
  height?: number;
  fontSize?: string | number;
  className?: string;
  style?: React.CSSProperties;
  fallbackText?: string;
}

const ProfileimagePlaceholders: React.FC<ProfileImagePlaceholderProps> = ({
  firstname,
  width = 68,
  height = 68,
  fontSize = "1.8rem",
  className = "",
  style = {},
  fallbackText = "U"
}) => {
  const getInitial = (): string => {
    if (firstname && firstname.trim()) {
      return firstname.charAt(0).toUpperCase();
    }
    return fallbackText;
  };

  return (
    <div
      className={`d-flex justify-content-center align-items-center ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        borderRadius: "50%",
        backgroundColor: "var(--bgDarkerColor)",
        color: "white",
        fontSize: fontSize,
        overflow: "hidden",
        flexShrink: 0,
        ...style
      }}
    >
      {getInitial()}
    </div>
  );
};

export default ProfileimagePlaceholders