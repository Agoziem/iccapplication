"use client";
import React, { createContext, useState, useContext, useRef } from "react";
import axios from "axios";

// ------------------------------------------------------
// Create the context
// ------------------------------------------------------
const WhatsappAPIContext = createContext(null);

const WhatsappAPIProvider = ({ children }) => {
  /** @type {[WAContact,(value:WAContact)=> void]} */
  const [selectedContact, setSelectedContact] = useState(null);
  const [atthebottom, setAtthebottom] = useState(false);

  // ------------------------------------------------------
  // Reference to the bottom of the chat messages
  // ------------------------------------------------------
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  // ------------------------------------------------------
  // function that scrolls to the bottom of the chat messages
  // ------------------------------------------------------
  const scrollToBottom = () => {
    bottomRef.current.scrollIntoView({ behavior: "smooth" });
    setAtthebottom(true);
  };

  // ------------------------------------------------------
  // Send WhatsApp Template message
  // ------------------------------------------------------
  const sendWhatsappTemplateMessage = async (
    to_phone_number,
    template_name,
    language_code = "en_US"
  ) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/whatsappAPI/send-template-message/`,
        {
          to_phone_number,
          template_name,
          language_code,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to send WhatsApp message", error);
      return { status: "error", message: error.response.data };
    }
  };

 

  return (
    <WhatsappAPIContext.Provider
      value={{
        selectedContact, // selected contact
        setSelectedContact, // set the selected contact
        sendWhatsappTemplateMessage, // send WhatsApp Template message
        bottomRef, // reference to the bottom of the chat messages
        fileInputRef,
        imageInputRef,
        videoInputRef,
        scrollToBottom, // function that scrolls to the bottom of the chat messages
        atthebottom, // at the bottom of the chat messages
        setAtthebottom, // set at the bottom of the chat messages
      }}
    >
      {children}
    </WhatsappAPIContext.Provider>
  );
};

const useWhatsappAPIContext = () => {
  return useContext(WhatsappAPIContext);
};

export { WhatsappAPIProvider, useWhatsappAPIContext };
