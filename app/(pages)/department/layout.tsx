import React from "react";
import BackToTop from "@/components/custom/backtotopbutton/BackToTop";
import MainHeader from "@/components/blocks/header/Mainheader/MainHeader";
import FooterSection from "@/components/sections/footerSection";
import "./department.css";

const DepartmentLayout = ({ children }) => {
  return (
    <div
      className="d-flex flex-column justify-content-between"
      style={{ minHeight: "100vh" }}
    >
      <MainHeader />
      <section className="deptlayout">{children}</section>
      <FooterSection />
      <BackToTop />
    </div>
  );
};

export default DepartmentLayout;
