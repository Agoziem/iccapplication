import React, { useState } from "react";

interface PasswordInputProps {
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  formErrors?: Record<string, string>;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ 
  name, 
  value, 
  onChange, 
  placeholder = "Enter password", 
  formErrors = {},
  required = true,
  disabled = false,
  className = "",
  style = {},
  onBlur,
  onFocus
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const hasError = formErrors[name];

  return (
    <div className={`my-4 ${className}`} style={style}>
      <div className="d-flex">
        <input
          name={name}
          type={showPassword ? "text" : "password"}
          className={`form-control ${hasError ? "is-invalid" : ""}`}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
        />
        <div
          className="d-flex align-items-center justify-content-center px-3 ms-1"
          style={{
            cursor: disabled ? "not-allowed" : "pointer",
            fontSize: "1.4rem",
            backgroundColor: "var(--bgDarkColor)",
            borderRadius: "5px",
          }}
          onClick={disabled ? undefined : toggleShowPassword}
        >
          {showPassword ? (
            <i className="bi bi-eye-slash-fill" />
          ) : (
            <i className="bi bi-eye-fill" />
          )}
        </div>
      </div>

      {hasError && (
        <div className="text-danger invalid-feedback">
          {formErrors[name]}
        </div>
      )}
    </div>
  );
};

export default PasswordInput;
