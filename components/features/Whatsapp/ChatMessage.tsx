import React, { useMemo } from "react";
import { useWhatsAppMedia } from "@/data/hooks/whatsapp.hooks";
import { WAMessage } from "@/types/whatsapp";
import moment from "moment";
import Link from "next/link";
import { BiCheckDouble } from "react-icons/bi";
import { FaRegFileImage } from "react-icons/fa6";

interface ChatMessageProps {
  message: WAMessage;
}

// Media Loading Component
interface MediaLoadingProps {
  isLoading: boolean;
  error: any;
}

const MediaLoading: React.FC<MediaLoadingProps> = React.memo(({ isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center mt-2" role="status">
        <div className="spinner-border text-primary" aria-label="Loading media">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center mt-2">
        <p className="text-primary mb-0">
          An error occurred while fetching media
        </p>
      </div>
    );
  }

  return null;
});

MediaLoading.displayName = 'MediaLoading';

// Media Components
interface MediaComponentProps {
  mediaUrl: string;
  message: WAMessage;
}

const ImageMedia: React.FC<MediaComponentProps> = React.memo(({ mediaUrl, message }) => (
  <div className="mt-2">
    <img
      src={mediaUrl}
      alt={message.caption || "WhatsApp image"}
      style={{ maxWidth: "70%", borderRadius: "10px" }}
      loading="lazy"
    />
    {message.caption && (
      <div className="mt-2" style={{ fontSize: "0.9rem" }}>
        {message.caption}
      </div>
    )}
  </div>
));

ImageMedia.displayName = 'ImageMedia';

const StickerMedia: React.FC<MediaComponentProps> = React.memo(({ mediaUrl, message }) => (
  <div className="mt-2">
    <img
      src={mediaUrl}
      alt="WhatsApp sticker"
      style={{ maxWidth: "70%", borderRadius: "10px" }}
      loading="lazy"
    />
  </div>
));

StickerMedia.displayName = 'StickerMedia';

const VideoMedia: React.FC<MediaComponentProps> = React.memo(({ mediaUrl, message }) => (
  <div className="mt-2 pt-2">
    <video
      src={mediaUrl}
      controls
      style={{ maxWidth: "70%", borderRadius: "10px" }}
      preload="metadata"
      aria-label={message.caption || "WhatsApp video"}
    >
      Your browser does not support the video tag.
    </video>
    {message.filename && (
      <h6 className="mt-2 fw-semibold">{message.filename}</h6>
    )}
    {message.caption && (
      <div className="mt-2" style={{ fontSize: "0.9rem" }}>
        {message.caption}
      </div>
    )}
  </div>
));

VideoMedia.displayName = 'VideoMedia';

const AudioMedia: React.FC<MediaComponentProps> = React.memo(({ mediaUrl }) => (
  <div className="mt-2">
    <audio controls className="w-100" preload="metadata">
      <source src={mediaUrl} type="audio/mpeg" />
      <source src={mediaUrl} type="audio/ogg" />
      Your browser does not support the audio element.
    </audio>
  </div>
));

AudioMedia.displayName = 'AudioMedia';

const DocumentMedia: React.FC<MediaComponentProps> = React.memo(({ mediaUrl, message }) => (
  <div style={{ minWidth: "250px", maxWidth: "35vw" }}>
    <div className="mb-2 d-flex align-items-center pt-2">
      <FaRegFileImage
        className="me-2 flex-shrink-0"
        style={{
          fontSize: "1.5rem",
          color: "var(--primary)",
        }}
        aria-hidden="true"
      />
      <div className="flex-grow-1">
        {message.filename && (
          <p className="fw-bold mb-0 text-truncate">{message.filename}</p>
        )}
      </div>
    </div>
    <div className="d-flex justify-content-end">
      <Link
        href={mediaUrl}
        className="btn btn-primary mb-2 rounded btn-sm"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Download ${message.filename || 'document'}`}
      >
        Download
      </Link>
    </div>
    {message.caption && (
      <div className="mt-2" style={{ fontSize: "0.9rem" }}>
        {message.caption}
      </div>
    )}
  </div>
));

DocumentMedia.displayName = 'DocumentMedia';

/**
 * Enhanced ChatMessage component with comprehensive type safety and accessibility
 * Displays individual WhatsApp messages with media support and proper formatting
 * Optimized with React.memo and proper TypeScript typing
 */
const ChatMessage: React.FC<ChatMessageProps> = React.memo(({ message }) => {
  // Fetch media data if message has media
  const {
    data: mediaUrl,
    isLoading,
    error,
  } = useWhatsAppMedia(message?.media_id || "");

  // Format message timestamp safely
  const formattedTime = useMemo(() => {
    if (!message.timestamp) return '';
    
    try {
      // Handle both Date objects and timestamp numbers/strings
      let messageTime: Date;
      if (message.timestamp instanceof Date) {
        messageTime = message.timestamp;
      } else if (typeof message.timestamp === 'number') {
        messageTime = new Date(message.timestamp * 1000);
      } else {
        messageTime = new Date(message.timestamp);
      }
      
      return messageTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return '';
    }
  }, [message.timestamp]);

  // Determine message styling
  const isOutgoing = message.message_mode === "sent";
  
  const messageStyle = useMemo(() => ({
    backgroundColor: isOutgoing ? "var(--secondary)" : "var(--bgDarkColor)",
    padding: "10px 15px",
    borderRadius: "20px",
    borderBottomLeftRadius: isOutgoing ? "20px" : "0",
    borderBottomRightRadius: isOutgoing ? "0" : "20px",
    maxWidth: "70%",
    wordWrap: "break-word" as const,
    color: isOutgoing ? "white" : "var(--primary)",
  }), [isOutgoing]);

  // Safe media URL extraction
  const safeMediaUrl = useMemo(() => {
    if (typeof mediaUrl === 'string') return mediaUrl;
    if (mediaUrl && typeof mediaUrl === 'object' && 'url' in mediaUrl) {
      return (mediaUrl as any).url;
    }
    return null;
  }, [mediaUrl]);

  const renderMedia = () => {
    if (!safeMediaUrl) return <MediaLoading isLoading={isLoading} error={error} />;

    switch (message.message_type) {
      case "image":
        return <ImageMedia mediaUrl={safeMediaUrl} message={message} />;
      case "sticker":
        return <StickerMedia mediaUrl={safeMediaUrl} message={message} />;
      case "video":
        return <VideoMedia mediaUrl={safeMediaUrl} message={message} />;
      case "audio":
        return <AudioMedia mediaUrl={safeMediaUrl} message={message} />;
      case "document":
        return <DocumentMedia mediaUrl={safeMediaUrl} message={message} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`d-flex mb-3 ${
        isOutgoing ? "justify-content-end" : "justify-content-start"
      }`}
      role="listitem"
    >
      <div style={messageStyle}>
        {/* Text message content */}
        {message.message_type === "text" && message.body && (
          <div style={{ whiteSpace: "pre-wrap" }}>{message.body}</div>
        )}

        {/* Media content */}
        {message.message_type !== "text" && renderMedia()}

        {/* Message timestamp and status */}
        <div className="d-flex justify-content-end align-items-center mt-1">
          <small
            style={{
              color: isOutgoing ? "rgba(255,255,255,0.7)" : "var(--primary)",
              fontSize: "0.7rem",
            }}
          >
            {formattedTime && (
              <time>
                {formattedTime}
              </time>
            )}
            
            {isOutgoing && (
              <BiCheckDouble
                className="ms-1"
                style={{
                  fontSize: "1.2rem",
                  color: message.status === "sent" ? "#34B7F1" : "rgba(255,255,255,0.5)",
                }}
                aria-label={`Message ${message.status || 'sent'}`}
              />
            )}
          </small>
        </div>
      </div>
    </div>
  );
});

ChatMessage.displayName = 'ChatMessage';

export default ChatMessage;
