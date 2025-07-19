import React, { useRef, useState, useEffect, ChangeEvent, CSSProperties } from "react";

interface ExtendableTextareaProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
}

const ExtendableTextarea: React.FC<ExtendableTextareaProps> = ({ 
  value, 
  onChange, 
  placeholder, 
  className, 
  style, 
  disabled 
}) => {
  const [height, setHeight] = useState<number>(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextGrow = (): void => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "0px";
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${scrollHeight}px`;
      setHeight(scrollHeight);
    }
  };

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
