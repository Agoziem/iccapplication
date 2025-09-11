"use client";
import React, { useCallback, useEffect, useState } from "react";
import ContactCard from "./ContactCard";
import SearchInput from "../../custom/Inputs/SearchInput";
import "./whatsapp.css";
import { useWhatsappAPIContext } from "@/data/whatsappAPI/WhatsappContext";
import { MdOutlineContacts } from "react-icons/md";
import BackButton from "../../custom/backbutton/BackButton";
import useWebSocket from "@/hooks/useWebSocket";
import { WAContactWebsocketSchema } from "@/schemas/whatsapp";
import { useFetchWAContacts } from "@/data/whatsappAPI/whatsapp.hook";
import { useQueryClient } from "react-query";

/**
 * Holds all the
 * @param {{showlist:boolean,
 * setShowlist:(value:boolean)=> void,}} props
 * @returns {JSX.Element}
 */

const Contacts = ({ showlist, setShowlist }) => {
  const { selectedContact, setSelectedContact } = useWhatsappAPIContext();
  const { isConnected, ws } = useWebSocket(
    `${process.env.NEXT_PUBLIC_DJANGO_WEBSOCKET_URL}/ws/whatsappapiSocket/contacts/`
  );
  const [showUnread, setShowUnread] = useState(false); // State to filter unread messages
  const [searchQuery, setSearchQuery] = useState(""); // State for search input

  // fetch all the contacts
  const {
    data: contacts,
    isLoading,
    error,
  } = useFetchWAContacts();

  // ------------------------------------------
  // Handling WebSocket onmessage event
  // ------------------------------------------
  const queryClient = useQueryClient();
  useEffect(() => {
    if (isConnected && ws) {
      ws.onmessage = (event) => {
        const responseContact = JSON.parse(event.data);
        const validatedcontact =
          WAContactWebsocketSchema.safeParse(responseContact);
  
        // Validate the WebSocket data
        if (!validatedcontact.success) {
          console.log(validatedcontact.error.issues);
          return;
        }
  
        const newContact = validatedcontact.data;
  
        // Define cache key for contacts
        const cacheKey = ["waContacts"];
  
        // Function to sort contacts by `last_message.timestamp`
        const sortContacts = (contacts) =>
          contacts.sort(
            (a, b) =>
              new Date(b.last_message.timestamp).getTime() -
              new Date(a.last_message.timestamp).getTime()
          );
  
        // Handle different operations
        if (newContact.operation === "create") {
          queryClient.setQueryData(cacheKey, (existingContacts = []) => {
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
              // If the contact doesn't exist, just add it to the top
              return sortContacts([newContact.contact, ...existingContacts]);
            }
          });
        }
  
        if (newContact.operation === "update_seen_status") {
          queryClient.setQueryData(cacheKey, (existingContacts = []) =>
            existingContacts.map((contact) =>
              contact.id === newContact.contact.id
                ? newContact.contact
                : contact
            )
          );
        }
      };
    }
  }, [isConnected, ws]);



  // Filter messages based on the `read` state
  let filteredContacts = showUnread
    ? contacts?.filter((contact) => contact.unread_message_count > 0) // Show only unread messages
    : contacts;

  // Filter messages further based on search input
  if (searchQuery) {
    filteredContacts = filteredContacts?.filter((contact) =>
      contact.profile_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (isLoading) {
    return <p>Loading....</p>;
  }

  if (error) {
    return <p>An error just occurred</p>;
  }

  // ----------------------------------------------------------
  // update a Message and populate/update Cache from Websocket
  // -----------------------------------------------------------
  /** @param {WAContact} updatedContact */
  const updateContact = async (updatedContact) => {
    if (updatedContact.unread_message_count !== 0) {
      if (ws && ws.readyState === WebSocket.OPEN) {
        /**@type {WAContactSocket} */
        const payload = {
          operation: "update_seen_status",
          contact: updatedContact,
        };
        ws.send(JSON.stringify(payload));
      } else {
        console.error("WebSocket is not connected.");
      }
    }
  };

  return (
    <div>
      <div className="mb-2">
        <BackButton />
      </div>
      <div
        className={`${!showlist ? "d-none d-md-block" : "d-flex flex-column"} mt-4 mt-md-3`}
      >
        <div className="d-flex flex-wrap">
          <h4 className="flex-fill mb-3">WA Messages</h4>
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
              onClick={() => setShowUnread(true)} // Show only unread messages
            >
              Unread
            </button>
          </div>
        </div>
        <hr />
        <div className="mb-4">
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
        <div className={`d-flex flex-column Contacts g-1 pe-2 `}>
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                updateContactfn={updateContact}
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
              No contacts found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contacts;
