import PageTitle from "@/components/custom/PageTitle/PageTitle";
import ServiceConfig from "@/components/features/configuration/services/ServiceConf";

const ServiceConfPage = ({ params }) => {
  const { id } = params;
  return (
    <div style={{ minHeight: "100vh" }}>
      <PageTitle pathname="Service Setting" />
      <ServiceConfig serviceid={id} />
    </div>
  );
};

export default ServiceConfPage;
