import { useFetchOrganization } from "@/data/organization/organization.hook";
import Link from "next/link";

const MainHeaderLogo = () => {
  const { data: OrganizationData } = useFetchOrganization();
  return (
    <div>
      <Link href="/" className="logo d-flex align-items-center mt-0 ">
        <img
          src={
            OrganizationData?.Organizationlogo
              ? OrganizationData.Organizationlogo
              : "/ICC Logo.png"
          }
          alt="logo"
          width={50}
          height={35}
          className="me-3"
          style={{
            height: "auto",
          }}
        />
        <span>ICC Online Center</span>
      </Link>
    </div>
  );
};

export default MainHeaderLogo;
