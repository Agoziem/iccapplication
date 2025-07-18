
import { TbBrandWhatsapp } from "react-icons/tb";
import WATemplateForm from "./WhatsappForm";
import { PulseLoader } from "react-spinners";
import { useGetSentTemplates } from "@/data/whatsappAPI/whatsapp.hook";

const WhatsappMessaging = () => {
  // fetch all the messages and populate cache
  const {
    data: senttemplatemessages,
    isLoading,
    error,
  } = useGetSentTemplates()

  
  /**
 * @param {string} messagestatus
 */
  const statusComponent = (messagestatus) => {
    switch (messagestatus) {
      case "pending":
        return (
          <span className="d-inline-flex align-items-center justify-content-between gap-2 badge bg-secondary-light text-secondary px-3 py-2">
            {messagestatus === "pending" && "sending message"}
            <PulseLoader size={7} color={"#e88504"} loading={true} />
          </span>
        );
      case "sent":
        return (
          <span className="d-inline-flex align-content-center justify-content-between badge bg-success-light text-success px-3 py-2">
            {messagestatus === "sent" && "Message Sent" }
            <i className="ms-1 bi bi-send-check"></i>
          </span>
        );

      case "failed":
        return (
          <span className="d-inline-flex align-content-center justify-content-between badge bg-danger-light text-danger px-3 py-2">
            {messagestatus}
            <i className="ms-1 bi bi-exclamation-triangle-fill"></i>
          </span>
        );
    }
  };
  return (
    <div>
      <div className="d-flex flex-column flex-md-row gap-5">
        {/* Message Form */}
        <div>
          <h5>Whatsapp Template Message</h5>
          <div className="card my-3 p-3 px-md-4 py-4">
            <WATemplateForm />
          </div>
        </div>

        {/* All Sent Messages */}
        <div className="flex-fill d-flex flex-column gap-1 px-3">
          <h5 className="text-center mb-3">Sent Messages</h5>
          {isLoading && (
            <div className=" d-flex align-items-center justify-content-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {senttemplatemessages?.length > 0
            ? senttemplatemessages.map((sentmessage) => (
                <div key={sentmessage.id} className="card p-4 py-4">
                  <div className="d-flex justify-content-between">
                    <h6 className="mb-1">
                      {sentmessage.title}
                    </h6>
                    <span
                      className="small"
                      style={{
                        color: "var(--bgDarkerColor)",
                      }}
                    >
                      {new Date(sentmessage.created_at).toLocaleTimeString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p>
                    {sentmessage.text?.length > 100
                      ? `${sentmessage.text.slice(0, 100)}...`
                      : sentmessage.text}
                  </p>
                  <div className="d-flex justify-content-end">
                    {statusComponent(sentmessage.status)}
                  </div>
                </div>
              ))
            : !isLoading && (
                <div className="mx-auto">
                  <div className="text-center">
                    <TbBrandWhatsapp
                      className="mb-2"
                      style={{
                        fontSize: "3.5rem",
                        color: "var(--bgDarkerColor)",
                      }}
                    />
                    <p>No Sent WA Template found</p>
                  </div>
                </div>
              )}

          {error && <div>An error just occured, please try again later</div>}
        </div>
      </div>
    </div>
  );
};

export default WhatsappMessaging;
