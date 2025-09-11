
import React, { useMemo, useCallback } from "react";
import { TbBrandWhatsapp } from "react-icons/tb";
import { PulseLoader } from "react-spinners";
import WATemplateForm from "./WhatsappForm";
import { useWhatsAppTemplates } from "@/data/whatsappAPI/whatsapp.hook";
import moment from "moment";

/**
 * Enhanced WhatsappMessaging component with comprehensive error handling and safety checks
 * Manages WhatsApp template creation and displays sent template messages
 */
const WhatsappMessaging = () => {
  // Fetch sent templates with error handling
  const {
    data: senttemplatemessages,
    isLoading,
    error,
  } = useWhatsAppTemplates();

  // Safe template data processing
  const templatesData = useMemo(() => {
    if (!senttemplatemessages || !Array.isArray(senttemplatemessages)) return [];
    
    return senttemplatemessages.filter(template => template && typeof template === 'object');
  }, [senttemplatemessages]);


  // Safe text truncation
  const truncateText = useCallback((text, maxLength = 100) => {
    if (!text || typeof text !== 'string') return 'No content available';
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  }, []);

  // Status component with proper validation
  const statusComponent = useCallback((messagestatus) => {
    const statusMap = {
      pending: {
        className: "bg-secondary-light text-secondary",
        text: "sending message",
        icon: <PulseLoader size={7} color={"#e88504"} loading={true} />,
      },
      sent: {
        className: "bg-success-light text-success",
        text: "Message Sent",
        icon: <i className="ms-1 bi bi-send-check" />,
      },
      failed: {
        className: "bg-danger-light text-danger",
        text: "failed",
        icon: <i className="ms-1 bi bi-exclamation-triangle-fill" />,
      },
    };

    const status = statusMap[messagestatus] || statusMap.failed;

    return (
      <span 
        className={`d-inline-flex align-items-center justify-content-between gap-2 badge ${status.className} px-3 py-2`}
      >
        {status.text}
        {status.icon}
      </span>
    );
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="d-flex align-items-center justify-content-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading WhatsApp templates...</span>
        </div>
        <span className="ms-3">Loading WhatsApp templates...</span>
      </div>
    );
  }

  // Error state
if (error) {
  const errorMessage =
    error && typeof error === "object" && "message" in error
      ? error.message
      : "Unknown error";

  return (
    <div className="alert alert-danger">
      <h6>Error Loading WhatsApp Templates</h6>
      <p>Unable to load sent templates. Please try again later.</p>
      <small>Error: {errorMessage}</small>
    </div>
  );
}


  return (
    <div>
      <div className="d-flex flex-column flex-md-row gap-5">
        {/* WhatsApp Template Form */}
        <div>
          <h5>WhatsApp Template Message</h5>
          <div className="card my-3 p-3 px-md-4 py-4">
            <WATemplateForm />
          </div>
        </div>

        {/* Sent Template Messages */}
        <div className="flex-fill d-flex flex-column gap-1 px-3">
          <h5 className="text-center mb-3">
            Sent Templates
            {templatesData.length > 0 && (
              <span className="badge bg-primary ms-2">{templatesData.length}</span>
            )}
          </h5>

          {/* Templates List */}
          {templatesData.length > 0 ? (
            <div className="d-flex flex-column gap-3">
              {templatesData.map((sentmessage) => {
                const messageKey = sentmessage.id || sentmessage.created_at || Math.random();
                const messageTitle = sentmessage.title || 'No Title';
                const messageText = sentmessage.text || 'No content';
                const messageDate = sentmessage.created_at || '';
                const messageStatus = sentmessage.status || 'unknown';
                const messageTemplate = sentmessage.template || 'unknown';

                return (
                  <div key={messageKey} className="card p-4">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div className="flex-grow-1">
                        <h6 className="mb-1">{messageTitle}</h6>
                        {messageTemplate !== 'unknown' && (
                          <small className="text-muted">
                            Template: {messageTemplate}
                          </small>
                        )}
                      </div>
                      <span
                        className="small text-nowrap ms-2"
                        style={{
                          color: "var(--bgDarkerColor)",
                        }}
                      >
                        {moment(messageDate).format("MMM D, YYYY h:mm A")}
                      </span>
                    </div>
                    
                    <p className="mb-3 text-muted">
                      {truncateText(messageText)}
                    </p>
                    
                    <div className="d-flex justify-content-end">
                      {statusComponent(messageStatus)}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Empty state
            <div className="mx-auto text-center py-5">
              <TbBrandWhatsapp
                className="mb-3"
                style={{
                  fontSize: "4rem",
                  color: "var(--bgDarkerColor)",
                }}
              />
              <h6 className="text-muted mb-2">No WhatsApp Templates Found</h6>
              <p className="text-muted small">
                Create your first WhatsApp template using the form on the left.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhatsappMessaging;
