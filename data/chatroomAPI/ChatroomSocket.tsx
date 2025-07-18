"use client";
import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";

// Types for socket messages
interface SocketMessage {
  id: number;
  user: number;
  type: "text" | "file" | "image";
  body: string;
  file?: string;
  created_at: string;
  updated_at: string;
}

interface SocketData {
  operation: "create" | "delete" | "update" | "reply" | "seen" | "typing";
  message?: SocketMessage;
  message_id?: number;
  user?: number;
  status?: string;
  typing_status?: boolean;
}

interface MessageCreateData {
  user: number;
  type: "text" | "file" | "image";
  body?: string;
  file?: File | null;
}

interface MessageUpdateData {
  message_id: number;
  body?: string;
  file?: File | null;
}

interface MessageReplyData {
  user: number;
  message_id: number;
  type: "text" | "file" | "image";
  body?: string;
  file?: File | null;
}

interface TypingStatus {
  user: number;
  status: string;
}

interface SelectedChat {
  id: number;
  group_name: string;
}

interface ChatroomSocketContextType {
  organizationID: string | null;
  messages: SocketMessage[];
  typingStatus: TypingStatus | Record<string, never>;
  setSelectedChat: (chat: SelectedChat | null) => void;
  createMessage: (user: number, type: "text" | "file" | "image", body?: string, file?: File | null) => void;
  deleteMessage: (message_id: number) => void;
  updateMessage: (message_id: number, body?: string, file?: File | null) => void;
  replyToMessage: (user: number, message_id: number, type: "text" | "file" | "image", body?: string, file?: File | null) => void;
  markAsSeen: (user: number, message_id: number) => void;
  updateTypingStatus: (user: number, typing_status: boolean) => void;
}

const ChatroomSocketContext = createContext<ChatroomSocketContextType | null>(null);

interface ChatroomSocketProviderProps {
  children: ReactNode;
}

const ChatroomSocketProvider: React.FC<ChatroomSocketProviderProps> = ({ children }) => {
  const [organizationID, setOrganizationID] = useState<string | null>(
    process.env.NEXT_PUBLIC_ORGANIZATION_ID || null
  );
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<SocketMessage[]>([]);
  const [typingStatus, setTypingStatus] = useState<TypingStatus | Record<string, never>>({});
  const [selectedChat, setSelectedChat] = useState<SelectedChat | null>(null);

  useEffect(() => {
    if (selectedChat) {
      const newSocket = new WebSocket(
        `ws://yourserver.com/ws/chat/${selectedChat.group_name}/`
      );
      setSocket(newSocket);

      newSocket.onmessage = (e: MessageEvent) => {
        const data: SocketData = JSON.parse(e.data);
        handleSocketMessage(data);
      };

      newSocket.onclose = () => {
        console.error("WebSocket closed unexpectedly");
      };

      return () => {
        newSocket.close();
      };
    }
  }, [selectedChat]);

  // ------------------------------------------------------
  // Handle incoming messages from the socket
  // ------------------------------------------------------
  const handleSocketMessage = (data: SocketData): void => {
    const { operation, message, message_id, user, status } = data;
    switch (operation) {
      case "create":
        if (message) {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
        break;
      case "delete":
        if (message_id) {
          setMessages((prevMessages) =>
            prevMessages.filter((msg) => msg.id !== message_id)
          );
        }
        break;
      case "seen":
        // Handle seen status
        break;
      case "typing":
        if (user && status) {
          setTypingStatus({ user, status });
        }
        break;
      default:
        break;
    }
  };

  // ------------------------------------------------------
  // handles sending messages to the socket
  // ------------------------------------------------------
  const sendMessage = (messageData: any): void => {
    if (socket) {
      socket.send(JSON.stringify(messageData));
    }
  };

  // ------------------------------------------------------
  // Create a new message
  // ------------------------------------------------------
  const createMessage = (user: number, type: "text" | "file" | "image", body: string = "", file: File | null = null): void => {
    sendMessage({
      operation: "create",
      user,
      type,
      body,
      file,
    });
  };

  // ------------------------------------------------------
  // Delete a message
  // ------------------------------------------------------
  const deleteMessage = (message_id: number): void => {
    sendMessage({
      operation: "delete",
      message_id,
    });
  };

  // ------------------------------------------------------
  // Update a message
  // ------------------------------------------------------
  const updateMessage = (message_id: number, body: string = "", file: File | null = null): void => {
    sendMessage({
      operation: "update",
      message_id,
      body,
      file,
    });
  };

  // ------------------------------------------------------
  // Reply to a message
  // ------------------------------------------------------
  const replyToMessage = (user: number, message_id: number, type: "text" | "file" | "image", body: string = "", file: File | null = null): void => {
    sendMessage({
      operation: "reply",
      user,
      message_id,
      type,
      body,
      file,
    });
  };

  // ------------------------------------------------------
  // Mark a message as seen
  // ------------------------------------------------------
  const markAsSeen = (user: number, message_id: number): void => {
    sendMessage({
      operation: "seen",
      user,
      message_id,
    });
  };

  // ------------------------------------------------------
  // Update typing status
  // ------------------------------------------------------
  const updateTypingStatus = (user: number, typing_status: boolean): void => {
    sendMessage({
      operation: "typing",
      user,
      typing_status,
    });
  };

  return (
    <ChatroomSocketContext.Provider
      value={{
        organizationID,
        messages,
        typingStatus,
        setSelectedChat,
        createMessage,
        deleteMessage,
        updateMessage,
        replyToMessage,
        markAsSeen,
        updateTypingStatus,
      }}
    >
      {children}
    </ChatroomSocketContext.Provider>
  );
};

const useChatroomSocketContext = (): ChatroomSocketContextType => {
  const context = useContext(ChatroomSocketContext);
  if (!context) {
    throw new Error("useChatroomSocketContext must be used within a ChatroomSocketProvider");
  }
  return context;
};

export { ChatroomSocketProvider, useChatroomSocketContext };
