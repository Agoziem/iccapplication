import React from "react";

interface InputWithIconProps {
  type: React.HTMLInputTypeAttribute;
  name: string;
  value: string | number;
  placeholder?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  icon: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

const InputWithIcon: React.FC<InputWithIconProps> = ({
  type,
  name,
  value,
  placeholder = "",
  onChange,
  icon,
  required = false,
  disabled = false,
  className = "",
  style = {},
  onBlur,
  onFocus
}) => {
  return (
    <div className={`input-group my-3 ${className}`} style={style}>
      <span className="input-group-text">
        <i className={`bi ${icon}`} />
      </span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        className="form-control"
        placeholder={placeholder}
        required={required}
        disabled={disabled}
      />
    </div>
  );
};

export default InputWithIcon;
