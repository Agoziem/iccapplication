import { z } from "zod";
import { imageSchema } from "./custom-validation";
import { UserminiSchema } from "./users";

/** Base fields (shared by inputs) */
export const NotificationBaseSchema = z.object({
  sender: z.number().nullable().optional(),
  title: z.string().max(255),
  message: z.string(),
  link: z.string().url().nullable().optional().or(z.literal("")),
  image: imageSchema,
});

/** Create Notification */
export const NotificationCreateSchema = NotificationBaseSchema.extend({
  user_ids: z.array(z.number()).optional().default([]),
});

/** Update Notification */
export const NotificationUpdateSchema = z.object({
  id: z.number(),
  sender: z.number().nullable().optional(),
  title: z.string().max(255).optional(),
  message: z.string().optional(),
  link: z.string().url().nullable().optional().or(z.literal("")),
  image: imageSchema,
  user_ids: z.array(z.number()).optional().default([]),
});

/** Mark as read/unread */
export const NotificationReadUpdateSchema = z.object({
  notification_id: z.number(),
  user_id: z.number(),
  is_read: z.boolean(),
});

/** Remove Notification */
export const RemoveNotificationSchema = z.object({
  notification_id: z.number(),
  user_id: z.number(),
});

// --------------------------------------------
/** User response inside recipients */
// --------------------------------------------
export const NotificationUserResponseSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  image_url: z.string().nullable().optional(),
  has_read: z.boolean(),
});

/** Notification-only details */
export const NotificationOnlyResponseSchema = z.object({
  id: z.number(),
  sender: UserminiSchema,
  title: z.string(),
  message: z.string(),
  link: z.string().nullable().optional(),
  image: imageSchema,
  image_url: z.string().nullable().optional(),
  created_at: z.string(), // ISO datetime
  updated_at: z.string(), // ISO datetime
});

/** Full Notification response */
export const NotificationResponseSchema = z.object({
  id: z.number(),
  sender: UserminiSchema,
  title: z.string(),
  message: z.string(),
  link: z.string().nullable().optional(),
  image: imageSchema,
  image_url: z.string().nullable().optional(),
  created_at: z.string(), // ISO datetime
  updated_at: z.string(), // ISO datetime
  recipients: z.array(NotificationUserResponseSchema),
});

/** Recipient mapping */
export const NotificationRecipientSchema = z.object({
  id: z.number(),
  notification_id: z.number(),
  user_id: z.number(),
  user_name: z.string(),
  notification_title: z.string(),
  is_read: z.boolean(),
});

/** Specialized: User’s notification list */
export const UserNotificationListSchema = z.object({
  id: z.number(),
  notification: NotificationOnlyResponseSchema,
  is_read: z.boolean(),
  sender_name: z.string().nullable(),
});
