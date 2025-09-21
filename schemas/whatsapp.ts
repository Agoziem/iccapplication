import { z } from "zod";

export const lastMessageSchema = z.object({
  id: z.number().int().positive().optional(),
  message_id: z.string().min(1).max(100),
  message_type: z.enum(["text", "image", "video", "audio", "document", "sticker"]).optional(),
  body: z.string().optional(),
  timestamp: z.coerce.date().optional(),
});

// ---------------------------------------------------------------------
// Core Contact Schema (Based on API Contact model)
// ---------------------------------------------------------------------
export const ContactSchema = z.object({
  id: z.number().int().positive().optional(),
  wa_id: z.string().min(1).max(50),
  profile_name: z.string().max(255).optional(),
  last_message: lastMessageSchema.optional(),
  unread_message_count: z.number().min(0).optional(),
});

/**
 * Schema for creating contacts (omits readonly fields)
 */
export const CreateContactSchema = ContactSchema.omit({
  id: true,
  last_message: true,
  unread_message_count: true,
});

/**
 * Schema for updating contacts
 */
export const UpdateContactSchema = ContactSchema.partial();

// ---------------------------------------------------------------------
// WhatsApp Message Schema (Based on API WAMessage model)
// ---------------------------------------------------------------------

export const WAMessageSchema = z.object({
  id: z.number().int().positive().optional(),
  message_id: z.string().min(1).max(100),
  message_type: z.enum(["text", "image", "video", "audio", "document", "sticker"]).optional(),
  body: z.string().optional(),
  media_id: z.string().max(100).optional(),
  mime_type: z.string().max(100).optional(),
  filename: z.string().max(100).optional(),
  animated: z.boolean().optional(),
  caption: z.string().optional(),
  link: z.string().url().max(200).optional(),
  message_mode: z.enum(["received", "sent"]).optional(),
  seen: z.boolean().optional(),
  status: z.enum(["pending", "sent"]).optional(),
  timestamp: z.coerce.date().optional(),
  contact: z.number().int().positive(),
});

/**
 * Schema for creating messages (omits readonly fields)
 */
export const CreateWAMessageSchema = WAMessageSchema.omit({
  id: true,
  timestamp: true,
});

/**
 * Schema for updating messages
 */
export const UpdateWAMessageSchema = WAMessageSchema.partial();

// ---------------------------------------------------------------------
// WhatsApp Template Schema (Based on API WATemplateSchema model)
// ---------------------------------------------------------------------
export const WATemplateSchema = z.object({
  id: z.number().int().positive().optional(),
  template: z.enum(["textonly", "textwithimage", "textwithvideo", "textwithaudio", "textwithdocument", "textwithCTA"]).optional(),
  text: z.string().optional(),
  link: z.string().url().max(200).optional(),
  created_at: z.coerce.date().optional(),
  title: z.string().min(1).max(300),
  status: z.enum(["pending", "sent", "failed"]).optional(),
});

/**
 * Schema for creating templates (omits readonly fields)
 */
export const CreateWATemplateSchema = WATemplateSchema.omit({
  id: true,
  created_at: true,
});

/**
 * Schema for updating templates
 */
export const UpdateWATemplateSchema = WATemplateSchema.partial();

// ---------------------------------------------------------------------
// Template Message Schema (Based on API TemplateMessage model)
// ---------------------------------------------------------------------
export const TemplateMessageSchema = z.object({
  to_phone_number: z.string().min(1),
  template_name: z.string().min(1),
  language_code: z.string().min(1).default("en_US"),
});

// ---------------------------------------------------------------------
// Send Message Schema (Based on API SendMessage model)
// ---------------------------------------------------------------------
export const SendMessageSchema = z.object({
  message_type: z.enum(["text", "image", "audio", "document", "video"]).default("text"),
  body: z.string().min(1).optional(),
  media_id: z.string().min(1).optional(),
  link: z.string().url().min(1).optional(),
  caption: z.string().min(1).optional(),
  message_mode: z.string().min(1).optional(),
  timestamp: z.string().min(1).optional(),
});

// ---------------------------------------------------------------------
// Array Schemas for bulk operations
// ---------------------------------------------------------------------

/**
 * Schema for arrays of contacts
 */
export const ContactArraySchema = z.array(ContactSchema);

/**
 * Schema for arrays of WhatsApp messages
 */
export const WAMessageArraySchema = z.array(WAMessageSchema);

/**
 * Schema for arrays of WhatsApp templates
 */
export const WATemplateArraySchema = z.array(WATemplateSchema);

// ---------------------------------------------------------------------
// WebSocket Message Schema (for real-time updates)
// ---------------------------------------------------------------------
export const WAMessageEventSchema = z.object({
  operation: z.string(), // e.g. "new_message"
  contact: ContactSchema,
  message: WAMessageSchema,
});

export const WAContactEventSchema = z.object({
  operation: z.enum(["update_seen_status", "create", "delete"]), // extend as needed
  contact: ContactSchema,
});

export const UpdateSeenStatusSchema = z.object({
  operation: z.literal("update_seen_status"),
  contact: z.object({
    id: z.number(),
  }),
});

