"use client";
import BackButton from "@/components/custom/backbutton/BackButton";
import NextBreadcrumb from "@/components/custom/Breadcrumb/breadcrumb";
import { useFetchOrganization } from "@/data/organization/organization.hook";
import React, { useContext } from "react";

const TermsPage = () => {
   const { data: OrganizationData } = useFetchOrganization();
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
      {OrganizationData?.terms_of_use ? (
        <div style={{ width: "100%" }}>
          <div
            dangerouslySetInnerHTML={{
              __html: OrganizationData.terms_of_use,
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
            No Terms of Use yet
          </p>
        </div>
      )}
    </div>
  );
};

export default TermsPage;
