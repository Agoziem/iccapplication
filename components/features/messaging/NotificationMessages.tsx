import { TbMessageCancel } from "react-icons/tb";
import NotificationForm from "./NotificationForm";
import { useRef, useState } from "react";
import Modal from "../../custom/Modal/modal";
import Alert from "../../custom/Alert/Alert";
import { shortenMessage } from "@/utils/utilities";
import { useDeleteNotification, useFetchNotifications } from "@/data/notificationsAPI/notifications.hook";

const NotificationMessages = () => {
  const [errormessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [Notification, setNotification] = useState(null);
  const [notificationId, setNotificationId] = useState(null);
  const [editmode, setEditMode] = useState(false);
  const formRef = useRef(null);
  const [showdeleteModal, setShowDeleteModal] = useState(false);
  const {
    data: notifications,
    isLoading,
    error,
  } = useFetchNotifications();

 const { mutateAsync: deleteNotification } = useDeleteNotification();

  const scrolltoform = () => {
    formRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const deleteMessage = async () => {
    try {
      setErrorMessage("");
      setSuccess("");
      await deleteNotification(notificationId);

      setSuccess(`Notification deleted successfully!`);
    } catch (error) {
      setErrorMessage(
        `Failed to ${
          editmode ? "edit" : "send"
        } notification. Please try again.`
      );
    } finally {
      setTimeout(() => {
        setErrorMessage("");
        setSuccess("");
        setNotificationId(null);
        setShowDeleteModal(false);
      }, 3000);
    }
  };

  return (
    <div>
      <div className="d-flex flex-column flex-md-row gap-5">
        {/* Message Form */}
        <div>
          <h5>Alerts & Notifications</h5>
          <div className="card my-3 p-3 px-md-4 py-4">
            <NotificationForm
              notification={Notification}
              editmode={editmode}
              setEditMode={setEditMode}
              formRef={formRef}
            />
          </div>
        </div>

        {/* All Sent Messages */}
        <div className="flex-fill d-flex flex-column gap-1 px-3">
          <h5 className="text-center mb-3">{notifications.length} Notification{notifications.length > 1 ? "s": ""}</h5>
          {isLoading && (
            <div className=" d-flex align-items-center justify-content-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {notifications?.length > 0
            ? notifications.map((notification) => (
                <div key={notification.id} className="card p-4 py-4">
                  <div className="d-flex justify-content-between">
                    <h6 className="mb-2">{notification.title}</h6>
                    <span
                      className="small"
                      style={{
                        color: "var(--bgDarkerColor)",
                      }}
                    >
                      {new Date(notification.created_at).toLocaleTimeString(
                        [],
                        {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                  </div>
                  <p>{shortenMessage(notification.message, 100)}</p>
                  <div className="d-flex justify-content-end gap-2">
                    <div
                      className={`badge bg-secondary-light text-secondary p-2 px-3`}
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setNotification(notification);
                        setEditMode(true);
                        scrolltoform();
                      }}
                    >
                      edit
                    </div>
                    <div
                      className={`badge bg-danger text-white p-2 px-3`}
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setNotificationId(notification.id);
                        setShowDeleteModal(true);
                      }}
                    >
                      delete
                    </div>
                  </div>
                </div>
              ))
            : !isLoading && (
                <div className="mx-auto">
                  <div className="text-center">
                    <TbMessageCancel
                      className="mb-2"
                      style={{
                        fontSize: "3.5rem",
                        color: "var(--bgDarkerColor)",
                      }}
                    />
                    <p>No Notifications found</p>
                  </div>
                </div>
              )}

          {error && <div>An error just occured, please try again later</div>}
        </div>
      </div>

      <Modal
        showmodal={showdeleteModal}
        toggleModal={() => setShowDeleteModal(false)}
      >
        <div className="modal-body">
          <p className="text-center mb-1">
            Are you sure you want to delete this Notification, it will be
            deleted from all the users
          </p>
          {/* Error Message */}
          {errormessage && <Alert type={"danger"}>{errormessage}</Alert>}
          {/* Success Message */}
          {success && <Alert type={"success"}>{success}</Alert>}

          <div className="d-flex justify-content-end mt-4">
            <button
              className="btn btn-danger rounded me-3"
              onClick={() => {
                deleteMessage();
              }}
            >
              Yes
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
    </div>
  );
};

export default NotificationMessages;
