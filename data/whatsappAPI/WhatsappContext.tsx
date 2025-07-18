"use client";
import React, { createContext, useState, useContext, useRef, ReactNode, RefObject } from "react";
import axios, { AxiosResponse } from "axios";
import type { WAContact } from "@/types/whatsapp";

// Types for context
interface WhatsappAPIContextType {
  selectedContact: WAContact | null;
  setSelectedContact: (contact: WAContact | null) => void;
  sendWhatsappTemplateMessage: (
    to_phone_number: string,
    template_name: string,
    language_code?: string
  ) => Promise<any>;
  bottomRef: RefObject<HTMLDivElement | null>;
  fileInputRef: RefObject<HTMLInputElement | null>;
  imageInputRef: RefObject<HTMLInputElement | null>;
  videoInputRef: RefObject<HTMLInputElement | null>;
  scrollToBottom: () => void;
  atthebottom: boolean;
  setAtthebottom: (value: boolean) => void;
}

interface WhatsappAPIProviderProps {
  children: ReactNode;
}

// ------------------------------------------------------
// Create the context
// ------------------------------------------------------
const WhatsappAPIContext = createContext<WhatsappAPIContextType | null>(null);

const WhatsappAPIProvider: React.FC<WhatsappAPIProviderProps> = ({ children }) => {
  const [selectedContact, setSelectedContact] = useState<WAContact | null>(null);
  const [atthebottom, setAtthebottom] = useState<boolean>(false);

  // ------------------------------------------------------
  // Reference to the bottom of the chat messages
  // ------------------------------------------------------
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  
  // ------------------------------------------------------
  // function that scrolls to the bottom of the chat messages
  // ------------------------------------------------------
  const scrollToBottom = (): void => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
      setAtthebottom(true);
    }
  };

  // ------------------------------------------------------
  // Send WhatsApp Template message
  // ------------------------------------------------------
  const sendWhatsappTemplateMessage = async (
    to_phone_number: string,
    template_name: string,
    language_code: string = "en_US"
  ): Promise<any> => {
    try {
      const response: AxiosResponse<any> = await axios.post(
        `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/whatsappAPI/send-template-message/`,
        {
          to_phone_number,
          template_name,
          language_code,
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Failed to send WhatsApp message", error);
      return { 
        status: "error", 
        message: error.response?.data || error.message 
      };
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

const useWhatsappAPIContext = (): WhatsappAPIContextType => {
  const context = useContext(WhatsappAPIContext);
  if (!context) {
    throw new Error("useWhatsappAPIContext must be used within a WhatsappAPIProvider");
  }
  return context;
};

export { WhatsappAPIProvider, useWhatsappAPIContext };
