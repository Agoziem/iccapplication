import PageTitle from "@/components/custom/PageTitle/PageTitle";
import Services from "@/components/features/Services/Services";

const ServicesPage = () => {
  return (
    <div>
      <PageTitle pathname="Services" />
      <div style={{ minHeight: "100vh" }}>
      <Services />
      </div>
    </div>
  );
};

export default ServicesPage;
