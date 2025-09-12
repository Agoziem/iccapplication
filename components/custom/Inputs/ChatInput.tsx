import React, { useState, useRef } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { ImAttachment } from "react-icons/im";
import { WAMessageDefault } from "@/data/constants";
import ChatAttachments from "../../features/Whatsapp/ChatAttachments";
import AttachmentInput from "./AttachmentInput";
import ExtendableTextarea from "./ExtendableTextarea";
import { useWhatsappAPIContext } from "@/providers/context/WhatsappContext";
import { useSendWAMessage } from "@/data/hooks/whatsapp.hooks";

/**
 * @param {{contact: WAContact}} props
 * @returns {JSX.Element}
 */
const ChatInput = ({ contact }) => {
  const [hasAttachment, setHasAttachment] = useState(false);
  const [messageBody, setMessageBody] = useState(""); // Manage input with useState
  const [fileName, setFileName] = useState("No Selected file");
  const [video, setVideo] = useState(null);
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { fileInputRef, imageInputRef, videoInputRef } =
    useWhatsappAPIContext();

  // Handle input change
  const handleInputChange = (e) => {
    setMessageBody(e.target.value);
  };

  // Handle message submission
  const { mutateAsync:sendWAMessage } = useSendWAMessage();
  const handleSubmission = async (e) => {
    e.preventDefault();
    if (!messageBody.trim()) {
      return;
    }

    /** @type {WAMessage} */
    const messagetosubmit = {
      ...WAMessageDefault,
      body: messageBody,
      contact: contact.id,
      message_mode: "sent",
    };

    setIsSubmitting(true);
    try {
      setMessageBody(""); // Clear the input field after submitting
      setIsSubmitting(false);
      await sendWAMessage(messagetosubmit);
    } catch (error) {
      console.log(error.message);
    }
  };

  // Handle file select
  const handleFileChange = ({ target: { files } }) => {
    const file = files[0];
    if (file) {
      if (file.size > 64 * 1024 * 1024) {
        console.log("file size exceeded");
        // add an error modal later
        return;
      }
      // remove the error modal by timeout
      setFileName(file.name);
      setFileType(file.type);
      // Corrected file type checks
      if (file.type.startsWith("image/")) {
        setImage(URL.createObjectURL(file)); // If it's an image
        setVideo(null);
        setFile(null);
      } else if (file.type.startsWith("video/")) {
        setVideo(URL.createObjectURL(file)); // If it's a video
        setImage(null);
        setFile(null);
      } else {
        setFile(URL.createObjectURL(file)); // If it's another file type
        setImage(null);
        setVideo(null);
      }
      setHasAttachment(true);
    }
  };

  // Handle file unselect
  const handleRemoveFile = () => {
    setFileName("No Selected file");
    setFileType(null);
    setImage(null);
    setVideo(null);
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
    if (imageInputRef.current) imageInputRef.current.value = null;
    if (videoInputRef.current) videoInputRef.current.value = null;
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
            type={fileType}
            resetinput={handleRemoveFile}
          />
        ))}
    </>
  );
};

export default ChatInput;
