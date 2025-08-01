import React, { useEffect, useRef, useState, ChangeEvent } from "react";
import { FaTimes } from "react-icons/fa";
import { FaRegFileImage } from "react-icons/fa6";
import { LuUpload } from "react-icons/lu";
import { MdOutlineArticle } from "react-icons/md";
import Alert from "../Alert/Alert";

interface ImageValue {
  img: File | string | null;
  img_url: string | null;
  img_name: string | null;
}

interface AlertState {
  show: boolean;
  message: string;
}

interface ArticleImageUploaderProps {
  value: ImageValue;
  onChange: (value: ImageValue) => void;
}

const ArticleImageUploader = ({ value, onChange }: ArticleImageUploaderProps) => {
  const fileInput = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("No Selected file");
  const [image, setImage] = useState<string | null>(null);
  const [errorAlert, setErrorAlert] = useState<AlertState>({ 
    show: false, 
    message: "" 
  });

  useEffect(() => {
    if (value) {
      setFileName(value.img_name || "No Selected file");
      setImage(value.img_url || null);
    } else {
      setFileName("No Selected file");
      setImage(null);
    }
    // Clear the input field when value changes (e.g., on reset)
    if (fileInput.current) {
      fileInput.current.value = "";
    }
  }, [value]);
  
  const showError = (message: string) => {
    setErrorAlert({ show: true, message });
    setTimeout(() => setErrorAlert({ show: false, message: "" }), 3000);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const file = files?.[0];
    
    if (file) {
      if (!file.type.startsWith("image/")) {
        showError("Only image files are allowed");
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      setFileName(file.name);
      setImage(imageUrl);
      onChange({ img: file, img_url: imageUrl, img_name: file.name });
    }
  };

  const handleRemoveFile = () => {
    setFileName("No Selected file");
    setImage(null);
    onChange({ img: null, img_url: "", img_name: "" });
    if (fileInput.current) fileInput.current.value = "";
  };

  return (
    <div>
      <div className="d-flex align-items-center mt-2">
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          id="file"
          hidden
          onChange={handleFileChange}
        />

        {errorAlert.show && <Alert type="danger">{errorAlert.message}</Alert>}

        <div>
          {image ? (
            <img
              src={image}
              className="rounded object-fit-cover me-3"
              alt="Uploaded"
              height={150}
              width={150}
              style={{ objectPosition: "top center" }}
            />
          ) : (
            <div
              className="d-flex justify-content-center align-items-center me-3 rounded"
              style={{
                width: "150px",
                height: "150px",
                fontSize: "80px",
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
            Only .jpg, .jpeg, .png files are allowed
          </div>
          <button
            className="btn btn-sm btn-accent-primary shadow-none"
            onClick={(e) => {
              e.preventDefault();
              fileInput.current?.click();
            }}
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
        {value?.img_url && (
          <FaTimes
            className="h-5 w-6 text-danger ms-2"
            onClick={handleRemoveFile}
            style={{ cursor: "pointer" }}
          />
        )}
      </div>
    </div>
  );
};

export default ArticleImageUploader;
