"use client";
import { useSendTemplateMessage } from "@/data/hooks/whatsapp.hooks";
import { Contact } from "@/types/whatsapp";
import React, { createContext, useState, useContext, useRef, ReactNode, RefObject } from "react";


interface WhatsappAPIContextValue {
  selectedContact: Contact | null;
  setSelectedContact: (contact: Contact | null) => void;
  atthebottom: boolean;
  setAtthebottom: (value: boolean) => void;
  bottomRef: RefObject<HTMLDivElement | null>;
  fileInputRef: RefObject<HTMLInputElement | null>;
  imageInputRef: RefObject<HTMLInputElement | null>;
  videoInputRef: RefObject<HTMLInputElement | null>;
  scrollToBottom: () => void;
  sendWhatsappTemplateMessage: (to_phone_number: string, template_name: string, language_code?: string) => Promise<any>;
}

interface WhatsappAPIProviderProps {
  children: ReactNode;
}

// ------------------------------------------------------
// Create the context
// ------------------------------------------------------
const WhatsappAPIContext = createContext<WhatsappAPIContextValue | null>(null);

const WhatsappAPIProvider: React.FC<WhatsappAPIProviderProps> = ({ children }) => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [atthebottom, setAtthebottom] = useState<boolean>(false);
  const { mutateAsync: sendTemplateMessage } = useSendTemplateMessage(); 

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
      await sendTemplateMessage({ to_phone_number, template_name, language_code });
    } catch (error: any) {
      console.error("Failed to send WhatsApp message", error);
      return { status: "error", message: error.response?.data || error.message };
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

const useWhatsappAPIContext = (): WhatsappAPIContextValue => {
  const context = useContext(WhatsappAPIContext);
  if (!context) {
    throw new Error('useWhatsappAPIContext must be used within a WhatsappAPIProvider');
  }
  return context;
};

export { WhatsappAPIProvider, useWhatsappAPIContext };
