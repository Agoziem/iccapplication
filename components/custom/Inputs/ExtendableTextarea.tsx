import React, { useRef, useState, useEffect } from "react";

interface ExtendableTextareaProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  maxLength?: number;
  minHeight?: number;
  maxHeight?: number;
}

const ExtendableTextarea: React.FC<ExtendableTextareaProps> = ({ 
  value, 
  onChange, 
  placeholder = "", 
  className = "", 
  style = {}, 
  disabled = false,
  name,
  required = false,
  onBlur,
  onFocus,
  maxLength,
  minHeight = 40,
  maxHeight = 300
}) => {
  const [height, setHeight] = useState<number>(minHeight);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Adjust the height of the textarea based on its scrollHeight
  const handleTextGrow = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "0px"; // Reset height
      const scrollHeight = textarea.scrollHeight; // Get the actual height
      const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
      textarea.style.height = `${newHeight}px`; // Set the dynamic height
      setHeight(newHeight);
    }
  };

  // When value changes, adjust the textarea height
  useEffect(() => {
    if (textareaRef.current) {
      handleTextGrow();
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
      placeholder={placeholder}
      className={className}
      style={{ 
        ...style, 
        height: `${height}px`, 
        resize: "none", 
        overflow: "hidden",
        minHeight: `${minHeight}px`,
        maxHeight: `${maxHeight}px`
      }}
      disabled={disabled}
      required={required}
      maxLength={maxLength}
    />
  );
};

export default ExtendableTextarea;
