import { AiFillFileExcel, AiFillFileImage, AiFillFileWord } from "react-icons/ai";
import { BsFileEarmarkPdfFill } from "react-icons/bs";
import { ReactElement } from "react";
import React from "react";

// Define supported MIME types
export type SupportedFileType = 
  | "application/pdf"
  | "application/msword"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  | "image/jpeg"
  | "image/png"
  | "image/jpg"
  | "image/gif"
  | "image/webp"
  | "application/vnd.ms-excel"
  | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  | "text/csv";

/**
 * Returns the appropriate file icon based on MIME type
 * @param type - The MIME type of the file
 * @returns React element representing the file icon
 */
export const getFileIcon = (type: string): ReactElement => {
  const normalizedType = type.toLowerCase();
  
  switch (normalizedType) {
    case "application/pdf":
      return React.createElement(BsFileEarmarkPdfFill, { className: "text-secondary" });
      
    case "application/msword":
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return React.createElement(AiFillFileWord, { className: "text-secondary" });
      
    case "image/jpeg":
    case "image/jpg":
    case "image/png":
    case "image/gif":
    case "image/webp":
      return React.createElement(AiFillFileImage, { className: "text-secondary" });
      
    case "application/vnd.ms-excel":
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
    case "text/csv":
      return React.createElement(AiFillFileExcel, { className: "text-secondary" });
      
    default:
      return React.createElement(BsFileEarmarkPdfFill, { className: "text-secondary" });
  }
};

/**
 * Checks if a file type is supported
 * @param type - The MIME type to check
 * @returns boolean indicating if the type is supported
 */
export const isSupportedFileType = (type: string): type is SupportedFileType => {
  const supportedTypes: SupportedFileType[] = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/gif", 
    "image/webp",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv"
  ];
  
  return supportedTypes.includes(type.toLowerCase() as SupportedFileType);
};

/**
 * Gets file category based on MIME type
 * @param type - The MIME type of the file
 * @returns File category as string
 */
export const getFileCategory = (type: string): string => {
  const normalizedType = type.toLowerCase();
  
  if (normalizedType === "application/pdf") {
    return "document";
  }
  
  if (normalizedType.includes("word") || normalizedType.includes("document")) {
    return "document";
  }
  
  if (normalizedType.startsWith("image/")) {
    return "image";
  }
  
  if (normalizedType.includes("excel") || normalizedType.includes("spreadsheet") || normalizedType === "text/csv") {
    return "spreadsheet";
  }
  
  return "unknown";
};

  