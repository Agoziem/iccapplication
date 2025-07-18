import { z } from "zod";


export const MESSAGE_STATUS = ["pending", "sent", "failed"] as const;

export const messageSchema = z.object({
  name: z.string(), // Required field
  email: z.string().email(), // Required field with email validation
  subject: z.string(), // Required field
  message: z.string(), // Required field
});

// ---------------------------------------------------------------------
// Validations for emails sent by user
// ---------------------------------------------------------------------
export const emailSchema = z.object({
  id: z.number(), // Required field
  organization: z.number().nullable(), // Nullable but required field
  name: z.string(), // Required field
  email: z.string().email(), // Required field with email validation
  subject: z.string(), // Required field
  message: z.string(), // Required field
  created_at: z.string(), // Required field
  read: z.boolean(),
});

// Zod Validation for emails Array
export const emailArraySchema = z.array(emailSchema);

export const emailsResponseSchema = z.object({
  count: z.number(),
  next: z.string().nullable(), // next can be null
  previous: z.string().nullable(), // previous can be null
  results: z.array(emailSchema),
});

// Zod Validation for emails response
export const emailResponseSchema = z.object({
  message: z.number(),
  recipient_email: z.string(),
  response_subject: z.string(),
  response_message: z.string().min(7, { message: "Message cannot be empty" }),
  created_at: z.string().optional(),
});

// Zod Validation for emails responses Array
export const emailResponseArraySchema = z.array(emailResponseSchema);

// ------------------------------------------------------
// Zod Validation for emails message to be sent to user
// ------------------------------------------------------
export const emailMessageSchema = z.object({
  id: z.number().optional(),
  subject: z.string().min(7, { message: "your Email must have a Subject" }),
  body: z.string().min(7, { message: "Your Email Body cannot be empty" }),
  template: z.string().nullable().optional(),
  created_at: z.string().optional(),
  status: z.enum(MESSAGE_STATUS),
});

// Zod Validation for emails messages array
export const emailMessagesArraySchema = z.array(emailMessageSchema);

export const emailMessageResponseSchema = z.object({
  count: z.number(),
  next: z.string().nullable(), // next can be null
  previous: z.string().nullable(), // previous can be null
  results: z.array(emailMessageSchema),
});


// -----------------------------------------
// Zod Validation for emails Websocket
// -----------------------------------------
export const MessageWebsocketSchema = z.object({
  operation: z.string(),
  message: emailSchema,
});

