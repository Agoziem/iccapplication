import React from 'react'

const ProfileimagePlaceholders = ({
  firstname,
  width = 68,
  height = 68,
  fontSize = "1.8rem",
}) => {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        width: `${width}px`, // `68px` by default
        height: `${height}px`, // `68px` by default
        borderRadius: "50%",
        backgroundColor: "var(--bgDarkerColor)",
        color: "white",
        fontSize: fontSize, // `1.5rem` by default
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {firstname?.charAt(0).toUpperCase()}
    </div>
  )
}

export default ProfileimagePlaceholders