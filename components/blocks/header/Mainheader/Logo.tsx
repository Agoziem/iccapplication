import { ORGANIZATION_ID } from "@/data/constants";
import { useOrganization } from "@/data/hooks/organization.hooks";
import Link from "next/link";

const MainHeaderLogo = () => {
  const { data: OrganizationData } = useOrganization(
    parseInt(ORGANIZATION_ID || "0", 10)
  );
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
