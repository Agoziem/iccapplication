import { useWhatsappAPIContext } from "@/data/whatsappAPI/WhatsappContext";
import React from "react";
import { FaArrowDown } from "react-icons/fa6";

const Scrolltobottom: React.FC = () => {
  const { scrollToBottom, atthebottom, setAtthebottom } =
    useWhatsappAPIContext();

  const handleScrollToBottom = (): void => {
    scrollToBottom();
  };

  return !atthebottom ? (
    <button
      className="position-absolute bottom-0 end-0 m-3 z-3 rounded"
      style={{
        backgroundColor: "var(--primary)",
        border: "none",
        padding: "0.5rem",
      }}
      onClick={handleScrollToBottom}
    >
      <FaArrowDown
        style={{
          fontSize: "1.5rem",
          color: "var(--bgColor)",
          cursor: "pointer",
        }}
      />
    </button>
  ) : null;
};

export default Scrolltobottom;
