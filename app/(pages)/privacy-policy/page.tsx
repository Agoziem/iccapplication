"use client";
import BackButton from "@/components/custom/backbutton/BackButton";
import NextBreadcrumb from "@/components/custom/Breadcrumb/breadcrumb";
import { ORGANIZATION_ID } from "@/data/constants";
import { useOrganization } from "@/data/hooks/organization.hooks";
import React, { useContext } from "react";

const PrivacyPage = () => {
  const { data: OrganizationData } = useOrganization(
    Number(ORGANIZATION_ID || 0)
  );
  return (
    <div
      className="mx-auto mt-4 mb-5 px-4 px-md-0 py-2"
      style={{
        maxWidth: "980px",
      }}
    >
      <div className="mb-3">
        <NextBreadcrumb capitalizeLinks />
        <BackButton />
      </div>

      {OrganizationData?.privacy_policy ? (
        <div style={{ width: "100%" }}>
          <div
            dangerouslySetInnerHTML={{
              __html: OrganizationData.privacy_policy,
            }}
            style={{
              fontSize: "1.1rem",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}
          />
        </div>
      ) : (
        <div className="d-flex justify-content-center">
          <p
            className="p-3 text-primary text-center bg-primary-light mt-1 mb-3 rounded"
            style={{ minWidth: "300px" }}
          >
            No Privacy Policy Found
          </p>
        </div>
      )}
    </div>
  );
};

export default PrivacyPage;
