"use client";
import React, { useState, useCallback, useMemo } from "react";
import EmailMessaging from "./EmailMessaging";
import WhatsappMessaging from "./WhatsappMessaging";
import NotificationMessages from "./NotificationMessages";

/**
 * Enhanced Messaging component with comprehensive error handling and accessibility
 * Manages template messaging for emails, WhatsApp, and notifications
 * Optimized with React.memo for performance
 */
const Messaging: React.FC = React.memo(() => {
  const Templates = useMemo(() => ["Emails", "WhatsApp", "Alerts & Notifications"], []);
  const [selectedTab, setSelectedTab] = useState<string>(Templates[0]);

  // Safe tab selection handler
  const handleTabSelect = useCallback((template: string) => {
    if (typeof template === 'string' && Templates.includes(template)) {
      setSelectedTab(template);
    }
  }, [Templates]);

  // Safe content rendering with error boundaries
  const renderContent = useCallback(() => {
    try {
      switch (selectedTab) {
        case "Emails":
          return <EmailMessaging />;
        case "WhatsApp":
          return <WhatsappMessaging />;
        case "Alerts & Notifications":
          return <NotificationMessages />;
        default:
          return <EmailMessaging />; // Fallback to emails
      }
    } catch (error) {
      console.error("Error rendering messaging content:", error);
      return (
        <div className="alert alert-danger" role="alert">
          <h6>Unable to load messaging content</h6>
          <p>Please refresh the page and try again.</p>
        </div>
      );
    }
  }, [selectedTab]);

  return (
    <div className="py-3">
      <h4>Template Messages</h4>
      
      {/* Tab Navigation */}
      <nav aria-label="Messaging template tabs" role="tablist">
        <div className="d-flex gap-2 flex-wrap">
          {Templates.map((template) => (
            <button
              key={template}
              type="button"
              role="tab"
              aria-selected={selectedTab === template}
              aria-controls={`${template}-panel`}
              className={`badge ${
                selectedTab === template 
                  ? "bg-primary text-white" 
                  : "bg-secondary-light text-secondary"
              } mt-2 p-2 px-3 border-0`}
              style={{
                cursor: "pointer",
                transition: "all 0.2s ease-in-out"
              }}
              onClick={() => handleTabSelect(template)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleTabSelect(template);
                }
              }}
            >
              {template}
            </button>
          ))}
        </div>
      </nav>
      
      {/* Tab Content */}
      <div 
        className="mt-4"
        id={`${selectedTab}-panel`}
        role="tabpanel"
        aria-labelledby={`${selectedTab}-tab`}
      >
        {renderContent()}
      </div>
    </div>
  );
});

// Add display name for debugging
Messaging.displayName = 'Messaging';

export default Messaging;
