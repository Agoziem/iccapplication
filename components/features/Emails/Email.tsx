"use client";
import React, { useState } from "react";
import EmailBody from "./EmailBody";
import Messages from "./Messages";

interface EmailMessage {
  id?: number;
  subject?: string;
  sender?: string;
  content?: string;
  timestamp?: string;
  [key: string]: any;
}

const Email: React.FC = () => {
  const [selectedMessage, setSelectedMessage] = useState<EmailMessage | null>(null);
  const [showlist, setShowlist] = useState<boolean>(true);
  return (
    <div
      className="row justify-content-between"
      style={{
        minHeight: "100vh",
      }}
    >
      <div className="col-12 col-md-5">
        <Messages
          showlist={showlist}
          setShowlist={setShowlist}
          message={selectedMessage}
          selectMessage={setSelectedMessage}
        />
      </div>
      <div className="col-12 col-md-7">
        <EmailBody
          showlist={showlist}
          setShowlist={setShowlist}
          message={selectedMessage}
          selectMessage={setSelectedMessage}
        />
      </div>
    </div>
  );
};

export default Email;
