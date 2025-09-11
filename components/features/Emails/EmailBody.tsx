import React, { useMemo, useCallback } from "react";
import ProfileimagePlaceholders from "../../custom/ImagePlaceholders/ProfileimagePlaceholders";
import EmailInput from "./EmailInput";
import { MdOutlineMessage } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useFetchOrganization } from "@/data/organization/organization.hook";
import { useFetchResponses } from "@/data/Emails/emails.hook";
import moment from "moment";

/**
 * Enhanced EmailBody component with comprehensive error handling and safety checks
 *
 * @param {{
 * message : Email,
 * selectMessage:(value:Email)=> void,
 * showlist:boolean,
 * setShowlist:(value:boolean)=> void,
 * }} props
 * @returns {JSX.Element}
 */
const EmailBody = ({ message, selectMessage, showlist, setShowlist }) => {
  // Fetch organization data with error handling
  const { 
    data: OrganizationData, 
    isLoading: orgLoading, 
    error: orgError 
  } = useFetchOrganization();

  // Safely get message ID for responses query
  const messageId = message?.id || null;

  // Fetch responses with conditional querying
  const {
    data: emailresponses,
    error: responseerror,
    isLoading: loadingresponse,
  } = useFetchResponses(messageId);

  // Safe property extraction from message
  const messageData = useMemo(() => {
    if (!message) return null;

    return {
      id: message.id,
      name: message.name || 'Unknown Sender',
      email: message.email || 'unknown@example.com',
      subject: message.subject || 'No Subject',
      message: message.message || 'No content',
      createdAt: message.created_at || '',
    };
  }, [message]);

  // Safe property extraction from organization
  const organizationData = useMemo(() => {
    if (!OrganizationData) return null;

    return {
      name: OrganizationData.name || 'Organization',
      logo: OrganizationData.Organizationlogo || '/default-logo.png',
    };
  }, [OrganizationData]);


  // Safe navigation handler
  const handleShowList = useCallback(() => {
    if (typeof setShowlist === 'function') {
      setShowlist(true);
    }
  }, [setShowlist]);

  // Safe responses rendering
  const renderResponses = useCallback(() => {
    if (loadingresponse) {
      return (
        <div className="text-center py-3">
          <div className="spinner-border spinner-border-sm text-primary" role="status">
            <span className="visually-hidden">Loading responses...</span>
          </div>
          <p className="text-muted mt-2">Loading responses...</p>
        </div>
      );
    }

    if (responseerror) {
      return (
        <div className="alert alert-warning">
          <small>Error loading responses: {responseerror.message || 'Unknown error'}</small>
        </div>
      );
    }

    if (!emailresponses || !Array.isArray(emailresponses) || emailresponses.length === 0) {
      return null;
    }

    return emailresponses.map((response, index) => {
      if (!response) return null;

      const responseKey = response.id || response.created_at || index;
      const responseMessage = response.response_message || 'No response content';
      const responseDate = moment(response.created_at).isValid()
        ? moment(response.created_at).format('MMM D, YYYY h:mm A')
        : 'Unknown date';

      return (
        <div key={responseKey} className="mb-4">
          <div className="d-flex mt-4">
            <div className="flex-fill d-flex">
              {organizationData?.logo ? (
                <img
                  src={organizationData.logo}
                  alt="Organization Logo"
                  className="rounded-circle mb-2"
                  style={{ width: "60px", height: "60px", objectFit: "cover" }}
                />
              ) : (
                <div
                  className="rounded-circle mb-2 bg-primary d-flex align-items-center justify-content-center text-white"
                  style={{ width: "60px", height: "60px", fontSize: "1.5rem" }}
                >
                  {organizationData?.name?.charAt(0) || 'O'}
                </div>
              )}
              <div className="ms-2">
                <p className="text-primary small fw-bold my-0">
                  From: {organizationData?.name || 'Organization'}
                </p>
                <p className="text-primary small my-0">
                  Response to: {messageData?.subject || 'No Subject'}
                </p>
              </div>
            </div>
            <div className="d-none d-md-block">
              <p className="text-primary small">{responseDate}</p>
            </div>
          </div>
          <div
            className="mt-2 p-3 rounded text-white"
            style={{
              backgroundColor: "var(--bgDarkerColor)",
            }}
          >
            <p className="mt-2 mx-2 text-white mb-0">
              {responseMessage}
            </p>
          </div>
        </div>
      );
    });
  }, [emailresponses, loadingresponse, responseerror, organizationData, messageData]);

  // Error state for organization loading
  if (orgError && !orgLoading) {
    return (
      <div className="alert alert-warning">
        <h6>Unable to load organization data</h6>
        <p>Some features may not work properly.</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile navigation header */}
      <h6
        className={`my-3 d-block d-md-none ${
          showlist ? "d-none d-md-block" : ""
        }`}
        style={{ cursor: "pointer" }}
        onClick={handleShowList}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleShowList();
          }
        }}
      >
        <BsThreeDotsVertical className="me-2" style={{ fontSize: "1.3rem" }} />
        Messages
      </h6>

      {/* Main email body */}
      <div
        className={`rounded ps-0 ps-md-4 mt-3 ${
          showlist ? "d-none d-md-block" : "d-block"
        }`}
        style={{
          minHeight: "100vh",
        }}
      >
        {/* Message header */}
        {messageData && (
          <div className="d-flex mb-3">
            <div className="flex-fill d-flex">
              <ProfileimagePlaceholders firstname={messageData.name} />
              <div className="ms-2">
                <h5 className="mb-1">{messageData.subject}</h5>
                <p className="text-primary small my-0">From: {messageData.name}</p>
                <p className="text-primary small my-0">
                  Email: {messageData.email}
                </p>
              </div>
            </div>
            <div className="d-none d-md-block">
              <p className="text-primary small">
                {moment(messageData.createdAt).isValid()
                  ? moment(messageData.createdAt).format('MMMM D, YYYY h:mm A')
                  : 'Unknown date'}
              </p>
            </div>
          </div>
        )}

        {/* Message content */}
        <div
          className="mt-3 p-3 rounded text-white d-flex flex-column"
          style={{
            backgroundColor: "var(--bgDarkerColor)",
            minHeight: "30vh",
          }}
        >
          {messageData ? (
            <div className="mt-2 mx-2">
              <p className="text-white mb-0">{messageData.message}</p>
            </div>
          ) : (
            <div className="text-center my-auto px-4">
              <div>
                <MdOutlineMessage
                  className="mb-3"
                  style={{
                    fontSize: "4.5rem",
                    color: "var(--bgColor)",
                  }}
                />
              </div>
              <div>
                No message selected. Select a message to view and respond to the user.
              </div>
            </div>
          )}
        </div>

        {/* Responses */}
        {messageData && renderResponses()}

        {/* Reply input */}
        {messageData && (
          <div className="mt-3">
            <EmailInput message={message} />
          </div>
        )}
      </div>
    </>
  );
};

export default EmailBody;
