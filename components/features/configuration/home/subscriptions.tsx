"use client";
import React, { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiMail, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { PulseLoader } from "react-spinners";
import Modal from "@/components/custom/Modal/modal";
import Alert from "@/components/custom/Alert/Alert";
import Pagination from "@/components/custom/Pagination/Pagination";
import { UpdateSubscriptionSchema, CreateSubscriptionSchema } from "@/schemas/organizations";
import { Subscription, UpdateSubscription, CreateSubscription } from "@/types/organizations";
import {
  useCreateSubscription,
  useDeleteSubscription,
  useSubscriptions,
  useUpdateSubscription,
} from "@/data/hooks/organization.hooks";
import { ORGANIZATION_ID } from "@/data/constants";

type AlertState = {
  show: boolean;
  message: string;
  type: "info" | "success" | "warning" | "danger";
};

type CreateSubscriptionFormData = {
  email: string;
};

type UpdateSubscriptionFormData = {
  email: string;
};

const Subscriptions = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [alert, setAlert] = useState<AlertState>({ show: false, message: "", type: "info" });
  const [addorupdate, setAddOrUpdate] = useState({ mode: "add", state: false });

  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "1";
  const pageSize = "20";
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDeletion] = useTransition();

  // Hooks
  const { mutateAsync: createSubscription } = useCreateSubscription();
  const { mutateAsync: updateSubscription } = useUpdateSubscription();
  const { mutateAsync: deleteSubscription } = useDeleteSubscription();

  // Fetch Subscriptions
  const { data: subscriptions, isLoading: loadingSubscriptions } = useSubscriptions(
    parseInt(ORGANIZATION_ID || "0", 10),
    {
      page: parseInt(page, 10),
      page_size: parseInt(pageSize, 10),
    }
  );

  // Form setup
  const {
    control,
    handleSubmit: handleFormSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<CreateSubscriptionFormData | UpdateSubscriptionFormData>({
    resolver: zodResolver(
      addorupdate.mode === "add" ? CreateSubscriptionSchema : UpdateSubscriptionSchema
    ),
    defaultValues: {
      email: "",
    },
  });

  // Handle alert display
  const handleAlert = (message: string, type: AlertState["type"]) => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "info" });
    }, 5000);
  };

  // Handle page change
  const handlePageChange = (newPage: string | number) => {
    const pageNum = typeof newPage === "string" ? parseInt(newPage) : newPage;
    router.push(`?page=${pageNum}&page_size=${pageSize}`, { scroll: false });
  };

  // Open modal for add/edit
  const openModal = (editSubscription?: Subscription) => {
    if (editSubscription) {
      setSubscription(editSubscription);
      setValue("email", editSubscription.email);
      setAddOrUpdate({ mode: "update", state: true });
    } else {
      setSubscription(null);
      reset();
      setAddOrUpdate({ mode: "add", state: false });
    }
    setShowModal(true);
  };

  // Close modals
  const closeModal = () => {
    setShowModal(false);
    setShowDeleteModal(false);
    setSubscription(null);
    setAddOrUpdate({ mode: "add", state: false });
    reset();
  };

  // Handle form submission
  const onSubmit = async (data: CreateSubscriptionFormData | UpdateSubscriptionFormData) => {
    startTransition(async () => {
      try {
        if (addorupdate.mode === "add") {
          await createSubscription({
            organizationId: parseInt(ORGANIZATION_ID || "0", 10),
            subscriptionData: {
              email: data.email,
            },
          });
          handleAlert("Subscription added successfully!", "success");
        } else if (subscription) {
          await updateSubscription({
            subscriptionId: subscription.id || 0,
            organizationId: parseInt(ORGANIZATION_ID || "0", 10),
            updateData: {
              email: data.email,
            },
          });
          handleAlert("Subscription updated successfully!", "success");
        }
        closeModal();
      } catch (error) {
        handleAlert(
          error instanceof Error ? error.message : "Failed to save subscription",
          "danger"
        );
      }
    });
  };

  // Handle subscription deletion
  const handleDelete = async (subscriptionId: number) => {
    startDeletion(async () => {
      try {
        await deleteSubscription({
          subscriptionId,
          organizationId: parseInt(ORGANIZATION_ID || "0", 10),
        });
        handleAlert("Subscription deleted successfully!", "success");
        setShowDeleteModal(false);
        setSubscription(null);
      } catch (error) {
        handleAlert(
          error instanceof Error ? error.message : "Failed to delete subscription",
          "danger"
        );
      }
    });
  };

  // Handle subscription edit
  const handleEdit = (subscription: Subscription) => {
    openModal(subscription);
  };

  // Handle subscription delete confirmation
  const handleDeleteConfirm = (subscription: Subscription) => {
    setSubscription(subscription);
    setShowDeleteModal(true);
  };

  if (loadingSubscriptions) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <PulseLoader color="#0d6efd" size={15} />
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="d-flex align-items-center">
            <FiMail size={32} className="text-primary me-2" />
            <h4 className="mb-0">Email Subscriptions</h4>
          </div>
        </div>
        <div className="col-md-6 text-end">
          <button
            className="btn btn-primary"
            onClick={() => openModal()}
            disabled={isPending}
          >
            <FiPlus size={16} className="me-1" />
            Add Email
          </button>
        </div>
      </div>

      {/* Subscription Header */}
      <div className="row mb-3 align-items-center">
        <div className="col-md-6">
          <h5 className="mb-1">All Subscriptions</h5>
          <p className="mb-0 text-primary">
            {(subscriptions?.count ?? 0)} Subscription{(subscriptions?.count ?? 0) !== 1 ? "s" : ""} in Total
          </p>
        </div>
      </div>

      {/* Alert */}
      {alert.show && <Alert type={alert.type}>{alert.message}</Alert>}

      {/* Subscriptions List */}
      <div className="row">
        {loadingSubscriptions ? (
          <div className="col-12 d-flex justify-content-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : subscriptions?.results?.length === 0 ? (
          <div className="col-12 text-center py-5">
            <FiMail size={64} className="text-muted mb-3" />
            <h5 className="text-muted">No subscriptions found</h5>
            <p className="text-muted">Start by adding your first subscription email</p>
          </div>
        ) : (
          <div className="col-12">
            {subscriptions?.results?.map((subscriptionItem) => (
              <div key={subscriptionItem.id} className="mb-3">
                {/* Subscription Card */}
                <div className="card border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center justify-content-between">
                      {/* Email Info */}
                      <div className="d-flex align-items-center flex-grow-1">
                        <div
                          className="rounded-circle d-flex justify-content-center align-items-center text-white me-3"
                          style={{
                            width: "50px",
                            height: "50px",
                            fontSize: "1.5rem",
                            backgroundColor: "var(--bs-primary)",
                          }}
                        >
                          <FiMail size={20} />
                        </div>

                        <div className="flex-grow-1">
                          <h6 className="mb-1 fw-bold">{subscriptionItem.email}</h6>
                          <p className="text-muted mb-0 small">
                            Added on {subscriptionItem.date_added ? new Date(subscriptionItem.date_added).toLocaleDateString() : "Unknown date"}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEdit(subscriptionItem)}
                          title="Edit Subscription"
                        >
                          <FiEdit size={14} className="me-1" />
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteConfirm(subscriptionItem)}
                          title="Delete Subscription"
                        >
                          <FiTrash2 size={14} className="me-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {subscriptions && subscriptions.count > parseInt(pageSize) && (
        <div className="row mt-4">
          <div className="col-12">
            <Pagination
              currentPage={parseInt(page)}
              totalPages={Math.ceil(subscriptions.count / parseInt(pageSize))}
              handlePageChange={handlePageChange}
            />
          </div>
        </div>
      )}

      {/* Add/Edit Subscription Modal */}
      <Modal showmodal={showModal} toggleModal={closeModal} overlayclose={false}>
        <div className="p-3">
          <h5 className="text-center mb-3">
            {addorupdate.mode === "add" ? "Add New Subscription" : "Update Subscription"}
          </h5>
          <hr />
          
          <form onSubmit={handleFormSubmit(onSubmit)}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-bold">
                Email Address <span className="text-danger">*</span>
              </label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    id="email"
                    placeholder="Enter email address"
                  />
                )}
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email.message}</div>
              )}
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeModal}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="d-inline-flex align-items-center justify-content-center gap-2">
                    <div>{addorupdate.mode === "add" ? "Adding..." : "Updating..."}</div>
                    <PulseLoader size={8} color={"#ffffff"} loading={true} />
                  </div>
                ) : (
                  addorupdate.mode === "add" ? "Add Email" : "Update Email"
                )}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal showmodal={showDeleteModal} toggleModal={closeModal}>
        <div className="p-3">
          <p className="text-center">Delete Subscription</p>
          <hr />
          <h5 className="text-center mb-4">
            {subscription?.email}
          </h5>
          <p className="text-center text-muted mb-4">
            Are you sure you want to delete this subscription? This action cannot be undone.
          </p>
          <div className="d-flex justify-content-center gap-2">
            <button
              className="btn btn-danger"
              onClick={() => subscription?.id && handleDelete(subscription.id)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="d-inline-flex align-items-center justify-content-center gap-2">
                  <div>Deleting...</div>
                  <PulseLoader size={8} color={"#ffffff"} loading={true} />
                </div>
              ) : (
                "Delete"
              )}
            </button>
            <button
              className="btn btn-secondary"
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Subscriptions;
