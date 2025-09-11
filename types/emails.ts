import { z } from "zod";
import {
  EmailSchema,
  CreateEmailSchema,
  UpdateEmailSchema,
  EmailResponseSchema,
  CreateEmailResponseSchema,
  EmailMessageSchema,
  CreateEmailMessageSchema,
  PaginatedEmailResponseSchema,
  PaginatedEmailResponsesSchema,
  PaginatedEmailMessageResponseSchema,
  EmailsSchema,
  EmailResponsesSchema,
  EmailMessagesSchema,
  emailResponseSchema,
  emailMessageSchema,
  MessageWebsocketSchema,
  EmailWebsocketSchema
} from "../schemas/emails";

// Extract TypeScript types from Zod schemas
export type Email = z.infer<typeof EmailSchema>;
export type CreateEmail = z.infer<typeof CreateEmailSchema>;
export type UpdateEmail = z.infer<typeof UpdateEmailSchema>;

export type EmailResponse = z.infer<typeof EmailResponseSchema>;
export type CreateEmailResponse = z.infer<typeof CreateEmailResponseSchema>;

export type EmailMessage = z.infer<typeof EmailMessageSchema>;
export type CreateEmailMessage = z.infer<typeof CreateEmailMessageSchema>;

// Paginated response types
export type PaginatedEmailResponse = z.infer<typeof PaginatedEmailResponseSchema>;
export type PaginatedEmailResponses = z.infer<typeof PaginatedEmailResponsesSchema>;
export type PaginatedEmailMessageResponse = z.infer<typeof PaginatedEmailMessageResponseSchema>;

// Array types
export type Emails = z.infer<typeof EmailsSchema>;
export type EmailResponses = z.infer<typeof EmailResponsesSchema>;
export type EmailMessages = z.infer<typeof EmailMessagesSchema>;

// Alias types (for backward compatibility)
export type EmailResponseAlias = z.infer<typeof emailResponseSchema>;
export type EmailMessageAlias = z.infer<typeof emailMessageSchema>;

// WebSocket types
export type MessageWebsocket = z.infer<typeof MessageWebsocketSchema>;
export type EmailWebsocket = z.infer<typeof EmailWebsocketSchema>;

// Additional utility types
export type EmailPreview = Pick<Email, 'id' | 'name' | 'email' | 'subject' | 'created_at' | 'read'>;
export type EmailSummary = Pick<Email, 'id' | 'subject' | 'created_at' | 'read'>;
export type EmailStatus = 'pending' | 'sent' | 'failed';
export type EmailOperation = 'create' | 'update' | 'delete';