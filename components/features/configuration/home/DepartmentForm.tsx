import ImageUploader from "@/components/custom/Imageuploader/ImageUploader";
import React, { useState } from "react";
import { TiTimes } from "react-icons/ti";

interface Department {
  name: string;
  description: string;
  staff_in_charge?: {
    id: number;
    [key: string]: any;
  };
  services: Array<{ name: string; [key: string]: any }>;
  [key: string]: any;
}

interface Staff {
  id: number;
  first_name: string;
  last_name: string;
  [key: string]: any;
}

interface AddOrUpdateMode {
  type: string;
  state: boolean;
}

interface DepartmentFormProps {
  addorupdate: AddOrUpdateMode;
  department: Department;
  setDepartment: (value: Department | Record<string, any>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  closeModal: () => void;
  staffs: Staff[];
  loading: boolean;
}

const DepartmentForm: React.FC<DepartmentFormProps> = ({
  addorupdate,
  department,
  setDepartment,
  handleSubmit,
  staffs,
  closeModal,
  loading,
}) => {
  const [service, setService] = useState<string>("");

  const handleFormSubmit = (e: React.FormEvent) => {
    handleSubmit(e);
  };

  return (
    <div className="mt-4">
      <h4>{addorupdate.type} Department</h4>
      <hr />
      <form onSubmit={handleFormSubmit}>
        <div className="form-group mb-3">
          <ImageUploader
            imagekey={"img"}
            imageurlkey={"img_url"}
            imagename={"img_name"}
            formData={department}
            setFormData={setDepartment}
          />
        </div>
        <div className="form-group mb-3">
          <label className="form-label">Department Name</label>
          <input
            type="text"
            className="form-control"
            value={department.name}
            onChange={(e) =>
              setDepartment({ ...department, name: e.target.value })
            }
            required
          />
        </div>

        {/* Description */}
        <div className="form-group mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            value={department.description}
            rows={5}
            onChange={(e) =>
              setDepartment({
                ...department,
                description: e.target.value,
              })
            }
            required
          ></textarea>
        </div>

        {/* Staff in Charge */}
        <div className="form-group mb-3">
          <label className="form-label">Staff in Charge</label>
          <select
            className="form-select"
            value={department.staff_in_charge?.id || ""}
            onChange={(e) =>
              setDepartment({
                ...department,
                staff_in_charge: {
                  ...department.staff_in_charge,
                  id: Number(e.target.value), // Ensure correct type
                },
              })
            }
            required
          >
            <option value="">Select Staff in Charge</option>
            {staffs.map((staff) => (
              <option key={staff.id} value={staff.id}>
                {staff.first_name} {staff.last_name}
              </option>
            ))}
          </select>
        </div>

        {/* Services */}
        <div className="form-group mb-3">
          <label className="form-label">Add Service</label>
          <div className="d-flex align-items-center">
            <input
              type="text"
              className="form-control"
              value={service}
              onChange={(e) => setService(e.target.value)}
            />
            <button
              className="btn btn-primary ms-2 rounded"
              onClick={(e) => {
                e.preventDefault();
                setDepartment({
                  ...department,
                  services: [...department.services, { name: service }],
                });
                setService("");
              }}
            >
              Add
            </button>
          </div>
        </div>

        <div className="mb-3">
          <p className="fw-bold text-primary mb-0">Services</p>
          <div>
            {department && department.services.length > 0 ? (
              department.services.map((service, index) => (
                <div
                  key={index}
                  className={`badge bg-secondary-light text-secondary mt-2 p-2 px-3 ${
                    department.services.length === index + 1 ? "" : "me-2"
                  }`}
                >
                  {service.name}
                  <TiTimes
                    className="ms-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      const newServices = department.services.filter(
                        (sub) => sub.name !== service.name
                      );
                      setDepartment({ ...department, services: newServices });
                    }}
                  />
                </div>
              ))
            ) : (
              <p>No services added yet</p>
            )}
          </div>
        </div>

        <hr />
        <button type="submit" className="btn btn-primary border-0 mt-3 rounded" >
          {loading ? "submitting department..." : addorupdate.type === "add" ? "Add Department" : "Update Department"}
        </button>
      </form>
    </div>
  );
};

export default DepartmentForm;
