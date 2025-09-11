import React from "react";
import BackToTop from "@/components/custom/backtotopbutton/BackToTop";
import MainHeader from "@/components/blocks/header/Mainheader/MainHeader";
import FooterSection from "@/components/sections/footerSection";
import styles from "./articlelayout.module.css";

export const metadata = {
  title: "ICC Articles",
  description:
    " Get the latest news and updates on our blog, stay informed and never miss out on any important information.",
};

const ArticleLayout = ({ children }) => {
  return (
    <div
      className="d-flex flex-column justify-content-between"
      style={{ minHeight: "100vh" }}
    >
      <MainHeader />
      <section className={styles.articlelayout}>{children}</section>
      <FooterSection />
      <BackToTop />
    </div>
  );
};

export default ArticleLayout;
