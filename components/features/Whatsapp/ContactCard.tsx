import React, { useCallback, useEffect, useState } from "react";
import ProfileimagePlaceholders from "../../custom/ImagePlaceholders/ProfileimagePlaceholders";
import "./whatsapp.css";
import { useWhatsappAPIContext } from "@/providers/context/WhatsappContext";

/**
 * @param {{ contact: WAContact,
 * updateContactfn:(contact:WAContact) => Promise<void>,
* setShowlist:(value:boolean)=> void,
 * }} props
 * @returns {JSX.Element}
 */

const ContactCard = ({ contact, updateContactfn, setShowlist }) => {
  const { setSelectedContact } = useWhatsappAPIContext();

  // ------------------------------------------------------
  // handle contact click
  // ------------------------------------------------------
  const handleContactClick = async () => {
    try {
      await updateContactfn(contact);
      setSelectedContact(contact);
      setShowlist(false)
    } catch (error) {
      console.error("Error handling contact click:", error);
    }
  };

  // ------------------------------------------------------
  // Function to shorten the message body
  // ------------------------------------------------------
  const shortenBody = (body, length = 18) => {
    if (!body) return "";
    return body.length > length ? `${body.slice(0, length)}...` : body;
  };

  return (
    <div className="ContactCard card p-3 pt-4" onClick={handleContactClick}>
      <div className="d-flex">
        <ProfileimagePlaceholders firstname={contact.profile_name} />
        <div className="flex-fill ms-3">
          <div className="d-flex justify-content-between">
            <h6>{contact.profile_name}</h6>
            <p
              className={`small ${
                contact.unread_message_count === 0
                  ? "text-primary"
                  : "text-secondary"
              } mb-1`}
            >
              {contact?.last_message
                ? new Date(contact.last_message.timestamp).toLocaleTimeString(
                    [],
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )
                : ""}
            </p>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <div className="mb-0">
              {shortenBody(contact?.last_message?.body)}
            </div>
            {contact?.unread_message_count > 0 && (
              <span className="badge bg-secondary rounded-pill flex-shrink-0">
                {contact?.unread_message_count}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
