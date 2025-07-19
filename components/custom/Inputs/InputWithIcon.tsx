import React, { ChangeEvent } from "react";

interface InputWithIconProps {
  type: string;
  name: string;
  value: string;
  placeholder?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  icon: string;
  required?: boolean;
}

const InputWithIcon = ({
  type,
  name,
  value,
  placeholder,
  onChange,
  icon,
  required = false,
}: InputWithIconProps) => {
  return (
    <div className="input-group my-3">
      <span className="input-group-text">
        <i className={`bi ${icon}`}></i>
      </span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="form-control"
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
};

export default InputWithIcon;
