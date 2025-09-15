import { ORGANIZATION_ID } from "@/data/constants";
import { useOrganization } from "@/data/hooks/organization.hooks";
import React from "react";

const VerificationEmail = ({
  confirmLink,
  expire_time,
}: {
  confirmLink: string;
  expire_time: string;
}) => {
  const currentYear = new Date().getFullYear();
  const { data: OrganizationData } = useOrganization(
    Number(ORGANIZATION_ID || 1)
  );
  return (
    <div style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.6", color: "#333" }}>
      <h2 style={{ color: "var(--primary)" }}>Verify Your Email Address</h2>
      <p>
        Thank you for signing up! To complete your registration and activate your account, please verify your email
        address.
      </p>
      <p>
        Click the button below to confirm your email:
      </p>
      <p>
        <a
          href={confirmLink}
          style={{
            display: "inline-block",
            padding: "10px 20px",
            backgroundColor: "var(--secondary)",
            color: "#fff",
            borderRadius: "5px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Verify Email
        </a>
      </p>
      <p>
        For your security, this link will expire on <strong>{expire_time}</strong>.
      </p>
      <p>If you did not create this account, you can safely ignore this email.</p>
      <p style={{ marginTop: "30px", fontSize: "12px", color: "#888" }}>
        &copy; {currentYear} {OrganizationData?.name || "Your Company"}. All rights reserved.
      </p>
    </div>
  );
};

export default VerificationEmail;

