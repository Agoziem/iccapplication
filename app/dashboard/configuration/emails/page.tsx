import Email from "@/components/features/Emails/Email";
import PageTitle from "@/components/custom/PageTitle/PageTitle";
import React from "react";

const EmailPage = () => {
  return (
    <div style={{ minHeight: "100vh" }}>
      <PageTitle pathname="Emails Settings" />
      <Email />
    </div>
  );
};

export default EmailPage;
