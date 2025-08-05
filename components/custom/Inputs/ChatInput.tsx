import React, { useState, useRef, ChangeEvent, FormEvent } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { ImAttachment } from "react-icons/im";
import { WAMessageDefault } from "@/constants";
import ChatAttachments from "../../features/Whatsapp/ChatAttachments";
import AttachmentInput from "./AttachmentInput";
import ExtendableTextarea from "./ExtendableTextarea";
import { useWhatsappAPIContext } from "@/data/WhatsappContext";
import { useSendWAMessage } from "@/data/whatsapp.hook";

interface ChatInputProps {
  contact: {
    id: string;
    [key: string]: any;
  };
}

const ChatInput: React.FC<ChatInputProps> = ({ contact }) => {
  const [hasAttachment, setHasAttachment] = useState<boolean>(false);
  const [messageBody, setMessageBody] = useState<string>("");
  const [fileName, setFileName] = useState<string>("No Selected file");
  const [video, setVideo] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { fileInputRef, imageInputRef, videoInputRef } =
    useWhatsappAPIContext();

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setMessageBody(e.target.value);
  };

  const { mutateAsync: sendWAMessage } = useSendWAMessage();
  const handleSubmission = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!messageBody.trim()) {
      return;
    }

    const messagetosubmit = {
      ...WAMessageDefault,
      body: messageBody,
      contact: parseInt(contact.id),
      message_mode: "sent" as const,
    };

    setIsSubmitting(true);
    try {
      setMessageBody("");
      setIsSubmitting(false);
      await sendWAMessage(messagetosubmit);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const handleFileChange = ({ target: { files } }: ChangeEvent<HTMLInputElement>): void => {
    const file = files?.[0];
    if (file) {
      if (file.size > 64 * 1024 * 1024) {
        console.log("file size exceeded");
        return;
      }
      setFileName(file.name);
      setFileType(file.type);
      if (file.type.startsWith("image/")) {
        setImage(URL.createObjectURL(file));
        setVideo(null);
        setFile(null);
      } else if (file.type.startsWith("video/")) {
        setVideo(URL.createObjectURL(file));
        setImage(null);
        setFile(null);
      } else {
        setFile(URL.createObjectURL(file));
        setImage(null);
        setVideo(null);
      }
      setHasAttachment(true);
    }
  };

  const handleRemoveFile = (): void => {
    setFileName("No Selected file");
    setFileType(null);
    setImage(null);
    setVideo(null);
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (imageInputRef.current) imageInputRef.current.value = "";
    if (videoInputRef.current) videoInputRef.current.value = "";
    setHasAttachment(false);
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
                    cursor: "pointer",
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
              />

              {/* Hidden Image input */}
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />

              {/* Hidden Video input */}
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                hidden
                onChange={handleFileChange}
              />

              {/* Submit button */}
              {messageBody.trim().length > 0 && (
                <button
                  className="btn btn-sm btn-primary rounded"
                  type="submit"
                  disabled={isSubmitting}
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
            fileName={fileName}
            video={video}
            image={image}
            file={file}
            type={fileType || undefined}
            resetinput={handleRemoveFile}
          />
        ))}
    </>
  );
};

export default ChatInput;
