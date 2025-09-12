'use client';

import React, { useState, useRef, forwardRef } from "react";
import Alert from "../Alert/Alert";
import { FaTimes } from "react-icons/fa";
import { LuUpload } from "react-icons/lu";
import { getFileIcon } from "@/utils/selectFileIcon";

interface FileUploaderProps {
  name?: string;
  value?: File | string | null;
  onChange?: (file: File | null) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
  maxSize?: number; // in bytes
  allowedFileTypes?: string[];
  placeholder?: string;
}

interface AlertState {
  show: boolean;
  message: string;
}

const FileUploader = forwardRef<HTMLInputElement, FileUploaderProps>(
  ({ 
    name = "file",
    value,
    onChange,
    onBlur,
    error,
    disabled = false,
    maxSize = 64 * 1024 * 1024, // 64MB default
    allowedFileTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
    placeholder = "Upload your Product file"
  }, ref) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
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
    if (!allowedFileTypes.includes(selectedFile.type)) {
      showError("Only PDF, Word, Excel, and Image files are allowed");
      return;
    }

    // File size validation
    if (selectedFile.size > maxSize) {
      showError(`File size should not exceed ${Math.round(maxSize / (1024 * 1024))}MB`);
      return;
    }

    setFileName(selectedFile.name);
    setFileType(selectedFile.type);
    
    // Call onChange with the file
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
    
    setFileName(null);
    setFileType(null);
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
        // If it's a URL, try to extract filename
        const urlFileName = value.split('/').pop() || 'Selected file';
        setFileName(urlFileName);
        // Try to determine file type from extension
        const extension = urlFileName.split('.').pop()?.toLowerCase();
        const typeMap: Record<string, string> = {
          pdf: 'application/pdf',
          doc: 'application/msword',
          docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          jpg: 'image/jpeg',
          jpeg: 'image/jpeg',
          png: 'image/png',
          xls: 'application/vnd.ms-excel',
          xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        };
        setFileType(extension ? typeMap[extension] || 'application/octet-stream' : null);
      } else if (value instanceof File) {
        setFileName(value.name);
        setFileType(value.type);
      }
    } else {
      setFileName(null);
      setFileType(null);
    }
  }, [value]);

  return (
    <div>
      <div className="mt-2">
        <input
          ref={ref || fileInputRef}
          type="file"
          accept={allowedFileTypes.join(',')}
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

        {/* File upload UI */}
        {!fileName ? (
          <div>
            <div
              className="mb-2 small"
              style={{
                color: "var(--bgDarkerColor)",
              }}
            >
              Only PDF, Word, Excel, and Image files are allowed. Max size: {Math.round(maxSize / (1024 * 1024))}MB
            </div>
            <button
              className={`btn btn-accent-secondary shadow-none mt-2 w-100 rounded py-3 text-center ${disabled ? 'disabled' : ''}`}
              onClick={handleUploadClick}
              disabled={disabled}
            >
              <LuUpload className="h5 me-2" />
              {placeholder}
            </button>
          </div>
        ) : (
          <div className="card p-4 py-2">
            <div className="d-flex justify-content-between align-items-center rounded py-3">
              {/* Dynamic file type icon */}
              <div className="flex-fill d-flex align-items-center">
                <div
                  className="d-flex justify-content-center align-items-center bg-secondary-light"
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    fontSize: "24px",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  {getFileIcon(fileType || '')}
                </div>
                <p className="font-medium text-sm mt-2 mx-3 mb-2 text-break">
                  {fileName}
                </p>
              </div>
              {value && (
                <div>
                  <FaTimes
                    className="text-danger ms-2"
                    onClick={handleRemoveFile}
                    style={{ 
                      cursor: disabled ? "not-allowed" : "pointer", 
                      fontSize: 25 
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

FileUploader.displayName = "FileUploader";

export default FileUploader;
