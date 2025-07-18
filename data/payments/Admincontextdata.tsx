"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { useSession } from "next-auth/react";
import Modal from "@/components/custom/Modal/modal";

// Define the service type for modal
interface ModalService {
  id?: number;
  name?: string;
  description?: string;
  [key: string]: any; // Allow for additional properties
}

// Define the context value interface
interface AdminContextValue {
  openModal: (service: ModalService) => void;
  closeModal: () => void;
}

// Define the provider props interface
interface AdminContextProviderProps {
  children: ReactNode;
}

const AdminContext = createContext<AdminContextValue | null>(null);

/**
 * AdminContextProvider component that wraps its children with the admin context.
 */
const AdminContextProvider: React.FC<AdminContextProviderProps> = ({ children }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalService, setModalService] = useState<ModalService | null>(null);
  const { data: session } = useSession();
  const Organizationid = process.env.NEXT_PUBLIC_ORGANIZATION_ID;

  // ----------------------------------------------------
  // Open Description Modal
  // ----------------------------------------------------
  const openModal = (service: ModalService): void => {
    setModalService(service);
    setShowModal(true);
  };

  // ----------------------------------------------------
  // Close Description Modal
  // ----------------------------------------------------
  const closeModal = (): void => {
    setModalService(null);
    setShowModal(false);
  };

  return (
    <AdminContext.Provider
      value={{
        openModal,
        closeModal,
      }}
    >
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
    </AdminContext.Provider>
  );
};

/**
 * Hook to access the admin context values.
 */
const useAdminContext = (): AdminContextValue => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdminContext must be used within an AdminContextProvider");
  }
  return context;
};

export { useAdminContext, AdminContextProvider };
