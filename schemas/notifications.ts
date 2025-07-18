import { z } from "zod";

// ---------------------------------------------------------------------
// Validations for Notification data
// ---------------------------------------------------------------------
export const notificationSchema = z.object({
  id: z.number(),
  title: z.string().min(1, { message: "Title is required" }),
  message: z.string().min(1, { message: "Message is required" }),
  viewed: z.boolean(),
  updated_at: z.string().optional(), // ISO string date format validation can be added if needed
  created_at: z.string().optional(), // Optional but expect ISO string format
});

export const notificationArraySchema = z.array(notificationSchema);

export const notificationResponseSchema = z.object({
  count: z.number(),
  next: z.string().nullable(), // next can be null
  previous: z.string().nullable(), // previous can be null
  results: z.array(notificationSchema),
});

// Define the full schema with action and notification
export const notificationActionSchema = z.object({
  action: z.enum(["add", "update", "delete", "mark_viewed"]),
  notification: notificationSchema,
});
