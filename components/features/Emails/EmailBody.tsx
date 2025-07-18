import ProfileimagePlaceholders from "../../custom/ImagePlaceholders/ProfileimagePlaceholders";
import EmailInput from "./EmailInput";
import { MdOutlineMessage } from "react-icons/md";
import { emailAPIendpoint, getResponses } from "@/data/Emails/fetcher";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useFetchOrganization } from "@/data/organization/organization.hook";
import { useFetchResponses } from "@/data/Emails/emails.hook";
/**
 * Holds all the Messages that was sent well paginated with load more button
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
  const { data: OrganizationData } = useFetchOrganization();
  const {
    data: emailresponses,
    error: responseerror,
    isLoading: loadingresponse,
  } = useFetchResponses(message ? message.id : null);

  return (
    <>
      <h6
        className={`my-3 d-block d-md-none ${
          showlist ? "d-none d-md-block" : ""
        }`}
        style={{ cursor: "pointer" }}
        onClick={() => {
          setShowlist(true);
        }}
      >
        <BsThreeDotsVertical className="me-2" style={{ fontSize: "1.3rem" }} />
        messages
      </h6>
      <div
        className={`rounded ps-0 ps-md-4 mt-3 ${
          showlist ? "d-none d-md-block" : "d-block"
        }`}
        style={{
          minHeight: "100vh",
        }}
      >
        {/* the details */}
        {message ? (
          <div className="d-flex">
            <div className="flex-fill d-flex">
              <ProfileimagePlaceholders firstname={message.name} />
              <div className="ms-2">
                <h5>{message.subject}</h5>
                <p className="text-primary small my-0">From: {message.name}</p>
                <p className="text-primary small my-0">
                  message from: {message.email}
                </p>
              </div>
            </div>
            <div className="d-none d-md-block">
              <p className="text-primary">
                {new Date(message.created_at).toLocaleTimeString([], {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ) : null}

        {/* the message */}
        <div
          className="mt-3 p-3 rounded text-white d-flex flex-column"
          style={{
            backgroundColor: "var(--bgDarkerColor)",
            minHeight: "30vh",
          }}
        >
          {message ? (
            <div className="mt-2 mx-2">
              <p className="text-white">{message.message}</p>
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
                No message selected, select a message to view and respond to the
                user
              </div>
            </div>
          )}
        </div>

        {/* Responses */}
        {responseerror && <p>Error loading Response</p>}

        {loadingresponse && <p>loading Responses</p>}

        {emailresponses
          ? emailresponses.map((response) => (
              <div key={response.created_at} className="mb-4 mb-2">
                <div className="d-flex mt-4">
                  <div className="flex-fill d-flex">
                    <img
                      src={OrganizationData.Organizationlogo}
                      alt="Organization Logo"
                      className="rounded-circle mb-2"
                      style={{ width: "60px", height: "auto" }}
                    />
                    <div className="ms-2">
                      <p className="text-primary small fw-bold my-0">
                        From: {OrganizationData.name}
                      </p>
                      <p className="text-primary small my-0">
                        response to: {message.subject}
                      </p>
                    </div>
                  </div>
                  <div className="d-none d-md-block">
                    <p className="text-primary">{response.created_at}</p>
                  </div>
                </div>
                <div
                  className="mt-2 p-3 rounded text-white d-flex flex-column"
                  style={{
                    backgroundColor: "var(--bgDarkerColor)",
                  }}
                >
                  <p className="mt-2 mx-2 text-white">
                    {response.response_message}
                  </p>
                </div>
              </div>
            ))
          : null}

        {/* the reply */}
        {message ? (
          <div className="mt-3">
            <EmailInput message={message} />
          </div>
        ) : null}
      </div>
    </>
  );
};

export default EmailBody;
