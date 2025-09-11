import { useWhatsappAPIContext } from "@/data/whatsappAPI/WhatsappContext";
import React from "react";
import { FaPhotoVideo } from "react-icons/fa";
import { HiOutlineDocument } from "react-icons/hi2";
import { PiImageBold } from "react-icons/pi";
import {getFileIcon} from "@/utils/selectFileIcon"

const ChatAttachments = () => {
  const { fileInputRef, imageInputRef, videoInputRef } =
    useWhatsappAPIContext();
  return (
    <ul className="dropdown-menu">
      <li
        style={{ cursor: "pointer" }}
        onClick={(e) => {
          e.preventDefault();
          fileInputRef?.current.click();
        }}
      >
        <span className="dropdown-item">
          <HiOutlineDocument className="me-2" style={{ fontSize: "1.3rem" }} /> Document
        </span>
      </li>
      <li
        style={{ cursor: "pointer" }}
        onClick={(e) => {
          e.preventDefault();
          imageInputRef?.current.click();
        }}
      >
        <span className="dropdown-item">
          <PiImageBold className="me-2" style={{ fontSize: "1.3rem" }} /> Image & Photos
        </span>
      </li>
      <li
        style={{ cursor: "pointer" }}
        onClick={(e) => {
          e.preventDefault();
          videoInputRef?.current.click();
        }}
      >
        <span className="dropdown-item">
          <FaPhotoVideo className="me-2" style={{ fontSize: "1.3rem" }} /> Videos
        </span>
      </li>
    </ul>
  );
};

export default ChatAttachments;
