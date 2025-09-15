import PageTitle from "@/components/custom/PageTitle/PageTitle";
import ServiceConfig from "@/components/features/configuration/services/ServiceConf";

const ServiceConfPage = () => {
  return (
    <div style={{ minHeight: "100vh" }}>
      <PageTitle pathname="Service Setting" />
      <ServiceConfig />
    </div>
  );
};

export default ServiceConfPage;
