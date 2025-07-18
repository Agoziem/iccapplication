import React, { useState } from "react";
import "./Profile.css";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Alert from "../../custom/Alert/Alert";
import Modal from "../../custom/Modal/modal";
import { useFetchPaymentsByUser } from "@/data/payments/orders.hook";

const ProfileCard = ({ alert, setEditMode }) => {
  const [showModal, setShowModal] = useState(false);
  const { data: session } = useSession();
  const [active, setActive] = useState(1);

  const { data: userOrders } = useFetchPaymentsByUser(session?.user?.id);

  const deleteUser = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/authapi/delete/${session?.user?.id}/`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      signOut();
      setShowModal(false);
    }
  };
  return (
    <div className="p-2 p-md-3 py-3">
      <div className="row">
        {/* Profile Link */}
        <div className="col-md-4">
          <div className="card py-3">
            <div className="profilepicture d-flex flex-column justify-content-center align-items-center my-3">
              {session && session.user.image ? (
                <img
                  src={session?.user?.image}
                  alt="Picture of the Customer"
                  width={80}
                  height={80}
                  className="rounded-circle"
                  style={{ objectFit: "cover", objectPosition: "top center" }}
                />
              ) : (
                <div
                  className="rounded-circle text-white d-flex justify-content-center align-items-center"
                  style={{
                    width: 80,
                    height: 80,
                    fontSize: 40,
                    backgroundColor: "var(--bgDarkerColor)",
                  }}
                >
                  {session?.user?.username?.charAt(0).toUpperCase()}
                </div>
              )}
              <h6 className="text-primary mt-3 mb-0">
                {session?.user?.username}
              </h6>
              <span className="text-primary text-opacity-25">
                {session?.user?.is_staff ? "admin" : "customer"}
              </span>
            </div>
            <div
              className={`p-2 ps-4 profilelinks ${
                active === 1 ? "activeprofilelink" : ""
              }`}
              onClick={() => {
                setActive(1);
              }}
            >
              <i
                className={`bi bi-person${active === 1 ? "-fill" : ""} me-2`}
              ></i>
              Account Settings
            </div>

            <div
              className={`p-2 ps-4 profilelinks ${
                active === 2 ? "activeprofilelink" : ""
              }`}
              onClick={() => {
                setActive(2);
              }}
            >
              <i
                className={`bi bi-shield${
                  active === 2 ? "-fill" : ""
                }-check me-2`}
              ></i>
              verification & 2FA
            </div>
            <div
              className={`p-2 ps-4 profilelinks ${
                active === 3 ? "activeprofilelink" : ""
              }`}
              onClick={() => {
                setActive(3);
              }}
            >
              <i
                className={`bi bi-trash${active === 3 ? "-fill" : ""} me-2`}
              ></i>
              delete Account
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="col-md-8">
          <div className="card pb-4 pb-md-4 px-5 px-md-5 ">
            {active === 1 && (
              <div className="">
                {
                  <div className="mt-3">
                    <Alert type={alert.type}>
                      <div>{alert.message}</div>
                      {alert.type === "success" && (
                        <div className="mt-2">
                          <button
                            className="btn btn-success my-3 rounded float-end"
                            onClick={() => {
                              signOut();
                            }}
                          >
                            log out
                          </button>
                        </div>
                      )}
                    </Alert>
                  </div>
                }
                <div>
                  <h4 className="my-2">Account Settings</h4>
                  <div className="float-end">
                    <i
                      className="bi bi-pencil-square h5 text-primary"
                      style={{ cursor: "pointer" }}
                      onClick={() => setEditMode(true)}
                    ></i>
                  </div>
                </div>
                <div className="my-3">
                  <h6>Personal information</h6>
                  <hr />
                  <div>
                    <div className="row">
                      <div className="my-2 col-12 col-md-6">
                        <p className="text-primary fw-bold mb-0">
                          <i className="bi bi-person-fill me-2"></i>Full Name
                        </p>
                        <span>
                          {session?.user?.first_name && session?.user?.last_name
                            ? session?.user?.first_name +
                              " " +
                              session?.user?.last_name
                            : "not available"}
                        </span>
                      </div>
                      <div className="my-2 col-12 col-md-6">
                        <p className="text-primary fw-bold mb-0">
                          <i className="bi bi-envelope-at-fill me-2"></i>Email
                        </p>
                        <span>{session?.user?.email || "not available"}</span>
                      </div>
                      <div className="my-2 col-12 col-md-6">
                        <p className="text-primary fw-bold mb-0">
                          <i className="bi bi-gender-ambiguous me-2 h4"></i>
                          Gender
                        </p>
                        <span>{session?.user?.sex || "not available"}</span>
                      </div>

                      <div className="my-2 col-12 col-md-6">
                        <p className="text-primary fw-bold mb-0">
                          <i className="bi bi-telephone-fill me-2"></i>Phone
                          number
                        </p>
                        <span>{session?.user?.phone || "not available"}</span>
                      </div>

                      <div className="my-2 col-12 col-md-6">
                        <p className="text-primary fw-bold mb-0">
                          <i className="bi bi-geo-alt-fill me-2"></i>Address
                        </p>
                        <span>{session?.user?.address || "not available"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="my-3">
                  <h6>Customer information</h6>
                  <hr />
                  <div>
                    <div className="row">
                      <div className="my-2 col-12 col-md-6">
                        <div className="bg-secondary-light rounded p-3">
                          <p className="text-secondary mb-0">
                            <i className="bi bi-cart me-3"></i>Orders
                          </p>
                          <span className="text-secondary h3 fw-bold">
                            {userOrders?.length}{" "}
                          </span>
                          <span className="text-secondary p fw-bold">
                            Order
                            {userOrders?.length > 1 && "s"}
                          </span>
                        </div>
                      </div>

                      <div className="my-2 col-12 col-md-6">
                        <div className="bg-success-light text-success rounded p-3">
                          <p className="text-success mb-0">
                            <i className="bi bi-cart-check me-3"></i>Completed
                            Orders
                          </p>
                          <span className="fw-bold h3">
                            {
                              userOrders?.filter(
                                (order) => order.status === "Completed"
                              ).length
                            }{" "}
                          </span>
                          <span className="p fw-bold">
                            Order
                            {userOrders?.filter(
                              (order) => order.status === "Completed"
                            ).length > 1 && "s"}
                          </span>
                        </div>
                      </div>

                      <div className="col-12 col-md-6 my-2">
                        <div className="bg-primary-light text-primary p-3 rounded">
                          <p className="text-primary mb-0">
                            <i className="bi bi-cart-dash me-3"></i>Pending
                            Orders
                          </p>
                          <span className="fw-bold h3">
                            {
                              userOrders?.filter(
                                (order) => order.status === "Pending"
                              ).length
                            }{" "}
                          </span>
                          <span className="p fw-bold">
                            Order
                            {userOrders?.filter(
                              (order) => order.status === "Pending"
                            ).length > 1 && "s"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {active === 2 && (
              <div className="pt-4 pt-md-4">
                <h5 className="my-3">Verification & 2FA</h5>
                <hr />
                <div className="my-3 mb-4">
                  <h6>email Verification</h6>
                  <div className="d-flex flex-wrap justify-content-between pe-3 mb-3">
                    <p>{session?.user?.email}</p>
                    <div>
                      {session?.user?.emailIsVerified ? (
                        <span className="badge bg-success-light text-success rounded-5 px-3 ms-2">
                          verified
                        </span>
                      ) : (
                        <span className="badge bg-danger-light text-danger rounded-5 px-3 ms-2">
                          not verified
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="my-4">
                    {!session?.user?.emailIsVerified && (
                      <Link
                        href={"#"}
                        className="bg-primary-light rounded px-3 py-2 "
                      >
                        verify email
                      </Link>
                    )}
                  </div>
                </div>

                <hr />
                <div className="my-3 mb-4">
                  <h6 className="my-2">2FA Authentication</h6>
                  <div className="d-flex flex-wrap  justify-content-between pe-3 mb-2">
                    <p>two factor Authentication</p>
                    <div>
                      {session?.user?.twofactorIsEnabled ? (
                        <span className="badge bg-success-light text-success rounded-5 px-3 ms-2">
                          enabled
                        </span>
                      ) : (
                        <span className="badge bg-danger-light text-danger rounded-5 px-3 ms-2">
                          disabled
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mb-2 small fst-italic ">...coming soon</div>
                  <div className="my-4">
                    {!session?.user?.twofactorIsEnabled && (
                      <Link
                        href={"#"}
                        className="bg-primary-light rounded px-3 py-2"
                      >
                        enable 2FA
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}

            {active === 3 && (
              <div className="pt-4 pt-md-4 pb-3">
                <h5 className="my-2">delete Account</h5>
                <hr />
                <div className=" bg-danger-light text-danger border border-1 border-danger rounded p-3">
                  you are about to delete your account, this action is
                  irreversible and all your Order data will be lost, and you
                  will be logged out
                  <div className="mt-3">
                    <button
                      className="btn btn-danger rounded float-end"
                      onClick={() => setShowModal(true)}
                    >
                      delete account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Modal for delete Account */}
      <Modal showmodal={showModal} toggleModal={() => setShowModal(false)}>
        <div className="modal-body">
          <p className="text-center">
            Are you sure you want to delete your Account
          </p>
          <div className="d-flex justify-content-center mt-4">
            <button
              className="btn btn-danger me-3"
              onClick={() => {
                deleteUser();
              }}
            >
              Yes
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => setShowModal(false)}
            >
              No
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfileCard;
