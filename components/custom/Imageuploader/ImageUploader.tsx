
import React, { useState, useRef, forwardRef, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { FaRegFileImage } from "react-icons/fa6";
import { IoIosImages } from "react-icons/io";
import { LuUpload } from "react-icons/lu";
import Alert from "../Alert/Alert";

interface ImageUploaderProps {
  name?: string;
  value?: File | string | null;
  onChange?: (file: File | null) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
  maxSize?: number; // in bytes
  placeholder?: string;
}

interface AlertState {
  show: boolean;
  message: string;
}

const ImageUploader = forwardRef<HTMLInputElement, ImageUploaderProps>(
  ({
    name = "image",
    value,
    onChange,
    onBlur,
    error,
    disabled = false,
    maxSize = 8 * 1024 * 1024, // 8MB default
    placeholder = "Upload Image"
  }, ref) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState<string>("No Selected file");
    const [image, setImage] = useState<string | null>(null);
    const [errorAlert, setErrorAlert] = useState<AlertState>({
      show: false,
      message: ""
    });

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

      // File size validation
      if (selectedFile.size > maxSize) {
        showError(`File size should not exceed ${Math.round(maxSize / (1024 * 1024))}MB`);
        return;
      }

      setFileName(selectedFile.name);
      setImage(URL.createObjectURL(selectedFile));
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
      onChange?.(null);
      if (ref && 'current' in ref && ref.current) {
        ref.current.value = '';
      } else if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    // Initialize from value prop
    useEffect(() => {
      if (value) {
        if (typeof value === 'string') {
          setImage(value);
          setFileName(value.split('/').pop() || 'Selected file');
        } else if (value instanceof File) {
          setFileName(value.name);
          setImage(URL.createObjectURL(value));
        }
      } else {
        setFileName("No Selected file");
        setImage(null);
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

          {/* selected image display */}
          {(errorAlert.show || error) && <Alert type="danger">{errorAlert.message || error}</Alert>}
          <div>
            {image ? (
              <img
                src={image}
                className="rounded-circle object-fit-cover me-3"
                alt="profile"
                height={75}
                width={75}
                style={{ objectPosition: "top center" }}
              />
            ) : (
              <div
                className="rounded-circle text-white d-flex justify-content-center align-items-center me-2"
                style={{
                  width: 80,
                  height: 80,
                  fontSize: 40,
                  backgroundColor: "var(--bgDarkerColor)",
                }}
              >
                <IoIosImages />
              </div>
            )}
          </div>

          {/* select image button */}
          <div>
            <div
              className="mb-2 small"
              style={{
                color: "var(--bgDarkerColor)",
              }}
            >
              Only .jpg, .jpeg, .png files are allowed. Max size: {Math.round(maxSize / (1024 * 1024))}MB
            </div>
            <button
              className={`btn btn-sm btn-accent-primary shadow-none mt-1 ${disabled ? 'disabled' : ''}`}
              onClick={handleUploadClick}
              disabled={disabled}
            >
              <LuUpload className="h5 me-2" />
              {image ? "Change Image" : placeholder}
            </button>
          </div>
        </div>

        {/* display the file name & the delete icon */}
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
  }
);

ImageUploader.displayName = "ImageUploader";

export default ImageUploader;
