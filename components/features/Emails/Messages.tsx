"use client";
import React, { useState, useEffect, useCallback, useMemo, useRef, memo } from "react";
import MessageCard from "./MessageCard";
import SearchInput from "../../custom/Inputs/SearchInput";
import "./Email.css";
import useWebSocket from "@/hooks/useWebSocket";
import { MessageWebsocketSchema } from "@/schemas/emails";
import { MdOutlineContacts } from "react-icons/md";
import Pagination from "@/components/custom/Pagination/Pagination";
import { useSearchParams, useRouter } from "next/navigation";
import { useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { Email, PaginatedEmailResponse, MessageWebsocket } from "@/types/emails";
import { useEmails } from "@/data/hooks/email.hooks";
import { ORGANIZATION_ID } from "@/data/constants";

interface MessagesProps {
  message: Email | null;
  selectMessage: (message: Email | null) => void;
  showlist: boolean;
  setShowlist: (show: boolean) => void;
}

const Messages: React.FC<MessagesProps> = memo(({ 
  message, 
  selectMessage, 
  showlist, 
  setShowlist 
}) => {
  const [showUnread, setShowUnread] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [wsError, setWsError] = useState<string | null>(null);
  
  // Refs for cleanup and race condition prevention
  const isMountedRef = useRef(true);
  const wsHandlerRef = useRef<((event: MessageEvent) => void) | null>(null);

  // Safe WebSocket connection with error handling
  const { isConnected, ws, error: wsConnectionError } = useWebSocket(
    `${process.env.NEXT_PUBLIC_DJANGO_WEBSOCKET_URL}/ws/emailapiSocket/`
  );

  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  // Safe parameter extraction with validation
  const page = useMemo(() => {
    const pageParam = searchParams?.get("page");
    const pageNum = parseInt(pageParam || "1");
    return isNaN(pageNum) || pageNum < 1 ? 1 : pageNum;
  }, [searchParams]);

  const pageSize = 10;

  // Fetch emails with error handling
  const {
    data: emailsData,
    isLoading: loadingMessages,
    error: fetchError,
    refetch
  } = useEmails(parseInt(ORGANIZATION_ID) || 0, {
    page,
    page_size: pageSize,
  });

  // Safe data extraction
  const messages = useMemo(() => {
    if (!emailsData || !Array.isArray(emailsData.results)) {
      return { results: [], count: 0 };
    }
    return emailsData;
  }, [emailsData]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (wsHandlerRef.current) {
        wsHandlerRef.current = null;
      }
    };
  }, []);

  // Safe page change handler
  const handlePageChange = useCallback((newPage: string | number) => {
    const pageNum = typeof newPage === 'string' ? parseInt(newPage) : newPage;
    
    if (!router || pageNum < 1 || isNaN(pageNum)) return;
    
    try {
      router.push(`?page=${pageNum}&page_size=${pageSize}`);
    } catch (error) {
      console.error('Error navigating to page:', error);
      toast.error('Failed to navigate to page');
    }
  }, [router]);

  // Safe WebSocket message handler
  const handleWebSocketMessage = useCallback((event: MessageEvent) => {
    if (!isMountedRef.current) return;

    try {
      const newMessage = JSON.parse(event.data);
      const validatedData = MessageWebsocketSchema.safeParse(newMessage);

      if (!validatedData.success) {
        console.error("Invalid WebSocket data:", validatedData.error.issues);
        return;
      }

      const { operation, message: wsMessage } = validatedData.data;

      if (!queryClient) return;

      queryClient.setQueryData(["emails"], (oldData: unknown) => {
        const emailData = oldData as PaginatedEmailResponse | undefined;
        
        if (!emailData || !Array.isArray(emailData.results)) {
          return emailData;
        }

        const updatedResults = [...emailData.results];
        const currentCount = emailData.count || 0;

        switch (operation) {
          case "create":
            if (wsMessage && wsMessage.id) {
              toast.success("You have a new message");
              return {
                ...emailData,
                count: currentCount + 1,
                results: [wsMessage, ...updatedResults],
              };
            }
            break;

          case "update":
            if (wsMessage && wsMessage.id) {
              const updatedMessages = updatedResults.map((msg) =>
                msg?.id === wsMessage.id ? { ...msg, ...wsMessage } : msg
              );
              return {
                ...emailData,
                results: updatedMessages,
              };
            }
            break;

          case "delete":
            if (wsMessage && wsMessage.id) {
              toast.success("A message was deleted");
              const filteredMessages = updatedResults.filter(
                (msg) => msg?.id !== wsMessage.id
              );
              return {
                ...emailData,
                count: Math.max(0, currentCount - 1),
                results: filteredMessages,
              };
            }
            break;

          default:
            console.warn(`Unhandled WebSocket operation: ${operation}`);
        }
        
        return emailData;
      });
    } catch (error) {
      console.error("Error handling WebSocket message:", error);
      setWsError('Error processing real-time update');
    }
  }, [queryClient]);

  // WebSocket event handling with cleanup
  useEffect(() => {
    if (isConnected && ws && isMountedRef.current) {
      wsHandlerRef.current = handleWebSocketMessage;
      ws.onmessage = handleWebSocketMessage;
      
      // Clear any previous WebSocket errors
      setWsError(null);

      return () => {
        if (ws && wsHandlerRef.current) {
          ws.onmessage = null;
        }
      };
    }
  }, [isConnected, ws, handleWebSocketMessage]);

  // Optimized message filtering with error handling
  const filteredMessages = useMemo(() => {
    if (!Array.isArray(messages.results)) {
      return [];
    }

    try {
      let filtered = messages.results;

      // Filter by read status
      if (showUnread) {
        filtered = filtered.filter((message) => 
          message && typeof message.read === 'boolean' && !message.read
        );
      }

      // Filter by search query
      if (searchQuery && searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        filtered = filtered.filter((message) => {
          if (!message) return false;
          
          const subject = message.subject || '';
          const name = message.name || '';
          
          return (
            subject.toLowerCase().includes(query) ||
            name.toLowerCase().includes(query)
          );
        });
      }

      return filtered;
    } catch (error) {
      console.error('Error filtering messages:', error);
      return messages.results || [];
    }
  }, [messages.results, showUnread, searchQuery]);

  // Safe message update function
  const updateMessage = useCallback(async (updatedMessage: Email) => {
    if (!updatedMessage || !updatedMessage.id || !isMountedRef.current) {
      console.warn('Invalid message data for update');
      return;
    }

    // Only send WebSocket update if message is unread
    if (!updatedMessage.read && ws && ws.readyState === WebSocket.OPEN) {
      try {
        const payload = {
          operation: "update",
          message: updatedMessage,
        };
        ws.send(JSON.stringify(payload));
      } catch (error) {
        console.error("Error sending WebSocket update:", error);
        toast.error('Failed to sync message status');
      }
    }
  }, [ws]);

  // Loading state
  if (loadingMessages) {
    return (
      <div className={`${!showlist ? "d-none d-md-block" : "d-block"}`}>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading messages...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (fetchError) {
    return (
      <div className={`${!showlist ? "d-none d-md-block" : "d-block"}`}>
        <div className="alert alert-danger">
          <h6>Failed to load messages</h6>
          <p>{fetchError?.message || 'An error occurred while loading messages'}</p>
          <button 
            className="btn btn-outline-danger btn-sm"
            onClick={() => refetch()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Calculate pagination safely
  const totalPages = Math.max(1, Math.ceil((messages.count || 0) / pageSize));
  const showPagination = !loadingMessages && messages.count > pageSize;

  return (
    <div className={`${!showlist ? "d-none d-md-block" : "d-block"}`}>
      {/* WebSocket error notification */}
      {(wsError || wsConnectionError) && (
        <div className="alert alert-warning alert-dismissible" role="alert">
          <small>
            {wsError || 'Real-time updates unavailable. Messages will refresh when you reload the page.'}
            <button
              type="button"
              className="btn-close btn-close-sm ms-2"
              onClick={() => setWsError(null)}
              aria-label="Dismiss notification"
            ></button>
          </small>
        </div>
      )}

      {/* Header */}
      <div className="d-flex align-items-center mb-3">
        <h4 className="flex-fill mb-0">Inbox</h4>
        <div className="d-flex" role="tablist" aria-label="Email filter tabs">
          <button
            className="btn btn-sm rounded me-2"
            style={{
              backgroundColor: !showUnread
                ? "var(--primary)"
                : "var(--bgDarkerColor)",
              borderColor: !showUnread
                ? "var(--primary)"
                : "var(--bgDarkerColor)",
              color: "white"
            }}
            onClick={() => setShowUnread(false)}
            role="tab"
            aria-selected={!showUnread}
            aria-controls="all-messages"
            id="all-mail-tab"
          >
            All mail ({messages.count || 0})
          </button>
          <button
            className="btn btn-sm rounded"
            style={{
              backgroundColor: showUnread
                ? "var(--primary)"
                : "var(--bgDarkerColor)",
              borderColor: showUnread
                ? "var(--primary)"
                : "var(--bgDarkerColor)",
              color: "white"
            }}
            onClick={() => setShowUnread(true)}
            role="tab"
            aria-selected={showUnread}
            aria-controls="unread-messages"
            id="unread-mail-tab"
          >
            Unread ({filteredMessages.filter(m => m && !m.read).length || 0})
          </button>
        </div>
      </div>

      <hr />

      {/* Search */}
      <div className="mb-4">
        <SearchInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          itemlabel="subject or sender name"
        />
      </div>

      {/* Messages List */}
      <div 
        className="messageslist d-flex flex-column gap-2 pe-2"
        role="tabpanel"
        id={showUnread ? "unread-messages" : "all-messages"}
        aria-labelledby={showUnread ? "unread-mail-tab" : "all-mail-tab"}
      >
        {filteredMessages.length > 0 ? (
          filteredMessages.map((message) => {
            if (!message || !message.id) return null;
            
            return (
              <MessageCard
                key={message.id}
                message={message}
                selectMessage={selectMessage}
                updateMessagefn={updateMessage}
                setShowlist={setShowlist}
              />
            );
          })
        ) : (
          <div className="text-center mt-4" role="status" aria-live="polite">
            <div className="mb-3">
              <MdOutlineContacts
                style={{
                  fontSize: "3.5rem",
                  color: "var(--bgDarkerColor)",
                }}
                aria-hidden="true"
              />
            </div>
            <h6 className="text-muted">
              {searchQuery ? 'No messages match your search' : 
               showUnread ? 'No unread messages' : 'No messages found'}
            </h6>
            {searchQuery && (
              <button 
                className="btn btn-link btn-sm"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search to show all messages"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {showPagination && (
        <div className="mt-4">
          <Pagination
            currentPage={String(page)}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
});

Messages.displayName = 'Messages';

export default Messages;
