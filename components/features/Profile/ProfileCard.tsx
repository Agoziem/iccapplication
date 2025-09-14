import React, { useState, useCallback, useMemo } from "react";
import Alert from "../../custom/Alert/Alert";
import Modal from "../../custom/Modal/modal";
import ProfileForm from "./ProfileForm";
import { useDeleteUser, useMyProfile, logoutUser } from "@/data/hooks/user.hooks";
import { usePaymentsByUser } from "@/data/hooks/payment.hooks";
import "./Profile.css";

interface ProfileCardProps {
  alert: { 
    show: boolean;
    type: "success" | "danger" | "info" | "warning"; 
    message: string; 
  };
  setAlert: (alert: { show: boolean; type: "success" | "danger" | "info" | "warning"; message: string }) => void;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}

type ProfileSection = 'account' | 'verification' | 'delete';

interface OrdersSummary {
  total: number;
  completed: number;
  pending: number;
}

/**
 * Enhanced ProfileCard component with comprehensive TypeScript and improved UX
 * Displays user profile information, verification status, and account management
 * Optimized with React.memo and proper error handling
 */
const ProfileCard: React.FC<ProfileCardProps> = React.memo(({ alert, setAlert, setEditMode }) => {
  // State management
  const [showModal, setShowModal] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<ProfileSection>('account');
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [editMode, setLocalEditMode] = useState<boolean>(false);

  // Data fetching
  const { data: user, isLoading: isUserLoading, error: userError } = useMyProfile();
  const { data: userOrders, isLoading: isOrdersLoading } = usePaymentsByUser(user?.id || 0);
  const { mutateAsync: deleteUserMutation } = useDeleteUser();

  // Memoized user display data
  const userDisplayData = useMemo(() => {
    if (!user) return null;
    
    return {
      displayName: user.username || user.first_name || "User",
      fullName: user.first_name && user.last_name 
        ? `${user.first_name} ${user.last_name}`
        : "Not available",
      avatarUrl: user.avatar_url,
      userType: user.is_staff ? "admin" : "customer",
      initials: (user.username || user.first_name || "U").charAt(0).toUpperCase(),
    };
  }, [user]);

  // Memoized orders summary
  const ordersSummary: OrdersSummary = useMemo(() => {
    if (!userOrders) return { total: 0, completed: 0, pending: 0 };
    
    return {
      total: userOrders.length,
      completed: userOrders.filter(order => order.status === "Completed").length,
      pending: userOrders.filter(order => order.status === "Pending").length,
    };
  }, [userOrders]);

  // Handle user account deletion
  const handleDeleteUser = useCallback(async () => {
    if (!user?.id) {
      console.error("User ID not available for deletion");
      return;
    }

    setIsDeleting(true);
    try {
      await deleteUserMutation(user.id);
      setShowModal(false);
      // User will be redirected after successful deletion
    } catch (error) {
      console.error("Error deleting user:", error);
      // Error handling could be improved with toast notifications
    } finally {
      setIsDeleting(false);
    }
  }, [user?.id, deleteUserMutation]);

  // Handle user logout
  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
      // User will be redirected after successful logout
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setIsLoggingOut(false);
    }
  }, []);

  // Handle section navigation
  const handleSectionChange = useCallback((section: ProfileSection) => {
    setActiveSection(section);
  }, []);

  // Handle edit mode activation
  const handleEditProfile = useCallback(() => {
    setLocalEditMode(true);
  }, []);

  // Handle profile form closing
  const handleCloseEditForm = useCallback(() => {
    setLocalEditMode(false);
  }, []);

  // Loading state
  if (isUserLoading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading profile...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (userError || !user) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        <h6>Error Loading Profile</h6>
        <p className="mb-0">Unable to load your profile data. Please refresh the page.</p>
      </div>
    );
  }

  if (!userDisplayData) return null;

  return (
    <div className="p-2 p-md-3 py-3">
      <div className="row">
        {/* Profile Navigation Sidebar */}
        <div className="col-md-4">
          <div className="card py-3">
            {/* User Profile Header */}
            <div className="profilepicture d-flex flex-column justify-content-center align-items-center my-3">
              {userDisplayData.avatarUrl ? (
                <img
                  src={userDisplayData.avatarUrl}
                  alt={`${userDisplayData.displayName}'s profile picture`}
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
                  aria-label={`Profile picture placeholder for ${userDisplayData.displayName}`}
                >
                  {userDisplayData.initials}
                </div>
              )}
              <h6 className="text-primary mt-3 mb-0">
                {userDisplayData.displayName}
              </h6>
              <span className="text-primary text-opacity-75 small">
                {userDisplayData.userType}
              </span>
            </div>

            {/* Navigation Links */}
            <nav role="navigation" aria-label="Profile sections">
              <button
                type="button"
                className={`w-100 text-start border-0 p-2 ps-4 profilelinks ${
                  activeSection === 'account' ? "activeprofilelink" : ""
                }`}
                onClick={() => handleSectionChange('account')}
                aria-pressed={activeSection === 'account'}
              >
                <i
                  className={`bi bi-person${activeSection === 'account' ? "-fill" : ""} me-2`}
                  aria-hidden="true"
                />
                Account Settings
              </button>

              <button
                type="button"
                className={`w-100 text-start border-0 p-2 ps-4 profilelinks ${
                  activeSection === 'verification' ? "activeprofilelink" : ""
                }`}
                onClick={() => handleSectionChange('verification')}
                aria-pressed={activeSection === 'verification'}
              >
                <i
                  className={`bi bi-shield${
                    activeSection === 'verification' ? "-fill" : ""
                  }-check me-2`}
                  aria-hidden="true"
                />
                Verification & 2FA
              </button>

              <button
                type="button"
                className={`w-100 text-start border-0 p-2 ps-4 profilelinks ${
                  activeSection === 'delete' ? "activeprofilelink" : ""
                }`}
                onClick={() => handleSectionChange('delete')}
                aria-pressed={activeSection === 'delete'}
              >
                <i
                  className={`bi bi-trash${activeSection === 'delete' ? "-fill" : ""} me-2`}
                  aria-hidden="true"
                />
                Delete Account
              </button>
            </nav>
          </div>
        </div>

        {/* Main Profile Content */}
        <div className="col-md-8">
          <div className="card pb-4 pb-md-4 px-4 px-md-5">
            {/* Account Settings Section */}
            {activeSection === 'account' && (
              <div className="pt-3">
                {/* Alert Display */}
                {alert.show && (
                  <div className="mt-3">
                    <Alert type={alert.type}>
                      <div>{alert.message}</div>
                      {alert.type === "success" && (
                        <div className="mt-3">
                          <button
                            className="btn btn-success rounded"
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                          >
                            {isLoggingOut ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" />
                                Logging out...
                              </>
                            ) : (
                              "Log out"
                            )}
                          </button>
                        </div>
                      )}
                    </Alert>
                  </div>
                )}

                {/* Account Settings Header */}
                <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
                  <h4 className="mb-0">Account Settings</h4>
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={handleEditProfile}
                    aria-label="Edit profile information"
                  >
                    <i className="bi bi-pencil-square me-1" aria-hidden="true" />
                    Edit Profile
                  </button>
                </div>

                {/* Personal Information */}
                <div className="my-4">
                  <h6 className="text-primary fw-semibold">Personal Information</h6>
                  <hr />
                  <div className="row">
                    <div className="col-12 col-md-6 mb-3">
                      <p className="text-primary fw-bold mb-1">
                        <i className="bi bi-person-fill me-2" aria-hidden="true" />
                        Full Name
                      </p>
                      <span className="text-muted">{userDisplayData.fullName}</span>
                    </div>

                    <div className="col-12 col-md-6 mb-3">
                      <p className="text-primary fw-bold mb-1">
                        <i className="bi bi-envelope-at-fill me-2" aria-hidden="true" />
                        Email
                      </p>
                      <span className="text-muted">{user.email || "Not available"}</span>
                    </div>

                    <div className="col-12 col-md-6 mb-3">
                      <p className="text-primary fw-bold mb-1">
                        <i className="bi bi-gender-ambiguous me-2" aria-hidden="true" />
                        Gender
                      </p>
                      <span className="text-muted">{user.Sex || "Not specified"}</span>
                    </div>

                    <div className="col-12 col-md-6 mb-3">
                      <p className="text-primary fw-bold mb-1">
                        <i className="bi bi-telephone-fill me-2" aria-hidden="true" />
                        Phone Number
                      </p>
                      <span className="text-muted">{user.phone || "Not provided"}</span>
                    </div>

                    <div className="col-12 mb-3">
                      <p className="text-primary fw-bold mb-1">
                        <i className="bi bi-geo-alt-fill me-2" aria-hidden="true" />
                        Address
                      </p>
                      <span className="text-muted">{user.address || "Not provided"}</span>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="my-4">
                  <h6 className="text-primary fw-semibold">Order Summary</h6>
                  <hr />
                  {isOrdersLoading ? (
                    <div className="text-center py-3">
                      <div className="spinner-border spinner-border-sm text-primary" />
                      <span className="ms-2">Loading orders...</span>
                    </div>
                  ) : (
                    <div className="row">
                      <div className="col-12 col-md-6 col-lg-4 mb-3">
                        <div className="bg-primary-light rounded p-3">
                          <p className="text-primary mb-2 fw-semibold">
                            <i className="bi bi-cart me-2" aria-hidden="true" />
                            Total Orders
                          </p>
                          <div className="d-flex align-items-baseline">
                            <span className="h3 fw-bold text-primary me-2">
                              {ordersSummary.total}
                            </span>
                            <span className="text-primary fw-semibold">
                              Order{ordersSummary.total !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-lg-4 mb-3">
                        <div className="bg-success-light rounded p-3">
                          <p className="text-success mb-2 fw-semibold">
                            <i className="bi bi-cart-check me-2" aria-hidden="true" />
                            Completed
                          </p>
                          <div className="d-flex align-items-baseline">
                            <span className="h3 fw-bold text-success me-2">
                              {ordersSummary.completed}
                            </span>
                            <span className="text-success fw-semibold">
                              Order{ordersSummary.completed !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-lg-4 mb-3">
                        <div className="bg-warning-light rounded p-3">
                          <p className="text-warning mb-2 fw-semibold">
                            <i className="bi bi-cart-dash me-2" aria-hidden="true" />
                            Pending
                          </p>
                          <div className="d-flex align-items-baseline">
                            <span className="h3 fw-bold text-warning me-2">
                              {ordersSummary.pending}
                            </span>
                            <span className="text-warning fw-semibold">
                              Order{ordersSummary.pending !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Verification & 2FA Section */}
            {activeSection === 'verification' && (
              <div className="pt-3">
                <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
                  <h4 className="mb-0">Verification & 2FA</h4>
                </div>

                {/* Email Verification */}
                <div className="my-4">
                  <h6 className="text-primary fw-semibold">Email Verification</h6>
                  <hr />
                  <div className="row">
                    <div className="col-12 mb-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="flex-grow-1">
                          <p className="text-primary fw-bold mb-1">
                            <i 
                              className={`bi bi-envelope-${user?.emailIsVerified ? 'check' : 'exclamation'} me-2`} 
                              aria-hidden="true" 
                            />
                            {user.email}
                          </p>
                          <span className={user?.emailIsVerified ? "text-success" : "text-warning"}>
                            {user?.emailIsVerified ? "Email is verified" : "Email is not verified"}
                          </span>
                        </div>
                        <div className="ms-3">
                          {user?.emailIsVerified ? (
                            <span className="badge bg-success-light text-success rounded-pill px-3">
                              Verified
                            </span>
                          ) : (
                            <div className="d-flex flex-column align-items-end">
                              <span className="badge bg-danger-light text-danger rounded-pill px-3 mb-2">
                                Not Verified
                              </span>
                              <button
                                type="button"
                                className="btn btn-outline-primary btn-sm rounded"
                                onClick={() => {
                                  // Handle email verification
                                  console.log("Verify email clicked");
                                }}
                                aria-label="Send email verification"
                              >
                                Verify Email
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Two-factor Authentication */}
                <div className="my-4">
                  <h6 className="text-primary fw-semibold">Two-factor Authentication (2FA)</h6>
                  <hr />
                  <div className="row">
                    <div className="col-12 mb-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="flex-grow-1">
                          <p className="text-primary fw-bold mb-1">
                            <i className="bi bi-shield-check me-2" aria-hidden="true" />
                            2FA Status
                          </p>
                          <span className={user?.twofactorIsEnabled ? "text-success" : "text-muted"}>
                            {user?.twofactorIsEnabled
                              ? "Two-factor authentication is enabled"
                              : "Two-factor authentication is disabled"}
                          </span>
                          <div className="mt-1">
                            <small className="text-muted fst-italic">
                              ...coming soon
                            </small>
                          </div>
                        </div>
                        <div className="ms-3">
                          {user?.twofactorIsEnabled ? (
                            <span className="badge bg-success-light text-success rounded-pill px-3">
                              Enabled
                            </span>
                          ) : (
                            <div className="d-flex flex-column align-items-end">
                              <span className="badge bg-danger-light text-danger rounded-pill px-3 mb-2">
                                Disabled
                              </span>
                              <button
                                type="button"
                                className="btn btn-outline-success btn-sm rounded"
                                onClick={() => {
                                  // Handle 2FA enable
                                  console.log("Enable 2FA clicked");
                                }}
                                aria-label="Enable two-factor authentication"
                                disabled
                              >
                                Enable 2FA
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Delete Account Section */}
            {activeSection === 'delete' && (
              <div className="pt-3">
                <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
                  <h4 className="mb-0 text-danger">Delete Account</h4>
                </div>

                {/* Warning Alert */}
                <div className="alert alert-danger d-flex align-items-start" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2 mt-1" aria-hidden="true" />
                  <div>
                    <strong>Warning:</strong> This action cannot be undone. All your data will be permanently deleted.
                  </div>
                </div>

                {/* Account Deletion Information */}
                <div className="my-4">
                  <h6 className="text-danger fw-semibold">Account Deletion</h6>
                  <hr />
                  
                  <div className="mb-4">
                    <p className="text-muted mb-3">
                      Before you delete your account, please note that:
                    </p>
                    <ul className="text-muted mb-4">
                      <li>All your personal information will be permanently deleted</li>
                      <li>Your order history will be anonymized for our records</li>
                      <li>You will lose access to any unused account credits</li>
                      <li>All saved preferences and settings will be lost</li>
                      <li>This action cannot be reversed under any circumstances</li>
                    </ul>

                    <div className="d-grid gap-2 d-md-block">
                      <button
                        type="button"
                        className="btn btn-danger rounded me-2"
                        onClick={() => setShowModal(true)}
                        disabled={isDeleting}
                        aria-label="Delete account permanently"
                      >
                        {isDeleting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                            Deleting Account...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-trash-fill me-2" aria-hidden="true" />
                            Delete My Account
                          </>
                        )}
                      </button>
                      <small className="text-muted d-block d-md-inline mt-2 mt-md-0">
                        You will be asked to confirm this action.
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      <Modal showmodal={showModal} toggleModal={() => setShowModal(false)}>
        <div className="modal-body">
          <div className="text-center mb-3">
            <i className="bi bi-exclamation-triangle-fill text-danger" style={{ fontSize: '2rem' }} />
            <h5 className="mt-3 text-danger">Confirm Account Deletion</h5>
          </div>
          <p className="text-center mb-4">
            Are you absolutely sure you want to delete your account? This action cannot be undone 
            and will permanently delete all your data.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <button
              className="btn btn-danger"
              onClick={handleDeleteUser}
              disabled={isDeleting}
              aria-label="Confirm account deletion"
            >
              {isDeleting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Deleting...
                </>
              ) : (
                "Yes, Delete Account"
              )}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setShowModal(false)}
              disabled={isDeleting}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Profile Modal */}
      {editMode && (
        <Modal showmodal={editMode} toggleModal={() => setLocalEditMode(false)}>
          <div className="modal-header">
            <h5 className="modal-title">Edit Profile</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setLocalEditMode(false)}
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            <ProfileForm setAlert={setAlert} setEditMode={handleCloseEditForm} />
          </div>
        </Modal>
      )}
    </div>
  );
});

ProfileCard.displayName = "ProfileCard";

export default ProfileCard;
