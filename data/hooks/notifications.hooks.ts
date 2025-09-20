import { converttoformData } from "@/utils/formutils";
import { AxiosInstance, AxiosInstancemultipart, AxiosInstanceWithToken, AxiosInstancemultipartWithToken } from "../instance";
import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from "react-query";
import {
  NotificationCreate,
  NotificationUpdate,
  NotificationReadUpdate,
  RemoveNotification,
  NotificationResponse,
  UserNotificationList,
  NotificationRecipient
} from "@/types/notifications";
import { ORGANIZATION_ID } from "../constants";
import { SuccessResponse } from "@/types/users";

export const notificationAPIendpoint = "/notificationsapi";


// notificationsapi


// GET
// /notificationsapi/


// POST
// /notificationsapi/create/


// DELETE
// /notificationsapi/delete/{notification_id}/


// GET
// /notificationsapi/get/{notification_id}/


// POST
// /notificationsapi/mark-read/


// POST
// /notificationsapi/remove-user/


// PUT
// /notificationsapi/update/{notification_id}/


// GET
// /notificationsapi/user/{user_id}/sent/


// GET
// /notificationsapi/user/{user_id}/unread/


// Query Keys
export const NOTIFICATION_KEYS = {
  all: ['notifications'] as const,
  notifications: () => [...NOTIFICATION_KEYS.all, 'notifications'] as const,
  notification: (id: number) => [...NOTIFICATION_KEYS.all, 'notification', id] as const,
  userNotifications: (userId: number) => [...NOTIFICATION_KEYS.all, 'user', userId] as const,
  userSentNotifications: (userId: number) => [...NOTIFICATION_KEYS.all, 'user', userId, 'sent'] as const,
  userUnreadNotifications: (userId: number) => [...NOTIFICATION_KEYS.all, 'user', userId, 'unread'] as const,
};

// API Functions
export const fetchNotifications = async (): Promise<NotificationResponse[]> => {
  const response = await AxiosInstance.get(`${notificationAPIendpoint}/`);
  return response.data;
};

export const fetchNotification = async (notificationId: number): Promise<NotificationResponse> => {
  const response = await AxiosInstance.get(`${notificationAPIendpoint}/get/${notificationId}/`);
  return response.data;
};

export const createNotification = async (notificationData: NotificationCreate): Promise<NotificationResponse> => {
  const formData = converttoformData(notificationData, ["user_ids"]);
  const response = await AxiosInstancemultipartWithToken.post(
    `${notificationAPIendpoint}/create/`,
    formData
  );
  return response.data;
};

export const updateNotification = async (notificationId: number, updateData: NotificationUpdate): Promise<NotificationResponse> => {
  const formData = converttoformData(updateData, ["user_ids"]);
  const response = await AxiosInstancemultipartWithToken.put(
    `${notificationAPIendpoint}/update/${notificationId}/`,
    formData
  );
  return response.data;
};

export const deleteNotification = async (notificationId: number): Promise<void> => {
  await AxiosInstanceWithToken.delete(`${notificationAPIendpoint}/delete/${notificationId}/`);
};

export const markNotificationAsRead = async (readData: NotificationReadUpdate): Promise<SuccessResponse> => {
  const response = await AxiosInstanceWithToken.post(`${notificationAPIendpoint}/mark-read/`, readData);
  return response.data;
};

export const removeUserFromNotification = async (removeData: RemoveNotification): Promise<SuccessResponse> => {
  const response = await AxiosInstanceWithToken.post(`${notificationAPIendpoint}/remove-user/`, removeData);
  return response.data;
};

export const fetchUserSentNotifications = async (userId: number): Promise<NotificationResponse[]> => {
  const response = await AxiosInstanceWithToken.get(`${notificationAPIendpoint}/user/${userId}/sent/`);
  return response.data;
};

export const fetchUserUnreadNotifications = async (userId: number): Promise<UserNotificationList[]> => {
  const response = await AxiosInstanceWithToken.get(`${notificationAPIendpoint}/user/${userId}/unread/`);
  return response.data;
};

// React Query Hooks

// Notifications Hooks
export const useNotifications = (): UseQueryResult<NotificationResponse[], Error> => {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.notifications(),
    queryFn: fetchNotifications,
    onError: (error: Error) => {
      console.error('Error fetching notifications:', error);
      throw error;
    },
  });
};

export const useNotification = (notificationId: number): UseQueryResult<NotificationResponse, Error> => {
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

export const useUserSentNotifications = (userId: number): UseQueryResult<NotificationResponse[], Error> => {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.userSentNotifications(userId),
    queryFn: () => fetchUserSentNotifications(userId),
    enabled: !!userId,
    onError: (error: Error) => {
      console.error('Error fetching user sent notifications:', error);
      throw error;
    },
  });
};

export const useUserUnreadNotifications = (userId: number): UseQueryResult<UserNotificationList[], Error> => {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.userUnreadNotifications(userId),
    queryFn: () => fetchUserUnreadNotifications(userId),
    enabled: !!userId,
    onError: (error: Error) => {
      console.error('Error fetching user unread notifications:', error);
      throw error;
    },
  });
};

export const useCreateNotification = (): UseMutationResult<NotificationResponse, Error, NotificationCreate> => {
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

export const useUpdateNotification = (): UseMutationResult<NotificationResponse, Error, { notificationId: number; updateData: NotificationUpdate }> => {
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

export const useMarkNotificationAsRead = (): UseMutationResult<SuccessResponse, Error, NotificationReadUpdate> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(NOTIFICATION_KEYS.userUnreadNotifications(variables.user_id));
      queryClient.invalidateQueries(NOTIFICATION_KEYS.notification(variables.notification_id));
      queryClient.invalidateQueries(NOTIFICATION_KEYS.notifications());
    },
    onError: (error: Error) => {
      console.error('Error marking notification as read:', error);
      throw error;
    },
  });
};

export const useRemoveUserFromNotification = (): UseMutationResult<SuccessResponse, Error, RemoveNotification> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: removeUserFromNotification,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(NOTIFICATION_KEYS.userUnreadNotifications(variables.user_id));
      queryClient.invalidateQueries(NOTIFICATION_KEYS.notification(variables.notification_id));
      queryClient.invalidateQueries(NOTIFICATION_KEYS.notifications());
    },
    onError: (error: Error) => {
      console.error('Error removing user from notification:', error);
      throw error;
    },
  });
};
