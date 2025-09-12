import React, { useState } from "react";
import Modal from "@/components/custom/Modal/modal";
import "./homeconfig.css";
import StaffForm from "./staffform";
import { staffdefault } from "@/data/constants";
import {
  MainAPIendpoint,
} from "@/data/hooks/organization.hooks";
import { useSearchParams, useRouter } from "next/navigation";
import Pagination from "@/components/custom/Pagination/Pagination";
import { useCreateStaff, useDeleteStaff, useFetchStaffs, useUpdateStaff } from "@/data/organization/organization.hook";
import toast from "react-hot-toast";

const Staffs = () => {
  const OrganizationID = process.env.NEXT_PUBLIC_ORGANIZATION_ID;
  const [staff, setStaff] = useState(staffdefault);
  const [addorupdate, setAddorupdate] = useState({
    mode: "add",
    state: false,
  });
  const [showModal, setShowModal] = useState(false);
  const [showdeleteModal, setShowDeleteModal] = useState(false);
  const [openIndex, setOpenIndex] = useState(0);

  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "1";
  const pageSize = "10";

  // for data fetching
  const {
    data: staffs,
    isLoading: loadingstaffs,
  } = useFetchStaffs(`${MainAPIendpoint}/staff/${OrganizationID}/?page=${page}&page_size=${pageSize}`)
 

  // Handle page change
  const handlePageChange = (newPage) => {
    router.push(`?page=${newPage}&page_size=${pageSize}`);
  };

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // add a staff or edit a staff
  const { mutateAsync: createStaff, isLoading:isCreating } = useCreateStaff();
  const { mutateAsync: updateStaff, isLoading:isUpdating } = useUpdateStaff();
  const addStaff = async (e) => {
    e.preventDefault();
    const { organization, ...restData } = staff;
    const stafftosubmit = {
      ...restData,
      organization: parseInt(OrganizationID),
    };
    try {
      if (addorupdate.mode === "add") {
        await createStaff(stafftosubmit);
      } else {
        await updateStaff(stafftosubmit);
      }
      toast.success(`Staff ${addorupdate.mode === "add" ? "added" : "updated"} successfully`);
    } catch (error) {
      console.log(error.message);
      toast.error(`An error just occurred`);
    } finally {
      closeModal();
    }
  };

  const closeModal = () => {
    setShowDeleteModal(false);
    setShowModal(false);
    setStaff(staffdefault);
  };

  // remove a staff
  const { mutateAsync: deleteStaff, isLoading:isDeleting } = useDeleteStaff();
  /**
   * @async
   * @param {number} id
   */
  const deletestaff = async (id) => {
    try {
      await deleteStaff(id);
      toast.success("Staff Deleted Successfully");
    } catch (error) {
      console.log(error.message);
      toast.error("Error Deleting Staff");
    } finally {
      closeModal();
    }
  };

  return (
    <div className="px-0 px-md-4">
      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn btn-primary border-0 rounded mb-2 mb-md-0"
          style={{ backgroundColor: "var(--bgDarkerColor)" }}
          onClick={() => {
            setAddorupdate({ mode: "add", state: true });
            setShowModal(true);
          }}
        >
          <i className="bi bi-plus-circle me-2 h5 mb-0"></i> Add Staff
        </button>
      </div>

      {staffs && staffs.results?.length === 0 ? (
        <div className="card">
          <div className="card-body">
            <h5>Staffs & Team</h5>
            <p className="card-text">You have no staffs or team members yet.</p>
          </div>
        </div>
      ) : (
        <div>
          <div className="my-4">
            <h4 className="mb-1">
              {staffs?.count} Staff{staffs?.count > 1 ? "s" : ""}
            </h4>
            <p>in total</p>
          </div>

          {staffs?.results?.map((staff, index) => (
            <div key={staff.id}>
              <div className="card my-3 p-3 px-md-4 py-4">
                <div className="d-flex align-items-center">
                  <div className="me-3 me-md-4">
                    {staff.img_url ? (
                      <img
                        src={staff.img_url}
                        alt={staff.first_name}
                        className="rounded-circle object-fit-cover"
                        height={75}
                        width={75}
                        style={{ objectPosition: "top center" }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "70px",
                          height: "70px",
                          borderRadius: "50%",
                          backgroundColor: "var(--bgDarkColor)",
                          color: "var(--primary)",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          fontSize: "2rem",
                        }}
                      >
                        {staff.first_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <h6 className="mb-1">
                      {staff.first_name} {staff.last_name} {""}
                      {staff.other_names || ""}
                    </h6>
                    <p className="mb-3">{staff.role}</p>
                    <div>
                      <div
                        className="badge text-primary bg-primary-light me-2 me-md-5 mb-3 mb-md-0 rounded p-2 px-3"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleToggle(index)}
                      >
                        {openIndex === index ? (
                          <span>
                            {" "}
                            Close details{" "}
                            <i className="bi bi-chevron-up ms-2"></i>
                          </span>
                        ) : (
                          <span>
                            {" "}
                            View details{" "}
                            <i className="bi bi-chevron-down ms-2"></i>
                          </span>
                        )}
                      </div>
                      <div
                        className="badge text-secondary bg-secondary-light me-2 rounded p-2 px-3"
                        onClick={() => {
                          setAddorupdate({ mode: "update", state: true });
                          setStaff(staff);
                          setShowModal(true);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        Edit
                      </div>
                      <div
                        className="badge text-white bg-danger rounded p-2 px-3"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setStaff({
                            ...staff,
                            id: staff.id,
                          });
                          setShowDeleteModal(true);
                        }}
                      >
                        Remove
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={`myaccordion-content my-0  ${
                  openIndex === index ? "open px-4 py-4" : ""
                }`}
              >
                <div className="">
                  <h5>More details</h5>
                  <hr />
                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="mb-1 text-secondary">Staff ID</h6>
                      <p>{staff.id || "not available"}</p>
                      <h6 className="mb-1 text-secondary">Email</h6>
                      <p>{staff.email || "not available"}</p>
                      <h6 className="mb-1 text-secondary">Phone</h6>
                      <p>{staff.phone || "not available"}</p>
                      <h6 className="mb-1 text-secondary">Address</h6>
                      <p>{staff.address || "not available"}</p>
                    </div>
                    <div className="col-md-6">
                      <h6 className="mb-1 text-secondary">facebook link</h6>
                      <p>{staff.facebooklink || "not available"}</p>
                      <h6 className="mb-1 text-secondary">instagram link</h6>
                      <p>{staff.instagramlink || "not available"}</p>
                      <h6 className="mb-1 text-secondary">twitter link</h6>
                      <p>{staff.twitterlink || "not available"}</p>
                      <h6 className="mb-1 text-secondary">linkedin link</h6>
                      <p>{staff.linkedinlink || "not available"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loadingstaffs &&
        staffs &&
        Math.ceil(staffs.count / parseInt(pageSize)) > 1 && (
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(staffs.count / parseInt(pageSize))}
            handlePageChange={handlePageChange}
          />
        )}

      <Modal
        showmodal={showdeleteModal}
        toggleModal={() => setShowDeleteModal(false)}
      >
        <div className="modal-body">
          <p className="text-center mb-1">
            Are you sure you want to delete this staff ?
          </p>
          <h5 className="text-center">
            {staff.first_name} {staff.last_name} {""}
            {staff.other_names || ""}
          </h5>
          <div className="d-flex justify-content-end mt-4">
            <button
              className="btn btn-danger rounded me-3"
              onClick={() => deletestaff(staff.id)}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Yes"}
            </button>
            <button
              className="btn btn-accent-secondary rounded"
              onClick={() => setShowDeleteModal(false)}
            >
              No
            </button>
          </div>
        </div>
      </Modal>
      <Modal showmodal={showModal} toggleModal={() => closeModal()}>
        <div className="">
          <h4 className="">
            {addorupdate.mode === "add" ? "Add" : "Update"} Staff
          </h4>
          <hr />
          <StaffForm
            addStaff={addStaff}
            addorupdate={addorupdate}
            staff={staff}
            setStaff={setStaff}
            closeModal={closeModal}
            loading={isCreating || isUpdating}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Staffs;
