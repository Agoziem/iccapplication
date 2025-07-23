import { useWhatsappAPIContext } from "@/data/whatsappAPI/WhatsappContext";
import React from "react";
import { FaPhotoVideo } from "react-icons/fa";
import { HiOutlineDocument } from "react-icons/hi2";
import { PiImageBold } from "react-icons/pi";
import {getFileIcon} from "@/utils/selectFileIcon"

const ChatAttachments: React.FC = () => {
  const { fileInputRef, imageInputRef, videoInputRef } =
    useWhatsappAPIContext();

  const handleFileClick = (e: React.MouseEvent): void => {
    e.preventDefault();
    fileInputRef?.current?.click();
  };

  const handleImageClick = (e: React.MouseEvent): void => {
    e.preventDefault();
    imageInputRef?.current?.click();
  };

  const handleVideoClick = (e: React.MouseEvent): void => {
    e.preventDefault();
    videoInputRef?.current?.click();
  };

  return (
    <ul className="dropdown-menu">
      <li style={{ cursor: "pointer" }} onClick={handleFileClick}>
        <span className="dropdown-item">
          <HiOutlineDocument className="me-2" style={{ fontSize: "1.3rem" }} /> Document
        </span>
      </li>
      <li style={{ cursor: "pointer" }} onClick={handleImageClick}>
        <span className="dropdown-item">
          <PiImageBold className="me-2" style={{ fontSize: "1.3rem" }} /> Image & Photos
        </span>
      </li>
      <li style={{ cursor: "pointer" }} onClick={handleVideoClick}>
        <span className="dropdown-item">
          <FaPhotoVideo className="me-2" style={{ fontSize: "1.3rem" }} /> Videos
        </span>
      </li>
    </ul>
  );
};

export default ChatAttachments;
