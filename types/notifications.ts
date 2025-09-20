import {
  NotificationCreateSchema,
  NotificationUpdateSchema,
  NotificationReadUpdateSchema,
  RemoveNotificationSchema,
  NotificationUserResponseSchema,
  NotificationOnlyResponseSchema,
  NotificationResponseSchema,
  NotificationRecipientSchema,
  UserNotificationListSchema,
} from "@/schemas/notifications";

export type NotificationCreate = typeof NotificationCreateSchema._type;
export type NotificationUpdate = typeof NotificationUpdateSchema._type;
export type NotificationReadUpdate = typeof NotificationReadUpdateSchema._type;
export type RemoveNotification = typeof RemoveNotificationSchema._type;

export type NotificationUserResponse = typeof NotificationUserResponseSchema._type;
export type NotificationOnlyResponse = typeof NotificationOnlyResponseSchema._type;
export type NotificationResponse = typeof NotificationResponseSchema._type;
export type NotificationRecipient = typeof NotificationRecipientSchema._type;
export type UserNotificationList = typeof UserNotificationListSchema._type;
