import BackToTop from "@/components/custom/backtotopbutton/BackToTop";
import MainHeader from "@/components/blocks/header/Mainheader/MainHeader";
import FooterSection from "@/components/sections/footerSection";
import React, { ReactNode, FC } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read our privacy policy to understand how we collect, use, and protect your data.",
};

interface PrivacyLayoutProps {
  children: ReactNode;
}

const PrivacyLayout: FC<PrivacyLayoutProps> = ({ children }) => {
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

export default PrivacyLayout;
