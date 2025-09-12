import React, { useEffect, useState } from "react";
import useWebSocket from "@/hooks/useWebSocket";
import Modal from "@/components/custom/Modal/modal";
import { shortenMessage, timeSince } from "@/utils/utilities";
import { notificationActionSchema } from "@/schemas/notifications";
import { useFetchNotifications } from "@/data/notificationsAPI/notification.hook";
import { useQueryClient } from "react-query";
import toast from "react-hot-toast";

function NavNotice() {
  const [showmodal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    time: "",
  });
  const { ws, isConnected } = useWebSocket(
    `${process.env.NEXT_PUBLIC_DJANGO_WEBSOCKET_URL}/ws/notifications/`
  );

  // fetch notifications from the server
  const {
    data: notifications,
    isLoading,
    error,
  } = useFetchNotifications();

  const queryClient = useQueryClient();

  // WebSocket Connection for notifications
  useEffect(() => {
    if (isConnected && ws) {
      ws.onmessage = (event) => {
        const responseNotification = JSON.parse(event.data);
        const validatedcontact =
          notificationActionSchema.safeParse(responseNotification);
  
        // Validate the WebSocket data
        if (!validatedcontact.success) {
          console.log(validatedcontact.error.issues);
          return;
        }
  
        const newNotification = validatedcontact.data;
  
        // Function to sort notifications by updated_at
        const sortNotifications = (notifications) =>
          notifications.sort(
            (a, b) =>
              new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
  
        // Define cache key for notifications
        const cacheKey = ["notifications"];
  
        // Handle different actions
        if (newNotification.action === "add") {
          queryClient.setQueryData(cacheKey, (existingNotifications = []) => {
            const notificationExists = existingNotifications.some(
              (notification) =>
                notification.id === newNotification.notification.id
            );
  
            if (notificationExists) {
              return sortNotifications([
                newNotification.notification,
                ...existingNotifications.filter(
                  (notification) =>
                    notification.id !== newNotification.notification.id
                ),
              ]);
            } else {
              // If the notification doesn't exist, just add it to the top
              return sortNotifications([
                newNotification.notification,
                ...existingNotifications,
              ]);
            }
          });
          toast.success("New notification received");
        }
  
        if (newNotification.action === "update") {
          queryClient.setQueryData(cacheKey, (existingNotifications = []) =>
            sortNotifications(
              existingNotifications.map((notification) =>
                notification.id === newNotification.notification.id
                  ? newNotification.notification
                  : notification
              )
            )
          );
          toast.success("A Notification was updated");
        }
  
        if (newNotification.action === "delete") {
          queryClient.setQueryData(cacheKey, (existingNotifications = []) =>
            existingNotifications.filter(
              (notification) =>
                notification.id !== newNotification.notification.id
            )
          );
          toast.success("A Notification deleted");
        }
  
        if (newNotification.action === "mark_viewed") {
          queryClient.setQueryData(cacheKey, (existingNotifications = []) =>
            existingNotifications.map((notification) =>
              notification.id === newNotification.notification.id
                ? newNotification.notification
                : notification
            )
          );
        }
      };
    }
  }, [isConnected, ws]);

  /** @param {NotificationMessage} notification */
  const mark_viewed = (notification) => {
    if (!notification.viewed) {
      if (ws && ws.readyState === WebSocket.OPEN) {
        /**@type {NotificationAction} */
        const payload = {
          action: "mark_viewed",
          notification: notification,
        };
        ws.send(JSON.stringify(payload));
      } else {
        console.error("WebSocket is not connected.");
      }
    }
  };

  return (
    <li className="nav-item dropdown">
      {/* the Notification bell icon */}
      <a className="nav-link nav-icon" href="#" data-bs-toggle="dropdown">
        <i className="bi bi-bell"></i>
        {(() => {
          const unseenCount = notifications?.filter(
            (notification) => !notification?.viewed
          ).length;
          return unseenCount > 0 ? (
            <span className="badge bg-danger badge-number">{unseenCount}</span>
          ) : null;
        })()}
      </a>

      {/* Notification dropdown header */}
      <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications">
        {(() => {
          const unreadNotifications = notifications?.filter(
            (notification) => !notification.viewed
          );
          return unreadNotifications?.length > 0 ? (
            <>
              <li className="dropdown-header text-primary">
                You have {unreadNotifications.length} unread notification
                {unreadNotifications.length > 1 ? "s" : ""}
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
            </>
          ) : (
            <>
              <li className="dropdown-header text-primary">
                You have no unread notifications at the moment
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
            </>
          );
        })()}

        {/* Notification dropdown messages */}
        {notifications?.length > 0 ? (
          notifications?.map((notification, index) => (
            <React.Fragment key={notification.id}>
              <li
                className="notification-item"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  mark_viewed(notification);
                  setModalContent({
                    title: notification.title,
                    message: notification.message,
                    time: timeSince(notification.created_at),
                  });
                  setShowModal(true);
                }}
              >
                <i
                  className={`bi  ${
                    notification.viewed
                      ? "bi-check-all text-primary"
                      : "bi-exclamation-circle text-secondary"
                  }`}
                ></i>
                <div>
                  <h4
                    className={
                      notification.viewed ? "text-primary" : "text-secondary"
                    }
                  >
                    {notification.title}
                  </h4>
                  <p className={notification.viewed ? "" : "text-dark"}>
                    {shortenMessage(notification.message, 50)}
                  </p>
                  <p>{timeSince(notification.created_at)}</p>
                </div>
              </li>
              {index === notifications.length - 1 ? null : (
                <li key={`divider-${notification.id}`}>
                  <hr className="dropdown-divider" />
                </li>
              )}
            </React.Fragment>
          ))
        ) : (
          <li className="notification-item">
            <i className="bi bi-exclamation-circle text-warning"></i>
            <div>
              <h4>Notice</h4>
              <p>No notice available at the moment</p>
            </div>
          </li>
        )}
      </ul>

      <Modal showmodal={showmodal} toggleModal={() => setShowModal(!showmodal)}>
        <h6>{modalContent.title}</h6>
        <p className="small text-muted">{modalContent.time}</p>
        <hr />
        <p>{modalContent.message}</p>
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(!showmodal)}
          >
            Close
          </button>
        </div>
      </Modal>
    </li>
  );
}

export default NavNotice;
