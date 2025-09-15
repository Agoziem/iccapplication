"use client";
import React, { useEffect, useState, useCallback, useMemo, memo } from "react";
import { useQueryClient } from "react-query";
import toast from "react-hot-toast";
import useWebSocket from "@/hooks/useWebSocket";
import Modal from "@/components/custom/Modal/modal";
import { shortenMessage, timeSince } from "@/utils/utilities";
import { useNotifications } from "@/data/hooks/notifications.hooks";
import { NotificationSchema, wsNotificationMessageSchema } from "@/schemas/notifications";
import { Notification as NotificationType } from "@/types/notifications";

interface ModalContent {
  title: string;
  message: string;
  time: string;
}

interface WSNotificationMessage {
  action: "add" | "update" | "delete" | "mark_viewed";
  notification: NotificationType;
}

const NavNotice: React.FC = memo(() => {
  const [showmodal, setShowModal] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<ModalContent>({
    title: "",
    message: "",
    time: "",
  });

  // WebSocket connection for real-time notifications
  const { ws, isConnected } = useWebSocket(
    `${process.env.NEXT_PUBLIC_DJANGO_WEBSOCKET_URL}/ws/notifications/`
  );

  // Fetch notifications from the server
  const { data: notifications, isLoading, error } = useNotifications();
  const queryClient = useQueryClient();

  // Function to sort notifications by updated_at
  const sortNotifications = useCallback((notifications: NotificationType[]) =>
    notifications.sort((a, b) => {
      const dateA = a.updated_at ? new Date(a.updated_at).getTime() : 0;
      const dateB = b.updated_at ? new Date(b.updated_at).getTime() : 0;
      return dateB - dateA;
    }), []
  );

  // Handle WebSocket messages
  const handleWebSocketMessage = useCallback((event: MessageEvent) => {
    try {
      const responseNotification = JSON.parse(event.data);
      const validatednotification = wsNotificationMessageSchema.safeParse(responseNotification);

      // Validate the WebSocket data
      if (!validatednotification.success) {
        console.error('Invalid notification format:', validatednotification.error.issues);
        return;
      }

      const newNotification = validatednotification.data;
      
      // Ensure notification data exists
      if (!newNotification.notification) {
        console.error('No notification data in WebSocket message');
        return;
      }

      const cacheKey = ["notifications"];

      // Handle different notification actions
      switch (newNotification.action) {
        case "add":
          queryClient.setQueryData(cacheKey, (existingNotifications: any[] = []) => {
            const notificationExists = existingNotifications.some(
              (notification) => notification.id === newNotification.notification!.id
            );

            if (notificationExists) {
              return sortNotifications([
                newNotification.notification!,
                ...existingNotifications.filter(
                  (notification) => notification.id !== newNotification.notification!.id
                ),
              ]);
            } else {
              return sortNotifications([
                newNotification.notification!,
                ...existingNotifications,
              ]);
            }
          });
          toast.success("New notification received");
          break;

        case "update":
          queryClient.setQueryData(cacheKey, (existingNotifications: any[] = []) =>
            sortNotifications(
              existingNotifications.map((notification) =>
                notification.id === newNotification.notification!.id
                  ? newNotification.notification!
                  : notification
              )
            )
          );
          toast.success("Notification updated");
          break;

        case "delete":
          queryClient.setQueryData(cacheKey, (existingNotifications: any[] = []) =>
            existingNotifications.filter(
              (notification) => notification.id !== newNotification.notification!.id
            )
          );
          toast.success("Notification deleted");
          break;

        case "mark_viewed":
          queryClient.setQueryData(cacheKey, (existingNotifications: any[] = []) =>
            existingNotifications.map((notification) =>
              notification.id === newNotification.notification!.id
                ? newNotification.notification!
                : notification
            )
          );
          break;

        default:
          console.warn('Unknown notification action:', newNotification.action);
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  }, [queryClient, sortNotifications]);

  // WebSocket Connection effect
  useEffect(() => {
    if (isConnected && ws) {
      ws.onmessage = handleWebSocketMessage;
    }
  }, [isConnected, ws, handleWebSocketMessage]);

  // Mark notification as viewed
  const markAsViewed = useCallback((notification: NotificationType) => {
    if (!notification.viewed && ws && ws.readyState === WebSocket.OPEN) {
      const payload = {
        action: "mark_viewed",
        notification: notification,
      };
      ws.send(JSON.stringify(payload));
    } else if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.error("WebSocket is not connected.");
    }
  }, [ws]);

  // Handle notification click
  const handleNotificationClick = useCallback((notification: NotificationType) => {
    markAsViewed(notification);
    setModalContent({
      title: notification.title,
      message: notification.message,
      time: notification.created_at ? timeSince(notification.created_at) : 'Unknown time',
    });
    setShowModal(true);
  }, [markAsViewed]);

  // Toggle modal
  const toggleModal = useCallback(() => {
    setShowModal(prev => !prev);
  }, []);

  // Memoized calculations
  const unreadNotifications = useMemo(() => 
    notifications?.filter((notification) => !notification.viewed) || [], 
    [notifications]
  );

  const unseenCount = useMemo(() => unreadNotifications.length, [unreadNotifications]);

  // Handle loading and error states
  if (error) {
    console.error('Error fetching notifications:', error);
  }

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
            ? `You have ${unreadNotifications.length} unread notification${unreadNotifications.length > 1 ? 's' : ''}`
            : "You have no unread notifications at the moment"
          }
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li>

        {/* Notification items */}
        {notifications && notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <React.Fragment key={notification.id}>
              <li
                className="notification-item"
                style={{ cursor: "pointer" }}
                onClick={() => handleNotificationClick(notification)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleNotificationClick(notification);
                  }
                }}
                aria-label={`View notification: ${notification.title}`}
              >
                <i
                  className={`bi ${
                    notification.viewed
                      ? "bi-check-all text-primary"
                      : "bi-exclamation-circle text-secondary"
                  }`}
                />
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
                  <p>{notification.created_at ? timeSince(notification.created_at) : 'Unknown time'}</p>
                </div>
              </li>
              {index < notifications.length - 1 && (
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
                  : "No notice available at the moment"
                }
              </p>
            </div>
          </li>
        )}
      </ul>

      {/* Notification detail modal */}
      <Modal showmodal={showmodal} toggleModal={toggleModal}>
        <div className="modal-body">
          <h6>{modalContent.title}</h6>
          <p className="small text-muted">{modalContent.time}</p>
          <hr />
          <p>{modalContent.message}</p>
          <div className="d-flex justify-content-end mt-3">
            <button
              className="btn btn-primary"
              onClick={toggleModal}
              type="button"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </li>
  );
});

NavNotice.displayName = 'NavNotice';

export default NavNotice;
