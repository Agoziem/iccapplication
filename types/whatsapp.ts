// Type definitions for WhatsApp integration

// Union types for message configuration
export type MessageType = "text" | "image" | "video" | "audio" | "document" | "sticker";
export type MessageMode = "received" | "sent";
export type MessageStatus = "pending" | "sent" | "failed";
export type TemplateName = "hello_world" | "textonly" | "textwithimage" | "textwithvideo" | "textwithaudio" | "textwithdocument" | "textwithCTA";

// Last message interface for contact references
export interface LastMessage {
  id?: number;
  message_id: string;
  message_type: MessageType;
  body?: string;
  timestamp?: string;
}

// WhatsApp contact interface
export interface WAContact {
  id?: number;
  wa_id: string;
  profile_name?: string;
  last_message?: LastMessage;
  unread_message_count: number;
}

// Array of WhatsApp contacts
export type WAContacts = WAContact[];

// WhatsApp message interface with media support
export interface WAMessage {
  id?: number | null;
  message_id?: string;
  contact: number | null;
  message_type: MessageType;
  body?: string;
  media_id?: string;
  mime_type?: string;
  filename?: string;
  animated?: boolean;
  caption?: string;
  timestamp?: string;
  message_mode: MessageMode;
  seen?: boolean;
  link?: string;
  status?: MessageStatus;
}

// Array of WhatsApp messages
export type WAMessages = WAMessage[];

// WebSocket contact data interface
export interface WAContactSocket {
  operation: string;
  contact: WAContact;
}

// WebSocket message data interface
export interface WAMessagesSocket {
  operation: string;
  contact: WAContact;
  message: WAMessage;
}

// WhatsApp template interface for broadcast messages
export interface WATemplate {
  id?: number;
  template: TemplateName;
  title: string;
  text?: string;
  link?: string | null;
  status: MessageStatus;
  created_at?: string;
}

// Array of WhatsApp templates
export type WATemplateArray = WATemplate[];

// Response interface for paginated contact results
export interface WAContactResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: WAContact[];
}

// Response interface for paginated template results
export interface WATemplateResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: WATemplate[];
}
