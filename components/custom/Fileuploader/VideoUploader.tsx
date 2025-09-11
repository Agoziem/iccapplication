import React, { useEffect, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { LuUpload } from "react-icons/lu";
import { MdOutlineVideoLibrary } from "react-icons/md";
import Alert from "../Alert/Alert";

const VideoUploader = ({
  videokey,
  videourlkey,
  videoname,
  formData,
  setFormData,
}) => {
  const fileInput = useRef(null);
  const [fileName, setFileName] = useState("No Selected file");
  const [video, setVideo] = useState(null);
  const [erroralert, setErrorAlert] = useState({
    show: false,
    message: "",
  });

  useEffect(() => {
    if (formData[videourlkey]) {
      setFileName(formData[videoname]);
      setVideo(formData[videourlkey]);
    }
  }, [formData[videourlkey], formData[videoname]]);

  const handleFileChange = ({ target: { files } }) => {
    const file = files[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        setErrorAlert({
          show: true,
          message: "Only video files are allowed",
        });
        return;
      }
      if (file.size > 64 * 1024 * 1024) {
        setErrorAlert({
          show: true,
          message: "File size should not exceed 64MB",
        });
        return;
      }
      setTimeout(() => {
        setErrorAlert({
          show: false,
          message: "",
        });
      }, 3000);
      setFileName(file.name);
      setVideo(URL.createObjectURL(file));
      setFormData({
        ...formData,
        [videokey]: file,
      });
    }
  };

  const handleRemoveFile = () => {
    setFileName("No Selected file");
    setVideo(null);
    setFormData({
      ...formData,
      [videokey]: null,
      [videourlkey]: null,
      [videoname]: null,
    });
    if (fileInput.current) {
      fileInput.current.value = null; // Reset file input value
    }
  };

  return (
    <div>
      <div className=" d-md-flex align-items-center mt-2">
        <input
          ref={fileInput}
          type="file"
          accept="video/*" // Restrict file picker to videos
          id="file"
          onChange={handleFileChange}
          hidden
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
          {erroralert.show && (
            <Alert type={"danger"}>{erroralert.message}</Alert>
          )}
          <p className="mb-2">Your Product Video</p>
          <div className="mb-2 small" style={{
            color: "var(--bgDarkerColor)",
          }}>
            Only video files are allowed. File size should not exceed 64MB
          </div>
          <button
            className="btn btn-sm btn-accent-primary shadow-none rounded"
            onClick={(e) => {
              e.preventDefault();
              fileInput.current.click();
            }}
          >
            <LuUpload className="h5 me-2" />
            {video ? "Change Video" : "Upload Video"}
          </button>
        </div>
      </div>

      {/* display the file name & the delete icon */}
      <div className="d-flex align-items-center rounded py-3">
        <MdOutlineVideoLibrary className="h4 text-primary" />
        <p className="font-medium text-sm mt-2 mx-3 mb-2 text-break">
          {fileName || "No Selected file"}
        </p>
        {formData[videokey] && (
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

export default VideoUploader;
