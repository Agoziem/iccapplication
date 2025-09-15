import BackToTop from "@/components/custom/backtotopbutton/BackToTop";
import MainHeader from "@/components/blocks/header/Mainheader/MainHeader";
import FooterSection from "@/components/sections/footerSection";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "ICC Videos",
    description:
      "We offer video tutorials on various courses across institutions.",
  };
  

const VideoLayout = ({ children }: { children: React.ReactNode }) => {
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

export default VideoLayout;
