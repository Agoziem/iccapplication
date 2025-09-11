import React from "react";
import BackToTop from "@/components/custom/backtotopbutton/BackToTop";
import MainHeader from "@/components/blocks/header/Mainheader/MainHeader";
import FooterSection from "@/components/sections/footerSection";
import "./feedback.css";

const FeedbackLayout = ({ children }) => {
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
