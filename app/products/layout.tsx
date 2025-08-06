import BackToTop from "@/components/custom/backtotopbutton/BackToTop";
import MainHeader from "@/components/blocks/header/Mainheader/MainHeader";
import FooterSection from "@/components/sections/footerSection";
import { Metadata } from "next";
import { ReactNode, FC } from "react";

export const metadata: Metadata = {
    title: "ICC Products",
    description:
      "We offer products such as past questions and study materials across tertiary institutions in the country.",
  };

interface ProductLayoutProps {
  children: ReactNode;
}
  
const ProductLayout: FC<ProductLayoutProps> = ({ children }) => {
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

export default ProductLayout;
