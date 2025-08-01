import React, { useEffect, useState } from "react";
import { converttoformData } from "@/utils/formutils";
import OrganizationalForm from "./organizationalform";
import { OrganizationDefault } from "@/constants";
import { useUpdateOrganization } from "@/data/organization.hook";
import toast from "react-hot-toast";
import { Organization } from "@/types/organizations";

interface AlertState {
  show: boolean;
  message: string;
  type: string;
}

interface OrganizationCardProps {
  OrganizationData: Organization;
}

const OrganizationCard: React.FC<OrganizationCardProps> = ({ OrganizationData }) => {
  const [Organization, setOrganizationData] = useState<Organization>(OrganizationDefault);
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    message: "",
    type: "",
  });
  const [editMode, setEditMode] = useState<boolean>(false);

  useEffect(() => {
    if (OrganizationData?.id){
      setOrganizationData(OrganizationData as any);
    }
  }, [OrganizationData]);

  const { mutateAsync } = useUpdateOrganization();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutateAsync(Organization);
      toast.success("Organization Details Updated Successfully");
    } catch (error: any) {
      console.log(error);
      toast.error("Error Updating Organization Details");
    } finally {
      setEditMode(false);
    }
  };

  return (
    <div className="card px-5 py-5">
      {editMode ? (
        <div>
          <div className="float-end">
            <i
              className="bi bi-x h3 text-secondary"
              style={{ cursor: "pointer" }}
              onClick={() => setEditMode(false)}
            ></i>
          </div>
          <h3 className="text-center mb-4">Edit Organization Details</h3>
          <OrganizationalForm
            handleSubmit={handleSubmit}
            OrganizationData={Organization}
            setOrganizationData={setOrganizationData as any}
            setEditMode={setEditMode}
          />
        </div>
      ) : (
        OrganizationData && (
          <div className="">
            <div className="float-end">
              <i
                className="bi bi-pencil-square h5 text-secondary"
                style={{ cursor: "pointer" }}
                onClick={() => setEditMode(true)}
              ></i>
            </div>
            <img
              src={OrganizationData.Organizationlogo || ""}
              alt="Organization Logo"
              className="rounded-circle mb-2"
              style={{ width: "80px", height: "auto" }}
            />

            <h5 className="mb-3">{OrganizationData.name}</h5>
            <p>{OrganizationData.description}</p>
            <hr />
            <h5>Vision</h5>
            <p>{OrganizationData.vision}</p>
            <hr />
            <h5>Mission</h5>
            <p>{OrganizationData.mission}</p>
            <hr />
            <p className="mb-1">
              <span className="fw-bold">Email:</span> {OrganizationData.email}
            </p>
            <p className="mb-1">
              <span className="fw-bold">Official line:</span>{" "}
              {OrganizationData.phone}
            </p>
            <p className="mb-1">
              <span className="fw-bold">Address:</span>{" "}
              {OrganizationData.address}
            </p>
            <hr />
            <button
              className="btn btn-accent-secondary rounded px-3 mt-3 shadow-none"
              onClick={() => setEditMode(true)}
            >
              edit organization details
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default OrganizationCard;
//
