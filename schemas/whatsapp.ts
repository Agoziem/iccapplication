import { z } from "zod";

export const MESSAGE_TYPES = [
  "text",
  "image",
  "video",
  "audio",
  "document",
  "sticker",
] as const;

export const MESSAGE_MODES = ["received", "sent"] as const;

export const MESSAGE_STATUS = ["pending", "sent", "failed"] as const;

// ---------------------------------------------------------------------
// Validations for WA API
// ---------------------------------------------------------------------

// Create the Zod schema for the Message model ..
export const WAMessageSchema = z.object({
  id: z.number().optional().nullable(),
  message_id: z.string().optional(),
  contact: z
    .number()
    .positive("Contact ID must be a positive number")
    .nullable(),
  message_type: z.enum(MESSAGE_TYPES),
  body: z.string().optional(), // Text message body
  media_id: z.string().optional(), // Media message ID
  mime_type: z.string().optional(), // MIME type for media messages
  filename: z.string().optional(), // Filename forideos/documents
  animated: z.boolean().optional(), // For stickers
  caption: z.string().optional(), // Caption for media
  timestamp: z.string().optional(), // ISO date string
  message_mode: z.enum(MESSAGE_MODES),
  seen: z.boolean().optional(), // Seen status for received messages
  link: z.string().url().optional(),
  status: z.enum(MESSAGE_STATUS).optional(), // Status for sent messages
});

export const WAMessageArraySchema = z.array(WAMessageSchema);

export const LastMessageSchema = z.object({
  id: z.number().optional(),
  message_id: z.string().min(1, "Message ID is required"),
  message_type: z.enum(MESSAGE_TYPES),
  body: z.string().optional(),
  timestamp: z.string().optional(),
});

export const WAContactSchema = z.object({
  id: z.number().optional(),
  wa_id: z.string(),
  profile_name: z.string().optional(),
  last_message: LastMessageSchema.optional(),
  unread_message_count: z.number(),
});

export const WAContactArraySchema = z.array(WAContactSchema);

export const WAContactResponseSchema = z.object({
  count: z.number(),
  next: z.string().nullable(), // next can be null
  previous: z.string().nullable(), // previous can be null
  results: z.array(WAContactSchema),
});

// Whatsapp Websocket types
export const WAContactWebsocketSchema = z.object({
  operation: z.string(),
  contact: WAContactSchema,
});

export const WAMessageWebsocketSchema = z.object({
  operation: z.string(),
  contact: WAContactSchema,
  message: WAMessageSchema,
});

// ---------------------------------------------------------------------
// Validations for Whatsapp Template
// ---------------------------------------------------------------------

export const TEMPLATE_NAMES = [
  "hello_world",
  "textonly",
  "textwithimage",
  "textwithvideo",
  "textwithaudio",
  "textwithdocument",
  "textwithCTA",
] as const;

// Template names
export const WATemplateSchema = z.object({
  id: z.number().optional(),

  template: z
    .enum(TEMPLATE_NAMES)
    .refine((value) => TEMPLATE_NAMES.includes(value), {
      message: "You must select a valid Template",
    }),
  title: z.string(),
  text: z.string().optional(),
  link: z.string().optional().nullable(),
  status: z.enum(MESSAGE_STATUS),
  created_at: z.string().optional(),
});

export const WATemplateArraySchema = z.array(WATemplateSchema);

export const WATemplateResponseSchema = z.object({
  count: z.number(),
  next: z.string().nullable(), // next can be null
  previous: z.string().nullable(), // previous can be null
  results: z.array(WATemplateSchema),
});
