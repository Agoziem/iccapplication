import { converttoformData } from "@/utils/formutils";
import { AxiosInstance, AxiosInstancemultipart, AxiosInstanceWithToken, AxiosInstancemultipartWithToken } from "../instance";
import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from "react-query";
import {
  Notification,
  CreateNotification,
  UpdateNotification,
  Notifications
} from "@/types/notifications";
import { ORGANIZATION_ID } from "../constants";

export const notificationAPIendpoint = "/notificationsapi";

// Query Keys
export const NOTIFICATION_KEYS = {
  all: ['notifications'] as const,
  notifications: () => [...NOTIFICATION_KEYS.all, 'notifications'] as const,
  notification: (id: number) => [...NOTIFICATION_KEYS.all, 'notification', id] as const,
};


export const fetchNotifications = async (): Promise<Notifications> => {
  const response = await AxiosInstance.get(`${notificationAPIendpoint}/notifications/`);
  return response.data;
};

export const fetchNotification = async (notificationId: number): Promise<Notification> => {
  const response = await AxiosInstance.get(`${notificationAPIendpoint}/notifications/${notificationId}/`);
  return response.data;
};

export const createNotification = async (notificationData: CreateNotification): Promise<Notification> => {
  const response = await AxiosInstanceWithToken.post(
    `${notificationAPIendpoint}/notifications/create/`,
    notificationData
  );
  return response.data;
};

export const updateNotification = async (notificationId: number, updateData: UpdateNotification): Promise<Notification> => {
  const response = await AxiosInstanceWithToken.put(
    `${notificationAPIendpoint}/notifications/${notificationId}/update/`,
    updateData
  );
  return response.data;
};

export const deleteNotification = async (notificationId: number): Promise<void> => {
  await AxiosInstanceWithToken.delete(`${notificationAPIendpoint}/notifications/${notificationId}/delete/`);
};

// React Query Hooks

// Notifications Hooks
export const useNotifications = (): UseQueryResult<Notifications, Error> => {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.notifications(),
    queryFn: fetchNotifications,
    onError: (error: Error) => {
      console.error('Error fetching notifications:', error);
      throw error;
    },
  });
};

export const useNotification = (notificationId: number): UseQueryResult<Notification, Error> => {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.notification(notificationId),
    queryFn: () => fetchNotification(notificationId),
    enabled: !!notificationId,
    onError: (error: Error) => {
      console.error('Error fetching notification:', error);
      throw error;
    },
  });
};

export const useCreateNotification = (): UseMutationResult<Notification, Error, CreateNotification> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createNotification,
    onSuccess: () => {
      queryClient.invalidateQueries(NOTIFICATION_KEYS.notifications());
    },
    onError: (error: Error) => {
      console.error('Error creating notification:', error);
      throw error;
    },
  });
};

export const useUpdateNotification = (): UseMutationResult<Notification, Error, { notificationId: number; updateData: UpdateNotification }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ notificationId, updateData }) => updateNotification(notificationId, updateData),
    onSuccess: (data) => {
      if (data.id) {
        queryClient.invalidateQueries(NOTIFICATION_KEYS.notification(data.id));
      }
      queryClient.invalidateQueries(NOTIFICATION_KEYS.notifications());
    },
    onError: (error: Error) => {
      console.error('Error updating notification:', error);
      throw error;
    },
  });
};

export const useDeleteNotification = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries(NOTIFICATION_KEYS.notifications());
    },
    onError: (error: Error) => {
      console.error('Error deleting notification:', error);
      throw error;
    },
  });
};
