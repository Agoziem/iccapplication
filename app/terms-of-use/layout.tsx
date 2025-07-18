import BackToTop from "@/components/custom/backtotopbutton/BackToTop";
import MainHeader from "@/components/blocks/header/Mainheader/MainHeader";
import FooterSection from "@/sections/footerSection";
import React, { ReactNode, FC } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Read our terms of use to understand how you can use our services and what we expect from you",
};

interface TermsLayoutProps {
  children: ReactNode;
}

const TermsLayout: FC<TermsLayoutProps> = ({ children }) => {
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

export default TermsLayout;
