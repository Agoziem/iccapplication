import Image from "next/image";
import React, { useState } from "react";
import { AiOutlineSend } from "react-icons/ai";
import ExtendableTextarea from "./ExtendableTextarea"; // Reuse the extendable textarea component
import { FaRegTrashCan } from "react-icons/fa6";
import { FaRegFileVideo } from "react-icons/fa";
import { getFileIcon } from "@/utils/selectFileIcon";

const AttachmentInput = ({
  video,
  image,
  file,
  type,
  fileName,
  resetinput,
}) => {
  const [captionBody, setCaptionBody] = useState(""); // Manage input with useState
  const [isSubmitting, setIsSubmitting] = useState(false);

  // handle input Change
  const handleInputChange = (e) => {
    setCaptionBody(e.target.value);
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
            cursor: "pointer",
          }}
          onClick={resetinput}
        />
      </div>
      {/* The File Preview */}
      <div className="flex-fill d-flex justify-content-center align-items-center">
        {image && (
          <div className="d-flex flex-column align-items-center gap-3">
            <img
              src={image}
              alt="sign up.png"
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
              {getFileIcon(type)}
            </div>
            <div className="text-light small">{fileName}</div>
          </div>
        )}
      </div>

      {/* The Caption Optional */}
      <div>
        <form>
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
              placeholder="Add a Caption (Optional)"
              className="chatinput form-control"
              style={{
                color: "white",
                backgroundColor: "var(--bgDarkerColor)",
                borderColor: "var(--bgDarkerColor)",
              }}
            />

            {/* Conditionally show the submit button if there is text in the input */}
            <button
              className="btn btn-sm btn-primary rounded"
              type="submit"
              disabled={isSubmitting}
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
