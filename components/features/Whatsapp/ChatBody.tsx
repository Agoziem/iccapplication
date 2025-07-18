import React, { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import { useWhatsappAPIContext } from "@/data/whatsappAPI/WhatsappContext";
import { BsWhatsapp } from "react-icons/bs";
import "./whatsapp.css";
import Scrolltobottom from "./Scrolltobottom";
import useWebSocket from "@/hooks/useWebSocket";
import { WAMessageWebsocketSchema } from "@/schemas/whatsapp";
import { useFetchWAMessages } from "@/data/whatsappAPI/whatsapp.hook";
import { useQueryClient } from "react-query";

// Component to show when there are no chat messages
const NoMessages = ({ messagesloading, messageserror }) => (
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

const ChatBody = () => {
  const { selectedContact, setSelectedContact } = useWhatsappAPIContext();
  const { bottomRef, scrollToBottom, setAtthebottom } = useWhatsappAPIContext();
  const { isConnected, ws } = useWebSocket(
    `${process.env.NEXT_PUBLIC_DJANGO_WEBSOCKET_URL}/ws/whatsappapiSocket/messages/`
  );
  const chatContainerRef = useRef(null);

  // ------------------------------------------------------
  // Fetch chat messages
  // ------------------------------------------------------
  const {
    data: chatmessages,
    error: messageserror,
    isLoading: messagesloading,
  } = useFetchWAMessages(selectedContact?.id);

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
              (oldData = []) => {
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
    const handleScroll = () => {
      if (chatContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } =
          chatContainerRef.current;

        setAtthebottom(scrollTop + clientHeight >= scrollHeight - 50);
      }
    };

    const chatContainer = chatContainerRef.current;
    chatContainer.addEventListener("scroll", handleScroll);

    // Cleanup event listener on component unmount
    return () => {
      chatContainer.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="position-relative">
      <div
        ref={chatContainerRef}
        className="chatbody mt-3 p-4 rounded text-white d-flex flex-column"
      >
        <div className={chatmessages?.length > 0 ? "mt-auto" : "my-auto"}>
          {chatmessages?.length > 0 ? (
            chatmessages.map((message) => (
              <ChatMessage key={message.id} message={message} />
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
