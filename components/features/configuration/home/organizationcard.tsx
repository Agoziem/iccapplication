import React, { useEffect, useState } from "react";
import OrganizationalForm from "./organizationalform";
import { useOrganization } from "@/data/hooks/organization.hooks";
import { ORGANIZATION_ID } from "@/data/constants";

const OrganizationCard = () => {
  const { data: OrganizationData } = useOrganization(
    parseInt(ORGANIZATION_ID || "0")
  );
  const [editMode, setEditMode] = useState(false);

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
            OrganizationData={OrganizationData}
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
              src={OrganizationData.Organizationlogo}
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
