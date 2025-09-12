import React, { useState } from "react";
import Alert from "@/components/custom/Alert/Alert";
import Modal from "@/components/custom/Modal/modal";
import DepartmentForm from "./DepartmentForm";
import { deptDefault } from "@/data/constants";
import { useSearchParams, useRouter } from "next/navigation";
import {
  MainAPIendpoint,
} from "@/data/hooks/organization.hooks";
import Pagination from "@/components/custom/Pagination/Pagination";
import {
  useCreateDepartment,
  useDeleteDepartment,
  useFetchDepartments,
  useFetchStaffs,
  useUpdateDepartment,
} from "@/data/organization/organization.hook";
import toast from "react-hot-toast";

const Depts = () => {
  const OrganizationID = process.env.NEXT_PUBLIC_ORGANIZATION_ID;
  const [showModal, setShowModal] = useState(false);
  const [showdeleteModal, setShowDeleteModal] = useState(false);
  const [service, setService] = useState("");
  const [department, setDepartment] = useState(deptDefault);

  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "1";
  const pageSize = "10";
  const [addorupdate, setAddOrUpdate] = useState({
    type: "add",
    state: false,
  });

  // for data fetching
  const { data: staffs } = useFetchStaffs(
    `${MainAPIendpoint}/staff/${OrganizationID}/`
  );

  // for data fetching
  const { data: depts, isLoading: loadingdepts } = useFetchDepartments(
    `${MainAPIendpoint}/department/${OrganizationID}/?page=${page}&page_size=${pageSize}`
  );

  // Handle page change
  const handlePageChange = (newPage) => {
    router.push(`?page=${newPage}&page_size=${pageSize}`);
  };

  // -------------------------------------------------------------
  // Function to handle form submission
  // -------------------------------------------------------------

  const { mutateAsync: createDepartment,isLoading: isCreating } = useCreateDepartment();
  const { mutateAsync: updateDepartment,isLoading: isUpdating } = useUpdateDepartment();
  const handleSubmit = async (e) => {
    const { organization, staff_in_charge, services, ...restData } = department;
    const departmenttosubmit = {
      ...restData,
      organization: parseInt(OrganizationID),
      staff_in_charge: staff_in_charge.id || "",
      services: services?.map((Service) => Service.name) || [],
    };
    e.preventDefault();
    try {
      if (addorupdate.type === "add") {
        await createDepartment(departmenttosubmit);
      } else {
        await updateDepartment(departmenttosubmit);
      }
      toast.success(
        `Department ${addorupdate.type === "add" ? "added" : "updated"} successfully`
      );
    } catch (error) {
      toast.error(
        `An error occurred while ${
          addorupdate.type === "add" ? "adding" : "updating"
        } Department`
      );
    } finally {
      closeModal();
    }
  };

  // -------------------------------------------------------------
  // Function to close the modal
  // -------------------------------------------------------------

  const closeModal = () => {
    setShowModal(false);
    setShowDeleteModal(false);
    setAddOrUpdate({
      type: "add",
      state: false,
    });
    setDepartment(deptDefault);
    setService("");
  };

  // -------------------------------------------------------------
  // Function to delete a testimonial
  // -------------------------------------------------------------
  const { mutateAsync: deleteDepartment, isLoading: isDeleting } =
    useDeleteDepartment();
  /**
   * @param {number} id
   */
  const removeDepartment = async (id) => {
    try {
      await deleteDepartment(id);
      toast.success("Department deleted successfully");
    } catch (error) {
      toast.error("An error occurred while deleting Department");
    } finally {
      closeModal();
    }
  };

  return (
    <div className="px-1 px-md-4">
      <div className="mb-5 mb-md-0">
        <div className="d-flex justify-content-end mb-2">
          <button
            className="btn btn-primary border-0 rounded"
            style={{ backgroundColor: "var(--bgDarkerColor)" }}
            onClick={() => {
              setAddOrUpdate({
                type: "add",
                state: true,
              });
              setShowModal(true);
            }}
          >
            <i className="bi bi-plus-circle me-2 h5 mb-0"></i> Add Department
          </button>
        </div>
        <div>
          <h4 className="mb-1">
            {depts?.count} Department{depts?.count > 1 ? "s" : ""}
          </h4>
          <p>in total</p>
        </div>
      </div>

      {/* set of horizontal Cards that are clickable */}
      <div className="mt-4">
        {depts?.results?.length === 0 ? (
          <p>No testimonials available</p>
        ) : (
          depts?.results.map((department) => (
            <div key={department.id} className="card my-3 p-3">
              <div className="card-body">
                <h5>{department.name} Department</h5>
                <p className="card-text">
                  {department.description && department.description.length > 100
                    ? department.description.slice(0, 200) + "..."
                    : department.description}
                </p>
                <div className="d-flex align-items-center">
                  {department?.staff_in_charge?.img_url ? (
                    <img
                      src={department.staff_in_charge.img_url}
                      alt="department"
                      className="rounded-circle object-fit-cover"
                      height={75}
                      width={75}
                      style={{ objectPosition: "top center" }}
                    />
                  ) : (
                    <div
                      className="rounded-circle text-white d-flex justify-content-center align-items-center"
                      style={{
                        width: 75,
                        height: 75,
                        fontSize: "30px",
                        backgroundColor: "var(--bgDarkerColor)",
                      }}
                    >
                      {department.staff_in_charge?.name
                        ?.charAt(0)
                        .toUpperCase()}
                    </div>
                  )}
                  <div className="ms-3">
                    <h6 className="mb-1">{department.staff_in_charge?.name}</h6>
                    <p className="my-0 small">{department.name} Head</p>
                  </div>
                </div>
                <div className="d-flex flex-wrap justify-content-between align-items-center mt-3">
                  <div className="mt-3 mt-md-0">
                    <button
                      className="btn btn-accent-secondary rounded small mx-0 me-2 mx-md-3"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setAddOrUpdate({
                          type: "update",
                          state: true,
                        });
                        setDepartment(department);
                        setShowModal(true);
                      }}
                    >
                      edit department
                    </button>

                    <button
                      className="btn btn-sm btn-danger rounded px-3"
                      onClick={() => {
                        setDepartment(department);
                        setShowDeleteModal(true);
                      }}
                    >
                      delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {!loadingdepts &&
          depts &&
          Math.ceil(depts.count / parseInt(pageSize)) > 1 && (
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(depts.count / parseInt(pageSize))}
              handlePageChange={handlePageChange}
            />
          )}
      </div>

      {/* Modal for adding a new testimonial */}
      <Modal showmodal={showModal} toggleModal={() => closeModal()}>
        <div className="modal-body">
          {addorupdate.state ? (
            <DepartmentForm
              addorupdate={addorupdate}
              department={department}
              setDepartment={setDepartment}
              handleSubmit={handleSubmit}
              closeModal={closeModal}
              staffs={staffs.results}
              loading={isCreating || isUpdating}
            />
          ) : null}
        </div>
      </Modal>
      <Modal
        showmodal={showdeleteModal}
        toggleModal={() => setShowDeleteModal(false)}
      >
        <div className="modal-body">
          <div className="mt-4">
            <h4>Delete Department</h4>
            <p>Are you sure you want to delete this Department?</p>
            <button
              className="btn btn-accent-secondary border-0 text-secondary mt-3 rounded"
              onClick={() => {
                removeDepartment(department.id);
              }}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting Testimonial..." : "Delete Testimonial"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Depts;
