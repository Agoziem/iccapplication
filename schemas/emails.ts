import { z } from "zod";

// Email
export const CreateEmailSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  subject: z.string(),
  message: z.string(),
});
export type CreateEmailType = z.infer<typeof CreateEmailSchema>;

export const UpdateEmailSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  subject: z.string().optional(),
  message: z.string().optional(),
});
export type UpdateEmailType = z.infer<typeof UpdateEmailSchema>;


// Email Response
export const CreateEmailResponseSchema = z.object({
  message: z.number(), // Assuming FK to Email is ID
  recipient_email: z.string().email(),
  response_subject: z.string(),
  response_message: z.string(),
});

export type CreateEmailResponseType = z.infer<typeof CreateEmailResponseSchema>;

export const UpdateEmailResponseSchema = z.object({
  recipient_email: z.string().email().optional(),
  response_subject: z.string().optional(),
  response_message: z.string().optional(),
});

export type UpdateEmailResponseType = z.infer<typeof UpdateEmailResponseSchema>;

// Email Message
export const CreateEmailMessageSchema = z.object({
  subject: z.string(),
  body: z.string(),
  template: z.string().optional(),
});
export type CreateEmailMessageType = z.infer<typeof CreateEmailMessageSchema>;

export const UpdateEmailMessageSchema = z.object({
  subject: z.string().optional(),
  body: z.string().optional(),
  template: z.string().optional(),
  status: z.string().optional(),
});
export type UpdateEmailMessageType = z.infer<typeof UpdateEmailMessageSchema>;
