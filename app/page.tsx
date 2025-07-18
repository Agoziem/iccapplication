import styles from "./page.module.css";
import HeaderSection from "@/sections/headerSection";
import StatisticsSection from "@/sections/statisticsSection";
import AboutSection from "@/sections/aboutSection";
import ServicesSection from "@/sections/servicesSection";
import TestimonialSection from "@/sections/testimonialSection";
import StaffSection from "@/sections/staffSection";
import BlogSection from "@/sections/blogSection";
import ContactSection from "@/sections/contactSection";
import FooterSection from "@/sections/footerSection";
import BackToTop from "@/components/custom/backtotopbutton/BackToTop";
import Feedback from "@/components/blocks/Feedback/ModalFeedback";
import CBTSection from "@/sections/CBTSection";
import ChatSection from "@/sections/ChatSection";
import { FC } from "react";

const Home: FC = () => {
  return (
    <main className={styles.main}>
      <HeaderSection />
      <StatisticsSection />
      <AboutSection />
      <ServicesSection />
      <CBTSection />
      <ChatSection />
      <StaffSection />
      <BlogSection />
      <TestimonialSection />
      <ContactSection />
      <FooterSection />
      <BackToTop />
      <Feedback />
    </main>
  );
};

export default Home;

// import React from "react";
