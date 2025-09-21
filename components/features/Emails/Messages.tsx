"use client";
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  memo,
} from "react";
import MessageCard from "./MessageCard";
import SearchInput from "../../custom/Inputs/SearchInput";
import "./Email.css";
import { MdOutlineContacts, MdRefresh } from "react-icons/md";
import Pagination from "@/components/custom/Pagination/Pagination";
import { useSearchParams, useRouter } from "next/navigation";
import { useQueryClient } from "react-query";
import toast from "react-hot-toast";
import {
  Email,
  PaginatedEmailResponse,
  MessageWebsocket,
} from "@/types/emails";
import { useEmails, useUpdateEmail } from "@/data/hooks/email.hooks";
import { ORGANIZATION_ID, WEBSOCKET_URL } from "@/data/constants";
import { parseAsInteger, useQueryState } from "nuqs";

interface MessagesProps {
  message: Email | null;
  selectMessage: (message: Email | null) => void;
  showlist: boolean;
  setShowlist: (show: boolean) => void;
}

const Messages: React.FC<MessagesProps> = memo(
  ({ message, selectMessage, showlist, setShowlist }) => {
    const [showUnread, setShowUnread] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useQueryState(
      "page",
      parseAsInteger.withDefault(1)
    );
    const [pageSize, setPageSize] = useQueryState(
      "page_size",
      parseAsInteger.withDefault(10)
    );

    // Fetch emails with error handling
    const {
      data: emailsData,
      isLoading: loadingMessages,
      error: fetchError,
      refetch,
    } = useEmails(parseInt(ORGANIZATION_ID) || 0, {
      page,
      page_size: pageSize,
    });

    const { mutateAsync: updateEmail } = useUpdateEmail();

    // Safe data extraction
    const messages = useMemo(() => {
      if (!emailsData || !Array.isArray(emailsData.results)) {
        return { results: [], count: 0 };
      }
      return emailsData;
    }, [emailsData]);


    // Safe page change handler
    const handlePageChange = useCallback((newPage: string | number) => {
      const pageNum = typeof newPage === "string" ? parseInt(newPage) : newPage;
      if (pageNum < 1 || isNaN(pageNum)) return;
      setPage(pageNum);
    }, []);

    // Optimized message filtering with error handling
    const filteredMessages = useMemo(() => {
      if (!Array.isArray(messages.results)) {
        return [];
      }

      try {
        let filtered = messages.results;

        // Filter by read status
        if (showUnread) {
          filtered = filtered.filter(
            (message) =>
              message && typeof message.read === "boolean" && !message.read
          );
        }

        // Filter by search query
        if (searchQuery && searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          filtered = filtered.filter((message) => {
            if (!message) return false;

            const subject = message.subject || "";
            const name = message.name || "";

            return (
              subject.toLowerCase().includes(query) ||
              name.toLowerCase().includes(query)
            );
          });
        }

        return filtered;
      } catch (error) {
        console.error("Error filtering messages:", error);
        return messages.results || [];
      }
    }, [messages.results, showUnread, searchQuery]);

    // Safe message update function
    const updateMessage = useCallback(async (updatedMessage: Email) => {
      if (!updatedMessage || !updatedMessage.id) {
        toast.error("Invalid message data for update");
        return;
      }
      try {
        await updateEmail({
          emailId: updatedMessage.id,
          updateData: {
            read: updatedMessage.read || false,
            name: updatedMessage.name,
            subject: updatedMessage.subject,
            message: updatedMessage.message,
            email: updatedMessage.email,
          },
        });
        refetch();
      } catch (error) {
        console.error("Error updating message:", error);
        toast.error("Failed to update message");
      }
    }, []);

    // Loading state
    if (loadingMessages) {
      return (
        <div className={`${!showlist ? "d-none d-md-block" : "d-block"}`}>
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "200px" }}
          >
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
            <p>
              {fetchError?.message ||
                "An error occurred while loading messages"}
            </p>
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
        

        {/* Header */}
        <div className="mb-3">
          <h4 className="mb-3">Inbox</h4>
          <div className="d-flex gap-2" role="tablist" aria-label="Email filter tabs">
            <button
              className="btn btn-sm rounded"
              style={{
                backgroundColor: !showUnread
                  ? "var(--primary)"
                  : "var(--bgDarkerColor)",
                borderColor: !showUnread
                  ? "var(--primary)"
                  : "var(--bgDarkerColor)",
                color: "white",
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
                color: "white",
              }}
              onClick={() => setShowUnread(true)}
              role="tab"
              aria-selected={showUnread}
              aria-controls="unread-messages"
              id="unread-mail-tab"
            >
              Unread ({filteredMessages.filter((m) => m && !m.read).length || 0}
              )
            </button>
            {/* refetch button */}
            <button
              className="btn btn-sm btn-accent-secondary rounded"
              onClick={() => {
                refetch();
                toast.success("Messages refreshed");
              }}
              aria-label="Refetch messages"
            >
              <MdRefresh size={20} />
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
                {searchQuery
                  ? "No messages match your search"
                  : showUnread
                  ? "No unread messages"
                  : "No messages found"}
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
  }
);

Messages.displayName = "Messages";

export default Messages;
