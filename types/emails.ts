export type MessageStatus = "pending" | "sent" | "failed";

export interface Message {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface Email {
  id: number;
  organization: number | null;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  read: boolean;
}

export type EmailArrays = Email[];

export interface EmailResponse {
  message: number;
  recipient_email: string;
  response_subject: string;
  response_message: string;
  created_at?: string;
}

export type EmailResponseArray = EmailResponse[];

export interface EmailMessage {
  id?: number;
  subject: string;
  body: string;
  template?: string | null;
  created_at?: string;
  status: MessageStatus;
}

export type EmailMessageArray = EmailMessage[];

export interface EmailWebsocket {
  operation: string;
  message: Email;
}

