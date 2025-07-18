import type { NotificationMessage } from "@/types/notifications";
import axios, { AxiosResponse } from "axios";

type NotificationMessageArray = NotificationMessage[];

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}`,
});

export const notificationAPIendpoint = "/notificationsapi";

// Fetch all the notifications
export async function fetchNotifications(): Promise<NotificationMessageArray | undefined> {
  try {
    const response: AxiosResponse<NotificationMessageArray> = await axiosInstance.get(
      `${notificationAPIendpoint}/notifications/`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
}

// Create a new notification
export async function createNotification(
  data: Omit<NotificationMessage, "id" | "created_at">
): Promise<NotificationMessage | undefined> {
  try {
    const response: AxiosResponse<NotificationMessage> = await axiosInstance.post(
      `${notificationAPIendpoint}/notifications/create/`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
}

// Update an existing notification
export async function updateNotification(
  data: NotificationMessage
): Promise<NotificationMessage | undefined> {
  try {
    const response: AxiosResponse<NotificationMessage> = await axiosInstance.put(
      `${notificationAPIendpoint}/notifications/${data.id}/update/`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error updating notification:", error);
    throw error;
  }
}

// Delete a notification by ID
export async function deleteNotification(id: number): Promise<number> {
  try {
    await axiosInstance.delete(`${notificationAPIendpoint}/notifications/${id}/delete/`);
    return id;
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
}
