import { AiFillFileExcel, AiFillFileImage, AiFillFileWord } from "react-icons/ai";
import { BsFileEarmarkPdfFill } from "react-icons/bs";

export const getFileIcon = (type) => {
    switch (type) {
      case "application/pdf":
        return <BsFileEarmarkPdfFill className="text-secondary " />;
      case "application/msword":
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return <AiFillFileWord className="text-secondary " />;
      case "image/jpeg":
      case "image/png":
        return <AiFillFileImage className="text-secondary " />;
      case "application/vnd.ms-excel":
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        return <AiFillFileExcel className="text-secondary " />;
      default:
        return <BsFileEarmarkPdfFill className="text-secondary " />;
    }
  };

  