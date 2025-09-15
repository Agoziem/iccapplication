import BackToTop from "@/components/custom/backtotopbutton/BackToTop";
import Footer from "@/components/blocks/footer/Footer";
import Header from "@/components/blocks/header/Header";
import SideBar from "@/components/blocks/sidebar/SideBar";
import NavList from "./navList";
import Main from "@/components/blocks/Main/Main";
import { SidebartoggleRefProvider } from "@/components/blocks/sidebar/sideBarTogglerContext";
import Feedback from "@/components/blocks/Feedback/ModalFeedback";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ICC dashboard",
  description:
    "ICC dashboard provides a platform for users to access the Jamb,Postutme, Admission services and applications. It is a dashboard that displays the services and applications, orders, and customers. It also displays the recent activities, recent sales, reports, news, and top-selling items.",
};

const dashboardlayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <SidebartoggleRefProvider>
        <Header portalname={"Dashboard"} portallink={"/dashboard"} />
        <SideBar navList={NavList} />
        <div
          className="d-flex flex-column justify-content-between"
          style={{ minHeight: "100vh" }}
        >
          <Main>{children}</Main>
          <Footer />
        </div>
        <BackToTop />
        <Feedback />
      </SidebartoggleRefProvider>
    </div>
  );
};

export default dashboardlayout;
