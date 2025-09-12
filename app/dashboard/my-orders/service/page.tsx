"use client";
import { useSearchParams } from "next/navigation";
import PageTitle from "@/components/custom/PageTitle/PageTitle";
import ServicesPlaceholder from "@/components/custom/ImagePlaceholders/ServicesPlaceholder";
import { servicesAPIendpoint } from "@/data/hooks/service.hooks";
import { PulseLoader } from "react-spinners";
import GoogleForm from "@/components/custom/Iframe/googleform";
import { TbNotesOff } from "react-icons/tb";
import { FaBell } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useFetchServiceByToken } from "@/data/services/service.hook";

const ServicePage = () => {
  const searchParams = useSearchParams();
  const servicetoken = searchParams.get("servicetoken");
  const { data: session } = useSession();
  const {
    data: service,
    isLoading: loadingService,
    error: error,
  } = useFetchServiceByToken(
    `${servicesAPIendpoint}/service_by_token/${servicetoken}/`,
    servicetoken
  );

  /** * @param {Service} service */
  const ServiceStatus = (service) => {
    if (
      service.userIDs_whose_services_is_in_progress.includes(session?.user.id)
    ) {
      return (
        <div className="badge bg-secondary-light text-secondary py-2">
          Service in Progress
        </div>
      );
    }

    if (
      service.userIDs_whose_services_have_been_completed.includes(
        session?.user.id
      )
    ) {
      return (
        <div className="badge bg-success-light text-success py-2">
          Service Completed
        </div>
      );
    }
    return;
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <PageTitle pathname="Service" />

      {loadingService && !error && (
        <div className="d-flex justify-content-center">
          <PulseLoader size={9} color={"#12000d"} loading={true} />
        </div>
      )}

      {!loadingService && service && (
        <div>
          <h3 className="text-center">Service Flow & Details</h3>
          <div
            className="card p-3 mx-auto my-4 p-4 px-5"
            style={{
              maxWidth: "650px",
            }}
          >
            <div className="d-flex flex-column justify-content-center gap-3">
              <div className="mx-auto">
                {service?.preview ? (
                  <img
                    src={service?.img_url}
                    alt="services"
                    width={89}
                    height={89}
                    className="rounded-circle object-fit-cover"
                    style={{ objectPosition: "center" }}
                  />
                ) : (
                  <ServicesPlaceholder
                    width={89}
                    height={89}
                    fontSize="2.5rem"
                  />
                )}
              </div>
              <div>
                <h5>{service?.name}</h5>
                <p
                  className="mb-1"
                  style={{
                    color: "var(--bgDarkerColor)",
                  }}
                >
                  <span className="fw-bold me-2 text-primary">category :</span>
                  {service?.category.category} Service
                </p>

                <div>
                  <span className="fw-bold me-2">Status :</span>
                  {(service && ServiceStatus(service)) || (
                    <div className="badge bg-primary-light text-primary py-2">
                      Service Purchased
                    </div>
                  )}
                </div>
              </div>

              {/* Service flow */}
              <div style={{ width: "100%" }}>
                <h5 className="text-center">Service Flow</h5>
                <hr />
                <div
                  dangerouslySetInnerHTML={{
                    __html: service?.service_flow,
                  }}
                  style={{
                    fontSize: "1.1rem",
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                  }}
                />
              </div>

              {/* Service Form */}
              <div className="mb-3">
                <h5 className="text-center">Service Details Form</h5>
                <p className="text-center small">
                  Fill out the Form and Click on the{" "}
                  <span className="fw-bold">Activate your Service</span> button
                  , to activate the Service, you will be notified once the
                  Service is Completed for you
                </p>
                <hr />
                {service?.details_form_link ? (
                  <GoogleForm src={service?.details_form_link} />
                ) : (
                  <div
                    className="text-center"
                    style={{ color: "var(--bgDarkerColor)" }}
                  >
                    <TbNotesOff style={{ fontSize: "7rem" }} />
                    <p>Service Form is currently not available</p>
                  </div>
                )}
              </div>

              {/* Button to Activate the Service */}
              <div>
                <button
                  className="btn btn-primary rounded mb-4"
                  onClick={() => {}}
                  disabled={!service?.details_form_link}
                >
                  Activate your Service
                  <FaBell className="ms-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicePage;
