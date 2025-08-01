import Tiptap from "@/components/custom/Richtexteditor/Tiptap";
import { OrganizationDefault } from "@/constants";
import { updateOrganization } from "@/data/organization.hook";
import { useUpdateOrganization } from "@/data/organization.hook";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Organization } from "@/types/organizations";

interface PrivacyPolicyProps {
  OrganizationData: Organization;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ OrganizationData }) => {
  const [organizationdata, setOrganizationData] = useState<Organization>(OrganizationDefault);

  useEffect(() => {
    if (OrganizationData?.id) {
      setOrganizationData(OrganizationData as any);
    }
  }, [OrganizationData]);

  const { mutateAsync } = useUpdateOrganization();
  const editPrivacyPolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutateAsync(organizationdata);
      toast.success("Privacy Policy Updated Successfully");
    } catch (error: any) {
      console.log(error.message);
      toast.error("Error Updating Privacy Policy");
    }
  };

  return (
    <div className="card p-4 py-5">
      <h5>Privacy Policy</h5>
      <hr />
      <p>Add or edit Privacy Policy</p>
      <Tiptap
        item={organizationdata?.privacy_policy || ""}
        setItem={(value) => {
          setOrganizationData({
            ...OrganizationData,
            privacy_policy: value,
          });
        }}
      />
      <button
        className="btn btn-primary mt-4 rounded"
        onClick={(e) => {
          editPrivacyPolicy(e);
        }}
      >
        Save Changes
      </button>
    </div>
  );
};

export default PrivacyPolicy;
