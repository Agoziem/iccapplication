// zod/waMessage.ts
import { z } from "zod";

// Enums
export const MessageTypeEnum = z.enum([
  "text",
  "image",
  "video",
  "audio",
  "document",
  "sticker",
]);
export type MessageType = z.infer<typeof MessageTypeEnum>;

export const MessageModeEnum = z.enum(["received", "sent"]);
export type MessageMode = z.infer<typeof MessageModeEnum>;

export const MessageStatusEnum = z.enum(["pending", "sent", "failed"]);
export type MessageStatus = z.infer<typeof MessageStatusEnum>;

export const TemplateTypeEnum = z.enum([
  "textonly",
  "textwithimage",
  "textwithvideo",
  "textwithaudio",
  "textwithdocument",
  "textwithCTA",
]);
export type TemplateType = z.infer<typeof TemplateTypeEnum>;

// ✅ Create WAMessage
export const CreateWAMessageSchema = z.object({
  message_id: z.string(),
  contact: z.number(),
  message_type: MessageTypeEnum.default("text"),
  body: z.string().default(""),
  media_id: z.string().default(""),
  mime_type: z.string().default(""),
  filename: z.string().default(""),
  animated: z.boolean().default(false),
  caption: z.string().default(""),
  link: z.string().url().default("https://www.example.com"),
  message_mode: MessageModeEnum.default("received"),
  seen: z.boolean().default(false),
  status: MessageStatusEnum.default("pending"),
});
export type CreateWAMessageType = z.infer<typeof CreateWAMessageSchema>;

// ✅ Update WAMessage
export const UpdateWAMessageSchema = z.object({
  message_type: MessageTypeEnum.optional(),
  body: z.string().optional(),
  media_id: z.string().optional(),
  mime_type: z.string().optional(),
  filename: z.string().optional(),
  animated: z.boolean().optional(),
  caption: z.string().optional(),
  link: z.string().url().optional(),
  message_mode: MessageModeEnum.optional(),
  seen: z.boolean().optional(),
  status: MessageStatusEnum.optional(),
});

export type UpdateWAMessageType = z.infer<typeof UpdateWAMessageSchema>;


// ✅ Create Contact 
export const CreateContactSchema = z.object({
  wa_id: z.string(),
  profile_name: z.string().optional(),
});
export type CreateContactType = z.infer<typeof CreateContactSchema>;

// ✅ Update Contact Schema
export const UpdateContactSchema = z.object({
  wa_id: z.string().optional(),
  profile_name: z.string().optional(),
});
export type UpdateContactType = z.infer<typeof UpdateContactSchema>;


// ✅ Create Status
export const CreateStatusSchema = z.object({
  message: z.number(),
  status: z.string(),
});
export type CreateStatusType = z.infer<typeof CreateStatusSchema>;


// create a zod schema for WATemplateSchema
export const CreateWATemplateSchema = z.object({
  title: z.string().optional(),
  template: TemplateTypeEnum,
  text: z.string().optional(),
  link: z.string().url().optional(),
});

export type CreateWATemplateSchemaType = z.infer<typeof CreateWATemplateSchema>;

// Update WATemplateSchema
export const UpdateWATemplateSchema = z.object({
  title: z.string().optional(),
  template: TemplateTypeEnum.optional(),
  text: z.string().optional(),
  link: z.string().url().optional(),
  status: MessageStatusEnum.optional(),
});

export type UpdateWATemplateSchemaType = z.infer<typeof UpdateWATemplateSchema>;

// Create WebhookEvent Schema
export const CreateWebhookEventSchema = z.object({
  event_id: z.string(),
  payload: z.record(z.any()),
});

export type CreateWebhookEventType = z.infer<typeof CreateWebhookEventSchema>;