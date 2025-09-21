"use client";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useQueryClient } from "react-query";
import ContactCard from "./ContactCard";
import SearchInput from "../../custom/Inputs/SearchInput";
import BackButton from "../../custom/backbutton/BackButton";
import { useWhatsappAPIContext } from "@/providers/context/WhatsappContext";
import { useWhatsAppContacts } from "@/data/hooks/whatsapp.hooks";
import useWebSocket from "@/hooks/useWebSocket";
import { WAContactEventSchema } from "@/schemas/whatsapp";
import { Contact } from "@/types/whatsapp";
import { WEBSOCKET_URL } from "@/data/constants";
import { MdOutlineContacts } from "react-icons/md";
import "./whatsapp.css";

interface ContactsProps {
  showlist: boolean;
  setShowlist: React.Dispatch<React.SetStateAction<boolean>>;
}

// Loading Component
const LoadingContacts: React.FC = React.memo(() => (
  <div className="d-flex justify-content-center mt-4">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading contacts...</span>
    </div>
  </div>
));

LoadingContacts.displayName = 'LoadingContacts';

// Error Component
const ErrorContacts: React.FC = React.memo(() => (
  <div className="alert alert-danger text-center mt-4">
    <h6>Error Loading Contacts</h6>
    <p className="mb-0">Please try refreshing the page.</p>
  </div>
));

ErrorContacts.displayName = 'ErrorContacts';

// Empty State Component
interface EmptyContactsProps {
  isFiltered: boolean;
}

const EmptyContacts: React.FC<EmptyContactsProps> = React.memo(({ isFiltered }) => (
  <div className="text-center mt-4">
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
      {isFiltered ? 'No contacts match your search' : 'No contacts found'}
    </h6>
    {!isFiltered && (
      <p className="text-muted small">
        Contacts will appear here once WhatsApp messages are received.
      </p>
    )}
  </div>
));

EmptyContacts.displayName = 'EmptyContacts';

/**
 * Enhanced Contacts component with comprehensive type safety and WebSocket integration
 * Displays WhatsApp contacts with search, filtering, and real-time updates
 * Optimized with React.memo and proper TypeScript typing
 */
const Contacts: React.FC<ContactsProps> = React.memo(({ showlist, setShowlist }) => {
  const { selectedContact, setSelectedContact } = useWhatsappAPIContext();
  const { isConnected, ws } = useWebSocket(
    `${WEBSOCKET_URL}/ws/whatsappapiSocket/contacts/`
  );
  const queryClient = useQueryClient();
  
  // State management
  const [showUnread, setShowUnread] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Fetch contacts data
  const {
    data: contacts,
    isLoading,
    error,
  } = useWhatsAppContacts();

  // Safe contacts array
  const safeContacts = useMemo(() => {
    return Array.isArray(contacts) ? contacts : [];
  }, [contacts]);

  // Sort contacts by timestamp - since last_message is a string, we'll use a different approach
  const sortContacts = useCallback((contactsToSort: Contact[]): Contact[] => {
    return contactsToSort.sort((a, b) => {
      // Sort date of last message
      const aTime = a.last_message?.timestamp ? new Date(a.last_message.timestamp).getTime() : 0;
      const bTime = b.last_message?.timestamp ? new Date(b.last_message.timestamp).getTime() : 0;
      return bTime - aTime;
    });
  }, []);

  // Handle WebSocket contact events
  const processWebSocketMessage = useCallback((event: MessageEvent) => {
    try {
      const responseContact = JSON.parse(event.data);
      const validatedcontact = WAContactEventSchema.safeParse(responseContact);

      if (!validatedcontact.success) {
        console.error("Invalid WebSocket contact data:", validatedcontact.error.issues);
        return;
      }

      const newContact = validatedcontact.data;
      const cacheKey = ["whatsapp", "contacts"];

      if (newContact.operation === "create" && newContact.contact) {
        queryClient.setQueryData<Contact[]>(cacheKey, (existingContacts = []) => {
          if (!Array.isArray(existingContacts)) return [newContact.contact];
          
          const contactExists = existingContacts.some(
            (contact) => contact.id === newContact.contact.id
          );

          if (contactExists) {
            return sortContacts([
              newContact.contact,
              ...existingContacts.filter(
                (contact) => contact.id !== newContact.contact.id
              ),
            ]);
          } else {
            return sortContacts([newContact.contact, ...existingContacts]);
          }
        });
      }

      if (newContact.operation === "update_seen_status" && newContact.contact) {
        queryClient.setQueryData<Contact[]>(cacheKey, (existingContacts = []) => {
          if (!Array.isArray(existingContacts)) return [newContact.contact];
          
          return existingContacts.map((contact) =>
            contact.id === newContact.contact.id
              ? newContact.contact
              : contact
          );
        });
      }
    } catch (error) {
      console.error("Error processing WebSocket contact message:", error);
    }
  }, [queryClient, sortContacts]);

  // WebSocket message handling
  useEffect(() => {
    if (isConnected && ws) {
      ws.onmessage = processWebSocketMessage;
    }
  }, [isConnected, ws, processWebSocketMessage]);

  // Filter and search contacts
  const filteredContacts = useMemo(() => {
    let result = safeContacts;

    // Filter by unread status
    if (showUnread) {
      result = result.filter((contact) => {
        const unreadCount = contact.unread_message_count ?? 0;
        return typeof unreadCount === 'number' && unreadCount > 0;
      });
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((contact) => {
        const profileName = contact.profile_name || '';
        const waId = contact.wa_id || '';
        return profileName.toLowerCase().includes(query) || 
               waId.includes(query);
      });
    }

    return result;
  }, [safeContacts, showUnread, searchQuery]);

  // Update contact seen status
  const updateContact = useCallback(async (updatedContact: Contact) => {
    const unreadCount = updatedContact.unread_message_count;
    
    // Handle both string and number unread counts
    const parsedCount = typeof unreadCount === 'string' 
      ? parseInt(unreadCount, 10) 
      : unreadCount || 0;
    
    if (parsedCount > 0) {
      if (ws && ws.readyState === WebSocket.OPEN) {
        try {
          const payload = {
            operation: "update_seen_status",
            contact: updatedContact,
          };
          ws.send(JSON.stringify(payload));
        } catch (error) {
          console.error("Error sending WebSocket message:", error);
        }
      } else {
        console.warn("WebSocket is not connected.");
      }
    }
  }, [ws]);

  // Handle filter button clicks
  const handleShowAllContacts = useCallback(() => {
    setShowUnread(false);
  }, []);

  const handleShowUnreadContacts = useCallback(() => {
    setShowUnread(true);
  }, []);

  // Loading state
  if (isLoading) {
    return <LoadingContacts />;
  }

  // Error state
  if (error) {
    return <ErrorContacts />;
  }

  const hasFilters = showUnread || searchQuery.trim().length > 0;

  return (
    <div>
      <div className="mb-2">
        <BackButton />
      </div>
      
      <div
        className={`${!showlist ? "d-none d-md-block" : "d-flex flex-column"} mt-4 mt-md-3`}
      >
        {/* Header with filter buttons */}
        <div className="d-flex flex-wrap align-items-center">
          <h4 className="flex-fill mb-3">WhatsApp Messages</h4>
          <div className="d-flex bg-primary-light" role="group" aria-label="Contact filter options">
            <button
              className="btn btn-sm btn-primary rounded me-2"
              style={{
                backgroundColor: !showUnread
                  ? "var(--primary)"
                  : "var(--bgDarkerColor)",
                borderColor: !showUnread
                  ? "var(--primary)"
                  : "var(--bgDarkerColor)",
              }}
              onClick={handleShowAllContacts}
              aria-pressed={!showUnread}
            >
              All Contacts
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
              onClick={handleShowUnreadContacts}
              aria-pressed={showUnread}
            >
              Unread ({safeContacts.filter(c => {
                const count = c.unread_message_count;
                const parsed = typeof count === 'string' ? parseInt(count, 10) : count || 0;
                return parsed > 0;
              }).length})
            </button>
          </div>
        </div>
        
        <hr />
        
        {/* Search input */}
        <div className="mb-4">
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="Search contacts..."
            aria-label="Search contacts by name or phone number"
          />
        </div>

        {/* Contacts list */}
        <div 
          className="d-flex flex-column Contacts g-1 pe-2"
          role="list"
          aria-label={`${filteredContacts.length} contact${filteredContacts.length !== 1 ? 's' : ''}`}
        >
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => (
              <div key={contact.id} role="listitem">
                <ContactCard
                  contact={contact}
                  updateContactfn={updateContact}
                  setShowlist={setShowlist}
                />
              </div>
            ))
          ) : (
            <EmptyContacts isFiltered={hasFilters} />
          )}
        </div>
      </div>
    </div>
  );
});

Contacts.displayName = 'Contacts';

export default Contacts;
