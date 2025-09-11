import React, { useMemo, useCallback } from "react";
import { useFetchSentEmails } from "@/data/Emails/emails.hook";
import EmailForm from "./EmailForm";
import { TbMessageCancel } from "react-icons/tb";
import { PulseLoader } from "react-spinners";
import moment from "moment";

/**
 * Enhanced EmailMessaging component with comprehensive error handling and safety checks
 * Manages email template creation and displays sent email templates
 */
const EmailMessaging = () => {
  // Fetch sent emails with error handling
  const { 
    data: sentemails, 
    isLoading, 
    error 
  } = useFetchSentEmails();

  // Safe email data processing
  const emailsData = useMemo(() => {
    if (!sentemails || !Array.isArray(sentemails)) return [];
    
    return sentemails.filter(email => email && typeof email === 'object');
  }, [sentemails]);


  // Safe text truncation
  const truncateText = useCallback((text, maxLength = 100) => {
    if (!text || typeof text !== 'string') return 'No content';
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  }, []);

  // Status component with proper validation
  const statusComponent = useCallback((emailstatus) => {
    const statusMap = {
      pending: {
        className: "bg-secondary-light text-secondary",
        text: "sending emails",
        icon: <PulseLoader size={7} color={"#e88504"} loading={true} />,
      },
      sent: {
        className: "bg-success-light text-success",
        text: "Emails Sent",
        icon: <i className="ms-1 bi bi-send-check" />,
      },
      failed: {
        className: "bg-danger-light text-danger",
        text: "failed",
        icon: <i className="ms-1 bi bi-exclamation-triangle-fill" />,
      },
    };

    const status = statusMap[emailstatus] || statusMap.failed;

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
          <span className="visually-hidden">Loading email templates...</span>
        </div>
        <span className="ms-3">Loading email templates...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="alert alert-danger">
        <h6>Error Loading Email Templates</h6>
        <p>Unable to load sent emails. Please try again later.</p>
        <small>Error: {error.message || 'Unknown error'}</small>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex flex-column flex-md-row gap-5">
        {/* Email Template Form */}
        <div>
          <h5>Email Templates</h5>
          <div className="card my-3 p-3 px-md-4 py-4">
            <EmailForm />
          </div>
        </div>

        {/* Sent Email Templates */}
        <div className="flex-fill d-flex flex-column gap-1 px-3">
          <h5 className="text-center mb-3">
            Sent Templates
            {emailsData.length > 0 && (
              <span className="badge bg-primary ms-2">{emailsData.length}</span>
            )}
          </h5>

          {/* Email Templates List */}
          {emailsData.length > 0 ? (
            <div className="d-flex flex-column gap-3">
              {emailsData.map((sentemail) => {
                const emailKey = sentemail.id || sentemail.created_at || Math.random();
                const emailSubject = sentemail.subject || 'No Subject';
                const emailBody = sentemail.body || 'No content';
                const emailDate = sentemail.created_at || '';
                const emailStatus = sentemail.status || 'unknown';

                return (
                  <div key={emailKey} className="card p-4">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="mb-1 flex-grow-1">
                        {emailSubject}
                      </h6>
                      <span
                        className="small text-nowrap ms-2"
                        style={{
                          color: "var(--bgDarkerColor)",
                        }}
                      >
                        {moment(emailDate).format("MMM D, YYYY h:mm A") || 'Unknown Date'}
                      </span>
                    </div>
                    
                    <p className="mb-3 text-muted">
                      {truncateText(emailBody)}
                    </p>
                    
                    <div className="d-flex justify-content-end">
                      {statusComponent(emailStatus)}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Empty state
            <div className="mx-auto text-center py-5">
              <TbMessageCancel
                className="mb-3"
                style={{
                  fontSize: "4rem",
                  color: "var(--bgDarkerColor)",
                }}
              />
              <h6 className="text-muted mb-2">No Email Templates Found</h6>
              <p className="text-muted small">
                Create your first email template using the form on the left.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailMessaging;
