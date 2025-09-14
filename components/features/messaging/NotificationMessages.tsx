import React, { useRef, useState, useCallback, useMemo } from "react";
import { TbMessageCancel } from "react-icons/tb";
import NotificationForm from "./NotificationForm";
import Modal from "../../custom/Modal/modal";
import Alert from "../../custom/Alert/Alert";
import { shortenMessage } from "@/utils/utilities";
import moment from "moment";
import { Notification as NotificationType } from "@/types/notifications";
import { useDeleteNotification, useNotifications } from "@/data/hooks/notifications.hooks";

/**
 * Enhanced NotificationMessages component with comprehensive error handling and safety checks
 * Manages notification creation, editing, deletion, and display
 * Optimized with React.memo for performance
 */
const NotificationMessages: React.FC = React.memo(() => {
  const [errormessage, setErrorMessage] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [notification, setNotification] = useState<NotificationType | null>(null);
  const [notificationId, setNotificationId] = useState<string | null>(null);
  const [editmode, setEditMode] = useState<boolean>(false);
  const [showdeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Fetch notifications with error handling
  const {
    data: notifications,
    isLoading,
    error,
  } = useNotifications();

  // Mutation for deleting notifications
  const { mutateAsync: deleteNotification } = useDeleteNotification();

  // Safe notifications data processing
  const notificationsData = useMemo(() => {
    if (!notifications || !Array.isArray(notifications)) return [];
    
    return notifications.filter(notification => 
      notification && 
      typeof notification === 'object' && 
      notification.id
    );
  }, [notifications]);


  // Safe message shortening with fallback
  const safelyTruncateMessage = useCallback((message: string | undefined, length = 100) => {
    if (!message || typeof message !== 'string') {
      return 'No message content';
    }
    
    try {
      return typeof shortenMessage === 'function' 
        ? shortenMessage(message, length)
        : message.length > length 
          ? `${message.slice(0, length)}...` 
          : message;
    } catch (error) {
      console.error('Error truncating message:', error);
      return message.length > length ? `${message.slice(0, length)}...` : message;
    }
  }, []);

  // Smooth scroll to form
  const scrolltoform = useCallback(() => {
    if (formRef.current) {
      try {
        formRef.current.scrollIntoView({ 
          behavior: "smooth", 
          block: "center" 
        });
      } catch (error) {
        console.error('Error scrolling to form:', error);
        // Fallback scroll
        formRef.current.scrollIntoView();
      }
    }
  }, []);

  // Enhanced delete message handler
  const deleteMessage = useCallback(async () => {
    if (!notificationId) {
      setErrorMessage("Invalid notification ID");
      return;
    }

    try {
      setErrorMessage("");
      setSuccess("");
      
      await deleteNotification(parseInt(notificationId));
      setSuccess("Notification deleted successfully!");
      
    } catch (error : any) {
      console.error("Error deleting notification:", error);
      setErrorMessage(
        error.message || "Failed to delete notification. Please try again."
      );
    } finally {
      // Clear states after delay
      setTimeout(() => {
        setErrorMessage("");
        setSuccess("");
        setNotificationId(null);
        setShowDeleteModal(false);
      }, 3000);
    }
  }, [notificationId, deleteNotification]);

  // Safe edit handler
  const handleEditNotification = useCallback((notification: NotificationType) => {
    if (!notification || !notification.id) {
      setErrorMessage("Invalid notification data");
      return;
    }
    
    setNotification(notification);
    setEditMode(true);
    scrolltoform();
  }, [scrolltoform]);

  // Safe delete handler
  const handleDeleteNotification = useCallback((notificationId: string | null) => {
    if (!notificationId) {
      setErrorMessage("Invalid notification ID");
      return;
    }
    
    setNotificationId(notificationId);
    setShowDeleteModal(true);
  }, []);

  // Close delete modal
  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setNotificationId(null);
    setErrorMessage("");
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="d-flex align-items-center justify-content-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading notifications...</span>
        </div>
        <span className="ms-3">Loading notifications...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="alert alert-danger">
        <h6>Error Loading Notifications</h6>
        <p>Unable to load notifications. Please try again later.</p>
        <small>Error: {error.message || 'Unknown error'}</small>
      </div>
    );
  }

  return (
    <div>
      {/* Global alerts */}
      {success && (
        <Alert type="success">
          {success}
        </Alert>
      )}
      {errormessage && (
        <Alert type="danger">
          {errormessage}
        </Alert>
      )}

      <div className="d-flex flex-column flex-md-row gap-5">
        {/* Notification Form */}
        <div>
          <h5>Alerts & Notifications</h5>
          <div className="card my-3 p-3 px-md-4 py-4">
            <NotificationForm
              notification={notification || undefined}
              editmode={editmode}
              setEditMode={setEditMode}
              formRef={formRef}
            />
          </div>
        </div>

        {/* All Notifications */}
        <div className="flex-fill d-flex flex-column gap-1 px-3">
          <h5 className="text-center mb-3">
            {notificationsData.length > 0 ? (
              <>
                {notificationsData.length} Notification{notificationsData.length > 1 ? "s" : ""}
                <span className="badge bg-primary ms-2">{notificationsData.length}</span>
              </>
            ) : (
              "Notifications"
            )}
          </h5>

          {/* Notifications List */}
          {notificationsData.length > 0 ? (
            <div className="d-flex flex-column gap-3">
              {notificationsData.map((notification) => {
                const notificationKey = notification.id;
                const notificationTitle = notification.title || 'No Title';
                const notificationMessage = notification.message || 'No message';
                const notificationDate = notification.created_at || '';

                return (
                  <div key={notificationKey} className="card p-4">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="mb-1 flex-grow-1">
                        {notificationTitle}
                      </h6>
                      <span
                        className="small text-nowrap ms-2"
                        style={{
                          color: "var(--bgDarkerColor)",
                        }}
                      >
                        {moment(notificationDate).format("MMM D, YYYY h:mm A") || 'Unknown Date'}
                      </span>
                    </div>
                    
                    <p className="mb-3 text-muted">
                      {safelyTruncateMessage(notificationMessage, 100)}
                    </p>
                    
                    <div className="d-flex justify-content-end gap-2">
                      <button
                        type="button"
                        className="badge bg-secondary-light text-secondary p-2 px-3 border-0"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleEditNotification(notification)}
                      >
                        edit
                      </button>
                      <button
                        type="button"
                        className="badge bg-danger text-white p-2 px-3 border-0"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDeleteNotification(notification.id ? String(notification.id) : null)}
                      >
                        delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Empty state
            <div className="mx-auto text-center py-5">
              <TbMessageCancel
                className="mb-3"
                style={{
                  fontSize: "4rem",
                  color: "var(--bgDarkerColor)",
                }}
              />
              <h6 className="text-muted mb-2">No Notifications Found</h6>
              <p className="text-muted small">
                Create your first notification using the form on the left.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        showmodal={showdeleteModal}
        toggleModal={closeDeleteModal}
      >
        <div className="modal-body">
          <h6 className="text-center mb-3">Confirm Deletion</h6>
          <p className="text-center mb-4">
            Are you sure you want to delete this notification? This action cannot be undone
            and will remove the notification from all users.
          </p>
          
          {/* Modal alerts */}
          {errormessage && <Alert type="danger">{errormessage}</Alert>}
          {success && <Alert type="success">{success}</Alert>}

          <div className="d-flex justify-content-center gap-3 mt-4">
            <button
              type="button"
              className="btn btn-danger rounded"
              onClick={deleteMessage}
              disabled={!notificationId}
            >
              Yes, Delete
            </button>
            <button
              type="button"
              className="btn btn-secondary rounded"
              onClick={closeDeleteModal}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
});

// Add display name for debugging
NotificationMessages.displayName = 'NotificationMessages';

export default NotificationMessages;
