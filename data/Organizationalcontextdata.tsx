"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import Modal from "@/components/custom/Modal/modal";

// Define the service type for the modal
interface ModalService {
  id?: number;
  name?: string;
  description?: string;
  [key: string]: any; // Allow for additional properties
}

// Define the context value type
interface OrganizationContextType {
  openModal: (service: ModalService) => void;
  closeModal: () => void;
}

// Define the provider props type
interface OrganizationProviderProps {
  children: ReactNode;
}

// Create the context with proper typing
const OrganizationContext = createContext<OrganizationContextType | null>(null);

// Create a provider
export const OrganizationProvider: React.FC<OrganizationProviderProps> = ({ children }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalService, setModalService] = useState<ModalService | null>(null);

  const openModal = (service: ModalService): void => {
    setModalService(service);
    setShowModal(true);
  };

  const closeModal = (): void => {
    setModalService(null);
    setShowModal(false);
  };

  // Expose all hooks through context
  const value: OrganizationContextType = {
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
            <button 
              className="btn btn-primary" 
              onClick={() => closeModal()}
              type="button"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </OrganizationContext.Provider>
  );
};

// Hook to use OrganizationContext
export const useOrganization = (): OrganizationContextType => {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error(
      "useOrganization must be used within an OrganizationProvider"
    );
  }
  return context;
};
