import React, { useRef, useState, useEffect } from "react";

/**
 * Extendable Textarea component that adjusts its height based on the content
 * 
 * @param {Object} props
 * @param {string} props.value - The value of the textarea.
 * @param {(event: React.ChangeEvent<HTMLTextAreaElement>) => void} props.onChange - Change handler for the textarea.
 * @param {string} props.placeholder - Placeholder text for the textarea.
 * @param {string} props.className - Additional classNames for the textarea.
 * @param {React.CSSProperties} props.style - Inline styles for the textarea.
 * @param {boolean} [props.disabled] - Whether the textarea is disabled.
 * 
 * @returns {JSX.Element}
 */
const ExtendableTextarea = ({ value, onChange, placeholder, className, style, disabled }) => {
  const [height, setHeight] = useState(0);
  const textareaRef = useRef(null);

  // Adjust the height of the textarea based on its scrollHeight
  const handleTextGrow = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "0px"; // Reset height
      const scrollHeight = textarea.scrollHeight; // Get the actual height
      textarea.style.height = `${scrollHeight}px`; // Set the dynamic height
      setHeight(scrollHeight);
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
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      style={{ ...style, height: `${height}px`, resize: "none", overflow: "hidden" }}
      disabled={disabled}
    />
  );
};

export default ExtendableTextarea;
