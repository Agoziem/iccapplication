"use client";
import React from "react";
import "./footer.css";
import { useFetchOrganization } from "@/data/organization.hook";

const Footer: React.FC = () => {
  const organizationID = process.env.NEXT_PUBLIC_ORGANIZATION_ID;
  const { data: OrganizationData } = useFetchOrganization();
  
  return (
    <footer id="footer" className="dashboardfooter px-2">
      <div className="copyright">
        &copy; Copyright 2024,{' '}
        <strong>
          <span>{OrganizationData?.name}</span>
        </strong>
        . All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;
