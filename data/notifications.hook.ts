import { Notification, PaginatedNotificationResponse, SuccessResponse, UnreadCountResponse } from "@/types/notifications";
import { AxiosinstanceAuth } from "./instance";
import { CreateNotificationType, UpdateNotificationType } from "@/schemas/notifications";
import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from "react-query";

// ======================================================
// React Query Hooks - Notifications
// ======================================================

/**
 * Hook to fetch all notifications
 */
export const useGetNotifications = (): UseQueryResult<PaginatedNotificationResponse> => {
  return useQuery("notifications", async () => {
    try {
      const response = await AxiosinstanceAuth.get(`/notifications/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  });
};

/**
 * Hook to fetch single notification by ID
 */
export const useGetNotification = (id: number): UseQueryResult<Notification> => {
  return useQuery(
    ["notification", id],
    async () => {
      try {
        const response = await AxiosinstanceAuth.get(`/notifications/${id}`);
        return response.data;
      } catch (error) {
        console.error("Error fetching notification by ID:", error);
        throw error;
      }
    },
    {
      enabled: !!id,
    }
  );
};

/**
 * Hook to get unread notifications count
 */
export const useGetUnreadNotificationsCount = (): UseQueryResult<UnreadCountResponse> => {
  return useQuery("unreadNotificationsCount", async () => {
    try {
      const response = await AxiosinstanceAuth.get(`/notifications/unread/count`);
      return response.data;
    } catch (error) {
      console.error("Error fetching unread notifications count:", error);
      throw error;
    }
  });
};

/**
 * Hook to create a new notification
 */
export const useCreateNotification = (): UseMutationResult<Notification, Error, CreateNotificationType> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: CreateNotificationType) => {
      try {
        const response = await AxiosinstanceAuth.post(`/notifications/`, data);
        return response.data;
      } catch (error) {
        console.error("Error creating notification:", error);
        throw error;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("notifications");
        queryClient.invalidateQueries("unreadNotificationsCount");
      },
      onError: (error) => {
        console.error("Failed to create notification:", error);
      },
    }
  );
};

/**
 * Hook to update an existing notification
 */
export const useUpdateNotification = (): UseMutationResult<
  Notification,
  Error,
  { id: number; notification: UpdateNotificationType }
> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: { id: number; notification: UpdateNotificationType }) => {
      try {
        const response = await AxiosinstanceAuth.put(`/notifications/${data.id}`, data.notification);
        return response.data;
      } catch (error) {
        console.error("Error updating notification:", error);
        throw error;
      }
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries("notifications");
        queryClient.invalidateQueries(["notification", variables.id]);
        queryClient.invalidateQueries("unreadNotificationsCount");
      },
      onError: (error) => {
        console.error("Failed to update notification:", error);
      },
    }
  );
};

/**
 * Hook to delete a notification
 */
export const useDeleteNotification = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (id: number) => {
      try {
        await AxiosinstanceAuth.delete(`/notifications/${id}/`);
      } catch (error) {
        console.error("Error deleting notification:", error);
        throw error;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("notifications");
        queryClient.invalidateQueries("unreadNotificationsCount");
      },
      onError: (error) => {
        console.error("Failed to delete notification:", error);
      },
    }
  );
};

/**
 * Hook to mark a notification as viewed
 */
export const useMarkNotificationAsViewed = (): UseMutationResult<Notification, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (notificationId: number) => {
      try {
        const response = await AxiosinstanceAuth.post(`/notifications/${notificationId}/mark-viewed/`);
        return response.data;
      } catch (error) {
        console.error("Error marking notification as viewed:", error);
        throw error;
      }
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries("notifications");
        queryClient.invalidateQueries(["notification", variables]);
        queryClient.invalidateQueries("unreadNotificationsCount");
      },
      onError: (error) => {
        console.error("Failed to mark notification as viewed:", error);
      },
    }
  );
};

/**
 * Hook to mark all notifications as viewed
 */
export const useMarkAllNotificationsAsViewed = (): UseMutationResult<SuccessResponse, Error, void> => {
  const queryClient = useQueryClient();
  return useMutation(
    async () => {
      try {
        const response = await AxiosinstanceAuth.post(`/notifications/mark-all-viewed/`);
        return response.data;
      } catch (error) {
        console.error("Error marking all notifications as viewed:", error);
        throw error;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("notifications");
        queryClient.invalidateQueries("unreadNotificationsCount");
      },
      onError: (error) => {
        console.error("Failed to mark all notifications as viewed:", error);
      },
    }
  );
};