"use client";
import React, { useState, useCallback } from "react";
import Contacts from "./Contacts";
import Chat from "./Chat";

/**
 * Enhanced WhatsappContainer component with comprehensive type safety
 * Main container component that manages the WhatsApp chat interface layout
 * Handles responsive design with showlist state for mobile/desktop views
 * Optimized with React.memo and proper TypeScript typing
 */
const WhatsappContainer: React.FC = React.memo(() => {
  // State to control mobile/desktop layout
  const [showlist, setShowlist] = useState<boolean>(true);

  return (
    <div className="row mt-1" role="main" aria-label="WhatsApp chat interface">
      {/* Contacts Panel */}
      <div 
        className="col-md-4"
        role="complementary"
        aria-label="Contacts list"
      >
        <Contacts 
          showlist={showlist} 
          setShowlist={setShowlist} 
        />
      </div>
      
      {/* Chat Panel */}
      <div 
        className="col-md-8"
        role="main"
        aria-label="Chat conversation"
      >
        <Chat 
          showlist={showlist} 
          setShowlist={setShowlist} 
        />
      </div>
    </div>
  );
});

WhatsappContainer.displayName = 'WhatsappContainer';

export default WhatsappContainer;
