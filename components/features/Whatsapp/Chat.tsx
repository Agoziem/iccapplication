import React, { useState } from "react";
import ChatInput from "../../custom/Inputs/ChatInput";
import ProfileimagePlaceholders from "../../custom/ImagePlaceholders/ProfileimagePlaceholders";
import ChatBody from "./ChatBody";
import { useWhatsappAPIContext } from "@/data/whatsappAPI/WhatsappContext";
import { BsThreeDotsVertical, BsWhatsapp } from "react-icons/bs";

/**
 * Holds all the
 * @param {{showlist:boolean,
 * setShowlist:(value:boolean)=> void,}} props
 * @returns {JSX.Element}
 */
const Chat = ({ showlist, setShowlist }) => {
  const { selectedContact } = useWhatsappAPIContext();

  return (
    <div
      className={`rounded ps-0 ps-md-4 mt-4 mb-4 ${
        showlist ? "d-none d-md-block" : "d-block"
      }`}
      style={{
        minHeight: "100vh",
      }}
    >
      {selectedContact ? (
        <div className="d-flex align-items-center">
          <h6
            className={`my-3 d-block d-md-none ${
              showlist ? "d-none d-md-block" : ""
            }`}
            style={{ cursor: "pointer" }}
            onClick={() => {
              setShowlist(true);
            }}
          >
            <BsThreeDotsVertical
              className="me-3"
              style={{ fontSize: "1.3rem" }}
            />
          </h6>
          <div className="flex-fill d-flex">
            <ProfileimagePlaceholders firstname="John" />
            <div className="ms-3">
              <h5>{selectedContact.profile_name}</h5>
              <p className="text-primary small my-0">{selectedContact.wa_id}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center mt-4">
          <div className="mb-2">
            <BsWhatsapp
              style={{
                fontSize: "3.5rem",
                color: "var(--bgDarkerColor)",
              }}
            />
          </div>
          No contact selected
        </div>
      )}

      {/* the message */}
      <div className="position-relative">
        <ChatBody />

        {/* the reply */}
        <div className="mt-3">
          <ChatInput contact={selectedContact} />
        </div>
      </div>
    </div>
  );
};

export default Chat;
