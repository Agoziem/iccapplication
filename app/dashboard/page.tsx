import PageTitle from "@/components/custom/PageTitle/PageTitle";
import DashboardBody from "@/components/blocks/dashboard/dashboard";
import { FC } from "react";

const Dashboard: FC = () => {
  return (
    <div>
      <PageTitle pathname="Dashboard" />
      <DashboardBody />
    </div>
  );
};

export default Dashboard;
