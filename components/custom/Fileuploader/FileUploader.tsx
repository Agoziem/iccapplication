import React, { useEffect, useRef, useState, ChangeEvent } from "react";
import { FaTimes } from "react-icons/fa";
import { LuUpload } from "react-icons/lu";
import Alert from "../Alert/Alert";
import { getFileIcon } from "@/utils/selectFileIcon";

interface AlertState {
  show: boolean;
  message: string;
}

interface FileUploaderProps {
  filekey: string;
  fileurlkey: string;
  filename: string;
  formData: Record<string, any>;
  setFormData: (data: Record<string, any>) => void;
}

const FileUploader = ({
  filekey,
  fileurlkey,
  filename,
  formData,
  setFormData,
}: FileUploaderProps) => {
  const fileInput = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [erroralert, setErrorAlert] = useState<AlertState>({
    show: false,
    message: "",
  });

  const allowedFileTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ] as const;

  useEffect(() => {
    if (formData[fileurlkey]) {
      setFileName(formData[filename]);
      setFileType(formData[filekey]?.type);
    }
  }, [formData, fileurlkey, filename, filekey]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const file = files?.[0];
    
    if (file) {
      if (!allowedFileTypes.includes(file.type as any)) {
        setErrorAlert({
          show: true,
          message: "Only PDF, Word, Excel, and Image files are allowed",
        });
        setTimeout(() => {
          setErrorAlert({
            show: false,
            message: "",
          });
        }, 3000);
        return;
      }
      setFileName(file.name);
      setFileType(file.type);
      setFormData({
        ...formData,
        [filekey]: file,
      });
    }
  };

  const handleRemoveFile = () => {
    setFileName(null);
    setFileType(null);
    setFormData({
      ...formData,
      [filekey]: null,
    });
    if (fileInput.current) {
      fileInput.current.value = "";
    }
  };

  const handleUploadClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    fileInput.current?.click();
  };

  return (
    <div>
      <div className="mt-2">
        <input
          ref={fileInput}
          type="file"
          id="file"
          onChange={handleFileChange}
          hidden
        />

        {/* where to click and select a file */}
        {erroralert.show && <Alert type="danger">{erroralert.message}</Alert>}
        {!fileName ? (
          <div className="">
            <div
              className="mb-2 small"
              style={{
                color: "var(--bgDarkerColor)",
              }}
            >
              only PDF, Word, Excel, and Image files are allowed
            </div>
            <button
              className="btn btn-accent-secondary shadow-none mt-2 w-100 rounded py-3 text-center"
              onClick={handleUploadClick}
            >
              <LuUpload className="h5 me-2" />
              Upload your Product file
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
                  {getFileIcon(fileType)}
                </div>
                <p className="font-medium text-sm mt-2 mx-3 mb-2 text-break">
                  {fileName}
                </p>
              </div>
              {formData[filekey] && (
                <div>
                  <FaTimes
                    className="text-danger ms-2"
                    onClick={handleRemoveFile}
                    style={{ cursor: "pointer", fontSize: 25 }}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
