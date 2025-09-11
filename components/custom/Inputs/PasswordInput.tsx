import React, { useState } from "react";

const PasswordInput = ({ name, value, onChange, placeholder, formErrors }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="my-4">
      <div className="d-flex">
        <input
          name={name}
          type={showPassword ? "text" : "password"}
          className={`form-control ${formErrors?.[name] ? "is-invalid" : ""}`}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
        />
        <div
          className="d-flex align-items-center justify-content-center px-3 ms-1"
          style={{
            cursor: "pointer",
            fontSize: "1.4rem",
            backgroundColor: "var(--bgDarkColor)",
            borderRadius: "5px",
          }}
          onClick={toggleShowPassword}
        >
          {showPassword ? (
            <i className="bi bi-eye-slash-fill"></i>
          ) : (
            <i className="bi bi-eye-fill"></i>
          )}
        </div>
      </div>

      {formErrors?.[name] && (
        <div className="text-danger invalid-feedback">
          {formErrors[name]}
        </div>
      )}
    </div>
  );
};

export default PasswordInput;
