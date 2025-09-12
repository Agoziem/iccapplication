import React, { useState, useRef } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { ImAttachment } from "react-icons/im";
import ChatAttachments from "../../features/Whatsapp/ChatAttachments";
import AttachmentInput from "./AttachmentInput";
import ExtendableTextarea from "./ExtendableTextarea";
import { useWhatsappAPIContext } from "@/providers/context/WhatsappContext";
import { useSendWhatsAppMessage } from "@/data/hooks/whatsapp.hooks";
import { WAMessage, Contact } from "@/types/whatsapp";

interface ChatInputProps {
  contact: Contact;
  disabled?: boolean;
}

interface FileState {
  fileName: string;
  fileType: string | null;
  video: string | null;
  image: string | null;
  file: string | null;
}

const ChatInput: React.FC<ChatInputProps> = ({ contact, disabled = false }) => {
  const [hasAttachment, setHasAttachment] = useState<boolean>(false);
  const [messageBody, setMessageBody] = useState<string>("");
  const [fileState, setFileState] = useState<FileState>({
    fileName: "No Selected file",
    fileType: null,
    video: null,
    image: null,
    file: null
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const { fileInputRef, imageInputRef, videoInputRef } = useWhatsappAPIContext();

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageBody(e.target.value);
  };

  // Handle message submission
  const { mutateAsync: sendWAMessage } = useSendWhatsAppMessage();
  
  const handleSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageBody.trim() || disabled) {
      return;
    }

    const messagetosubmit = {
      contactId: contact.id!,
      messageData: {
        message_type: "text" as const,
        body: messageBody,
        message_mode: "sent",
      }
    };

    setIsSubmitting(true);
    try {
      setMessageBody(""); // Clear the input field after submitting
      await sendWAMessage(messagetosubmit);
    } catch (error) {
      console.error("Error sending message:", error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle file select
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const file = files?.[0];
    
    if (!file) return;

    if (file.size > 64 * 1024 * 1024) {
      console.log("file size exceeded");
      // add an error modal later
      return;
    }

    const newFileState: FileState = {
      fileName: file.name,
      fileType: file.type,
      video: null,
      image: null,
      file: null
    };

    // Determine file type and set appropriate URL
    if (file.type.startsWith("image/")) {
      newFileState.image = URL.createObjectURL(file);
    } else if (file.type.startsWith("video/")) {
      newFileState.video = URL.createObjectURL(file);
    } else {
      newFileState.file = URL.createObjectURL(file);
    }

    setFileState(newFileState);
    setHasAttachment(true);
  };

  // Handle file unselect
  const handleRemoveFile = () => {
    setFileState({
      fileName: "No Selected file",
      fileType: null,
      image: null,
      video: null,
      file: null
    });
    
    // Clear file input refs
    if (fileInputRef?.current) fileInputRef.current.value = '';
    if (imageInputRef?.current) imageInputRef.current.value = '';
    if (videoInputRef?.current) videoInputRef.current.value = '';
    
    setHasAttachment(false);
  };

  const handleAttachmentSubmit = async (caption: string) => {
    // Handle attachment submission with caption
    console.log("Submitting attachment with caption:", caption);
    // Add your attachment submission logic here
  };

  return (
    <>
      {contact &&
        (!hasAttachment ? (
          <form onSubmit={handleSubmission}>
            <div
              className="d-flex rounded p-2 align-items-center"
              style={{
                backgroundColor: "var(--bgDarkerColor)",
                borderColor: "var(--bgDarkerColor)",
              }}
            >
              <div className="dropup">
                <ImAttachment
                  className="dropdown-toggle m-2"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{
                    fontSize: "1.3rem",
                    color: "var(--bgColor)",
                    cursor: disabled ? "not-allowed" : "pointer",
                  }}
                />
                <ChatAttachments />
              </div>

              {/* text input for text messages */}
              <ExtendableTextarea
                value={messageBody}
                onChange={handleInputChange}
                placeholder="Type a message"
                className="chatinput form-control"
                disabled={disabled}
                style={{
                  color: "white",
                  backgroundColor: "var(--bgDarkerColor)",
                  borderColor: "var(--bgDarkerColor)",
                }}
              />

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                hidden
                onChange={handleFileChange}
                disabled={disabled}
              />

              {/* Hidden Image input */}
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
                disabled={disabled}
              />

              {/* Hidden Video input */}
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                hidden
                onChange={handleFileChange}
                disabled={disabled}
              />

              {/* Submit button */}
              {messageBody.trim().length > 0 && (
                <button
                  className="btn btn-sm btn-primary rounded"
                  type="submit"
                  disabled={isSubmitting || disabled}
                >
                  {!isSubmitting ? (
                    <AiOutlineSend
                      className="h6 mb-0"
                      style={{
                        fontSize: "1.3rem",
                      }}
                    />
                  ) : (
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  )}
                </button>
              )}
            </div>
          </form>
        ) : (
          <AttachmentInput
            fileName={fileState.fileName}
            video={fileState.video}
            image={fileState.image}
            file={fileState.file}
            type={fileState.fileType}
            resetinput={handleRemoveFile}
            onSubmit={handleAttachmentSubmit}
            disabled={disabled}
          />
        ))}
    </>
  );
};

export default ChatInput;
