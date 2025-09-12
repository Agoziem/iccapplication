'use client';

import React, { useState, useRef, forwardRef } from "react";
import { FaTimes } from "react-icons/fa";
import { FaRegFileImage } from "react-icons/fa6";
import { LuUpload } from "react-icons/lu";
import { MdOutlineArticle } from "react-icons/md";
import Alert from "../Alert/Alert";

interface ArticleImageUploaderProps {
  name?: string;
  value?: File | string | null;
  onChange?: (file: File | null) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
  maxSize?: number; // in bytes
  acceptedTypes?: string[];
  width?: number;
  height?: number;
}

interface AlertState {
  show: boolean;
  message: string;
}

const ArticleImageUploader = forwardRef<HTMLInputElement, ArticleImageUploaderProps>(
  ({ 
    name = "articleImage",
    value,
    onChange,
    onBlur,
    error,
    disabled = false,
    maxSize = 5 * 1024 * 1024, // 5MB default for images
    acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    width = 150,
    height = 150
  }, ref) => {
  const [fileName, setFileName] = useState<string>("No Selected file");
  const [image, setImage] = useState<string | null>(null);
  const [errorAlert, setErrorAlert] = useState<AlertState>({
    show: false,
    message: ""
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showError = (message: string) => {
    setErrorAlert({ show: true, message });
    setTimeout(() => {
      setErrorAlert({ show: false, message: "" });
    }, 3000);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    // File type validation
    if (!selectedFile.type.startsWith("image/")) {
      showError("Only image files are allowed");
      return;
    }

    // Specific file type validation if provided
    if (acceptedTypes.length > 0 && !acceptedTypes.includes(selectedFile.type)) {
      showError(`Only ${acceptedTypes.join(', ')} files are allowed`);
      return;
    }

    // File size validation
    if (selectedFile.size > maxSize) {
      showError(`File size should not exceed ${Math.round(maxSize / (1024 * 1024))}MB`);
      return;
    }

    const imageUrl = URL.createObjectURL(selectedFile);
    setFileName(selectedFile.name);
    setImage(imageUrl);
    
    // Call onChange with the structured value
    onChange?.(selectedFile);
  };

  const handleUploadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (disabled) return;
    
    if (ref && 'current' in ref) {
      ref.current?.click();
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleRemoveFile = () => {
    if (disabled) return;
    
    setFileName("No Selected file");
    setImage(null);
    
    // Call onChange with empty values
    onChange?.(null);
    
    // Clear the input
    if (ref && 'current' in ref && ref.current) {
      ref.current.value = '';
    } else if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Initialize from value prop
  React.useEffect(() => {
    if (value) {
      if (typeof value === 'string') {
        setImage(value);
        setFileName(value.split('/').pop() || 'Selected file');
      }
      else if (value instanceof File) {
        setFileName(value.name);
        setImage(URL.createObjectURL(value));
      }
    } else {
      setFileName("No Selected file");
      setImage(null);
    }
    
    // Clear the input field when value changes (e.g., on reset)
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [value]);

  return (
    <div>
      <div className="d-flex align-items-center mt-2">
        <input
          ref={ref || fileInputRef}
          type="file"
          accept="image/*"
          id="file"
          name={name}
          onChange={handleFileChange}
          onBlur={onBlur}
          hidden
          disabled={disabled}
        />

        {/* Error display */}
        {(errorAlert.show || error) && (
          <Alert type="danger">
            {errorAlert.message || error}
          </Alert>
        )}

        <div>
          {image ? (
            <img
              src={image}
              className="rounded object-fit-cover me-3"
              alt="Article thumbnail"
              height={height}
              width={width}
              style={{ objectPosition: "top center" }}
            />
          ) : (
            <div
              className="d-flex justify-content-center align-items-center me-3 rounded"
              style={{
                width: `${width}px`,
                height: `${height}px`,
                fontSize: Math.min(width, height) * 0.5,
                backgroundColor: "var(--bgDarkColor)",
                color: "var(--bgDarkerColor)",
              }}
            >
              <MdOutlineArticle />
            </div>
          )}
        </div>

        <div>
          <p className="mb-0">Article Thumbnail</p>
          <div className="mb-3 small" style={{ color: "var(--bgDarkerColor)" }}>
            Only .jpg, .jpeg, .png files are allowed. Max size: {Math.round(maxSize / (1024 * 1024))}MB
          </div>
          <button
            className={`btn btn-sm btn-accent-primary shadow-none ${disabled ? 'disabled' : ''}`}
            onClick={handleUploadClick}
            disabled={disabled}
          >
            <LuUpload className="h5 me-2" />
            {image ? "Change Image" : "Upload Image"}
          </button>
        </div>
      </div>

      <div className="d-flex align-items-center rounded py-3">
        <FaRegFileImage className="h4 text-primary" />
        <p className="font-medium text-sm mt-2 mx-3 mb-2 text-break">
          {fileName}
        </p>
        {value && (
          <FaTimes
            className="h-5 w-6 text-danger ms-2"
            onClick={handleRemoveFile}
            style={{ cursor: disabled ? "not-allowed" : "pointer" }}
          />
        )}
      </div>
    </div>
  );
});

ArticleImageUploader.displayName = "ArticleImageUploader";

export default ArticleImageUploader;
