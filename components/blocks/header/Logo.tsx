"use client";
import React, { useContext } from 'react';
import './logo.css';
import Link from 'next/link';
import Image from 'next/image';
import { RefContext } from '../sidebar/sideBarTogglerContext';
import { useFetchOrganization } from '@/data/organization.hook';

interface LogoProps {
  portalname: string;
  portallink: string;
}

const Logo: React.FC<LogoProps> = ({ portalname, portallink }) => {
  const { data: OrganizationData } = useFetchOrganization();
  const sidebartoggleref = useContext(RefContext);

  const handleToggleSideBar = (): void => {
    if (typeof document !== "undefined") {
      document.body.classList.toggle("toggle-sidebar");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-between">
      <Link href="/" className="logo d-flex align-items-center">
        {OrganizationData && OrganizationData.Organizationlogo && (
          <Image
            src={OrganizationData.Organizationlogo}
            alt="logo"
            width={50}
            height={50}
            className="me-3"
            style={{ height: "auto" }}
          />
        )}
        <span className="d-none d-lg-block">{portalname}</span>
      </Link>
      <i
        className="bi bi-list toggle-sidebar-btn"
        onClick={handleToggleSideBar}
        ref={sidebartoggleref}
      ></i>
    </div>
  );
};

export default Logo;
