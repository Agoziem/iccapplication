"use client";

import React, { createContext, useContext, useState } from "react";
import { useSession } from "next-auth/react";
import Modal from "@/components/custom/Modal/modal";

/**
 * @typedef {Object} OrdersContextValue
 * @property {(service: any) => void} openModal - Function to open a modal.
 * @property {() => void} closeModal - Function to close a modal.
 */

/** @type {React.Context<OrdersContextValue | null>} */
const AdminContext = createContext(null);

/**
 * AdminContextProvider component that wraps its children with the admin context.
 *
 * @param {{ children: React.ReactNode }} props - The children elements to render inside the provider.
 * @returns {JSX.Element} The AdminContext provider component.
 */
const AdminContextProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalService, setModalService] = useState(null);
  const { data: session } = useSession();
  const Organizationid = process.env.NEXT_PUBLIC_ORGANIZATION_ID;

  // ----------------------------------------------------
  // Open Description Modal
  // ----------------------------------------------------
  const openModal = (service) => {
    setModalService(service);
    setShowModal(true);
  };

  // ----------------------------------------------------
  // Close Description Modal
  // ----------------------------------------------------
  const closeModal = () => {
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
 *
 * @returns {OrdersContextValue | null} The current admin context value.
 */
const useAdminContext = () => useContext(AdminContext);

export { useAdminContext, AdminContextProvider };
