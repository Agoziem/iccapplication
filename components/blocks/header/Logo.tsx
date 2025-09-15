"use client";
import React, { useContext, useCallback, memo } from 'react';
import './logo.css';
import Link from 'next/link';
import Image from 'next/image';
import { RefContext } from '../sidebar/sideBarTogglerContext';
import { useOrganization } from '@/data/hooks/organization.hooks';
import { ORGANIZATION_ID } from '@/data/constants';

interface LogoProps {
  portalname?: string;
  portallink?: string;
}

const Logo: React.FC<LogoProps> = memo(({ portalname, portallink }) => {
  const { data: OrganizationData } = useOrganization(Number(ORGANIZATION_ID));
  const sidebartoggleref = useContext(RefContext);

  const handleToggleSideBar = useCallback(() => {
    if (typeof document !== "undefined") {
      document.body.classList.toggle("toggle-sidebar");
    }
  }, []);

  return (
    <div className="d-flex align-items-center justify-content-between">
      <Link href={`/`} className="logo d-flex align-items-center">
        {OrganizationData?.Organizationlogo && (
          <Image 
            src={OrganizationData.Organizationlogo} 
            alt="Organization logo" 
            width={50} 
            height={50} 
            className='me-3' 
            style={{ height: "auto" }}
            priority
          />
        )} 
        <span className="d-none d-lg-block">{portalname}</span>
      </Link>
      <i
        className="bi bi-list toggle-sidebar-btn"
        onClick={handleToggleSideBar}
        ref={sidebartoggleref}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleToggleSideBar();
          }
        }}
        aria-label="Toggle sidebar"
      />
    </div>
  );
});

Logo.displayName = 'Logo';

export default Logo;
