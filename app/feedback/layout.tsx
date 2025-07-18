import React, { ReactNode, FC } from "react";
import BackToTop from "@/components/custom/backtotopbutton/BackToTop";
import MainHeader from "@/components/blocks/header/Mainheader/MainHeader";
import FooterSection from "@/sections/footerSection";
import "./feedback.css";

interface FeedbackLayoutProps {
  children: ReactNode;
}

const FeedbackLayout: FC<FeedbackLayoutProps> = ({ children }) => {
  return (
    <div
      className="d-flex flex-column justify-content-between"
      style={{ minHeight: "100vh" }}
    >
      <MainHeader />
      <section className="feedbacklayout">{children}</section>
      <FooterSection />
      <BackToTop />
    </div>
  );
};

export default FeedbackLayout;
