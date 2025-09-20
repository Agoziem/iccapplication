"use client";
import React, { useEffect, useState, useCallback, useMemo, memo } from "react";
import toast from "react-hot-toast";
import Modal from "@/components/custom/Modal/modal";
import { shortenMessage, timeSince } from "@/utils/utilities";
import {
  useMarkNotificationAsRead,
  useNotifications,
  useRemoveUserFromNotification,
} from "@/data/hooks/notifications.hooks";
import {
  NotificationOnlyResponse,
  NotificationResponse,
} from "@/types/notifications";
import { useMyProfile } from "@/data/hooks/user.hooks";
import { useHasChecked } from "@/providers/context/NotificationChecked";
import moment from "moment";

const NavNotice: React.FC = memo(() => {
  const [showmodal, setShowModal] = useState<boolean>(false);
  const { data: user } = useMyProfile();
  const [modalContent, setModalContent] = useState<NotificationResponse | null>(
    null
  );
  // Fetch notifications from the server
  const { data: notifications, isLoading, error } = useNotifications();
  const { mutateAsync: markAsRead } = useMarkNotificationAsRead();
  const { mutateAsync: removeUserAsRecipient } =
    useRemoveUserFromNotification();
  const { hasChecked, setHasChecked } = useHasChecked();

  // Function to sort notifications by updated_at
  const sortedNotifications = useMemo<NotificationResponse[]>(() => {
    if (!notifications) return [];
    return notifications.sort((a, b) => {
      const dateA = a.updated_at ? new Date(a.updated_at).getTime() : 0;
      const dateB = b.updated_at ? new Date(b.updated_at).getTime() : 0;
      return dateB - dateA;
    });
  }, [notifications]);

  const checkIfNotificationIsRead = (
    notification: NotificationResponse
  ): boolean => {
    if (!user) return false;
    return notification.recipients.some(
      (recipient) => recipient.id === user.id && recipient.has_read === true
    );
  };

  // Handle notification click
  const handleNotificationClick = useCallback(
    async (notification: NotificationResponse) => {
      if (!user) {
        toast.error("User not found. Please log in.");
        return;
      }
      if (!checkIfNotificationIsRead(notification)) {
        await markAsRead({
          notification_id: notification.id,
          user_id: user.id!,
          is_read: true,
        });
      }
      setModalContent(notification);
      setShowModal(true);
    },
    [markAsRead, user]
  );

  // Toggle modal
  const toggleModal = useCallback(() => {
    setShowModal((prev) => !prev);
  }, []);

  const handleRemoveUserAsRecipient = async (
    notification: NotificationResponse
  ) => {
    if (!user || !user.id) {
      toast.error("User not found. Please log in.");
      return;
    }
    const toastId = toast.loading("Removing you as a recipient...");
    try {
      await removeUserAsRecipient({
        notification_id: notification.id,
        user_id: user.id,
      });
      toast.success("notification removed successfully", {
        id: toastId,
      });
    } catch (error) {
      console.error("Failed to remove user as recipient:", error);
      toast.error("Failed to remove notification", {
        id: toastId,
      });
    }
  };

  // Memoized unread notifications count
  const unreadNotifications = useMemo(() => {
    if (!notifications || !user) return [];
    return notifications.filter(
      (notification) =>
        !notification.recipients.some(
          (recipient) => recipient.id === user.id && recipient.has_read
        )
    );
  }, [notifications, user]);

  const unseenCount = useMemo(() => {
    if (!notifications || !user) return 0;
    return notifications.reduce((count, notification) => {
      const recipient = notification.recipients.find((r) => r.id === user.id);
      return recipient && !recipient.has_read ? count + 1 : count;
    }, 0);
  }, [notifications, user]);

  return (
    <li className="nav-item dropdown">
      {/* Notification bell icon */}
      <a
        className="nav-link nav-icon"
        href="#"
        data-bs-toggle="dropdown"
        role="button"
        aria-label="View notifications"
        aria-expanded="false"
        onClick={() => {
          if (!hasChecked) {
            setHasChecked(true);
          }
        }}
      >
        <i className="bi bi-bell"></i>
        {unseenCount > 0 && (
          <span className="badge bg-danger badge-number">{unseenCount}</span>
        )}
      </a>

      {/* Notification dropdown */}
      <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications">
        {/* Dropdown header */}
        <li className="dropdown-header text-primary">
          {unreadNotifications.length > 0
            ? `You have ${unreadNotifications.length} unread notification${
                unreadNotifications.length > 1 ? "s" : ""
              }`
            : "You have no unread notifications at the moment"}
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li>

        {/* Notification items */}
        {sortedNotifications && sortedNotifications.length > 0 ? (
          sortedNotifications.map((notification, index) => (
            <React.Fragment key={notification.id}>
              <li
                className="notification-item"
                style={{ cursor: "pointer" }}
                onClick={() => handleNotificationClick(notification)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleNotificationClick(notification);
                  }
                }}
                aria-label={`View notification: ${notification.title}`}
              >
                {notification.image_url ? (
                  <img
                    src={notification.image_url}
                    alt="Notification"
                    className="rounded-circle"
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                      marginRight: "10px",
                    }}
                  />
                ) : (
                  <div className="notification-icon">
                    <i
                      className={`bi ${
                        checkIfNotificationIsRead(notification)
                          ? "bi-check-all text-primary"
                          : "bi-exclamation-circle text-secondary"
                      }`}
                    />
                  </div>
                )}
                <div>
                  <h4
                    className={
                      checkIfNotificationIsRead(notification)
                        ? "text-primary line-clamp-2"
                        : "text-secondary line-clamp-2"
                    }
                  >
                    {notification.title}
                  </h4>
                  <p
                    className={
                      checkIfNotificationIsRead(notification) ? "" : "text-dark"
                    }
                  >
                    {shortenMessage(notification.message, 50)}
                  </p>
                  <p>
                    {notification.created_at
                      ? timeSince(notification.created_at)
                      : "Unknown time"}
                  </p>
                </div>
              </li>
              {index < sortedNotifications.length - 1 && (
                <li key={`divider-${notification.id}`}>
                  <hr className="dropdown-divider" />
                </li>
              )}
            </React.Fragment>
          ))
        ) : (
          <li className="notification-item">
            <i className="bi bi-exclamation-circle text-warning" />
            <div>
              <h4>Notice</h4>
              <p>
                {isLoading
                  ? "Loading notifications..."
                  : "No notice available at the moment"}
              </p>
            </div>
          </li>
        )}
      </ul>

      {/* Notification detail modal */}
      <Modal showmodal={showmodal} toggleModal={toggleModal}>
        <div className="modal-body">
          <h6>{modalContent?.title}</h6>
          <p className="small text-muted">
            {moment(modalContent?.updated_at).fromNow()}
          </p>
          <hr />
          {modalContent?.image_url && (
            <img
              src={modalContent?.image_url}
              alt="Notification Image"
              className="img-fluid mb-3"
            />
          )}
          <p>{modalContent?.message}</p>
          <div className="d-flex justify-content-end mt-3">
            <button
              className="btn btn-primary"
              onClick={toggleModal}
              type="button"
            >
              Close
            </button>
            <button
              className="btn btn-danger ms-2"
              onClick={() => {
                if (modalContent) {
                  handleRemoveUserAsRecipient(modalContent);
                  toggleModal();
                }
              }}
              type="button"
            >
              Remove Notification
            </button>
          </div>
        </div>
      </Modal>
    </li>
  );
});

NavNotice.displayName = "NavNotice";

export default NavNotice;
