"use client";
import styles from "./page.module.css";
import HeaderSection from "@/components/sections/headerSection";
import StatisticsSection from "@/components/sections/statisticsSection";
import AboutSection from "@/components/sections/aboutSection";
import ServicesSection from "@/components/sections/servicesSection";
import TestimonialSection from "@/components/sections/testimonialSection";
import StaffSection from "@/components/sections/staffSection";
import BlogSection from "@/components/sections/blogSection";
import ContactSection from "@/components/sections/contactSection";
import FooterSection from "@/components/sections/footerSection";
import BackToTop from "@/components/custom/backtotopbutton/BackToTop";
import Feedback from "@/components/blocks/Feedback/ModalFeedback";
import CBTSection from "@/components/sections/CBTSection";
import ChatSection from "@/components/sections/ChatSection";

export default function Home() {
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
}
