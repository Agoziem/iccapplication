"use client";
import React, { createContext, useContext, useState } from "react";
import Modal from "@/components/custom/Modal/modal";

// Create the context
const OrganizationContext = createContext(null);

// Create a provider
export const OrganizationProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalService, setModalService] = useState(null);


  const openModal = (service) => {
    setModalService(service);
    setShowModal(true);
  };

  const closeModal = () => {
    setModalService(null);
    setShowModal(false);
  };

  // Expose all hooks through context
  const value = {
   
    openModal, // Open Description Modal
    closeModal, // Close Description Modal
  };

  return (
    <OrganizationContext.Provider value={value}>
      {children}
      {/* Modal for Service Description */}
      <Modal showmodal={showModal} toggleModal={closeModal}>
        <div className="">
          <h5 className="mb-3">Service Description</h5>
          <div className="modal-body">
            <p>{modalService?.description}</p>
          </div>
          <div>
            <button className="btn btn-primary" onClick={() => closeModal()}>
              Close
            </button>
          </div>
        </div>
      </Modal>
    </OrganizationContext.Provider>
  );
};

// Hook to use OrganizationContext
export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error(
      "useOrganization must be used within an OrganizationProvider"
    );
  }
  return context;
};
