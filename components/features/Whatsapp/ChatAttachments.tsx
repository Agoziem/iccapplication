import React, { useCallback } from "react";
import { useWhatsappAPIContext } from "@/providers/context/WhatsappContext";
import { FaPhotoVideo } from "react-icons/fa";
import { HiOutlineDocument } from "react-icons/hi2";
import { PiImageBold } from "react-icons/pi";

// Attachment option interface
interface AttachmentOption {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  action: () => void;
  ariaLabel: string;
}

/**
 * Enhanced ChatAttachments component with comprehensive type safety and accessibility
 * Provides dropdown menu for selecting different types of file attachments
 * Optimized with React.memo and proper TypeScript typing
 */
const ChatAttachments: React.FC = React.memo(() => {
  const { fileInputRef, imageInputRef, videoInputRef } = useWhatsappAPIContext();

  // Handle document attachment click
  const handleDocumentClick = useCallback((e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (fileInputRef?.current) {
      fileInputRef.current.click();
    } else {
      console.warn('Document file input ref is not available');
    }
  }, [fileInputRef]);

  // Handle image attachment click
  const handleImageClick = useCallback((e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (imageInputRef?.current) {
      imageInputRef.current.click();
    } else {
      console.warn('Image file input ref is not available');
    }
  }, [imageInputRef]);

  // Handle video attachment click
  const handleVideoClick = useCallback((e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (videoInputRef?.current) {
      videoInputRef.current.click();
    } else {
      console.warn('Video file input ref is not available');
    }
  }, [videoInputRef]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((
    e: React.KeyboardEvent<HTMLLIElement>, 
    clickHandler: (e: React.MouseEvent<HTMLLIElement>) => void
  ) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      // Cast the keyboard event to mouse event for the handler
      clickHandler(e as unknown as React.MouseEvent<HTMLLIElement>);
    }
  }, []);

  return (
    <ul 
      className="dropdown-menu" 
      role="menu"
      aria-label="Attachment options"
    >
      {/* Document Attachment */}
      <li
        role="menuitem"
        tabIndex={0}
        style={{ cursor: "pointer" }}
        onClick={handleDocumentClick}
        onKeyDown={(e) => handleKeyDown(e, handleDocumentClick)}
        aria-label="Attach document file"
      >
        <span className="dropdown-item d-flex align-items-center">
          <HiOutlineDocument 
            className="me-2 flex-shrink-0" 
            style={{ fontSize: "1.3rem" }}
            aria-hidden="true"
          />
          <span>Document</span>
        </span>
      </li>

      {/* Image Attachment */}
      <li
        role="menuitem"
        tabIndex={0}
        style={{ cursor: "pointer" }}
        onClick={handleImageClick}
        onKeyDown={(e) => handleKeyDown(e, handleImageClick)}
        aria-label="Attach image or photo"
      >
        <span className="dropdown-item d-flex align-items-center">
          <PiImageBold 
            className="me-2 flex-shrink-0" 
            style={{ fontSize: "1.3rem" }}
            aria-hidden="true"
          />
          <span>Images & Photos</span>
        </span>
      </li>

      {/* Video Attachment */}
      <li
        role="menuitem"
        tabIndex={0}
        style={{ cursor: "pointer" }}
        onClick={handleVideoClick}
        onKeyDown={(e) => handleKeyDown(e, handleVideoClick)}
        aria-label="Attach video file"
      >
        <span className="dropdown-item d-flex align-items-center">
          <FaPhotoVideo 
            className="me-2 flex-shrink-0" 
            style={{ fontSize: "1.3rem" }}
            aria-hidden="true"
          />
          <span>Videos</span>
        </span>
      </li>
    </ul>
  );
});

ChatAttachments.displayName = 'ChatAttachments';

export default ChatAttachments;
