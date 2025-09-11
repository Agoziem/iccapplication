import PageTitle from "@/components/custom/PageTitle/PageTitle";
import DashboardBody from "@/components/blocks/dashboard/dashboard";

const Dashboard = () => {
  return (
    <div>
      <PageTitle pathname="Dashboard" />
      <DashboardBody />
    </div>
  );
};

export default Dashboard;
