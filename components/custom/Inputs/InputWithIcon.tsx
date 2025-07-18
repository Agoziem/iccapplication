import React, { useState } from "react";

const InputWithIcon = ({
  type,
  name,
  value,
  placeholder,
  onChange,
  icon,
  required = false,
}) => {
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
