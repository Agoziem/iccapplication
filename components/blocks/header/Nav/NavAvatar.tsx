"use client";

import React, { useState, useCallback, memo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import useCurrentUser from "@/hooks/useCurrentUser";
import Modal from "@/components/custom/Modal/modal";
import { logoutUser } from "@/data/hooks/user.hooks";

const NavAvatar: React.FC = memo(() => {
  const { currentRoot, currentUser } = useCurrentUser();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loggingOut, setLoggingOut] = useState<boolean>(false);
  const router = useRouter();

  const logoutDashboard = useCallback(async () => {
    try {
      setLoggingOut(true);
      setShowModal(false);
      await logoutUser();
      toast.success("Logged out successfully");
      router.push("/accounts/signin");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    } finally {
      setLoggingOut(false);
    }
  }, [router]);

  const toggleModal = useCallback(() => {
    setShowModal(prev => !prev);
  }, []);

  return (
    <>
      <li className="nav-item dropdown pe-3">
        <a
          className="nav-link nav-profile d-flex align-items-center pe-0"
          href="#"
          data-bs-toggle="dropdown"
        >
          {currentUser?.avatar_url ? (
            <img
              src={`${currentUser.avatar_url}`}
              alt="Profile"
              width={35}
              height={35}
              className="rounded-circle object-fit-cover"
              style={{ objectPosition: "top center" }}
            />
          ) : (
            <div
              className="rounded-circle text-white d-flex justify-content-center align-items-center"
              style={{
                width: 40,
                height: 40,
                fontSize: 20,
                backgroundColor: "var(--secondary)",
              }}
            >
              {currentUser?.username?.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="d-none d-md-block dropdown-toggle ps-2">
            {currentUser?.first_name || currentUser?.username || "customer"}
          </span>
        </a>

        <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
          <li className="dropdown-header">
            <h6>
              {currentUser?.first_name || currentUser?.username || "customer"}
            </h6>
            <span className="d-block">
              {currentUser?.is_staff ? "admin" : "customer"}
            </span>
            <span>{currentUser?.email}</span>
          </li>
          <li>
            <hr className="dropdown-divider" />
          </li>

          <li>
            <Link
              className="dropdown-item d-flex align-items-center"
              href={`/`}
            >
              <i className="bi bi-house-door"></i>
              <span>Home page</span>
            </Link>
          </li>
          <li>
            <hr className="dropdown-divider" />
          </li>

          <li>
            <Link
              className="dropdown-item d-flex align-items-center"
              href={`/${currentRoot}/profile`}
            >
              <i className="bi bi-person"></i>
              <span>My Profile</span>
            </Link>
          </li>
          <li>
            <hr className="dropdown-divider" />
          </li>

          <li>
            <Link
              className="dropdown-item d-flex align-items-center"
              href={`/${currentRoot}/profile`}
            >
              <i className="bi bi-gear"></i>
              <span>Account Settings</span>
            </Link>
          </li>
          <li>
            <hr className="dropdown-divider" />
          </li>

          <li>
            <Link
              className="dropdown-item d-flex align-items-center"
              href={`/terms-of-use`}
            >
              <i className="bi bi-person-lock"></i>
              <span>Terms of Use</span>
            </Link>
          </li>
          <li>
            <hr className="dropdown-divider" />
          </li>

          <li>
            <Link
              className="dropdown-item d-flex align-items-center"
              href={`/privacy-policy`}
            >
              <i className="bi bi-shield-shaded"></i>
              <span>Privacy Policy</span>
            </Link>
          </li>
          <li>
            <hr className="dropdown-divider" />
          </li>

          <li>
            <Link
              className="dropdown-item d-flex align-items-center"
              href={"/#"}
              {...{
                onClick: (e) => {
                  e.preventDefault();
                  setShowModal(true);
                },
              }}
            >
              <i className="bi bi-box-arrow-right"></i>
              <span>Sign Out</span>
            </Link>
          </li>
        </ul>
      </li>

      {/* Modal for logout */}
      <Modal showmodal={showModal} toggleModal={toggleModal}>
        <div className="modal-body">
          <p className="text-center">Are you sure you want to logout?</p>
          <div className="d-flex justify-content-center mt-4">
            <button
              className="btn btn-primary me-3"
              onClick={() => {
                logoutDashboard();
              }}
            >
              {loggingOut ? (
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">logging out</span>
                </div>
              ) : (
                "Yes"
              )}
            </button>

            <button
              className="btn btn-secondary"
              onClick={toggleModal}
            >
              No
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
});

NavAvatar.displayName = 'NavAvatar';

export default NavAvatar;
