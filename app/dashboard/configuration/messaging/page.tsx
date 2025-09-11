import Messaging from "@/components/features/messaging/Messaging";
import PageTitle from "@/components/custom/PageTitle/PageTitle";

const MessagingPage = () => {
  return (
    <div style={{ minHeight: "100vh" }}>
      <PageTitle pathname="Messaging & Notifications" />
      <Messaging />
    </div>
  );
};

export default MessagingPage;
