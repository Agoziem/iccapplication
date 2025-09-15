import { z } from "zod";
import {
  NotificationSchema,
  CreateNotificationSchema,
  UpdateNotificationSchema,
  NotificationsSchema,
  notificationSchema,
  wsNotificationMessageSchema,
  wsNotificationSchema
} from "../schemas/notifications";

// Extract TypeScript types from Zod schemas
export type Notification = z.infer<typeof NotificationSchema>;
export type CreateNotification = z.infer<typeof CreateNotificationSchema>;
export type UpdateNotification = z.infer<typeof UpdateNotificationSchema>;
export type Notifications = z.infer<typeof NotificationsSchema>;

// Alias type (for backward compatibility)
export type NotificationAlias = z.infer<typeof notificationSchema>;

// Additional utility types
export type NotificationPreview = Pick<Notification, 'id' | 'title' | 'viewed' | 'created_at'>;
export type UnreadNotification = Notification & { viewed: false };
export type ReadNotification = Notification & { viewed: true };

// WebSocket types
export type WSNotificationMessage = z.infer<typeof wsNotificationMessageSchema>;
export type WSNotification = z.infer<typeof wsNotificationSchema>;