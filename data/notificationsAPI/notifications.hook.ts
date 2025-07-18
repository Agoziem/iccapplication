"use client";

import React from "react";
import { useQuery, useMutation, QueryClient, QueryClientProvider, useQueryClient } from "react-query";
import {
  fetchNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
} from "@/data/notificationsAPI/fetcher";

// Initialize the Query Client
const queryClient = new QueryClient();

// Custom Hook: Fetch Notifications
export const useFetchNotifications = () => {
  return useQuery(["notifications"], fetchNotifications);
};

// Custom Hook: Create Notification
export const useCreateNotification = () => {
  const queryClient = useQueryClient();
  return useMutation(createNotification, {
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]); // Refresh notifications list
    },
  });
};

// Custom Hook: Update Notification
export const useUpdateNotification = () => {
  const queryClient = useQueryClient();
  return useMutation(updateNotification, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["notifications"]); // Refresh notifications list
      queryClient.invalidateQueries(["notification", variables.id]); // Refresh specific notification if needed
    },
  });
};

// Custom Hook: Delete Notification
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteNotification, {
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]); // Refresh notifications list
    },
  });
};

// Optional Notifications Provider (for global query client and structure)
export const NotificationsProvider = ({ children }) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
