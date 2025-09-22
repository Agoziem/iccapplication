"use client";
import React, { useCallback } from "react";
import Modal from "@/components/custom/Modal/modal";
import { Product, Service, Video } from "@/types/items";
import { formatPrice } from "@/utils/utilities";

const { createContext, useContext, useState } = React;
type ReactNode = React.ReactNode;

type ModalItem = Service | Product | Video;

interface OrganizationContextValue {
  openModal: (item: ModalItem) => void;
  closeModal: () => void;
}

interface OrganizationProviderProps {
  children: ReactNode;
}

// Create the context
const OrganizationContext = createContext<OrganizationContextValue | null>(
  null
);

// Create a provider
export const OrganizationProvider: React.FC<OrganizationProviderProps> = ({
  children,
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalItem, setModalItem] = useState<ModalItem | null>(null);

  const openModal = (item: ModalItem): void => {
    setModalItem(item);
    setShowModal(true);
  };

  const closeModal = (): void => {
    setModalItem(null);
    setShowModal(false);
  };

  // Helper function to get item display name
  const getItemDisplayName = useCallback((item: ModalItem): string => {
    if ("name" in item && item.name) return item.name;
    if ("title" in item && item.title) return item.title;
    return "Item Description";
  }, []);

  // Expose all hooks through context
  const value: OrganizationContextValue = {
    openModal, // Open Description Modal
    closeModal, // Close Description Modal
  };

  return (
    <OrganizationContext.Provider value={value}>
      {children}

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
                  {formatPrice(String(modalItem.price))}
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
