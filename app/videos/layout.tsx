import BackToTop from "@/components/custom/backtotopbutton/BackToTop";
import MainHeader from "@/components/blocks/header/Mainheader/MainHeader";
import FooterSection from "@/components/sections/footerSection";
import { Metadata } from "next";
import { ReactNode, FC } from "react";

export const metadata: Metadata = {
    title: "ICC Videos",
    description:
      "We offer video tutorials on various courses across institutions.",
  };

interface VideoLayoutProps {
  children: ReactNode;
}
  
const VideoLayout: FC<VideoLayoutProps> = ({ children }) => {
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
