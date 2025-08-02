// Email
export type EmailSchema = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  updated_at: string;
};

// Email Response
export type EmailResponseSchema = {
  id: number;
  message: number; // FK to Email
  recipient_email: string;
  response_subject: string;
  response_message: string;
  created_at: string;
  updated_at: string;
};

// Email Message
export type EmailMessageSchema = {
  id: number;
  subject: string;
  body: string;
  template?: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

// Lists
export type EmailMessageListSchema = {
  messages: EmailMessageSchema[];
};

// Generic Success/Error
export type SuccessResponseSchema = {
  message: string;
};

export type ErrorResponseSchema = {
  error: string;
};

// Paginated Responses
export type PaginatedEmailSchema = {
  count: number;
  items: EmailSchema[];
};

export type PaginatedEmailResponseSchema = {
  count: number;
  items: EmailResponseSchema[];
};

export type PaginatedEmailMessageResponseSchema = {
  count: number;
  items: EmailMessageSchema[];
};
