import {
  notificationActionSchema,
  notificationSchema,
} from "@/schemas/notifications";
import { z } from "zod";

export type NotificationMessage = z.infer<typeof notificationSchema>;

export type NotificationMessages = NotificationMessage[];

export type NotificationAction = z.infer<typeof notificationActionSchema>;
