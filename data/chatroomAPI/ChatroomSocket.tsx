"use client";
import React, { createContext, useState, useEffect, useContext } from "react";

const ChatroomSocketContext = createContext(null);

const ChatroomSocketProvider = ({ children }) => {
  const [organizationID, setOrganizationID] = useState(
    process.env.NEXT_PUBLIC_ORGANIZATION_ID
  );
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typingStatus, setTypingStatus] = useState({});
  const [selectedChat, setSelectedChat] = useState(null);

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
  const handleSocketMessage = (data) => {
    const { operation, message, message_id, user, status } = data;
    switch (operation) {
      case "create":
        setMessages((prevMessages) => [...prevMessages, message]);
        break;
      case "delete":
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== message_id)
        );
        break;
      case "seen":
        // Handle seen status
        break;
      case "typing":
        setTypingStatus({ user, status });
        break;
      default:
        break;
    }
  };

  // ------------------------------------------------------
  // handles sending messages to the socket
  // ------------------------------------------------------
  const sendMessage = (messageData) => {
    if (socket) {
      socket.send(JSON.stringify(messageData));
    }
  };

  // ------------------------------------------------------
  // Create a new message
  // ------------------------------------------------------
  const createMessage = (user, type, body = "", file = null) => {
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
  const deleteMessage = (message_id) => {
    sendMessage({
      operation: "delete",
      message_id,
    });
  };


  // ------------------------------------------------------
  // Update a message
  // ------------------------------------------------------
  const updateMessage = (message_id, body = "", file = null) => {
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
  const replyToMessage = (user, message_id, type, body = "", file = null) => {
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
  const markAsSeen = (user, message_id) => {
    sendMessage({
      operation: "seen",
      user,
      message_id,
    });
  };


  // ------------------------------------------------------
  // Update typing status
  // ------------------------------------------------------
  const updateTypingStatus = (user, typing_status) => {
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

const useChatroomSocketContext = () => {
  return useContext(ChatroomSocketContext);
};

export { ChatroomSocketProvider, useChatroomSocketContext };
