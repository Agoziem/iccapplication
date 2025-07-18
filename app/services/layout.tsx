import BackToTop from "@/components/custom/backtotopbutton/BackToTop";
import MainHeader from "@/components/blocks/header/Mainheader/MainHeader";
import FooterSection from "@/sections/footerSection";
import { Metadata } from "next";
import { ReactNode, FC } from "react";

export const metadata: Metadata = {
  title: "ICC Services",
  description:
    "We offer all JAMB-related services, including Post-UTME and admissions for schools across the country.",
};

interface ServiceLayoutProps {
  children: ReactNode;
}

const ServiceLayout: FC<ServiceLayoutProps> = ({ children }) => {
  return (
    <div
      className="d-flex flex-column justify-content-between"
      style={{ minHeight: "100vh" }}
    >
      <MainHeader />
      <section
        style={{
          paddingTop: "80px",
        }}
      >
        {children}
      </section>
      <FooterSection />
      <BackToTop />
    </div>
  );
};

export default ServiceLayout;
