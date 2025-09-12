"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import Modal from "@/components/custom/Modal/modal";
import { Service } from "@/types/items";

interface OrganizationContextValue {
  openModal: (service: Service) => void;
  closeModal: () => void;
}

interface OrganizationProviderProps {
  children: ReactNode;
}

// Create the context
const OrganizationContext = createContext<OrganizationContextValue | null>(null);

// Create a provider
export const OrganizationProvider: React.FC<OrganizationProviderProps> = ({ children }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalService, setModalService] = useState<Service | null>(null);


  const openModal = (service: Service): void => {
    setModalService(service);
    setShowModal(true);
  };

  const closeModal = (): void => {
    setModalService(null);
    setShowModal(false);
  };

  // Expose all hooks through context
  const value: OrganizationContextValue = {
   
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
