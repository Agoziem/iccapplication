"use client";
import React, { useState } from "react";
import EmailBody from "./EmailBody";
import Messages from "./Messages";
import { Email } from "@/types/emails";

const EmailContainer = () => {
  const [selectedMessage, setSelectedMessage] = useState<Email | null>(null);
  const [showlist, setShowlist] = useState(true);
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

export default EmailContainer;
