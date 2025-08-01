import { FaCircle } from "react-icons/fa";
import "./Email.css";
import React from "react";

interface EmailMessage {
  id?: number;
  subject?: string;
  sender?: string;
  content?: string;
  timestamp?: string;
  name?: string;
  email?: string;
  message?: string;
  read?: boolean;
  [key: string]: any;
}

interface MessageCardProps {
  message: EmailMessage;
  selectMessage: (value: EmailMessage) => void;
  updateMessagefn: (message: EmailMessage) => Promise<void>;
  setShowlist: (value: boolean) => void;
}

const MessageCard: React.FC<MessageCardProps> = ({ message, selectMessage, updateMessagefn, setShowlist }) => {
  const handleClick = async () => {
    await updateMessagefn(message);
    selectMessage(message);
    setShowlist(false)
  };
  return (
    <div
      className="EmailCard card p-3 pt-4"
      style={{ cursor: "pointer" }}
      onClick={() => {
        handleClick();
      }}
    >
      {/* message details */}
      <div className="d-flex">
        <div className="flex-fill">
          <h6 className={`mb-0 ${!message.read ? "text-secondary" : ""}`}>
            {message.name}
            {!message.read ? (
              <FaCircle className="ms-3 text-secondary" />
            ) : null}
          </h6>
          <p className="fw-bold my-1">{message.subject}</p>
        </div>
        <div>
          <p className="text-muted mt-1">{message.created_at}</p>
        </div>
      </div>
      {/* shortened message */}
      <div>
        <p className="text-muted mt-1">
          {(message.message?.length ?? 0) > 100
            ? `${message.message?.slice(0, 100)}...`
            : message.message || ""}
        </p>
      </div>
    </div>
  );
};

export default MessageCard;
