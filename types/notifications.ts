export interface NotificationMessage {
  id: number;
  title: string;
  message: string;
  viewed: boolean;
  updated_at?: string;
  created_at?: string;
}

export type NotificationMessages = NotificationMessage[];

export type NotificationActionType = "add" | "update" | "delete" | "mark_viewed";

export interface NotificationAction {
  action: NotificationActionType;
  notification: NotificationMessage;
}
