import React, { useCallback, useMemo } from "react";
import ProfileimagePlaceholders from "../../custom/ImagePlaceholders/ProfileimagePlaceholders";
import { useWhatsappAPIContext } from "@/providers/context/WhatsappContext";
import { Contact } from "@/types/whatsapp";
import "./whatsapp.css";
import moment from "moment";

interface ContactCardProps {
  contact: Contact;
  updateContactfn: (contact: Contact) => Promise<void>;
  setShowlist: (value: boolean) => void;
}

/**
 * Enhanced ContactCard component with comprehensive type safety and accessibility
 * Displays contact information with last message preview and unread count
 * Optimized with React.memo and proper TypeScript typing
 */
const ContactCard: React.FC<ContactCardProps> = React.memo(
  ({ contact, updateContactfn, setShowlist }) => {
    const { setSelectedContact } = useWhatsappAPIContext();

    // Handle contact selection with proper error handling
    const handleContactClick = useCallback(async () => {
      try {
        await updateContactfn(contact);
        setSelectedContact(contact);
        setShowlist(false);
      } catch (error) {
        console.error("Error handling contact click:", error);
      }
    }, [contact, updateContactfn, setSelectedContact, setShowlist]);

    // Handle keyboard navigation
    const handleKeyPress = useCallback(
      (event: React.KeyboardEvent) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleContactClick();
        }
      },
      [handleContactClick]
    );

    // Function to safely shorten the message body
    const shortenBody = useCallback(
      (body: string | undefined, length: number = 18): string => {
        if (!body || typeof body !== "string") return "";
        return body.length > length ? `${body.slice(0, length)}...` : body;
      },
      []
    );

    // Format last message timestamp safely format as 4/34/23
    const formattedTime = useMemo(() => {
      const timestamp = contact?.last_message?.timestamp;
      return moment(timestamp).isValid() ? moment(timestamp).fromNow() : "";
    }, []);

    // Determine unread count display
    const unreadCount = useMemo(() => {
      const count = contact?.unread_message_count;
      if (typeof count === "string") {
        const parsed = parseInt(count, 10);
        return isNaN(parsed) ? 0 : parsed;
      }
      return typeof count === "number" && count > 0 ? count : 0;
    }, [contact?.unread_message_count]);

    // Contact display name with fallback
    const displayName = useMemo(() => {
      return contact?.profile_name || contact?.wa_id || "Unknown Contact";
    }, [contact?.profile_name, contact?.wa_id]);

    return (
      <div
        className="ContactCard card p-3 pt-4 cursor-pointer"
        onClick={handleContactClick}
        onKeyDown={handleKeyPress}
        tabIndex={0}
        role="button"
        aria-label={`Select contact ${displayName}${
          unreadCount > 0 ? `, ${unreadCount} unread messages` : ""
        }`}
      >
        <div className="d-flex">
          <ProfileimagePlaceholders
            firstname={displayName}
            aria-hidden="true"
          />

          <div className="flex-fill ms-3">
            <div className="d-flex justify-content-between align-items-start">
              <h6
                className="mb-1 fw-semibold text-truncate line-clamp-1"
                title={displayName}
                style={{ maxWidth: "150px" }}
              >
                {displayName}
              </h6>
            </div>

            <div>
              <div className="d-flex justify-content-between align-items-center">
                <div className="mb-0 flex-grow-1 me-2 line-clamp-1">
                  <span
                    className="text-muted"
                    style={{ fontSize: "0.85rem" }}
                    title={contact?.last_message?.body || ""}
                  >
                    {shortenBody(contact?.last_message?.body) ||
                      "No messages yet"}
                  </span>
                </div>

                {unreadCount > 0 && (
                  <span
                    className="badge bg-secondary rounded-pill flex-shrink-0"
                    aria-label={`${unreadCount} unread message${
                      unreadCount !== 1 ? "s" : ""
                    }`}
                    style={{ fontSize: "0.7rem" }}
                  >
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </div>
              {formattedTime && (
                <p
                  className={`small ml-auto flex-shrink-0 ${
                    unreadCount === 0 ? "text-primary" : "text-secondary"
                  }`}
                  style={{ fontSize: "0.75rem" }}
                >
                  <time>{formattedTime}</time>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ContactCard.displayName = "ContactCard";

export default ContactCard;
