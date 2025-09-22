import { z } from "zod";

export const EmailSchema = z.object({
  id: z.number().optional(),
  created_at: z.coerce.date().optional(),
  name: z.string().min(1).max(100),
  email: z.string().email().min(1).max(254),
  subject: z.string().min(1).max(100),
  message: z.string().min(1),
  read: z.boolean().optional(),
  organization: z.number().optional(),
});


export const CreateEmailSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email().min(1, "Email is required").max(254),
  subject: z.string().min(1, "Subject is required").max(100),
  message: z.string().min(1, "Message is required"),
});

export const UpdateEmailSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().min(1).max(254),
  subject: z.string().min(1).max(100),
  message: z.string().min(1),
  read: z.boolean().optional(),
});

export const EmailResponseSchema = z.object({
  id: z.number().optional(),
  created_at: z.coerce.date().optional(),
  recipient_email: z.string().email().min(1).max(254),
  response_subject: z.string().min(1).max(100),
  response_message: z.string().min(1),
  message: z.number().optional(),
});


export const CreateEmailResponseSchema = z.object({
  recipient_email: z.string().email().min(1, "Recipient email is required").max(254),
  response_subject: z.string().min(1, "Response subject is required").max(100),
  response_message: z.string().min(1, "Response message is required"),
  message: z.number().optional(),
});


export const EmailMessageSchema = z.object({
  id: z.number().optional(),
  created_at: z.coerce.date().optional(),
  subject: z.string().min(1).max(355),
  body: z.string().min(1),
  template: z.string().max(255).optional(),
  status: z.enum(["pending", "sent", "failed"]).optional(),
});


export const CreateEmailMessageSchema = z.object({
  subject: z.string().min(1).max(355),
  body: z.string().min(1),
  template: z.string().max(255).optional(),
});

// ------------------------------------
// Paginated Response Schemas (from API)
// ------------------------------------

export const PaginatedEmailResponseSchema = z.object({
  count: z.number(),
  next: z.string().url().optional(),
  previous: z.string().url().optional(),
  results: z.array(EmailSchema),
});

export const PaginatedEmailResponsesSchema = z.object({
  count: z.number(),
  next: z.string().url().optional(),
  previous: z.string().url().optional(),
  results: z.array(EmailResponseSchema),
});

export const PaginatedEmailMessageResponseSchema = z.object({
  count: z.number(),
  next: z.string().url().optional(),
  previous: z.string().url().optional(),
  results: z.array(EmailMessageSchema),
});

// ------------------------------------
// Array Schemas
// ------------------------------------

export const EmailsSchema = z.array(EmailSchema);
export const EmailResponsesSchema = z.array(EmailResponseSchema);
export const EmailMessagesSchema = z.array(EmailMessageSchema);

// ------------------------------------
// Alias exports (for backward compatibility)
// ------------------------------------

export const emailResponseSchema = CreateEmailResponseSchema;
export const emailMessageSchema = CreateEmailMessageSchema;

// ------------------------------------
// WebSocket Schemas
// ------------------------------------

/**
 * WebSocket Message Schema for Email operations
 * Used for real-time email updates via WebSocket
 */
export const MessageWebsocketSchema = z.object({
  operation: z.enum(["create", "update", "delete"]),
  message: EmailSchema,
});

/**
 * WebSocket Email Update Schema
 */
export const EmailWebsocketSchema = z.object({
  operation: z.enum(["create", "update", "delete"]),
  message: EmailSchema,
});

