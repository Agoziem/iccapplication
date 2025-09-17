"use client";
import React, { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiMessageSquare, FiEdit, FiTrash2, FiStar } from "react-icons/fi";
import { BiSolidQuoteAltRight } from "react-icons/bi";
import { PulseLoader } from "react-spinners";
import Modal from "@/components/custom/Modal/modal";
import Alert from "@/components/custom/Alert/Alert";
import StarRating from "@/components/custom/StarRating/StarRating";
import TestimonialForm from "./TestimonialForm";
import Pagination from "@/components/custom/Pagination/Pagination";
import {
  useDeleteTestimonial,
  useTestimonials,
} from "@/data/hooks/organization.hooks";
import { Testimonial } from "@/types/organizations";
import { ORGANIZATION_ID } from "@/data/constants";
import { parseAsInteger, useQueryState } from "nuqs";

type AlertState = {
  show: boolean;
  message: string;
  type: "info" | "success" | "warning" | "danger";
};

const Testimonials = () => {
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    message: "",
    type: "info",
  });
  const [addorupdate, setAddOrUpdate] = useState({ mode: "add", state: false });
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [pageSize, setPageSize] = useQueryState(
    "page_size",
    parseAsInteger.withDefault(10)
  );
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDeletion] = useTransition();

  // Hooks
  const { mutateAsync: deleteTestimonial } = useDeleteTestimonial();

  // Fetch Testimonials
  const { data: testimonials, isLoading: loadingTestimonials } =
    useTestimonials(parseInt(ORGANIZATION_ID || "0"), {
      page: page,
      page_size: pageSize,
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
    setPage(pageNum);
  };

  // Open modal for add/edit
  const openModal = (editTestimonial?: Testimonial) => {
    if (editTestimonial) {
      setTestimonial(editTestimonial);
      setAddOrUpdate({ mode: "update", state: true });
    } else {
      setTestimonial(null);
      setAddOrUpdate({ mode: "add", state: false });
    }
    setShowModal(true);
  };

  // Handle testimonial deletion
  const handleDelete = async (testimonialId: number) => {
    startDeletion(async () => {
      try {
        await deleteTestimonial({
          testimonialId,
          organizationId: parseInt(ORGANIZATION_ID || "0"),
        });
        handleAlert("Testimonial deleted successfully!", "success");
        setShowDeleteModal(false);
        setTestimonial(null);
      } catch (error) {
        handleAlert(
          error instanceof Error
            ? error.message
            : "Failed to delete testimonial",
          "danger"
        );
      }
    });
  };

  // Handle testimonial edit
  const handleEdit = (testimonial: Testimonial) => {
    setTestimonial(testimonial);
    setAddOrUpdate({ mode: "update", state: true });
    setShowModal(true);
  };

  // Handle testimonial delete confirmation
  const handleDeleteConfirm = (testimonial: Testimonial) => {
    setTestimonial(testimonial);
    setShowDeleteModal(true);
  };

  // Close modals
  const closeModal = () => {
    setShowModal(false);
    setShowDeleteModal(false);
    setTestimonial(null);
    setAddOrUpdate({ mode: "add", state: false });
  };

  // Handle form success
  const handleFormSuccess = () => {
    handleAlert(
      addorupdate.mode === "add"
        ? "Testimonial created successfully!"
        : "Testimonial updated successfully!",
      "success"
    );
    closeModal();
  };

  if (loadingTestimonials) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "400px" }}
      >
        <PulseLoader color="#0d6efd" size={15} />
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Testimonials Header */}
      <div className="row mb-3 align-items-center">
        <div className="col-md-6">
          <h5 className="mb-1">All Testimonials</h5>
          <p className="mb-0 text-primary">
            {testimonials?.count ?? 0} Testimonial
            {(testimonials?.count ?? 0) !== 1 ? "s" : ""} in Total
          </p>
        </div>
        <div className="col-md-6 text-end">
          <button
            className="btn btn-primary"
            onClick={() => openModal()}
            disabled={isPending}
          >
            Add New Testimonial
          </button>
        </div>
      </div>

      {/* Alert */}
      {alert.show && <Alert type={alert.type}>{alert.message}</Alert>}

      {/* Testimonials List */}
      <div className="row">
        {loadingTestimonials ? (
          <div className="col-12 d-flex justify-content-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : testimonials?.results?.length === 0 ? (
          <div className="col-12 text-center py-5">
            <FiMessageSquare size={64} className="text-muted mb-3" />
            <h5 className="text-muted">No testimonials found</h5>
            <p className="text-muted">Start by adding your first testimonial</p>
          </div>
        ) : (
          <div className="col-12">
            {testimonials?.results?.map((testimonial) => (
              <div
                key={testimonial.id}
                className="card my-3 border-0 shadow-sm"
              >
                <div className="card-body p-4">
                  {/* Quote Icon */}
                  <div className="d-flex justify-content-end mb-2">
                    <BiSolidQuoteAltRight
                      className="text-primary opacity-50"
                      style={{ fontSize: "35px" }}
                    />
                  </div>

                  {/* Testimonial Content */}
                  <p
                    className="card-text fs-6 mb-4 text-muted"
                    style={{ lineHeight: "1.6" }}
                  >
                    {testimonial.content}
                  </p>

                  {/* User Info & Actions */}
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-start">
                    {/* User Details */}
                    <div className="d-flex align-items-center mb-3 mb-md-0">
                      {/* Avatar */}
                      {testimonial.img_url ? (
                        <img
                          src={testimonial.img_url}
                          alt={testimonial.name}
                          className="rounded-circle object-fit-cover me-3"
                          height={60}
                          width={60}
                          style={{ objectPosition: "top center" }}
                        />
                      ) : (
                        <div
                          className="rounded-circle text-white d-flex justify-content-center align-items-center me-3"
                          style={{
                            width: 60,
                            height: 60,
                            fontSize: "24px",
                            backgroundColor: "var(--bs-primary)",
                          }}
                        >
                          {testimonial.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                      )}

                      {/* User Info */}
                      <div>
                        <h6 className="mb-1 fw-bold">
                          {testimonial.name || "Anonymous"}
                        </h6>
                        <p className="mb-1 small text-muted">
                          {testimonial.role || "Customer"}
                        </p>
                        <div className="d-flex align-items-center">
                          <StarRating rating={testimonial.rating || 5} />
                          <small className="text-muted ms-2">
                            {testimonial.rating || 5}/5 stars
                          </small>
                        </div>
                      </div>
                    </div>

                    {/* Meta Info & Actions */}
                    <div className="d-flex flex-column align-items-md-end">
                      {/* Date */}
                      <div className="text-muted small mb-3">
                        {testimonial.created_at
                          ? new Date(testimonial.created_at).toDateString()
                          : "No date"}
                      </div>

                      {/* Action Buttons */}
                      <div className="btn-group" role="group">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEdit(testimonial)}
                          title="Edit Testimonial"
                        >
                          <FiEdit size={14} />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteConfirm(testimonial)}
                          title="Delete Testimonial"
                        >
                          <FiTrash2 size={14} />
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
      {testimonials && testimonials.count > pageSize && (
        <div className="row mt-4">
          <div className="col-12">
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(testimonials.count / pageSize)}
              handlePageChange={handlePageChange}
            />
          </div>
        </div>
      )}

      {/* Add/Edit Testimonial Modal */}
      <Modal
        showmodal={showModal}
        toggleModal={closeModal}
        overlayclose={false}
      >
        <TestimonialForm
          testimonial={testimonial}
          editMode={addorupdate.mode === "update"}
          onSuccess={handleFormSuccess}
          onCancel={closeModal}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal showmodal={showDeleteModal} toggleModal={closeModal}>
        <div className="p-3">
          <p className="text-center">Delete Testimonial</p>
          <hr />
          <h5 className="text-center mb-4">
            {testimonial?.name || "Anonymous"}
          </h5>
          <p className="text-center text-muted mb-4">
            Are you sure you want to delete this testimonial? This action cannot
            be undone.
          </p>
          <div className="d-flex justify-content-center gap-2">
            <button
              className="btn btn-danger"
              onClick={() => testimonial?.id && handleDelete(testimonial.id)}
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
            <button className="btn btn-secondary" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Testimonials;
