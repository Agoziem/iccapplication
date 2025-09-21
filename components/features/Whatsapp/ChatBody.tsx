import React, { useEffect, useRef, useMemo, useCallback } from "react";
import { useQueryClient } from "react-query";
import { BsWhatsapp } from "react-icons/bs";
import ChatMessage from "./ChatMessage";
import Scrolltobottom from "./Scrolltobottom";
import { useWhatsappAPIContext } from "@/providers/context/WhatsappContext";
import useWebSocket from "@/hooks/useWebSocket";
import { useWhatsAppMessages } from "@/data/hooks/whatsapp.hooks";
import { WAMessageEventSchema } from "@/schemas/whatsapp";
import { WEBSOCKET_URL } from "@/data/constants";
import { WAMessage } from "@/types/whatsapp";
import "./whatsapp.css";

// Component to show when there are no chat messages
interface NoMessagesProps {
  messagesloading: boolean;
  messageserror: any;
}

const NoMessages: React.FC<NoMessagesProps> = React.memo(({ messagesloading, messageserror }) => (
  <div>
    {messagesloading && (
      <div className="d-flex justify-content-center">
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Loading messages...</span>
        </div>
      </div>
    )}
    {messageserror && (
      <div className="alert alert-danger text-center">
        Error occurred while fetching messages.
      </div>
    )}
    <div className="text-center px-4" style={{color: "var(--bgColor)"}}>
      <BsWhatsapp
        className="mb-3"
        style={{ fontSize: "4.5rem" }}
        aria-hidden="true"
      />
      <div className="">
        No chat messages found. Select a contact to start messaging. Note that
        messaging must be initiated from the contact side.
      </div>
    </div>
  </div>
));

NoMessages.displayName = 'NoMessages';

/**
 * Enhanced ChatBody component with comprehensive error handling and type safety
 * Displays chat messages with WebSocket integration and auto-scroll functionality
 * Optimized with React.memo and proper TypeScript typing
 */
const ChatBody: React.FC = React.memo(() => {
  const { selectedContact, setSelectedContact } = useWhatsappAPIContext();
  const { bottomRef, scrollToBottom, setAtthebottom } = useWhatsappAPIContext();
  const { isConnected, ws } = useWebSocket(
    `${WEBSOCKET_URL}/ws/whatsappapiSocket/messages/`
  );
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Fetch chat messages
  const {
    data: chatmessages,
    error: messageserror,
    isLoading: messagesloading,
  } = useWhatsAppMessages(selectedContact?.id || 0);

  // Safe messages array
  const safeMessages = useMemo(() => {
    return Array.isArray(chatmessages) ? chatmessages : [];
  }, [chatmessages]);

  // Handle WebSocket message processing
  const processWebSocketMessage = useCallback((event: MessageEvent) => {
    try {
      const responseMessage = JSON.parse(event.data);
      const validatedmessage = WAMessageEventSchema.safeParse(responseMessage);

      if (!validatedmessage.success) {
        console.error(
          "Invalid WebSocket message:",
          validatedmessage.error.issues
        );
        return;
      }

      const newMessage = validatedmessage.data;

      if (newMessage.operation === "create" && newMessage.message) {
        queryClient.setQueryData<WAMessage[]>(
          ["whatsapp", "messages", newMessage.message.contact],
          (oldData = []) => {
            if (!Array.isArray(oldData)) return [newMessage.message];
            return [...oldData, newMessage.message];
          }
        );
      }
    } catch (error) {
      console.error("Error processing WebSocket message:", error);
    }
  }, [queryClient]);

  // Handle scroll event to check if user has scrolled up
  const handleScroll = useCallback(() => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      setAtthebottom(scrollTop + clientHeight >= scrollHeight - 50);
    }
  }, [setAtthebottom]);

  // WebSocket message handling
  useEffect(() => {
    if (isConnected && ws) {
      ws.onmessage = processWebSocketMessage;
    }
  }, [isConnected, ws, processWebSocketMessage]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (bottomRef.current && safeMessages.length > 0) {
      scrollToBottom();
    }
  }, [safeMessages, bottomRef, scrollToBottom]);

  // Scroll event listener
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener("scroll", handleScroll);
      return () => {
        chatContainer.removeEventListener("scroll", handleScroll);
      };
    }
  }, [handleScroll]);

  // Render messages with proper type safety
  return (
    <div className="position-relative">
      <div
        ref={chatContainerRef}
        className="chatbody mt-3 p-4 rounded text-white d-flex flex-column"
        role="main"
        aria-label="Chat messages"
      >
        <div className={safeMessages.length > 0 ? "mt-auto" : "my-auto"}>
          {safeMessages.length > 0 ? (
            safeMessages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))
          ) : (
            <NoMessages
              messagesloading={messagesloading}
              messageserror={messageserror}
            />
          )}
        </div>
        <div ref={bottomRef} aria-hidden="true" />
        <Scrolltobottom />
      </div>
    </div>
  );
});

ChatBody.displayName = 'ChatBody';

export default ChatBody;
