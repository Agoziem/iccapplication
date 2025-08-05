import React, { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import { useWhatsappAPIContext } from "@/data/WhatsappContext";
import { BsWhatsapp } from "react-icons/bs";
import "./whatsapp.css";
import Scrolltobottom from "./Scrolltobottom";
import useWebSocket from "@/hooks/useWebSocket";
import { WAMessageWebsocketSchema } from "@/schemas/whatsapp";
import { useFetchWAMessages } from "@/data/whatsapp.hook";
import { useQueryClient } from "react-query";

interface NoMessagesProps {
  messagesloading: boolean;
  messageserror: any;
}

const NoMessages: React.FC<NoMessagesProps> = ({ messagesloading, messageserror }) => (
  <div>
    {messagesloading && <div>Loading...</div>}
    {messageserror && <div>Error occurred while fetching messages.</div>}
    <div className="text-center px-4">
      <BsWhatsapp
        className="mb-3"
        style={{ fontSize: "4.5rem", color: "var(--bgColor)" }}
      />
      <div>
        No chat Messages found. Select a contact to start messaging. Note that
        messaging must be initiated from the contact side.
      </div>
    </div>
  </div>
);

const ChatBody: React.FC = () => {
  const { selectedContact, setSelectedContact } = useWhatsappAPIContext();
  const { bottomRef, scrollToBottom, setAtthebottom } = useWhatsappAPIContext();
  const { isConnected, ws } = useWebSocket(
    `${process.env.NEXT_PUBLIC_DJANGO_WEBSOCKET_URL}/ws/whatsappapiSocket/messages/`
  );
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // ------------------------------------------------------
  // Fetch chat messages
  // ------------------------------------------------------
  const {
    data: chatmessages,
    error: messageserror,
    isLoading: messagesloading,
  } = useFetchWAMessages(selectedContact?.id || 0);

  // -----------------------------------------------------
  // append a new message upon recieval from websocket
  // -----------------------------------------------------
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isConnected && ws) {
      ws.onmessage = (event) => {
        try {
          const responseMessage = JSON.parse(event.data); // Parse the WebSocket message
          const validatedmessage =
            WAMessageWebsocketSchema.safeParse(responseMessage);

          // Validate the WebSocket message
          if (!validatedmessage.success) {
            console.error(
              "Invalid WebSocket message:",
              validatedmessage.error.issues
            );
            return; // Exit early if the message is invalid
          }

          const newMessage = validatedmessage.data;

          // Safely check if selectedContact exists
          if (newMessage.operation === "create") {
            queryClient.setQueryData(
              ["waMessages", newMessage.message.contact],
              (oldData: any[] = []) => {
                return [...oldData, newMessage.message];
              }
            );
          }
        } catch (error) {
          console.error("Error processing WebSocket message:", error);
        }
      };
    }
  }, [isConnected, ws, queryClient]);

  // ------------------------------------------------------
  // Scroll to the bottom whenever messages change
  // ------------------------------------------------------
  useEffect(() => {
    if (bottomRef.current) {
      scrollToBottom();
    }
  }, [chatmessages, bottomRef]);

  // ------------------------------------------------------
  // Handle scroll event to check if the user has scrolled up
  // ------------------------------------------------------
  useEffect(() => {
    const handleScroll = (): void => {
      if (chatContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } =
          chatContainerRef.current;

        setAtthebottom(scrollTop + clientHeight >= scrollHeight - 50);
      }
    };

    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener("scroll", handleScroll);

      // Cleanup event listener on component unmount
      return () => {
        chatContainer.removeEventListener("scroll", handleScroll);
      };
    }
  }, [setAtthebottom]);

  return (
    <div className="position-relative">
      <div
        ref={chatContainerRef}
        className="chatbody mt-3 p-4 rounded text-white d-flex flex-column"
      >
        <div className={(chatmessages?.length || 0) > 0 ? "mt-auto" : "my-auto"}>
          {(chatmessages?.length || 0) > 0 ? (
            chatmessages?.map((message) => (
              <ChatMessage key={message.id} message={message as any} />
            ))
          ) : (
            <NoMessages
              messagesloading={messagesloading}
              messageserror={messageserror}
            />
          )}
          {/* Dummy element to scroll into view */}
        </div>
        <div ref={bottomRef} />
        <Scrolltobottom />
      </div>
    </div>
  );
};

export default ChatBody;
