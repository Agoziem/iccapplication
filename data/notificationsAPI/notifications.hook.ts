/**
 * @fileoverview Notification Management React Query Hooks
 * 
 * Comprehensive React Query hooks for notification system operations including
 * real-time updates, CRUD operations, bulk actions, and user preferences with
 * optimized caching strategies and enhanced error handling.
 * 
 * Features:
 * - Real-time notification updates with automatic polling
 * - CRUD operations with optimistic updates and cache management
 * - Bulk operations for efficient notification handling
 * - User preferences management with cache synchronization
 * - Comprehensive error handling and loading states
 * - Smart caching with automatic invalidation strategies
 * 
 * @version 2.0.0
 * @author Innovation CyberCafe Team
 */

"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "react-query";
import {
  // Core CRUD
  fetchNotifications,
  fetchNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
  
  // Bulk Operations
  bulkMarkAsViewed,
  markAllAsViewed,
  bulkDeleteNotifications,
  
  // Statistics and Analytics
  fetchNotificationStats,
  getUnreadNotificationCount,
  
  // User Preferences
  fetchNotificationPreferences,
  updateNotificationPreferences,
  
  // Real-time
  checkNewNotifications,
} from "./fetcher";

// =================== CORE NOTIFICATION HOOKS =================== //

/**
 * Hook to fetch notifications with filtering and pagination
 * Retrieves user notifications with automatic caching and real-time updates.
 * 
 * @function useFetchNotifications
 * @param {Object} [filters={}] - Filtering parameters
 * @param {Object} [options={}] - React Query options
 * @returns {Object} React Query query object for notifications
 */
export const useFetchNotifications = (filters = {}, options = {}) => {
  return useQuery(
    ["notifications", filters],
    () => fetchNotifications(filters),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      cacheTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      onSuccess: (data) => {
        // Sort by creation date descending
        const sortedData = data.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        console.log(`🔔 [HOOK] Successfully fetched ${sortedData.length} notifications`);
        return sortedData;
      },
      onError: (error) => {
        console.error('🔔 [HOOK] Failed to fetch notifications:', error);
      },
      ...options,
    }
  );
};

/**
 * Hook to fetch notifications with infinite scroll
 * Enables infinite loading for large notification lists.
 * 
 * @function useFetchNotificationsInfinite
 * @param {Object} [filters={}] - Filtering parameters
 * @param {Object} [options={}] - React Query options
 * @returns {Object} React Query infinite query object
 */
export const useFetchNotificationsInfinite = (filters = {}, options = {}) => {
  return useInfiniteQuery(
    ["notifications-infinite", filters],
    ({ pageParam = 1 }) => fetchNotifications({ ...filters, page: pageParam }),
    {
      getNextPageParam: (lastPage, pages) => {
        // Assuming API returns hasNextPage or similar
        return lastPage.length > 0 ? pages.length + 1 : undefined;
      },
      staleTime: 2 * 60 * 1000,
      cacheTime: 5 * 60 * 1000,
      onError: (error) => {
        console.error('🔔 [HOOK] Failed to fetch infinite notifications:', error);
      },
      ...options,
    }
  );
};

/**
 * Hook to fetch a single notification by ID
 * Retrieves detailed notification information.
 * 
 * @function useFetchNotificationById
 * @param {number} id - Notification ID
 * @param {Object} [options={}] - React Query options
 * @returns {Object} React Query query object for single notification
 */
export const useFetchNotificationById = (id, options = {}) => {
  return useQuery(
    ["notification", id],
    () => fetchNotificationById(id),
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      onSuccess: (data) => {
        console.log('🔔 [HOOK] Successfully fetched notification:', data.id);
      },
      onError: (error) => {
        console.error('🔔 [HOOK] Failed to fetch notification:', error);
      },
      ...options,
    }
  );
};

/**
 * Hook to create a new notification
 * Creates notifications with automatic cache invalidation.
 * 
 * @function useCreateNotification
 * @returns {Object} React Query mutation object for notification creation
 */
export const useCreateNotification = () => {
  const queryClient = useQueryClient();
  return useMutation(createNotification, {
    onSuccess: (newNotification) => {
      // Invalidate notifications list
      queryClient.invalidateQueries(["notifications"]);
      queryClient.invalidateQueries(["notifications-infinite"]);
      // Update unread count
      queryClient.invalidateQueries(["unread-count"]);
      console.log('🔔 [HOOK] Successfully created notification:', newNotification.id);
    },
    onError: (error) => {
      console.error('🔔 [HOOK] Failed to create notification:', error);
    },
  });
};

/**
 * Hook to update a notification
 * Updates notifications with optimistic updates and cache management.
 * 
 * @function useUpdateNotification
 * @returns {Object} React Query mutation object for notification updates
 */
export const useUpdateNotification = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (/** @type {any} */ variables) => updateNotification(variables.id, variables.data),
    {
      onMutate: async (/** @type {any} */ variables) => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries(["notifications"]);
        await queryClient.cancelQueries(["notification", variables.id]);
        
        // Snapshot previous values
        const previousNotifications = queryClient.getQueryData(["notifications"]);
        const previousNotification = queryClient.getQueryData(["notification", variables.id]);
        
        // Optimistically update notifications list
        if (previousNotifications) {
          queryClient.setQueryData(["notifications"], (/** @type {any} */ old) => {
            return old.map((/** @type {NotificationData} */ notification) =>
              notification.id === variables.id
                ? { ...notification, ...variables.data }
                : notification
            );
          });
        }
        
        // Optimistically update single notification
        if (previousNotification && typeof previousNotification === 'object') {
          queryClient.setQueryData(["notification", variables.id], {
            ...(/** @type {any} */ previousNotification),
            ...variables.data,
          });
        }
        
        return { previousNotifications, previousNotification };
      },
      onError: (error, variables, context) => {
        // Rollback on error
        if (context?.previousNotifications) {
          queryClient.setQueryData(["notifications"], context.previousNotifications);
        }
        if (context?.previousNotification) {
          queryClient.setQueryData(["notification", variables.id], context.previousNotification);
        }
        console.error('🔔 [HOOK] Failed to update notification:', error);
      },
      onSuccess: (updatedNotification, variables) => {
        // Update specific notification in cache
        queryClient.setQueryData(["notification", variables.id], updatedNotification);
        // Update unread count if viewed status changed
        if (variables.data.viewed !== undefined) {
          queryClient.invalidateQueries(["unread-count"]);
        }
        console.log('🔔 [HOOK] Successfully updated notification:', variables.id);
      },
      onSettled: () => {
        // Always refetch after error or success
        queryClient.invalidateQueries(["notifications"]);
        queryClient.invalidateQueries(["notifications-infinite"]);
      },
    }
  );
};

/**
 * Hook to delete a notification
 * Deletes notifications with optimistic updates and cache cleanup.
 * 
 * @function useDeleteNotification
 * @returns {Object} React Query mutation object for notification deletion
 */
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteNotification, {
    onMutate: async (notificationId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(["notifications"]);
      
      // Snapshot previous value
      const previousNotifications = queryClient.getQueryData(["notifications"]);
      
      // Optimistically update
      if (previousNotifications) {
        queryClient.setQueryData(["notifications"], (/** @type {NotificationArray} */ old) => {
          return old.filter((/** @type {NotificationData} */ notification) => notification.id !== notificationId);
        });
      }
      
      return { previousNotifications };
    },
    onError: (error, notificationId, context) => {
      // Rollback on error
      if (context?.previousNotifications) {
        queryClient.setQueryData(["notifications"], context.previousNotifications);
      }
      console.error('🔔 [HOOK] Failed to delete notification:', error);
    },
    onSuccess: (deletedId) => {
      // Remove specific notification from cache
      queryClient.removeQueries(["notification", deletedId]);
      // Update unread count
      queryClient.invalidateQueries(["unread-count"]);
      console.log('🔔 [HOOK] Successfully deleted notification:', deletedId);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries(["notifications"]);
      queryClient.invalidateQueries(["notifications-infinite"]);
    },
  });
};

// =================== BULK OPERATIONS HOOKS =================== //

/**
 * Hook to mark multiple notifications as viewed
 * Bulk update for efficient notification management.
 * 
 * @function useBulkMarkAsViewed
 * @returns {Object} React Query mutation object for bulk mark as viewed
 */
export const useBulkMarkAsViewed = () => {
  const queryClient = useQueryClient();
  return useMutation(bulkMarkAsViewed, {
    onMutate: async (notificationIds) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(["notifications"]);
      
      // Snapshot previous value
      const previousNotifications = queryClient.getQueryData(["notifications"]);
      
      // Optimistically update
      if (previousNotifications) {
        queryClient.setQueryData(["notifications"], (/** @type {NotificationArray} */ old) => {
          return old.map((/** @type {NotificationData} */ notification) =>
            notificationIds.includes(notification.id)
              ? { ...notification, viewed: true }
              : notification
          );
        });
      }
      
      return { previousNotifications };
    },
    onError: (error, notificationIds, context) => {
      // Rollback on error
      if (context?.previousNotifications) {
        queryClient.setQueryData(["notifications"], context.previousNotifications);
      }
      console.error('🔔 [HOOK] Failed to bulk mark as viewed:', error);
    },
    onSuccess: (result, notificationIds) => {
      // Update unread count
      queryClient.invalidateQueries(["unread-count"]);
      console.log('🔔 [HOOK] Successfully marked notifications as viewed:', notificationIds.length);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries(["notifications"]);
      queryClient.invalidateQueries(["notifications-infinite"]);
    },
  });
};

/**
 * Hook to mark all notifications as viewed
 * Convenience function for bulk operations.
 * 
 * @function useMarkAllAsViewed
 * @returns {Object} React Query mutation object for mark all as viewed
 */
export const useMarkAllAsViewed = () => {
  const queryClient = useQueryClient();
  return useMutation(markAllAsViewed, {
    onSuccess: (result) => {
      // Invalidate all notification-related queries
      queryClient.invalidateQueries(["notifications"]);
      queryClient.invalidateQueries(["notifications-infinite"]);
      queryClient.invalidateQueries(["unread-count"]);
      console.log('🔔 [HOOK] Successfully marked all notifications as viewed');
    },
    onError: (error) => {
      console.error('🔔 [HOOK] Failed to mark all as viewed:', error);
    },
  });
};

/**
 * Hook to delete multiple notifications
 * Bulk delete for efficient notification management.
 * 
 * @function useBulkDeleteNotifications
 * @returns {Object} React Query mutation object for bulk delete
 */
export const useBulkDeleteNotifications = () => {
  const queryClient = useQueryClient();
  return useMutation(bulkDeleteNotifications, {
    onMutate: async (notificationIds) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(["notifications"]);
      
      // Snapshot previous value
      const previousNotifications = queryClient.getQueryData(["notifications"]);
      
      // Optimistically update
      if (previousNotifications) {
        queryClient.setQueryData(["notifications"], (/** @type {NotificationArray} */ old) => {
          return old.filter((/** @type {NotificationData} */ notification) => !notificationIds.includes(notification.id));
        });
      }
      
      return { previousNotifications };
    },
    onError: (error, notificationIds, context) => {
      // Rollback on error
      if (context?.previousNotifications) {
        queryClient.setQueryData(["notifications"], context.previousNotifications);
      }
      console.error('🔔 [HOOK] Failed to bulk delete notifications:', error);
    },
    onSuccess: (result, notificationIds) => {
      // Remove specific notifications from cache
      notificationIds.forEach(id => {
        queryClient.removeQueries(["notification", id]);
      });
      // Update unread count
      queryClient.invalidateQueries(["unread-count"]);
      console.log('🔔 [HOOK] Successfully deleted notifications:', notificationIds.length);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries(["notifications"]);
      queryClient.invalidateQueries(["notifications-infinite"]);
    },
  });
};

// =================== STATISTICS AND ANALYTICS HOOKS =================== //

/**
 * Hook to fetch notification statistics
 * Retrieves aggregated notification data for dashboards.
 * 
 * @function useFetchNotificationStats
 * @param {Object} [options={}] - Statistics options
 * @param {Object} [queryOptions={}] - React Query options
 * @returns {Object} React Query query object for statistics
 */
export const useFetchNotificationStats = (options = {}, queryOptions = {}) => {
  return useQuery(
    ["notification-stats", options],
    () => fetchNotificationStats(options),
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
      cacheTime: 15 * 60 * 1000, // 15 minutes
      onSuccess: (data) => {
        console.log('🔔 [HOOK] Successfully fetched notification statistics');
      },
      onError: (error) => {
        console.error('🔔 [HOOK] Failed to fetch notification stats:', error);
      },
      ...queryOptions,
    }
  );
};

/**
 * Hook to get unread notification count
 * Real-time count of unread notifications.
 * 
 * @function useUnreadNotificationCount
 * @param {Object} [options={}] - React Query options
 * @returns {Object} React Query query object for unread count
 */
export const useUnreadNotificationCount = (options = {}) => {
  return useQuery(
    ["unread-count"],
    getUnreadNotificationCount,
    {
      staleTime: 30 * 1000, // 30 seconds
      cacheTime: 2 * 60 * 1000, // 2 minutes
      refetchInterval: 60 * 1000, // Refetch every minute
      refetchOnWindowFocus: true,
      onSuccess: (count) => {
        console.log(`🔔 [HOOK] Unread notifications count: ${count}`);
      },
      onError: (error) => {
        console.error('🔔 [HOOK] Failed to get unread count:', error);
      },
      ...options,
    }
  );
};

// =================== USER PREFERENCES HOOKS =================== //

/**
 * Hook to fetch notification preferences
 * Retrieves user notification settings.
 * 
 * @function useFetchNotificationPreferences
 * @param {Object} [options={}] - React Query options
 * @returns {Object} React Query query object for preferences
 */
export const useFetchNotificationPreferences = (options = {}) => {
  return useQuery(
    ["notification-preferences"],
    fetchNotificationPreferences,
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
      cacheTime: 15 * 60 * 1000, // 15 minutes
      onSuccess: (data) => {
        console.log('🔔 [HOOK] Successfully fetched notification preferences');
      },
      onError: (error) => {
        console.error('🔔 [HOOK] Failed to fetch preferences:', error);
      },
      ...options,
    }
  );
};

/**
 * Hook to update notification preferences
 * Updates user notification settings with cache synchronization.
 * 
 * @function useUpdateNotificationPreferences
 * @returns {Object} React Query mutation object for preferences update
 */
export const useUpdateNotificationPreferences = () => {
  const queryClient = useQueryClient();
  return useMutation(updateNotificationPreferences, {
    onSuccess: (updatedPreferences) => {
      // Update preferences in cache
      queryClient.setQueryData(["notification-preferences"], updatedPreferences);
      console.log('🔔 [HOOK] Successfully updated notification preferences');
    },
    onError: (error) => {
      console.error('🔔 [HOOK] Failed to update preferences:', error);
    },
  });
};

// =================== REAL-TIME HOOKS =================== //

/**
 * Hook for real-time notification polling
 * Checks for new notifications at regular intervals.
 * 
 * @function useNotificationPolling
 * @param {number} [interval=30000] - Polling interval in milliseconds
 * @param {Object} [options={}] - React Query options
 * @returns {Object} React Query query object for real-time updates
 */
export const useNotificationPolling = (interval = 30000, options = {}) => {
  const queryClient = useQueryClient();
  
  return useQuery(
    ["notification-polling"],
    () => {
      const lastCheck = localStorage.getItem('lastNotificationCheck') || new Date().toISOString();
      return checkNewNotifications(lastCheck);
    },
    {
      refetchInterval: interval,
      refetchIntervalInBackground: true,
      onSuccess: (newNotifications) => {
        if (newNotifications.length > 0) {
          // Update last check time
          localStorage.setItem('lastNotificationCheck', new Date().toISOString());
          
          // Invalidate notifications to include new ones
          queryClient.invalidateQueries(["notifications"]);
          queryClient.invalidateQueries(["unread-count"]);
          
          console.log(`🔔 [HOOK] Found ${newNotifications.length} new notifications`);
        }
      },
      onError: (error) => {
        console.error('🔔 [HOOK] Failed to check for new notifications:', error);
      },
      ...options,
    }
  );
};

