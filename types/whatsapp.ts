import { z } from "zod";
import {
  ContactSchema,
  CreateContactSchema,
  UpdateContactSchema,
  WAMessageSchema,
  CreateWAMessageSchema,
  UpdateWAMessageSchema,
  WATemplateSchema,
  CreateWATemplateSchema,
  UpdateWATemplateSchema,
  TemplateMessageSchema,
  SendMessageSchema,
  ContactArraySchema,
  WAMessageArraySchema,
  WATemplateArraySchema
} from "../schemas/whatsapp";

// Extract TypeScript types from Zod schemas
export type Contact = z.infer<typeof ContactSchema>;
export type CreateContact = z.infer<typeof CreateContactSchema>;
export type UpdateContact = z.infer<typeof UpdateContactSchema>;

export type WAMessage = z.infer<typeof WAMessageSchema>;
export type CreateWAMessage = z.infer<typeof CreateWAMessageSchema>;
export type UpdateWAMessage = z.infer<typeof UpdateWAMessageSchema>;

export type WATemplate = z.infer<typeof WATemplateSchema>;
export type CreateWATemplate = z.infer<typeof CreateWATemplateSchema>;
export type UpdateWATemplate = z.infer<typeof UpdateWATemplateSchema>;

export type TemplateMessage = z.infer<typeof TemplateMessageSchema>;
export type SendMessage = z.infer<typeof SendMessageSchema>;

// Array types
export type ContactArray = z.infer<typeof ContactArraySchema>;
export type WAMessageArray = z.infer<typeof WAMessageArraySchema>;
export type WATemplateArray = z.infer<typeof WATemplateArraySchema>;

// Additional utility types
export type MessageType = "text" | "image" | "video" | "audio" | "document" | "sticker";
export type MessageMode = "received" | "sent";
export type MessageStatus = "pending" | "sent" | "failed";
export type TemplateType = "textonly" | "textwithimage" | "textwithvideo" | "textwithaudio" | "textwithdocument" | "textwithCTA";

export type ContactPreview = Pick<Contact, 'id' | 'wa_id' | 'profile_name' | 'last_message' | 'unread_message_count'>;
export type MessagePreview = Pick<WAMessage, 'id' | 'message_type' | 'body' | 'message_mode' | 'timestamp' | 'seen'>;
export type TemplatePreview = Pick<WATemplate, 'id' | 'title' | 'template' | 'status' | 'created_at'>;

// Chat conversation types
export type ChatConversation = {
  contact: Contact;
  messages: WAMessage[];
  unreadCount: number;
};