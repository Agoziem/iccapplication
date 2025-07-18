"use client";
import React, { useState } from "react";
import EmailMessaging from "./EmailMessaging";
import WhatsappMessaging from "./WhatsappMessaging";
import NotificationMessages from "./NotificationMessages";

const Messaging = () => {
  const Templates = ["Emails", "WhatsApp", "Alerts & Notifications"];
  const [selectedTab, setSelectedTab] = useState(Templates[0]); // Default to the first tab

  // Function to render content based on selected tab
  const renderContent = () => {
    switch (selectedTab) {
      case "Emails":
        return <EmailMessaging />;
      case "WhatsApp":
        return <WhatsappMessaging />;
      case "Alerts & Notifications":
        return <NotificationMessages />;
      default:
        return <EmailMessaging />;
    }
  };

  return (
    <div className="py-3">
      <h4>Template Messages</h4>
      <div className="d-flex gap-2">
        {Templates.map((template) => (
          <div
            key={template}
            className={`badge ${
              selectedTab === template ? "bg-primary text-white" : "bg-secondary-light text-secondary"
            } mt-2 p-2 px-3`}
            style={{
              cursor: "pointer",
            }}
            onClick={() => setSelectedTab(template)} // Set the clicked tab as the selected one
          >
            {template}
          </div>
        ))}
      </div>
      
      {/* Render the selected tab content */}
      <div className="mt-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default Messaging;
