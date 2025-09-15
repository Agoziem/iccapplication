import { z } from "zod";

/**
 * Main Notification Schema (Notification from API)
 * Based on API model with fields: id, title, message, viewed, created_at, updated_at
 */
export const NotificationSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1).max(255),
  message: z.string().min(1),
  viewed: z.boolean().optional(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
});

/**
 * Create Notification Schema
 * For creating new notifications via API
 */
export const CreateNotificationSchema = z.object({
  title: z.string().min(1).max(255),
  message: z.string().min(1),
  viewed: z.boolean().optional().default(false),
});

/**
 * Update Notification Schema  
 * For updating existing notifications via API
 */
export const UpdateNotificationSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  message: z.string().min(1).optional(),
  viewed: z.boolean().optional(),
});

/**
 * Array of Notifications Schema
 */
export const NotificationsSchema = z.array(NotificationSchema);

// ------------------------------------
// Alias exports (for backward compatibility)
// ------------------------------------

export const notificationSchema = CreateNotificationSchema;


// -----------------------------------------
// Websocket Notification Schema
// -----------------------------------------

export const wsNotificationSchema = z.object({
  id: z.number(),
  title: z.string(),
  message: z.string(),
  viewed: z.boolean(),
  updated_at: z.string().datetime(), // ISO 8601 timestamp
  created_at: z.string().datetime(),
});

export const wsNotificationMessageSchema = z.object({
  action: z.enum(["add", "update", "delete", "mark_viewed"]),
  notification: wsNotificationSchema.optional(), // sometimes you only send { error: ... } or action without full payload
});
