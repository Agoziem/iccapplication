import React, { useCallback, memo } from "react";
import { FaCircle } from "react-icons/fa";
import "./Email.css";
import moment from "moment";
import { Email } from "@/types/emails";

interface MessageCardProps {
  message: Email | null;
  selectMessage: (message: Email | null) => void;
  updateMessagefn?: (message: Email) => Promise<void>;
  setShowlist: (show: boolean) => void;
}

const MessageCard: React.FC<MessageCardProps> = memo(({ 
  message, 
  selectMessage, 
  updateMessagefn, 
  setShowlist 
}) => {
  // Validate required props
  if (!message || !message.id) {
    console.warn('MessageCard: Invalid message data provided');
    return null;
  }

  // Safe property extraction with fallbacks
  const messageId = message.id;
  const senderName = message.name || 'Unknown Sender';
  const subject = message.subject || 'No Subject';
  const messageText = message.message || '';
  const createdAt = message.created_at || '';
  const isRead = Boolean(message.read);


  // Safe click handler with error handling
  const handleClick = useCallback(async () => {
    try {
      // Validate required functions
      if (typeof selectMessage !== 'function') {
        console.error('selectMessage function not provided');
        return;
      }

      if (typeof setShowlist !== 'function') {
        console.error('setShowlist function not provided');
        return;
      }

      // Update message if unread and updateMessagefn is provided
      if (!isRead && typeof updateMessagefn === 'function') {
        try {
          const updatedMessage = { ...message, read: true };
          await updateMessagefn(updatedMessage);
        } catch (error) {
          console.error('Error updating message:', error);
          // Continue with selection even if update fails
        }
      }

      // Select message and hide list on mobile
      selectMessage(message);
      setShowlist(false);
    } catch (error) {
      console.error('Error handling message click:', error);
    }
  }, [message, selectMessage, updateMessagefn, setShowlist, isRead]);

  // Truncate message text safely
  const getTruncatedMessage = useCallback((text: string) => {
    if (!text) return 'No content';
    
    const maxLength = 100;
    if (text.length <= maxLength) return text;
    
    return `${text.slice(0, maxLength)}...`;
  }, []);

  // Memoize truncated message and formatted date to prevent recalculation
  const truncatedMessage = React.useMemo(() => getTruncatedMessage(messageText), [messageText, getTruncatedMessage]);
  
  const formattedDate = React.useMemo(() => {
    if (!createdAt) return 'Unknown date';
    const momentDate = moment(createdAt);
    return momentDate.isValid() ? momentDate.format('MMM D, h:mm A') : 'Invalid date';
  }, [createdAt]);

  const dateTitle = React.useMemo(() => {
    if (typeof createdAt === 'string') return createdAt;
    if (createdAt instanceof Date) return createdAt.toISOString();
    return 'Unknown date';
  }, [createdAt]);

  return (
    <div
      className="EmailCard card p-3 pt-4"
      style={{ cursor: "pointer" }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`Message from ${senderName}: ${subject}`}
    >
      {/* Message details */}
      <div className="d-flex">
        <div className="flex-fill">
          <h6 className={`mb-0 ${!isRead ? "text-secondary" : ""}`}>
            {senderName}
            {!isRead && (
              <FaCircle 
                className="ms-3 text-secondary" 
                style={{ fontSize: '0.5rem' }}
                aria-label="Unread message"
              />
            )}
          </h6>
          <p className="fw-bold my-1" title={subject}>
            {subject}
          </p>
        </div>
        <div>
          <p className="text-muted mt-1 small" title={dateTitle}>
            {formattedDate}
          </p>
        </div>
      </div>
      
      {/* Message preview */}
      <div>
        <p className="text-muted mt-1" title={messageText}>
          {truncatedMessage}
        </p>
      </div>
    </div>
  );
});

MessageCard.displayName = 'MessageCard';

export default MessageCard;
