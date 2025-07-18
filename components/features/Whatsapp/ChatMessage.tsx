import { useFetchMedia } from "@/data/whatsappAPI/whatsapp.hook";
import Link from "next/link";
import { BiCheckDouble } from "react-icons/bi";
import { FaRegFileImage } from "react-icons/fa6";

/**
 * Description placeholder
 *
 * @param {{ message: WAMessage; }} props
 * @returns {JSX.Element}
 */
const ChatMessage = ({ message }) => {
  const {
    data: mediaUrl,
    isLoading,
    error,
  } = useFetchMedia(
    message?.media_id,
  )

  const messageTime = new Date(message.timestamp);

  // TODO: Handle Media Messages and let them display well

  return (
    <div
      className={`d-flex mb-3 ${
        message.message_mode === "sent"
          ? "justify-content-end"
          : "justify-content-start"
      }`}
    >
      <div
        style={{
          backgroundColor:
            message.message_mode === "sent"
              ? "var(--secondary)"
              : "var(--bgDarkColor)",
          padding: "10px 15px",
          borderRadius: "20px",
          borderBottomLeftRadius:
            message.message_mode === "sent" ? "20px" : "0",
          borderBottomRightRadius:
            message.message_mode === "received" ? "20px" : "0",
          maxWidth: "70%",
          wordWrap: "break-word",
          color: message.message_mode === "sent" ? "white" : "var(--primary)",
        }}
      >
        {/* // Display the message body if the message type is text */}
        {message.message_type === "text" ? message.body : null}

        {/* // Show a loading spinner while the media is loading */}
        {!error && isLoading && (
          <div className="d-flex justify-content-center mt-2">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {/* // Show a loading error if there is any error */}
        {error && !isLoading && (
          <div className="d-flex justify-content-center mt-2">
            <p className="text-primary">
              an error occured while fetching media
            </p>
          </div>
        )}

        {/* // Display the media if the message type is media */}
        {message.message_type === "image" && mediaUrl && (
          <div className="mt-2">
            <img
              src={mediaUrl}
              alt="media"
              style={{ maxWidth: "70%", borderRadius: "10px" }}
            />
            {message?.caption}
          </div>
        )}

        {/* // Display the media if the message type is media */}
        {message.message_type === "sticker" && mediaUrl && (
          <div className="mt-2">
            <img
              src={mediaUrl}
              alt="media"
              style={{ maxWidth: "70%", borderRadius: "10px" }}
            />
          </div>
        )}

        {/* // Display the media if the message type is media */}
        {message.message_type === "video" && mediaUrl && (
          <div className="mt-2 pt-2">
            <video
              src={mediaUrl}
              controls
              style={{ maxWidth: "70%", borderRadius: "10px" }}
            />
            {message.filename && <h6 className="mt-2">{message.filename}</h6>}
            {message?.caption}
          </div>
        )}

        {/*  // Display the media if the message type is media */}
        {message.message_type === "audio" && mediaUrl && (
          <div className="mt-2">
            <audio controls>
              <source src={mediaUrl} type="audio/mpeg" />
            </audio>
          </div>
        )}

        {/* // Display the media if the message type is media */}
        {message.message_type === "document" && mediaUrl && (
          <div style={{ width: "35vw" }}>
            <div className="mb-2 d-flex pt-2">
              <div>
                <FaRegFileImage
                  className="me-2"
                  style={{
                    fontSize: "1.5rem",
                    color: "var(--primary)",
                  }}
                />
              </div>
              <div>
                {message.filename && (
                  <p className="fw-bold">{message.filename}</p>
                )}
              </div>
            </div>
            <div className="d-flex justify-content-end">
              <Link
                href={mediaUrl}
                className="btn btn-primary mb-2 rounded"
                target="_blank"
                rel="noreferrer"
              >
                download
              </Link>
            </div>

            <div>{message?.caption}</div>
          </div>
        )}

        {/* // Displays the timestamp and whether sent or not */}
        <div className="d-flex justify-content-end">
          <small
            style={{
              color:
                message.message_mode === "sent" ? "white" : "var(--primary)",
              fontSize: "0.7rem",
            }}
          >
            {messageTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}

            {message.message_mode === "sent" && (
              <BiCheckDouble
                className="ms-2"
                style={{
                  fontSize: "1.2rem",
                  color: message.status === "sent" ? "#34B7F1" : "",
                }}
              />
            )}
          </small>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
