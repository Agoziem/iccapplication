"use client";
import React, { useMemo } from "react";
import "./footer.css";
import { useOrganization } from "@/data/hooks/organization.hooks";
import { ORGANIZATION_ID } from "@/data/constants";

const Footer: React.FC = () => {
  // Get organization data using the organization ID constant
  const { data: OrganizationData, isLoading, error } = useOrganization(Number(ORGANIZATION_ID));

  // Memoize the current year to avoid recalculation
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  // Handle loading and error states gracefully
  if (error) {
    console.warn('Failed to fetch organization data for footer:', error);
  }

  return (
    <footer id="footer" className="dashboardfooter px-2">
      <div className="copyright">
        &copy; Copyright {currentYear},{' '}
        <strong>
          <span>
            {isLoading ? (
              <span className="placeholder-glow">
                <span className="placeholder col-4"></span>
              </span>
            ) : (
              OrganizationData?.name || 'Innovation CyberCafe'
            )}
          </span>
        </strong>
        . All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;
