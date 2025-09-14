"use client";
import React, { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiEdit, FiTrash2, FiPlus, FiUser, FiHome } from "react-icons/fi";
import { PulseLoader } from "react-spinners";
import Modal from "@/components/custom/Modal/modal";
import Alert from "@/components/custom/Alert/Alert";
import DepartmentForm from "./DepartmentForm";
import Pagination from "@/components/custom/Pagination/Pagination";
import { useDepartments, useDeleteDepartment } from "@/data/hooks/organization.hooks";
import { Department } from "@/types/organizations";
import { ORGANIZATION_ID } from "@/data/constants";

type AlertState = {
  show: boolean;
  message: string;
  type: "info" | "success" | "warning" | "danger";
};

const Depts = () => {
  const [department, setDepartment] = useState<Department | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [alert, setAlert] = useState<AlertState>({ show: false, message: "", type: "info" });
  const [addorupdate, setAddOrUpdate] = useState({ mode: "add", state: false });

  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "1";
  const pageSize = "10";
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDeletion] = useTransition();

  // Hooks
  const { mutateAsync: deleteDepartment } = useDeleteDepartment();

  // Fetch Departments
  const { data: depts, isLoading: loadingdepts } = useDepartments(
    parseInt(ORGANIZATION_ID || "0", 10)
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
    router.push(`?page=${pageNum}&page_size=${pageSize}`, { scroll: false });
  };

  // Open modal for add/edit
  const openModal = (editDepartment?: Department) => {
    if (editDepartment) {
      setDepartment(editDepartment);
      setAddOrUpdate({ mode: "update", state: true });
    } else {
      setDepartment(null);
      setAddOrUpdate({ mode: "add", state: false });
    }
    setShowModal(true);
  };

  // Handle department deletion
  const handleDelete = async (departmentId: number) => {
    startDeletion(async () => {
      try {
        await deleteDepartment({
          departmentId,
          organizationId: parseInt(ORGANIZATION_ID || "0", 10),
        });
        handleAlert("Department deleted successfully!", "success");
        setShowDeleteModal(false);
        setDepartment(null);
      } catch (error) {
        handleAlert(
          error instanceof Error ? error.message : "Failed to delete department",
          "danger"
        );
      }
    });
  };

  // Handle department edit
  const handleEdit = (department: Department) => {
    setDepartment(department);
    setAddOrUpdate({ mode: "update", state: true });
    setShowModal(true);
  };

  // Handle department delete confirmation
  const handleDeleteConfirm = (department: Department) => {
    setDepartment(department);
    setShowDeleteModal(true);
  };

  // Close modals
  const closeModal = () => {
    setShowModal(false);
    setShowDeleteModal(false);
    setDepartment(null);
    setAddOrUpdate({ mode: "add", state: false });
  };

  // Handle form success
  const handleFormSuccess = () => {
    handleAlert(
      addorupdate.mode === "add" ? "Department created successfully!" : "Department updated successfully!",
      "success"
    );
    closeModal();
  };

  if (loadingdepts) {
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
            <FiHome size={32} className="text-primary me-2" />
            <h4 className="mb-0">Department Management</h4>
          </div>
        </div>
        <div className="col-md-6 text-end">
          <button
            className="btn btn-primary"
            onClick={() => openModal()}
            disabled={isPending}
          >
            <FiPlus size={16} className="me-1" />
            Add Department
          </button>
        </div>
      </div>

      {/* Department Header */}
      <div className="row mb-3 align-items-center">
        <div className="col-md-6">
          <h5 className="mb-1">All Departments</h5>
          <p className="mb-0 text-primary">
            {(depts?.count ?? 0)} Department{(depts?.count ?? 0) !== 1 ? "s" : ""} in Total
          </p>
        </div>
      </div>

      {/* Alert */}
      {alert.show && <Alert type={alert.type}>{alert.message}</Alert>}

      {/* Departments List */}
      <div className="row">
        {loadingdepts ? (
          <div className="col-12 d-flex justify-content-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : depts?.results?.length === 0 ? (
          <div className="col-12 text-center py-5">
            <FiHome size={64} className="text-muted mb-3" />
            <h5 className="text-muted">No departments found</h5>
            <p className="text-muted">Start by adding your first department</p>
          </div>
        ) : (
          <div className="col-12">
            {depts?.results?.map((departmentItem) => (
              <div key={departmentItem.id} className="mb-3">
                {/* Department Card */}
                <div className="card border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div className="row align-items-start">
                      {/* Department Image */}
                      <div className="col-md-3 text-center mb-3 mb-md-0">
                        {departmentItem.img_url ? (
                          <img
                            src={departmentItem.img_url}
                            alt={departmentItem.name}
                            className="rounded"
                            style={{
                              width: "100%",
                              maxWidth: "200px",
                              height: "120px",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div
                            className="rounded d-flex justify-content-center align-items-center text-white mx-auto"
                            style={{
                              width: "100%",
                              maxWidth: "200px",
                              height: "120px",
                              fontSize: "2rem",
                              backgroundColor: "var(--bs-primary)",
                            }}
                          >
                            <FiHome size={48} />
                          </div>
                        )}
                      </div>

                      {/* Department Info */}
                      <div className="col-md-6">
                        <h5 className="fw-bold mb-2">{departmentItem.name} Department</h5>
                        <p className="text-muted mb-3">
                          {departmentItem.description && departmentItem.description.length > 150
                            ? `${departmentItem.description.slice(0, 150)}...`
                            : departmentItem.description}
                        </p>

                        {/* Department Head */}
                        <div className="d-flex align-items-center mb-3">
                          {departmentItem.staff_in_charge?.img_url ? (
                            <img
                              src={departmentItem.staff_in_charge.img_url}
                              alt="Department Head"
                              className="rounded-circle object-fit-cover me-3"
                              style={{
                                width: "50px",
                                height: "50px",
                                objectPosition: "top center",
                              }}
                            />
                          ) : (
                            <div
                              className="rounded-circle d-flex justify-content-center align-items-center text-white me-3"
                              style={{
                                width: "50px",
                                height: "50px",
                                fontSize: "1.2rem",
                                backgroundColor: "var(--bs-secondary)",
                              }}
                            >
                              <FiUser size={20} />
                            </div>
                          )}
                          <div>
                            <h6 className="mb-0">
                              {departmentItem.staff_in_charge?.first_name} {departmentItem.staff_in_charge?.last_name}
                            </h6>
                            <p className="text-muted mb-0 small">Department Head</p>
                          </div>
                        </div>

                        {/* Services */}
                        {departmentItem.services && departmentItem.services.length > 0 && (
                          <div className="mb-3">
                            <h6 className="fw-bold mb-2">Services ({departmentItem.services.length})</h6>
                            <div className="d-flex flex-wrap gap-1">
                              {departmentItem.services.slice(0, 3).map((service, index) => (
                                <span
                                  key={index}
                                  className="badge bg-light text-dark border small"
                                >
                                  {service.name}
                                </span>
                              ))}
                              {departmentItem.services.length > 3 && (
                                <span className="badge bg-secondary small">
                                  +{departmentItem.services.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="col-md-3 text-end">
                        <div className="d-flex flex-column gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEdit(departmentItem)}
                            title="Edit Department"
                          >
                            <FiEdit size={14} className="me-1" />
                            Edit Department
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteConfirm(departmentItem)}
                            title="Delete Department"
                          >
                            <FiTrash2 size={14} className="me-1" />
                            Delete Department
                          </button>
                        </div>
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
      {depts && depts.count > parseInt(pageSize) && (
        <div className="row mt-4">
          <div className="col-12">
            <Pagination
              currentPage={parseInt(page)}
              totalPages={Math.ceil(depts.count / parseInt(pageSize))}
              handlePageChange={handlePageChange}
            />
          </div>
        </div>
      )}

      {/* Add/Edit Department Modal */}
      <Modal showmodal={showModal} toggleModal={closeModal} overlayclose={false}>
        <DepartmentForm
          department={department}
          editMode={addorupdate.mode === "update"}
          onSuccess={handleFormSuccess}
          onCancel={closeModal}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal showmodal={showDeleteModal} toggleModal={closeModal}>
        <div className="p-3">
          <p className="text-center">Delete Department</p>
          <hr />
          <h5 className="text-center mb-4">
            {department?.name} Department
          </h5>
          <p className="text-center text-muted mb-4">
            Are you sure you want to delete this department? This action cannot be undone.
          </p>
          <div className="d-flex justify-content-center gap-2">
            <button
              className="btn btn-danger"
              onClick={() => department?.id && handleDelete(department.id)}
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

export default Depts;
