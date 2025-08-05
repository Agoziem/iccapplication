"use client";
import React, {
  createContext,
  useState,
  useContext,
  useRef,
  ReactNode,
  RefObject,
} from "react";
import { Contact } from "@/types/whatsapp";

// Types for context
interface WhatsappAPIContextType {
  selectedContact: Contact | null;
  setSelectedContact: (contact: Contact | null) => void;
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

const WhatsappAPIProvider: React.FC<WhatsappAPIProviderProps> = ({
  children,
}) => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
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

  return (
    <WhatsappAPIContext.Provider
      value={{
        selectedContact, // selected contact
        setSelectedContact, // set the selected contact
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
    throw new Error(
      "useWhatsappAPIContext must be used within a WhatsappAPIProvider"
    );
  }
  return context;
};

export { WhatsappAPIProvider, useWhatsappAPIContext };
