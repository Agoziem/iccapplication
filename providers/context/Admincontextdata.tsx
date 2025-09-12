"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import Modal from "@/components/custom/Modal/modal";
import { Service } from "@/types/items";

interface AdminContextValue {
  openModal: (service: Service) => void;
  closeModal: () => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

interface AdminContextProviderProps {
  children: ReactNode;
}

const AdminContextProvider: React.FC<AdminContextProviderProps> = ({ children }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalService, setModalService] = useState<Service | null>(null);

  // ----------------------------------------------------
  // Open Description Modal
  // ----------------------------------------------------
  const openModal = (service: Service): void => {
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

const useAdminContext = (): AdminContextValue | null => useContext(AdminContext);

export { useAdminContext, AdminContextProvider };
