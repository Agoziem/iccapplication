"use client";

import { 
  useQuery, 
  useMutation, 
  QueryClient, 
  useQueryClient,
  UseQueryResult,
  UseMutationResult
} from "react-query";
import type { NotificationMessage } from "@/types/notifications";
import {
  fetchNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
} from "@/data/notificationsAPI/fetcher";

type NotificationMessageArray = NotificationMessage[];

// Initialize the Query Client
const queryClient = new QueryClient();

// Custom Hook: Fetch Notifications
export const useFetchNotifications = (): UseQueryResult<NotificationMessageArray | undefined, Error> => {
  return useQuery(["notifications"], fetchNotifications);
};

// Custom Hook: Create Notification
export const useCreateNotification = (): UseMutationResult<NotificationMessage | undefined, Error, Omit<NotificationMessage, "id" | "created_at">> => {
  const queryClient = useQueryClient();
  return useMutation(createNotification, {
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]); // Refresh notifications list
    },
  });
};

// Custom Hook: Update Notification
export const useUpdateNotification = (): UseMutationResult<NotificationMessage | undefined, Error, NotificationMessage> => {
  const queryClient = useQueryClient();
  return useMutation(updateNotification, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["notifications"]); // Refresh notifications list
      queryClient.invalidateQueries(["notification", variables.id]); // Refresh specific notification if needed
    },
  });
};

// Custom Hook: Delete Notification
export const useDeleteNotification = (): UseMutationResult<number, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation(deleteNotification, {
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]); // Refresh notifications list
    },
  });
};
