"use client";
import React, { ReactNode, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import "./modal.css";

interface ModalProps {
  children: ReactNode;
  showmodal: boolean;
  toggleModal: () => void;
  overlayclose?: boolean;
}

const Modal = ({ children, showmodal, toggleModal, overlayclose = true }: ModalProps) => {
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (showmodal) {
        document.body.classList.add("active-modal");
      } else {
        document.body.classList.remove("active-modal");
      }
    }
    
    return () => {
      if (typeof document !== "undefined") {
        document.body.classList.remove("active-modal");
      }
    };
  }, [showmodal]);

  const handleOverlayClick = () => {
    if (overlayclose) {
      toggleModal();
    }
  };

  if (!showmodal) {
    return null;
  }

  return (
    <div className="mymodal">
      <div
        onClick={handleOverlayClick}
        className="overlay"
      ></div>
      <div className="mymodal-content">
        {children}
        <FaTimes className="close-mymodal" onClick={toggleModal} />
      </div>
    </div>
  );
};

export default Modal;
