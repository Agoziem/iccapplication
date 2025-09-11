import React, { useCallback } from "react";
import { FaCircle } from "react-icons/fa";
import "./Email.css";
import moment from "moment";

/**
 * Enhanced MessageCard component with safety checks and error handling
 * @param {{ message: Email,
 * selectMessage:(value:Email)=> void,
 * updateMessagefn:(message:Email) => Promise<void>
 * setShowlist:(value:boolean)=> void,
 * }} props
 * @returns {JSX.Element}
 */
const MessageCard = ({ message, selectMessage, updateMessagefn, setShowlist }) => {
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

  // Format creation date safely
  const formatDate = useCallback((dateString) => {
    if (!dateString) return 'Unknown date';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      
      // Check if date is today
      const today = new Date();
      const messageDate = new Date(dateString);
      const isToday = today.toDateString() === messageDate.toDateString();
      
      if (isToday) {
        return messageDate.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      }
      
      return messageDate.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Unknown date';
    }
  }, []);

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
  const getTruncatedMessage = useCallback((text) => {
    if (!text) return 'No content';
    
    const maxLength = 100;
    if (text.length <= maxLength) return text;
    
    return `${text.slice(0, maxLength)}...`;
  }, []);

  const truncatedMessage = getTruncatedMessage(messageText);
  const formattedDate = formatDate(createdAt);

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
          <p className="text-muted mt-1 small" title={ typeof createdAt === 'string' ? createdAt : moment(createdAt).format('MMMM Do YYYY, h:mm:ss a') }>
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
};

export default MessageCard;
