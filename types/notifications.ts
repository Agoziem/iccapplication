import { NotificationType } from "@/schemas/notifications";
import { UserMini } from "./users";


// ✅ Notification Type
export type Notification = {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  users_viewed: UserMini[];
  users_viewed_count: number;
  is_viewed_by_user?: boolean;
  created_at: string; // ISO date string
  updated_at: string;
};

// ✅ Paginated Response
export type PaginatedNotificationResponse = {
  count: number;
  items: Notification[];
};

// ✅ List Response (non-paginated)
export type NotificationListResponse = {
  notifications: Notification[];
};

export type UnreadCountResponse = {
  unread_count: number;
};

// ✅ Success and Error
export type SuccessResponse = {
  message: string;
};

export type ErrorResponse = {
  error: string;
};
