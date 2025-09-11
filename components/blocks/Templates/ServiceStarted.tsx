import React from "react";

/**
 * @param {{user:ServiceUser,service:Service}} param0
 */
const ServiceStarted = ({ service, user }) => {
  return (
    <div>
      <div>
        <h5>Hi {user.username},</h5>
      </div>

      <div>
        We are glad to inform you that we have received your details for the
        service {service.name}. The service is now in progress for you. You will
        be notified immediately once the service has been completed, along with
        the necessary documents and printouts.
      </div>

      <div>
        <p>explore other hot and trending Services available, at the moment</p>
        <a href={`${process.env.NEXT_PUBLIC_URL}/dashboard/services`}>
          view Services
        </a>
      </div>
      
      <div>Kudos, ICC Service Team</div>
    </div>
  );
};

export default ServiceStarted;
