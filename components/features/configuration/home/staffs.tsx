"use client";
import React, { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FiUsers,
  FiEdit,
  FiTrash2,
  FiMail,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import { PulseLoader } from "react-spinners";
import Modal from "@/components/custom/Modal/modal";
import Alert from "@/components/custom/Alert/Alert";
import StaffForm from "./staffform";
import Pagination from "@/components/custom/Pagination/Pagination";
import { useDeleteStaff, useStaffs } from "@/data/hooks/organization.hooks";
import { Staff } from "@/types/organizations";
import { ORGANIZATION_ID } from "@/data/constants";
import "./homeconfig.css";
import { parseAsInteger, useQueryState } from "nuqs";

type AlertState = {
  show: boolean;
  message: string;
  type: "info" | "success" | "warning" | "danger";
};

const Staffs = () => {
  const [staff, setStaff] = useState<Staff | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    message: "",
    type: "info",
  });
  const [addorupdate, setAddOrUpdate] = useState({ mode: "add", state: false });
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [pageSize, setPageSize] = useQueryState(
    "page_size",
    parseAsInteger.withDefault(10)
  );
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDeletion] = useTransition();

  // Hooks
  const { mutateAsync: deleteStaff } = useDeleteStaff();

  // Fetch Staff
  const { data: staffs, isLoading: loadingStaffs } = useStaffs(
    parseInt(ORGANIZATION_ID || "0"),
    {
      page: page,
      page_size: pageSize,
    }
  );

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

  // Handle toggle accordion
  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Open modal for add/edit
  const openModal = (editStaff?: Staff) => {
    if (editStaff) {
      setStaff(editStaff);
      setAddOrUpdate({ mode: "update", state: true });
    } else {
      setStaff(null);
      setAddOrUpdate({ mode: "add", state: false });
    }
    setShowModal(true);
  };

  // Handle staff deletion
  const handleDelete = async (staffId: number) => {
    startDeletion(async () => {
      try {
        await deleteStaff({
          staffId,
          organizationId: parseInt(ORGANIZATION_ID || "0"),
        });
        handleAlert("Staff member deleted successfully!", "success");
        setShowDeleteModal(false);
        setStaff(null);
      } catch (error) {
        handleAlert(
          error instanceof Error
            ? error.message
            : "Failed to delete staff member",
          "danger"
        );
      }
    });
  };

  // Handle staff edit
  const handleEdit = (staff: Staff) => {
    setStaff(staff);
    setAddOrUpdate({ mode: "update", state: true });
    setShowModal(true);
  };

  // Handle staff delete confirmation
  const handleDeleteConfirm = (staff: Staff) => {
    setStaff(staff);
    setShowDeleteModal(true);
  };

  // Close modals
  const closeModal = () => {
    setShowModal(false);
    setShowDeleteModal(false);
    setStaff(null);
    setAddOrUpdate({ mode: "add", state: false });
  };

  // Handle form success
  const handleFormSuccess = () => {
    handleAlert(
      addorupdate.mode === "add"
        ? "Staff member created successfully!"
        : "Staff member updated successfully!",
      "success"
    );
    closeModal();
  };

  if (loadingStaffs) {
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
      {/* Staff Header */}
      <div className="row mb-3 align-items-center">
        <div className="col-md-6 d-flex align-items-center">
          <div>
            <h5 className="mb-1">All Staff Members</h5>
            <p className="mb-0 text-primary">
              {staffs?.count ?? 0} Staff Member
              {(staffs?.count ?? 0) !== 1 ? "s" : ""} in Total
            </p>
          </div>
        </div>
        <div className="col-md-6 text-end">
          <button
            className="btn btn-primary"
            onClick={() => openModal()}
            disabled={isPending}
          >
            Add New Staff Member
          </button>
        </div>
      </div>

      {/* Alert */}
      {alert.show && <Alert type={alert.type}>{alert.message}</Alert>}

      {/* Staff List */}
      <div className="row">
        {loadingStaffs ? (
          <div className="col-12 d-flex justify-content-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : staffs?.results?.length === 0 ? (
          <div className="col-12 text-center py-5">
            <FiUsers size={64} className="text-muted mb-3" />
            <h5 className="text-muted">No staff members found</h5>
            <p className="text-muted">
              Start by adding your first staff member
            </p>
          </div>
        ) : (
          <div className="col-12">
            {staffs?.results?.map((staffMember, index) => (
              <div key={staffMember.id} className="mb-3">
                {/* Staff Card */}
                <div className="card border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center">
                      {/* Avatar */}
                      <div className="me-4">
                        {staffMember.img_url ? (
                          <img
                            src={staffMember.img_url}
                            alt={`${staffMember.first_name} ${staffMember.last_name}`}
                            className="rounded-circle object-fit-cover"
                            height={80}
                            width={80}
                            style={{ objectPosition: "top center" }}
                          />
                        ) : (
                          <div
                            className="rounded-circle d-flex justify-content-center align-items-center text-white"
                            style={{
                              width: "80px",
                              height: "80px",
                              fontSize: "2rem",
                              backgroundColor: "var(--bs-primary)",
                            }}
                          >
                            {staffMember.first_name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* Staff Info */}
                      <div className="flex-grow-1">
                        <h6 className="mb-1 fw-bold">
                          {staffMember.first_name} {staffMember.last_name}{" "}
                          {staffMember.other_names || ""}
                        </h6>
                        <p className="text-muted mb-3">
                          {staffMember.role || "Staff Member"}
                        </p>

                        {/* Action Buttons */}
                        <div className="d-flex flex-wrap gap-2">
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => handleToggle(index)}
                          >
                            {openIndex === index
                              ? "Hide Details"
                              : "View Details"}
                          </button>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEdit(staffMember)}
                            title="Edit Staff"
                          >
                            <FiEdit size={14} className="me-1" />
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteConfirm(staffMember)}
                            title="Delete Staff"
                          >
                            <FiTrash2 size={14} className="me-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Collapsible Details */}
                  {openIndex === index && (
                    <div className="border-top bg-lighter">
                      <div className="card-body p-4">
                        <h6 className="mb-3 fw-bold">Contact Details</h6>
                        <div className="row g-4">
                          {/* Contact Information */}
                          <div className="col-md-6">
                            <div className="mb-3">
                              <h6 className="mb-1 text-secondary fw-bold small">
                                Staff ID
                              </h6>
                              <p className="mb-0">
                                {staffMember.id || "Not available"}
                              </p>
                            </div>

                            {staffMember.email && (
                              <div className="mb-3">
                                <h6 className="mb-1 text-secondary fw-bold small d-flex align-items-center">
                                  <FiMail size={14} className="me-1" />
                                  Email
                                </h6>
                                <a
                                  href={`mailto:${staffMember.email}`}
                                  className="text-decoration-none"
                                >
                                  {staffMember.email}
                                </a>
                              </div>
                            )}

                            {staffMember.phone && (
                              <div className="mb-3">
                                <h6 className="mb-1 text-secondary fw-bold small d-flex align-items-center">
                                  <FiPhone size={14} className="me-1" />
                                  Phone
                                </h6>
                                <a
                                  href={`tel:${staffMember.phone}`}
                                  className="text-decoration-none"
                                >
                                  {staffMember.phone}
                                </a>
                              </div>
                            )}

                            {staffMember.address && (
                              <div className="mb-3">
                                <h6 className="mb-1 text-secondary fw-bold small d-flex align-items-center">
                                  <FiMapPin size={14} className="me-1" />
                                  Address
                                </h6>
                                <p className="mb-0">{staffMember.address}</p>
                              </div>
                            )}
                          </div>

                          {/* Social Media Links */}
                          <div className="col-md-6">
                            <h6 className="mb-3 text-secondary fw-bold small">
                              Social Media Links
                            </h6>
                            <div className="d-flex flex-wrap gap-2">
                              {staffMember.facebooklink && (
                                <a
                                  href={staffMember.facebooklink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-sm btn-outline-primary"
                                  title="Facebook"
                                >
                                  <FaFacebook size={16} />
                                </a>
                              )}
                              {staffMember.instagramlink && (
                                <a
                                  href={staffMember.instagramlink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-sm btn-outline-danger"
                                  title="Instagram"
                                >
                                  <FaInstagram size={16} />
                                </a>
                              )}
                              {staffMember.twitterlink && (
                                <a
                                  href={staffMember.twitterlink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-sm btn-outline-info"
                                  title="Twitter"
                                >
                                  <FaTwitter size={16} />
                                </a>
                              )}
                              {staffMember.linkedinlink && (
                                <a
                                  href={staffMember.linkedinlink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-sm btn-outline-primary"
                                  title="LinkedIn"
                                >
                                  <FaLinkedin size={16} />
                                </a>
                              )}
                              {!staffMember.facebooklink &&
                                !staffMember.instagramlink &&
                                !staffMember.twitterlink &&
                                !staffMember.linkedinlink && (
                                  <p className="text-muted mb-0">
                                    No social media links available
                                  </p>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {staffs && staffs.count > pageSize && (
        <div className="row mt-4">
          <div className="col-12">
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(staffs.count / pageSize)}
              handlePageChange={handlePageChange}
            />
          </div>
        </div>
      )}

      {/* Add/Edit Staff Modal */}
      <Modal
        showmodal={showModal}
        toggleModal={closeModal}
        overlayclose={false}
      >
        <StaffForm
          staff={staff}
          editMode={addorupdate.mode === "update"}
          onSuccess={handleFormSuccess}
          onCancel={closeModal}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal showmodal={showDeleteModal} toggleModal={closeModal}>
        <div className="p-3">
          <p className="text-center">Delete Staff Member</p>
          <hr />
          <h5 className="text-center mb-4">
            {staff?.first_name} {staff?.last_name}
          </h5>
          <p className="text-center text-muted mb-4">
            Are you sure you want to delete this staff member? This action
            cannot be undone.
          </p>
          <div className="d-flex justify-content-center gap-2">
            <button
              className="btn btn-danger"
              onClick={() => staff?.id && handleDelete(staff.id)}
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

export default Staffs;
