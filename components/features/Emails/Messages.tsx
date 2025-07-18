"use client";
import React, { useState, useEffect } from "react";
import MessageCard from "./MessageCard";
import SearchInput from "../../custom/Inputs/SearchInput";
import "./Email.css";
import useWebSocket from "@/hooks/useWebSocket";
import { MessageWebsocketSchema } from "@/schemas/emails";
import { MdOutlineContacts } from "react-icons/md";
import Pagination from "@/components/custom/Pagination/Pagination";
import { useSearchParams, useRouter } from "next/navigation";
import {  useFetchEmails } from "@/data/Emails/emails.hook";
import { useQueryClient } from "react-query";
import toast from "react-hot-toast";

/**
 * Holds all the Messages that was sent well paginated with load more button
 * @param {{ message : Email,
 * selectMessage:(value:Email)=> void,
 * showlist:boolean,
 * setShowlist:(value:boolean)=> void,
 * }} props
 * @returns {JSX.Element}
 */
const Messages = ({ message, selectMessage, showlist, setShowlist }) => {
  const { isConnected, ws } = useWebSocket(
    `${process.env.NEXT_PUBLIC_DJANGO_WEBSOCKET_URL}/ws/emailapiSocket/`
  );

  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "1";
  const pageSize = "10";

  // fetch all the messages and populate cache
  const {
    data: messages,
    isLoading: loadingMessages,
    error,
  } = useFetchEmails();

  // Handle page change
  const handlePageChange = (newPage) => {
    router.push(`?page=${newPage}&page_size=${pageSize}`);
  };

  const [showUnread, setShowUnread] = useState(false); // State to filter unread messages
  const [searchQuery, setSearchQuery] = useState(""); // State for search input

  // -----------------------------------------
  // Handling WebSocket onmessage event
  // -----------------------------------------
  const queryClient = useQueryClient();
  useEffect(() => {
    if (isConnected && ws) {
      ws.onmessage = (event) => {
        try {
          const newMessage = JSON.parse(event.data);
          const validatedData = MessageWebsocketSchema.safeParse(newMessage);

          if (!validatedData.success) {
            console.error(
              "Invalid WebSocket data:",
              validatedData.error.issues
            );
            return;
          }

          const { operation, message } = validatedData.data;

          queryClient.setQueryData(
            ["emails"],
            (oldData) => {
              if (!oldData) return; // No cache to update

              const updatedResults = [...(oldData.results || [])];

              switch (operation) {
                case "create":
                  toast.success("you have a new message");
                  return {
                    ...oldData,
                    count: oldData.count + 1,
                    results: [message, ...updatedResults], // Add new message at the top
                  };

                case "update":
                  return {
                    ...oldData,
                    results: updatedResults.map((msg) =>
                      msg.id === message.id ? message : msg
                    ), // Replace the updated message
                  };

                case "delete":
                  toast.success("A message was deleted");
                  return {
                    ...oldData,
                    count: oldData.count - 1,
                    results: updatedResults.filter(
                      (msg) => msg.id !== message.id
                    ), // Remove deleted message
                  };

                default:
                  console.warn(`Unhandled operation: ${operation}`);
                  return oldData;
              }
            }
          );
        } catch (error) {
          console.error("Error handling WebSocket message:", error);
        }
      };
    }
  }, [isConnected, ws, queryClient]);

  if (loadingMessages) {
    return <p>Loading....</p>;
  }

  if (error) {
    return <p>An error just occurred</p>;
  }

  // Filter messages based on the `read` state
  let filteredMessages = showUnread
    ? messages?.results?.filter((message) => !message.read) // Show only unread messages
    : messages.results;

  // Filter messages further based on search input
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredMessages = filteredMessages?.filter(
      (message) =>
        message.subject.toLowerCase().includes(query) ||
        message.name.toLowerCase().includes(query) // Assuming 'user' is a string field
    );
  }

  // -----------------------------------------------------------
  // update a Message and populate/update Cache from Websocket
  // ------------------------------------------------------------
  /** @param {Email} updatedMessage */
  const updateMessage = async (updatedMessage) => {
    if (!updatedMessage.read) {
      if (ws && ws.readyState === WebSocket.OPEN) {
        /**@type {EmailWebsocket} */
        const payload = {
          operation: "update",
          message: updatedMessage,
        };

        ws.send(JSON.stringify(payload));
      } else {
        console.error("WebSocket is not connected.");
      }
    }
  };

  return (
    <div className={`${!showlist ? "d-none d-md-block" : "d-block"}`}>
      <div className="d-flex">
        <h4 className="flex-fill">Inbox</h4>
        <div className="d-flex bg-primary-light">
          <button
            className="btn btn-sm btn-primary rounded me-2"
            style={{
              backgroundColor: showUnread
                ? "var(--bgDarkerColor)"
                : "var(--primary)",
              borderColor: showUnread
                ? "var(--bgDarkerColor)"
                : "var(--primary)",
            }}
            onClick={() => setShowUnread(false)} // Show all messages
          >
            All mail
          </button>
          <button
            className="btn btn-sm btn-primary rounded"
            style={{
              backgroundColor: showUnread
                ? "var(--primary)"
                : "var(--bgDarkerColor)",
              borderColor: showUnread
                ? "var(--primary)"
                : "var(--bgDarkerColor)",
            }}
            onClick={() => setShowUnread(true)} // Show only unread messages
          >
            Unread
          </button>
        </div>
      </div>
      <hr />
      <div className="mb-4">
        {/* Pass searchQuery and setSearchQuery to SearchInput */}
        <SearchInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          itemlabel={"subject or user"}
        />
      </div>
      <div className="messageslist d-flex flex-column g-1 pe-2">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((message) => (
            <MessageCard
              key={message.id}
              message={message}
              selectMessage={selectMessage}
              updateMessagefn={updateMessage}
              setShowlist={setShowlist}
            />
          ))
        ) : (
          <div className="text-center mt-4">
            <div className="mb-2">
              <MdOutlineContacts
                style={{
                  fontSize: "3.5rem",
                  color: "var(--bgDarkerColor)",
                }}
              />
            </div>
            No Message found
          </div>
        )}
      </div>

      {!loadingMessages &&
        messages &&
        Math.ceil(messages.count / parseInt(pageSize)) > 1 && (
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(messages.count / parseInt(pageSize))}
            handlePageChange={handlePageChange}
          />
        )}
    </div>
  );
};

export default Messages;
