import React, { useEffect, useRef, useState, forwardRef } from "react";
import { FaTimes } from "react-icons/fa";
import { LuUpload } from "react-icons/lu";
import { MdOutlineVideoLibrary } from "react-icons/md";
import Alert from "../Alert/Alert";

interface VideoUploaderProps {
  value?: File | string | null;
  onChange?: (file: File | string) => void;
  name?: string;
  maxSize?: number;
  disabled?: boolean;
  error?: string;
}

const VideoUploader = forwardRef<HTMLInputElement, VideoUploaderProps>(({
  value,
  onChange,
  name,
  maxSize = 64 * 1024 * 1024, // 64MB default
  disabled = false,
  error,
}, ref) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("No Selected file");
  const [video, setVideo] = useState<string | null>(null);
  const [errorAlert, setErrorAlert] = useState({
    show: false,
    message: "",
  });

  useEffect(() => {
    if (value instanceof File) {
      setFileName(value.name);
      setVideo(URL.createObjectURL(value));
    } else if (typeof value === 'string' && value) {
      setFileName("Existing video");
      setVideo(value);
    } else {
      setFileName("No Selected file");
      setVideo(null);
    }
  }, [value]);

  const showError = (message: string) => {
    setErrorAlert({ show: true, message });
    setTimeout(() => {
      setErrorAlert({ show: false, message: "" });
    }, 3000);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const file = files?.[0];
    
    if (file) {
      if (!file.type.startsWith("video/")) {
        showError("Only video files are allowed");
        return;
      }
      
      if (file.size > maxSize) {
        showError(`File size should not exceed ${Math.round(maxSize / (1024 * 1024))}MB`);
        return;
      }

      setFileName(file.name);
      setVideo(URL.createObjectURL(file));
      onChange?.(file);
    }
  };

  const handleRemoveFile = () => {
    setFileName("No Selected file");
    setVideo(null);
    onChange?.("");
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div>
      <div className="d-md-flex align-items-center mt-2">
        <input
          ref={ref || fileInputRef}
          type="file"
          accept="video/*"
          id="file"
          name={name}
          onChange={handleFileChange}
          hidden
          disabled={disabled}
        />

        <div>
          {video ? (
            <video
              src={video}
              className="rounded object-fit-cover me-3"
              height={200}
              width={200}
              controls
              style={{ objectPosition: "top center" }}
            />
          ) : (
            <div
              className="d-flex justify-content-center align-items-center me-3 rounded"
              style={{
                width: "200px",
                height: "200px",
                fontSize: "80px",
                backgroundColor: "var(--bgDarkColor)",
                color: "var(--bgDarkerColor)",
              }}
            >
              <MdOutlineVideoLibrary />
            </div>
          )}
        </div>

        <div className="mt-3 mt-md-0">
          {(errorAlert.show || error) && (
            <Alert type="danger">
              {errorAlert.message || error}
            </Alert>
          )}
          <p className="mb-2">Your Product Video</p>
          <div 
            className="mb-2 small" 
            style={{ color: "var(--bgDarkerColor)" }}
          >
            Only video files are allowed. File size should not exceed {Math.round(maxSize / (1024 * 1024))}MB
          </div>
          <button
            className={`btn btn-sm btn-accent-primary shadow-none rounded ${disabled ? 'disabled' : ''}`}
            onClick={handleUploadClick}
            disabled={disabled}
          >
            <LuUpload className="h5 me-2" />
            {video ? "Change Video" : "Upload Video"}
          </button>
        </div>
      </div>

      <div className="d-flex align-items-center rounded py-3">
        <MdOutlineVideoLibrary className="h4 text-primary" />
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

VideoUploader.displayName = "VideoUploader";

export default VideoUploader;
