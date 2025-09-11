/**
 * @fileoverview Notification Management API Integration Module
 * 
 * Comprehensive API integration for notification system managing user notifications,
 * system alerts, real-time updates, and notification preferences with enhanced
 * error handling, validation, and timeout support.
 * 
 * Features:
 * - Real-time notification management with live updates
 * - CRUD operations for notifications with validation
 * - Bulk operations for efficient notification handling
 * - User notification preferences and settings
 * - Comprehensive error handling with retry logic
 * - Enhanced axios configuration with timeouts
 * 
 * @see https://docs.innovationcybercafe.com/api/notifications
 * @version 2.0.0
 * @author Innovation CyberCafe Team
 */

import axios from "axios";
import { z } from "zod";
import {
  NotificationSchema,
  CreateNotificationSchema,
  UpdateNotificationSchema,
  NotificationsSchema,
} from "@/schemas/notifications";

// Enhanced axios instance with timeout and interceptors
export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}`,
  timeout: 15000, // 15 second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for logging and error handling
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`🔔 [NOTIFICATION-API] ${config.method?.toUpperCase()} ${config.url}`);
    if (config.data) {
      console.log('🔔 [NOTIFICATION-API] Request data:', config.data);
    }
    return config;
  },
  (error) => {
    console.error('🔔 [NOTIFICATION-API] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging and error handling
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`🔔 [NOTIFICATION-API] Response ${response.status} from ${response.config.url}`);
    return response;
  },
  (error) => {
    const errorContext = {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    };
    console.error('🔔 [NOTIFICATION-API] Response error:', errorContext);
    
    // Enhanced error handling with user-friendly messages
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout - Please check your internet connection and try again';
    } else if (error.response?.status === 404) {
      error.message = 'Notification resource not found';
    } else if (error.response?.status === 403) {
      error.message = 'Access denied - Please check your permissions';
    } else if (error.response?.status >= 500) {
      error.message = 'Server error - Please try again later';
    }
    
    return Promise.reject(error);
  }
);

/**
 * Base API endpoint for notification operations
 * All notification API calls are prefixed with this endpoint
 */
export const notificationAPIendpoint = "/notificationsapi";

/**
 * Organization ID from environment variables
 * Used for organization-scoped notification operations
 */
const ORGANIZATION_ID = process.env.NEXT_PUBLIC_ORGANIZATION_ID;

// ======================== CORE NOTIFICATION CRUD OPERATIONS ======================== //

/**
 * Fetches all notifications with optional filtering and pagination
 * Retrieves user notifications with comprehensive filtering and sorting options.
 * 
 * @function fetchNotifications
 * @param {Object} [filters={}] - Filtering and pagination parameters
 * @returns {Promise<NotificationArray>} Promise resolving to notifications array
 * @throws {Error} When notification retrieval fails or validation errors occur
 */
export const fetchNotifications = async (filters = {}) => {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    if (ORGANIZATION_ID) params.append('organization', ORGANIZATION_ID);
    
    // Add filter parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await axiosInstance.get(
      `${notificationAPIendpoint}/notifications/?${params.toString()}`
    );

    const validation = NotificationsSchema.safeParse(response.data);
    if (!validation.success) {
      console.error('🔔 [FETCH-NOTIFICATIONS] Validation errors:', validation.error.issues);
      throw new Error('Notifications data validation failed');
    }

    console.log(`🔔 [FETCH-NOTIFICATIONS] Successfully fetched ${validation.data.length} notifications`);
    return validation.data;
  } catch (error) {
    console.error('🔔 [FETCH-NOTIFICATIONS] Failed to fetch notifications:', error);
    throw new Error(`Failed to fetch notifications: ${error.message}`);
  }
};

/**
 * Fetches a single notification by ID
 * Returns detailed notification information for specific notification.
 * 
 * @function fetchNotificationById
 * @param {number} id - Notification ID to fetch
 * @returns {Promise<NotificationData>} Promise resolving to notification data
 * @throws {Error} When notification retrieval fails or validation errors occur
 */
export const fetchNotificationById = async (id) => {
  try {
    if (!id || id <= 0) {
      throw new Error('Valid notification ID is required');
    }

    const params = new URLSearchParams();
    if (ORGANIZATION_ID) params.append('organization', ORGANIZATION_ID);

    const response = await axiosInstance.get(
      `${notificationAPIendpoint}/notifications/${id}/?${params.toString()}`
    );

    const validation = NotificationSchema.safeParse(response.data);
    if (!validation.success) {
      console.error('🔔 [FETCH-NOTIFICATION] Validation errors:', validation.error.issues);
      throw new Error('Notification data validation failed');
    }

    console.log('🔔 [FETCH-NOTIFICATION] Successfully fetched notification:', id);
    return validation.data;
  } catch (error) {
    console.error('🔔 [FETCH-NOTIFICATION] Failed to fetch notification:', error);
    throw new Error(`Failed to fetch notification: ${error.message}`);
  }
};

/**
 * Creates a new notification
 * Creates system notifications with comprehensive validation.
 * 
 * @function createNotification
 * @param {CreateNotificationData} notificationData - Notification data to create
 * @returns {Promise<NotificationData>} Promise resolving to created notification
 * @throws {Error} When notification creation fails or validation errors occur
 */
export const createNotification = async (notificationData) => {
  try {
    // Validate input data
    const inputValidation = CreateNotificationSchema.safeParse(notificationData);
    if (!inputValidation.success) {
      console.error('🔔 [CREATE-NOTIFICATION] Input validation errors:', inputValidation.error.issues);
      throw new Error('Invalid notification data');
    }

    // Add organization context
    const requestData = {
      ...inputValidation.data,
      ...(ORGANIZATION_ID && { organization: ORGANIZATION_ID })
    };

    const response = await axiosInstance.post(
      `${notificationAPIendpoint}/notifications/create/`,
      requestData
    );

    const validation = NotificationSchema.safeParse(response.data);
    if (!validation.success) {
      console.error('🔔 [CREATE-NOTIFICATION] Response validation errors:', validation.error.issues);
      throw new Error('Notification creation response validation failed');
    }

    console.log('🔔 [CREATE-NOTIFICATION] Successfully created notification:', validation.data.id);
    return validation.data;
  } catch (error) {
    console.error('🔔 [CREATE-NOTIFICATION] Failed to create notification:', error);
    throw new Error(`Failed to create notification: ${error.message}`);
  }
};

/**
 * Updates an existing notification
 * Modifies notification details with comprehensive validation.
 * 
 * @function updateNotification
 * @param {number} id - Notification ID to update
 * @param {UpdateNotificationData} updateData - Update data
 * @returns {Promise<NotificationData>} Promise resolving to updated notification
 * @throws {Error} When notification update fails or validation errors occur
 */
export const updateNotification = async (id, updateData) => {
  try {
    if (!id || id <= 0) {
      throw new Error('Valid notification ID is required');
    }

    // Validate input data
    const inputValidation = UpdateNotificationSchema.safeParse(updateData);
    if (!inputValidation.success) {
      console.error('🔔 [UPDATE-NOTIFICATION] Input validation errors:', inputValidation.error.issues);
      throw new Error('Invalid update data');
    }

    const response = await axiosInstance.patch(
      `${notificationAPIendpoint}/notifications/${id}/update/`,
      inputValidation.data
    );

    const validation = NotificationSchema.safeParse(response.data);
    if (!validation.success) {
      console.error('🔔 [UPDATE-NOTIFICATION] Response validation errors:', validation.error.issues);
      throw new Error('Notification update response validation failed');
    }

    console.log('🔔 [UPDATE-NOTIFICATION] Successfully updated notification:', id);
    return validation.data;
  } catch (error) {
    console.error('🔔 [UPDATE-NOTIFICATION] Failed to update notification:', error);
    throw new Error(`Failed to update notification: ${error.message}`);
  }
};

/**
 * Deletes a notification
 * Removes a notification from the system.
 * 
 * @function deleteNotification
 * @param {number} id - Notification ID to delete
 * @returns {Promise<number>} Promise resolving to deleted notification ID
 * @throws {Error} When notification deletion fails
 */
export const deleteNotification = async (id) => {
  try {
    if (!id || id <= 0) {
      throw new Error('Valid notification ID is required');
    }

    await axiosInstance.delete(`${notificationAPIendpoint}/notifications/${id}/delete/`);

    console.log('🔔 [DELETE-NOTIFICATION] Successfully deleted notification:', id);
    return id;
  } catch (error) {
    console.error('🔔 [DELETE-NOTIFICATION] Failed to delete notification:', error);
    throw new Error(`Failed to delete notification: ${error.message}`);
  }
};

// ======================== BULK OPERATIONS ======================== //

/**
 * Marks multiple notifications as viewed
 * Efficiently updates multiple notifications in a single request.
 * 
 * @function bulkMarkAsViewed
 * @param {number[]} notificationIds - Array of notification IDs to mark as viewed
 * @returns {Promise<Object>} Promise resolving to bulk operation result
 * @throws {Error} When bulk operation fails
 */
export const bulkMarkAsViewed = async (notificationIds) => {
  try {
    if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
      throw new Error('Valid notification IDs array is required');
    }

    const requestData = {
      notification_ids: notificationIds,
      action: 'mark_viewed',
      data: { viewed: true },
      ...(ORGANIZATION_ID && { organization: ORGANIZATION_ID })
    };

    const response = await axiosInstance.post(
      `${notificationAPIendpoint}/notifications/bulk-update/`,
      requestData
    );

    console.log(`🔔 [BULK-MARK-VIEWED] Successfully marked ${notificationIds.length} notifications as viewed`);
    return response.data;
  } catch (error) {
    console.error('🔔 [BULK-MARK-VIEWED] Failed to mark notifications as viewed:', error);
    throw new Error(`Failed to mark notifications as viewed: ${error.message}`);
  }
};

/**
 * Marks all notifications as viewed for the current user
 * Convenience function for marking all unread notifications.
 * 
 * @function markAllAsViewed
 * @param {Object} [filters={}] - Optional filters to apply
 * @returns {Promise<Object>} Promise resolving to operation result
 * @throws {Error} When operation fails
 */
export const markAllAsViewed = async (filters = {}) => {
  try {
    const requestData = {
      ...filters,
      ...(ORGANIZATION_ID && { organization: ORGANIZATION_ID })
    };

    const response = await axiosInstance.post(
      `${notificationAPIendpoint}/notifications/mark-all-viewed/`,
      requestData
    );

    console.log('🔔 [MARK-ALL-VIEWED] Successfully marked all notifications as viewed');
    return response.data;
  } catch (error) {
    console.error('🔔 [MARK-ALL-VIEWED] Failed to mark all as viewed:', error);
    throw new Error(`Failed to mark all notifications as viewed: ${error.message}`);
  }
};

/**
 * Deletes multiple notifications
 * Efficiently removes multiple notifications in a single request.
 * 
 * @function bulkDeleteNotifications
 * @param {number[]} notificationIds - Array of notification IDs to delete
 * @returns {Promise<Object>} Promise resolving to bulk operation result
 * @throws {Error} When bulk operation fails
 */
export const bulkDeleteNotifications = async (notificationIds) => {
  try {
    if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
      throw new Error('Valid notification IDs array is required');
    }

    const requestData = {
      notification_ids: notificationIds,
      action: 'delete',
      ...(ORGANIZATION_ID && { organization: ORGANIZATION_ID })
    };

    const response = await axiosInstance.post(
      `${notificationAPIendpoint}/notifications/bulk-delete/`,
      requestData
    );

    console.log(`🔔 [BULK-DELETE] Successfully deleted ${notificationIds.length} notifications`);
    return response.data;
  } catch (error) {
    console.error('🔔 [BULK-DELETE] Failed to delete notifications:', error);
    throw new Error(`Failed to delete notifications: ${error.message}`);
  }
};

// ======================== STATISTICS AND ANALYTICS ======================== //

/**
 * Fetches notification statistics and analytics
 * Provides aggregated data for dashboard displays.
 * 
 * @function fetchNotificationStats
 * @param {Object} [options={}] - Optional parameters for statistics
 * @returns {Promise<Object>} Promise resolving to statistics data
 * @throws {Error} When statistics retrieval fails
 */
export const fetchNotificationStats = async (options = {}) => {
  try {
    const params = new URLSearchParams();
    if (ORGANIZATION_ID) params.append('organization', ORGANIZATION_ID);
    
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(item => params.append(key, item));
        } else {
          params.append(key, value.toString());
        }
      }
    });

    const response = await axiosInstance.get(
      `${notificationAPIendpoint}/notifications/stats/?${params.toString()}`
    );

    console.log('🔔 [FETCH-STATS] Successfully fetched notification statistics');
    return response.data;
  } catch (error) {
    console.error('🔔 [FETCH-STATS] Failed to fetch notification stats:', error);
    throw new Error(`Failed to fetch notification statistics: ${error.message}`);
  }
};

/**
 * Gets count of unread notifications
 * Returns the number of unread notifications for the current user.
 * 
 * @function getUnreadNotificationCount
 * @returns {Promise<number>} Promise resolving to unread count
 * @throws {Error} When count retrieval fails
 */
export const getUnreadNotificationCount = async () => {
  try {
    const params = new URLSearchParams();
    if (ORGANIZATION_ID) params.append('organization', ORGANIZATION_ID);

    const response = await axiosInstance.get(
      `${notificationAPIendpoint}/notifications/unread-count/?${params.toString()}`
    );

    const count = Number(response.data.count) || 0;
    console.log(`🔔 [UNREAD-COUNT] Found ${count} unread notifications`);
    return count;
  } catch (error) {
    console.error('🔔 [UNREAD-COUNT] Failed to get unread count:', error);
    throw new Error(`Failed to get unread notification count: ${error.message}`);
  }
};

// ======================== USER PREFERENCES ======================== //

/**
 * Fetches user notification preferences
 * Returns current notification settings for the user.
 * 
 * @function fetchNotificationPreferences
 * @returns {Promise<Object>} Promise resolving to user preferences
 * @throws {Error} When preferences retrieval fails
 */
export const fetchNotificationPreferences = async () => {
  try {
    const params = new URLSearchParams();
    if (ORGANIZATION_ID) params.append('organization', ORGANIZATION_ID);

    const response = await axiosInstance.get(
      `${notificationAPIendpoint}/preferences/?${params.toString()}`
    );

    console.log('🔔 [FETCH-PREFERENCES] Successfully fetched notification preferences');
    return response.data;
  } catch (error) {
    console.error('🔔 [FETCH-PREFERENCES] Failed to fetch preferences:', error);
    throw new Error(`Failed to fetch notification preferences: ${error.message}`);
  }
};

/**
 * Updates user notification preferences
 * Modifies notification settings for the current user.
 * 
 * @function updateNotificationPreferences
 * @param {Object} preferences - New preference settings
 * @returns {Promise<Object>} Promise resolving to updated preferences
 * @throws {Error} When preferences update fails
 */
export const updateNotificationPreferences = async (preferences) => {
  try {
    const requestData = {
      ...preferences,
      ...(ORGANIZATION_ID && { organization: ORGANIZATION_ID })
    };

    const response = await axiosInstance.put(
      `${notificationAPIendpoint}/preferences/update/`,
      requestData
    );

    console.log('🔔 [UPDATE-PREFERENCES] Successfully updated notification preferences');
    return response.data;
  } catch (error) {
    console.error('🔔 [UPDATE-PREFERENCES] Failed to update preferences:', error);
    throw new Error(`Failed to update notification preferences: ${error.message}`);
  }
};

// ======================== REAL-TIME UTILITIES ======================== //

/**
 * Checks for new notifications since last check
 * Used for real-time notification polling.
 * 
 * @function checkNewNotifications
 * @param {string} lastCheckTime - ISO timestamp of last check
 * @returns {Promise<NotificationArray>} Promise resolving to new notifications
 * @throws {Error} When check fails
 */
export const checkNewNotifications = async (lastCheckTime) => {
  try {
    const params = new URLSearchParams();
    if (ORGANIZATION_ID) params.append('organization', ORGANIZATION_ID);
    if (lastCheckTime) params.append('since', lastCheckTime);

    const response = await axiosInstance.get(
      `${notificationAPIendpoint}/notifications/new/?${params.toString()}`
    );

    const validation = NotificationsSchema.safeParse(response.data);
    if (!validation.success) {
      console.error('🔔 [CHECK-NEW] Validation errors:', validation.error.issues);
      throw new Error('New notifications validation failed');
    }

    console.log(`🔔 [CHECK-NEW] Found ${validation.data.length} new notifications`);
    return validation.data;
  } catch (error) {
    console.error('🔔 [CHECK-NEW] Failed to check for new notifications:', error);
    throw new Error(`Failed to check for new notifications: ${error.message}`);
  }
};
