import React from "react";

/**
 * @param {{user:ServiceUser,service:Service}} param0
 */
const ServiceCompleted = ({ service, user }) => {
  return (
    <div>
      <div>
        <h5>Hi {user.username},</h5>
      </div>

      <div>
        We are pleased to inform you that the service {service.name} has been
        successfully completed. The necessary documents and printouts are now
        available for you. Thank you for choosing our service.
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

export default ServiceCompleted;
