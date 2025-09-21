import React, { useState, useMemo, useCallback } from "react";
import { BsThreeDotsVertical, BsWhatsapp } from "react-icons/bs";
import ChatInput from "../../custom/Inputs/ChatInput";
import ProfileimagePlaceholders from "../../custom/ImagePlaceholders/ProfileimagePlaceholders";
import ChatBody from "./ChatBody";
import { useWhatsappAPIContext } from "@/providers/context/WhatsappContext";

interface ChatProps {
  showlist: boolean;
  setShowlist: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Enhanced Chat component with comprehensive error handling and type safety
 * Displays chat interface with contact header and message input
 * Optimized with React.memo and proper TypeScript typing
 */
const Chat: React.FC<ChatProps> = React.memo(({ showlist, setShowlist }) => {
  const { selectedContact } = useWhatsappAPIContext();

  // Handle back to contacts list
  const handleBackToContacts = useCallback(() => {
    setShowlist(true);
  }, [setShowlist]);

  // Safe contact profile name
  const profileName = useMemo(() => {
    return selectedContact?.profile_name || 'Unknown Contact';
  }, [selectedContact?.profile_name]);

  // Safe WhatsApp ID
  const whatsappId = useMemo(() => {
    return selectedContact?.wa_id || '';
  }, [selectedContact?.wa_id]);

  return (
    <div
      className={`rounded ps-0 ps-md-4 mt-4 mb-4 ${
        showlist ? "d-none d-md-block" : "d-block"
      }`}
      style={{
        minHeight: "100vh",
      }}
      role="main"
      aria-label={selectedContact ? `Chat with ${profileName}` : "Chat interface"}
    >
      {selectedContact ? (
        <div className="d-flex align-items-center">
          <h6
            className={`my-3 d-block d-md-none ${
              showlist ? "d-none d-md-block" : ""
            }`}
            style={{ cursor: "pointer" }}
            onClick={handleBackToContacts}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleBackToContacts();
              }
            }}
            aria-label="Back to contacts"
          >
            <BsThreeDotsVertical
              className="me-3"
              style={{ fontSize: "1.3rem" }}
              aria-hidden="true"
            />
          </h6>
          <div className="flex-fill d-flex">
            <ProfileimagePlaceholders firstname="John" />
            <div className="ms-3">
              <h5 className="mb-1">{profileName}</h5>
              <p className="text-primary small my-0">{whatsappId}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center mt-4">
          <div className="mb-2">
            <BsWhatsapp
              style={{
                fontSize: "3.5rem",
                color: "var(--bgDarkerColor)",
              }}
              aria-hidden="true"
            />
          </div>
          <p className="text-muted mb-0">No contact selected</p>
          <small className="text-muted">Select a contact from the list to start chatting</small>
        </div>
      )}

      {/* The message area */}
      <div className="position-relative">
        <ChatBody />

        {/* The reply input */}
        {selectedContact && (
          <div className="mt-3">
            <ChatInput contact={selectedContact} />
          </div>
        )}
      </div>
    </div>
  );
});

Chat.displayName = 'Chat';

export default Chat;
