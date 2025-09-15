import { SITE_URL } from "@/data/constants";
import { Service, ServiceUser } from "@/types/items";
import React from "react";

const ServiceStarted = ({ service, user }: { service: Service; user: ServiceUser }) => {
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
        <a href={`${SITE_URL}/dashboard/services`}>
          view Services
        </a>
      </div>
      
      <div>Kudos, ICC Service Team</div>
    </div>
  );
};

export default ServiceStarted;
