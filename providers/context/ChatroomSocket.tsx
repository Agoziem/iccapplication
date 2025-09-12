"use client";
import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";

interface Message {
  id: number;
  user_id: number;
  content: string;
  timestamp: string;
  message_type?: string;
  [key: string]: any;
}

interface TypingStatus {
  [user_id: string]: boolean;
}

interface ChatRoom {
  id: number;
  group_name?: string;
  [key: string]: any;
}

interface SocketMessage {
  type: string;
  message?: Message;
  user_id?: number;
  is_typing?: boolean;
  [key: string]: any;
}

interface ChatroomSocketContextValue {
  organizationID: string | undefined;
  socket: WebSocket | null;
  messages: Message[];
  typingStatus: TypingStatus;
  selectedChat: ChatRoom | null;
  setSelectedChat: (chat: ChatRoom | null) => void;
  sendMessage: (messageData: any) => void;
  createMessage: (user: any, type: string, body?: string, file?: any) => void;
  editMessage: (messageId: number, newContent: string) => void;
  deleteMessage: (messageId: number) => void;
  updateMessage: (message_id: number, body?: string, file?: any) => void;
  replyToMessage: (user: any, message_id: number, type: string, body?: string, file?: any) => void;
  markAsSeen: (user: any, message_id: number) => void;
  sendTypingStatus: (isTyping: boolean) => void;
  updateTypingStatus: (user: any, typing_status: boolean) => void;
}

interface ChatroomSocketProviderProps {
  children: ReactNode;
}

const ChatroomSocketContext = createContext<ChatroomSocketContextValue | null>(null);

const ChatroomSocketProvider: React.FC<ChatroomSocketProviderProps> = ({ children }) => {
  const [organizationID, setOrganizationID] = useState<string | undefined>(
    process.env.NEXT_PUBLIC_ORGANIZATION_ID
  );
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingStatus, setTypingStatus] = useState<TypingStatus>({});
  const [selectedChat, setSelectedChat] = useState<ChatRoom | null>(null);

  useEffect(() => {
    if (selectedChat) {
      const newSocket = new WebSocket(
        `ws://yourserver.com/ws/chat/${selectedChat.group_name}/`
      );
      setSocket(newSocket);

      newSocket.onmessage = (e) => {
        const data = JSON.parse(e.data);
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
  const handleSocketMessage = (data: SocketMessage): void => {
    const { type: operation, message, message_id, user, status } = data;
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
        if (user && status !== undefined) {
          setTypingStatus({ [user]: status });
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
  const createMessage = (user: any, type: string, body: string = "", file: any = null): void => {
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
  const updateMessage = (message_id: number, body: string = "", file: any = null): void => {
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
  const replyToMessage = (user: any, message_id: number, type: string, body: string = "", file: any = null): void => {
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
  const markAsSeen = (user: any, message_id: number): void => {
    sendMessage({
      operation: "seen",
      user,
      message_id,
    });
  };


  // ------------------------------------------------------
  // Update typing status
  // ------------------------------------------------------
  const updateTypingStatus = (user: any, typing_status: boolean): void => {
    sendMessage({
      operation: "typing",
      user,
      typing_status,
    });
  };

  // Simple edit message function for interface compatibility
  const editMessage = (messageId: number, newContent: string): void => {
    updateMessage(messageId, newContent);
  };

  // Simple typing status function for interface compatibility
  const sendTypingStatus = (isTyping: boolean): void => {
    // This would need user context - simplified for now
    updateTypingStatus("current_user", isTyping);
  };

  return (
    <ChatroomSocketContext.Provider
      value={{
        organizationID,
        socket,
        messages,
        typingStatus,
        selectedChat,
        setSelectedChat,
        sendMessage,
        createMessage,
        editMessage,
        deleteMessage,
        updateMessage,
        replyToMessage,
        markAsSeen,
        sendTypingStatus,
        updateTypingStatus,
      }}
    >
      {children}
    </ChatroomSocketContext.Provider>
  );
};

const useChatroomSocketContext = (): ChatroomSocketContextValue => {
  const context = useContext(ChatroomSocketContext);
  if (!context) {
    throw new Error('useChatroomSocketContext must be used within a ChatroomSocketProvider');
  }
  return context;
};

export { ChatroomSocketProvider, useChatroomSocketContext };
