import React, { useEffect, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { FaRegFileImage } from "react-icons/fa6";
import { IoIosImages } from "react-icons/io";
import { LuUpload } from "react-icons/lu";
import Alert from "../Alert/Alert";

/**
 * @param {{ imagekey: string; imageurlkey: string; imagename: string; formData: any; setFormData: any; }} param0
 */
const ImageUploader = ({
  imagekey,
  imageurlkey,
  imagename,
  formData,
  setFormData,
}) => {
  const fileInput = useRef(null);
  const [fileName, setFileName] = useState("No Selected file");
  const [image, setImage] = useState(null);
  const [erroralert, setErrorAlert] = useState({
    show: false,
    message: "",
  });

  // update the state from the External data on Page load , and when the data changes
  useEffect(() => {
    if (formData?.[imagekey]) setFileName(formData[imagename]);
    if (formData?.[imageurlkey]) setImage(formData[imageurlkey]);
  }, [formData,imagekey,imagename,imageurlkey]);

  const handleFileChange = ({ target: { files } }) => {
    const file = files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrorAlert({
          show: true,
          message: "Only image files are allowed",
        });
        setTimeout(() => {
          setErrorAlert({
            show: false,
            message: "",
          });
        }, 3000);
        return;
      }
      setFormData({
        ...formData,
        [imagekey]: file,
        [imagename]: file.name,
        [imageurlkey]: URL.createObjectURL(file)
      });
    }
  };

  const handleRemoveFile = () => {
    setFileName("No Selected file");
    setImage(null);
    setFormData({
      ...formData,
      [imagekey]: null,
      [imagename]: null,
      [imageurlkey]: null
    });
    if (fileInput.current) {
      fileInput.current.value = null; // Reset file input value
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center mt-2">
        {/* hidden image file input */}
        <input
          ref={fileInput}
          type="file"
          accept="image/*" // Restrict file picker to images
          id="file"
          onChange={handleFileChange}
          hidden
        />

        {/* selected image display */}
        {erroralert.show && <Alert type="danger">{erroralert.message}</Alert>}
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
            only .jpg, .jpeg, .png files are allowed
          </div>
          <button
            className="btn btn-sm btn-accent-primary shadow-none mt-1"
            onClick={(e) => {
              e.preventDefault();
              fileInput.current.click();
            }}
          >
            <LuUpload className="h5 me-2" />
            {image ? "Change Image" : "Upload Image"}
          </button>
        </div>
      </div>

      {/* display the file name & the delete icon */}
      <div className="d-flex align-items-center rounded py-3">
        <FaRegFileImage className="h4 text-primary" />
        <p className="font-medium text-sm mt-2 mx-3 mb-2 text-break">
          {fileName}
        </p>
        {formData?.[imagekey] && (
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

export default ImageUploader;
