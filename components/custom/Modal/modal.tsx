"use client";
import React from "react";
import { FaTimes } from "react-icons/fa";
import "./modal.css";

const Modal = ({ children, showmodal, toggleModal, overlayclose = true }) => {
  if (typeof document !== "undefined") {
    if (showmodal) {
      document.body.classList.add("active-modal");
    } else {
      document.body.classList.remove("active-modal");
    }
  }

  return (
    <>
      {showmodal && (
        <div>
          <div className="mymodal">
            <div
              onClick={() => {
                if (overlayclose) {
                  toggleModal();
                }
              }}
              className="overlay"
            ></div>
            <div className="mymodal-content">
              {children}
              <FaTimes className="close-mymodal" onClick={toggleModal} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
