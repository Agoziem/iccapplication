import {
  notificationArraySchema,
  notificationSchema,
} from "@/schemas/notifications";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}`,
});

export const notificationAPIendpoint = "/notificationsapi";

// fetch all the Notifications
export const fetchNotifications = async () => {
  const response = await axiosInstance.get(
    `${notificationAPIendpoint}/notifications/`
  );
  const validation = notificationArraySchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * submits Responses to database and updates the Ui optimistically
 * @async
 * @param {NotificationMessage} data
 * @returns {Promise<NotificationMessage>}
 */
export const createNotification = async (data) => {
  const response = await axiosInstance.post(
    `${notificationAPIendpoint}/notifications/create/`,
    data
  );
  const validation = notificationSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * submits Responses to database and updates the Ui optimistically
 * @async
 * @param {NotificationMessage} data
 * @returns {Promise<NotificationMessage>}
 */
export const updateNotification = async (data) => {
  const response = await axiosInstance.put(
    `${notificationAPIendpoint}/notifications/${data.id}/update/`,
    data
  );
  const validation = notificationSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * submits Responses to database and updates the Ui optimistically
 * @async
 * @param {number} id
* @returns {Promise<number>}
 */
export const deleteNotification = async (id) => {
  const response = await axiosInstance.delete(
    `${notificationAPIendpoint}/notifications/${id}/delete/`
  );
  return id;
};
