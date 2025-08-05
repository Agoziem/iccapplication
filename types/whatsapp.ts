// types/waMessage.ts
import {
  MessageMode,
  MessageStatus,
  MessageType,
  TemplateType,
} from "@/schemas/whatsapp";

export type WAMessageMini = {
  id: number;
  message_id: string;
  message_type: MessageType;
  body?: string;
  timestamp: string;
};

export type WAMessage = {
  id: number;
  message_id: string;
  contact: number | Contact; // Adjust based on how you're embedding
  message_type: MessageType;
  body: string;
  media_id: string;
  mime_type: string;
  filename: string;
  animated: boolean;
  caption: string;
  link: string;
  message_mode: MessageMode;
  seen: boolean;
  status: MessageStatus;
  timestamp: string;
};

export type Contact = {
  id: number;
  wa_id: string;
  profile_name: string;
  last_message?: WAMessageMini;
  unread_message_count: number;
};

export type Status = {
  id: number;
  message: number;
  status: string;
  timestamp: string;
};


export type WebhookEvent = {
  id: number;
  event_id: string;
  payload: Record<string, any>;
  received_at: string;
};

export type WATemplateSchema = {
  id: number;
  title: string;
  template: TemplateType;
  text?: string;
  link?: string;
  status: MessageStatus;
  created_at: string;
};


// Reusable response wrappers
export type PaginatedResponse<T> = {
  count: number;
  items: T[];
};

export type ListResponse<T> = {
  results: T[];
};

export type SuccessResponse = {
  message: string;
};

export type ErrorResponse = {
  error: string;
};

export type MediaResponse = {
  media_url: string;
  mime_type: string;
  success: boolean;
};

export type WebSocketMessage = {
  operation: string;
  contact?: Contact;
  message?: WAMessage;
};

// ✅ SendMessage type
export type SendMessage = {
  message_type?: MessageType; // defaults to "text"
  body?: string;              // optional for text messages
  media_id?: string;          // required for media messages
  link?: string;              // optional, for sent media URLs
};

// ✅ TemplateMessage type
export type TemplateMessage = {
  to_phone_number: string;
  template_name: string;
  language_code?: string; // defaults to "en_US"
};

