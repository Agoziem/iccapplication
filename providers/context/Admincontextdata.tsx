"use client";

import React from "react";
import { Product, Service, Video } from "@/types/items";
import Modal from "@/components/custom/Modal/modal";
import { formatPrice } from "@/utils/utilities";

const { createContext, useContext, useState, useCallback, useMemo } = React;
type ReactNode = React.ReactNode;

type ModalItem = Service | Product | Video;

interface AdminContextValue {
  // Modal management
  showModal: boolean;
  modalItem: ModalItem | null;
  openModal: (item: ModalItem) => void;
  closeModal: () => void;

  // Admin state management (can be extended)
  isLoading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  clearError: () => void;
}

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

interface AdminContextProviderProps {
  children: ReactNode;
}

const AdminContextProvider: React.FC<AdminContextProviderProps> = ({
  children,
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalItem, setModalItem] = useState<ModalItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setErrorState] = useState<string | null>(null);

  // ----------------------------------------------------
  // Open Description Modal
  // ----------------------------------------------------
  const openModal = useCallback((item: ModalItem): void => {
    setModalItem(item);
    setShowModal(true);
  }, []);

  // ----------------------------------------------------
  // Close Description Modal
  // ----------------------------------------------------
  const closeModal = useCallback((): void => {
    setModalItem(null);
    setShowModal(false);
  }, []);

  // ----------------------------------------------------
  // Error Management
  // ----------------------------------------------------
  const setError = useCallback((error: string | null): void => {
    setErrorState(error);
  }, []);

  const clearError = useCallback((): void => {
    setErrorState(null);
  }, []);

  // Helper function to get item display name
  const getItemDisplayName = useCallback((item: ModalItem): string => {
    if ("name" in item && item.name) return item.name;
    if ("title" in item && item.title) return item.title;
    return "Item Description";
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    (): AdminContextValue => ({
      showModal,
      modalItem,
      openModal,
      closeModal,
      isLoading,
      error,
      setError,
      clearError,
    }),
    [
      showModal,
      modalItem,
      openModal,
      closeModal,
      isLoading,
      error,
      setError,
      clearError,
    ]
  );

  return (
    <AdminContext.Provider value={contextValue}>
      {children}

      {/* Modal for Item Description */}
      <Modal showmodal={showModal} toggleModal={closeModal}>
        <div>
          <h5 className="mb-3">
            {modalItem ? getItemDisplayName(modalItem) : "Item Description"}
          </h5>
          <hr />
          <div className="modal-body">
            <div
              dangerouslySetInnerHTML={{
                __html: modalItem?.description || "No description available",
              }}
              className="card-text text-primary small line-clamp-3"
            />

            {/* Display additional item info if available */}
            {modalItem && "price" in modalItem && modalItem.price && (
              <div className="mb-2">
                <strong>Price: </strong>
                <span className="text-primary fw-bold">
                  {formatPrice(modalItem.price)}
                </span>
              </div>
            )}

            {modalItem && "category" in modalItem && modalItem.category && (
              <div className="mb-2">
                <strong>Category: </strong>
                <span className="badge bg-secondary">
                  {modalItem.category.category}
                </span>
              </div>
            )}
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button className="btn btn-secondary" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* Error Display Modal */}
      {error && (
        <Modal showmodal={!!error} toggleModal={clearError}>
          <div>
            <h5 className="mb-3 text-danger">
              <i className="bi bi-exclamation-triangle me-2"></i>
              Error
            </h5>
            <div className="modal-body">
              <p className="text-danger">{error}</p>
            </div>
            <div className="d-flex justify-content-end">
              <button className="btn btn-primary" onClick={clearError}>
                Dismiss
              </button>
            </div>
          </div>
        </Modal>
      )}
    </AdminContext.Provider>
  );
};

const useAdminContext = (): AdminContextValue => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error(
      "useAdminContext must be used within an AdminContextProvider"
    );
  }
  return context;
};

export { useAdminContext, AdminContextProvider };
