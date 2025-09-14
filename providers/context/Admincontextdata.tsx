"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import Modal from "@/components/custom/Modal/modal";
import { Product, Service, Video } from "@/types/items";

type ModalItem = Service | Product | Video;

interface AdminContextValue {
  openModal: (item: ModalItem) => void;
  closeModal: () => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

interface AdminContextProviderProps {
  children: ReactNode;
}

const AdminContextProvider: React.FC<AdminContextProviderProps> = ({ children }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalItem, setModalItem] = useState<ModalItem | null>(null);

  // ----------------------------------------------------
  // Open Description Modal
  // ----------------------------------------------------
  const openModal = (item: ModalItem): void => {
    setModalItem(item);
    setShowModal(true);
  };

  // ----------------------------------------------------
  // Close Description Modal
  // ----------------------------------------------------
  const closeModal = (): void => {
    setModalItem(null);
    setShowModal(false);
  };

  return (
    <AdminContext.Provider value={{ openModal, closeModal }}>
      {children}

      {/* Modal for Item Description */}
      <Modal showmodal={showModal} toggleModal={closeModal}>
        <div>
          <h5 className="mb-3">{modalItem?.name || modalItem?.title || "Item Description"}</h5>
          <div className="modal-body">
            <p>{modalItem?.description}</p>
          </div>
          <div>
            <button className="btn btn-primary" onClick={closeModal}>
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
