// zod/notification.ts
import { z } from "zod";

// Reusable notification type enum
export const NotificationTypeEnum = z.enum(["info", "success", "warning", "error"]);
export type NotificationType = z.infer<typeof NotificationTypeEnum>;

// ✅ Create Notification
export const CreateNotificationSchema = z.object({
  title: z.string().min(1),
  message: z.string().min(1),
  type: NotificationTypeEnum.default("info"),
});
export type CreateNotificationType = z.infer<typeof CreateNotificationSchema>;

// ✅ Update Notification
export const UpdateNotificationSchema = z.object({
  title: z.string().optional(),
  message: z.string().optional(),
  type: NotificationTypeEnum.optional(),
});
export type UpdateNotificationType = z.infer<typeof UpdateNotificationSchema>;

// ✅ Mark as Viewed
export const MarkAsViewedSchema = z.object({
  notification_id: z.number(),
});
export type MarkAsViewedType = z.infer<typeof MarkAsViewedSchema>;
