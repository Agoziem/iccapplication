import React, { useCallback } from "react";
import { useWhatsappAPIContext } from "@/providers/context/WhatsappContext";
import { FaArrowDown } from "react-icons/fa6";

/**
 * Enhanced Scrolltobottom component with comprehensive type safety and accessibility
 * Shows a floating button to scroll to the bottom of chat when user scrolls up
 * Optimized with React.memo and proper TypeScript typing
 */
const Scrolltobottom: React.FC = React.memo(() => {
  const { scrollToBottom, atthebottom, setAtthebottom } = useWhatsappAPIContext();

  // Handle scroll to bottom click
  const handleScrollClick = useCallback(() => {
    try {
      scrollToBottom();
      // Optionally set to bottom immediately to hide button
      setAtthebottom(true);
    } catch (error) {
      console.error('Error scrolling to bottom:', error);
    }
  }, [scrollToBottom, setAtthebottom]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleScrollClick();
    }
  }, [handleScrollClick]);

  // Don't render if already at bottom
  if (atthebottom) {
    return null;
  }

  return (
    <button
      className="position-absolute bottom-0 end-0 m-3 z-3 rounded shadow-sm"
      style={{
        backgroundColor: "var(--primary)",
        border: "none",
        padding: "0.75rem",
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
      }}
      onClick={handleScrollClick}
      onKeyDown={handleKeyDown}
      aria-label="Scroll to bottom of chat"
      title="Scroll to bottom"
      type="button"
    >
      <FaArrowDown
        style={{
          fontSize: "1.2rem",
          color: "var(--bgColor)",
        }}
        aria-hidden="true"
      />
    </button>
  );
});

Scrolltobottom.displayName = 'Scrolltobottom';

export default Scrolltobottom;
