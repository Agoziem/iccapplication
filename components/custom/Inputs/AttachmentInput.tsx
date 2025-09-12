import Image from "next/image";
import React, { useState } from "react";
import { AiOutlineSend } from "react-icons/ai";
import ExtendableTextarea from "./ExtendableTextarea";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaRegFileVideo } from "react-icons/fa";
import { getFileIcon } from "@/utils/selectFileIcon";

interface AttachmentInputProps {
  video?: string | null;
  image?: string | null;
  file?: string | null;
  type?: string | null;
  fileName?: string;
  resetinput: () => void;
  onSubmit?: (caption: string) => Promise<void>;
  disabled?: boolean;
  placeholder?: string;
}

const AttachmentInput: React.FC<AttachmentInputProps> = ({
  video,
  image,
  file,
  type,
  fileName = "No Selected file",
  resetinput,
  onSubmit,
  disabled = false,
  placeholder = "Add a Caption (Optional)"
}) => {
  const [captionBody, setCaptionBody] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // handle input Change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCaptionBody(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || disabled) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.(captionBody);
      setCaptionBody("");
    } catch (error) {
      console.error("Error submitting attachment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="w-100 position-absolute z-2 bottom-0 d-flex flex-column p-3"
      style={{
        height: "350px",
        backgroundColor: "var(--primary)",
      }}
    >
      <div className="d-flex p-2 pe-4 justify-content-end text-light">
        <FaRegTrashCan
          style={{
            fontSize: "1.3rem",
            cursor: disabled ? "not-allowed" : "pointer",
          }}
          onClick={disabled ? undefined : resetinput}
        />
      </div>
      
      {/* The File Preview */}
      <div className="flex-fill d-flex justify-content-center align-items-center">
        {image && (
          <div className="d-flex flex-column align-items-center gap-3">
            <img
              src={image}
              alt={fileName}
              height={150}
              width={300}
              style={{
                width: "auto",
              }}
            />
            <div className="text-light small">{fileName}</div>
          </div>
        )}

        {video && (
          <div className="d-flex flex-column align-items-center gap-3">
            <FaRegFileVideo
              className="text-light"
              style={{
                height: "120px",
                width: "auto",
              }}
            />
            <div className="text-light small">{fileName}</div>
          </div>
        )}

        {file && (
          <div className="d-flex flex-column align-items-center gap-3">
            <div
              className="text-light"
              style={{ height: "120px", width: "auto" }}
            >
              {getFileIcon(type || '')}
            </div>
            <div className="text-light small">{fileName}</div>
          </div>
        )}
      </div>

      {/* The Caption Optional */}
      <div>
        <form onSubmit={handleSubmit}>
          <div
            className="d-flex rounded p-2 align-items-center"
            style={{
              backgroundColor: "var(--bgDarkerColor)",
              borderColor: "var(--bgDarkerColor)",
            }}
          >
            <ExtendableTextarea
              value={captionBody}
              onChange={handleInputChange}
              placeholder={placeholder}
              className="chatinput form-control"
              disabled={disabled}
              style={{
                color: "white",
                backgroundColor: "var(--bgDarkerColor)",
                borderColor: "var(--bgDarkerColor)",
              }}
            />

            {/* Submit button */}
            <button
              className="btn btn-sm btn-primary rounded"
              type="submit"
              disabled={isSubmitting || disabled}
            >
              {!isSubmitting ? (
                <AiOutlineSend
                  className="h6 mb-0"
                  style={{
                    fontSize: "1.3rem",
                  }}
                />
              ) : (
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AttachmentInput;
