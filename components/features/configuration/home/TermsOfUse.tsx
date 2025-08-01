import Tiptap from "@/components/custom/Richtexteditor/Tiptap";
import React, { useEffect, useState } from "react";
import { OrganizationDefault } from "@/constants";
import { useUpdateOrganization } from "@/data/organization.hook";
import toast from "react-hot-toast";
import { Organization } from "@/types/organizations";

interface TermsOfUseProps {
  OrganizationData: Organization;
}

const TermsOfUse: React.FC<TermsOfUseProps> = ({ OrganizationData }) => {
  const [organizationdata,setOrganizationData] = useState<Organization>(OrganizationDefault);

  useEffect(() => {
    if (OrganizationData?.id) {
      setOrganizationData(OrganizationData as any);
    }
  }, [OrganizationData]);

  const { mutateAsync } = useUpdateOrganization();
  const editTermsOfUse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutateAsync(organizationdata)
      toast.success("Terms of Use Updated Successfully")
    } catch (error: any) {
      console.log(error.message)
      toast.error("Error Updating Terms of Use")
    }
  };

  return (
    <div className="card p-4 py-5">
      <h5>Terms of Use</h5>
      <hr />
      <p>Add or edit Terms of Use</p>
      <Tiptap
        item={organizationdata?.terms_of_use || ""}
        setItem={(value) => {
          setOrganizationData({
            ...OrganizationData,
            terms_of_use: value,
          });
        }}
      />
      <button
        className="btn btn-primary mt-4 rounded"
        onClick={(e) => {
          editTermsOfUse(e);
        }}
      >
        Save Changes
      </button>
    </div>
  );
};

export default TermsOfUse;
