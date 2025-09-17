"use client";
import React, { useState, useTransition, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TiTimes } from "react-icons/ti";
import { PulseLoader } from "react-spinners";
import ImageUploader from "@/components/custom/Imageuploader/ImageUploader";
import { ORGANIZATION_ID } from "@/data/constants";
import {
  useCreateDepartment,
  useStaffs,
  useUpdateDepartment,
} from "@/data/hooks/organization.hooks";
import { Department } from "@/types/organizations";
import {
  UpdateDepartmentSchema,
  CreateDepartmentSchema,
} from "@/schemas/organizations";
import { UpdateDepartment, CreateDepartment } from "@/types/organizations";

interface DepartmentFormProps {
  department?: Department | null;
  editMode: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

const DepartmentForm = ({
  department,
  editMode,
  onSuccess,
  onCancel,
}: DepartmentFormProps) => {
  const [service, setService] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  // Hooks
  const { data: staffs } = useStaffs(parseInt(ORGANIZATION_ID, 10));
  const { mutateAsync: createDepartment } = useCreateDepartment();
  const { mutateAsync: updateDepartment } = useUpdateDepartment();

  // Form setup
  const {
    control,
    handleSubmit: handleFormSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<CreateDepartment | UpdateDepartment>({
    resolver: zodResolver(
      editMode ? UpdateDepartmentSchema : CreateDepartmentSchema
    ),
    defaultValues: {
      name: "",
      description: "",
      staff_in_charge: 0,
      img: "",
      services: [],
    },
  });

  // Initialize form data
  useEffect(() => {
    if (editMode && department) {
      reset({
        name: department.name || "",
        description: department.description || "",
        staff_in_charge: department.staff_in_charge?.id || 0,
        img: department.img_url || "",
      });
      setValue("services", department.services?.map((s) => s.name) || []);
      setServices(department.services?.map((s) => s.name) || []);
    } else {
      reset();
      setServices([]);
    }
  }, [editMode, department, setValue, reset]);

  // Handle form submission
  const onSubmit = async (data: CreateDepartment | UpdateDepartment) => {
    startTransition(async () => {
      try {
        const departmentData = {
          name: data.name || "",
          description: data.description || "",
          staff_in_charge: data.staff_in_charge || 0,
          services: services || [],
          img: data.img || "",
        };

        if (editMode && department) {
          await updateDepartment({
            departmentId: department.id || 0,
            organizationId: parseInt(ORGANIZATION_ID || "0", 10),
            updateData: departmentData,
          });
        } else {
          await createDepartment({
            organizationId: parseInt(ORGANIZATION_ID || "0", 10),
            departmentData,
          });
        }

        onSuccess();
      } catch (error) {
        console.error("Error saving department:", error);
      }
    });
  };

  // Add service
  const addService = () => {
    if (service.trim() && !services.includes(service.trim())) {
      setServices([...services, service.trim()]);
      setService("");
    }
  };

  // Remove service
  const removeService = (serviceToRemove: string) => {
    setServices(services.filter((s) => s !== serviceToRemove));
  };

  return (
    <div className="p-3">
      <h5 className="text-center mb-3">
        {editMode ? "Update Department" : "Add New Department"}
      </h5>
      <hr />

      <form onSubmit={handleFormSubmit(onSubmit)}>
        {/* Image Upload */}
        <div className="mb-3">
          <label className="form-label fw-bold">Department Image</label>
          <Controller
            name="img"
            control={control}
            render={({ field }) => (
              <ImageUploader
                name="img"
                value={field.value}
                onChange={field.onChange}
                error={
                  typeof errors.img?.message === "string"
                    ? errors.img.message
                    : undefined
                }
              />
            )}
          />
        </div>

        {/* Department Name */}
        <div className="mb-3">
          <label htmlFor="name" className="form-label fw-bold">
            Department Name <span className="text-danger">*</span>
          </label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                id="name"
                placeholder="Enter department name"
              />
            )}
          />
          {errors.name && (
            <div className="invalid-feedback">{errors.name.message}</div>
          )}
        </div>

        {/* Description */}
        <div className="mb-3">
          <label htmlFor="description" className="form-label fw-bold">
            Description <span className="text-danger">*</span>
          </label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                className={`form-control ${
                  errors.description ? "is-invalid" : ""
                }`}
                id="description"
                rows={4}
                placeholder="Enter department description"
              />
            )}
          />
          {errors.description && (
            <div className="invalid-feedback">{errors.description.message}</div>
          )}
        </div>

        {/* Staff in Charge */}
        <div className="mb-3">
          <label htmlFor="staff_in_charge" className="form-label fw-bold">
            Staff in Charge <span className="text-danger">*</span>
          </label>
          <Controller
            name="staff_in_charge"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                className={`form-select ${
                  errors.staff_in_charge ? "is-invalid" : ""
                }`}
                id="staff_in_charge"
              >
                <option value={0}>Select Staff in Charge</option>
                {staffs?.results?.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.first_name} {staff.last_name}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.staff_in_charge && (
            <div className="invalid-feedback">
              {errors.staff_in_charge.message}
            </div>
          )}
        </div>

        {/* Services */}
        <div className="mb-3">
          <label className="form-label fw-bold">Department Services</label>
          <div className="d-flex align-items-center mb-2">
            <input
              type="text"
              className="form-control me-2"
              value={service}
              onChange={(e) => setService(e.target.value)}
              placeholder="Add a service"
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addService())
              }
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={addService}
              disabled={!service.trim()}
            >
              Add
            </button>
          </div>

          {/* Services List */}
          <div className="mb-3">
            <p className="fw-bold text-primary mb-2">
              Services ({services.length})
            </p>
            <div>
              {services.length > 0 ? (
                <div className="d-flex flex-wrap gap-2">
                  {services.map((serviceItem, index) => (
                    <div
                      key={index}
                      className="badge bg-primary-light text-primary border p-2 px-3 d-flex align-items-center"
                    >
                      {serviceItem}
                      <TiTimes
                        className="ms-2 text-danger"
                        size={16}
                        style={{ cursor: "pointer" }}
                        onClick={() => removeService(serviceItem)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted mb-0">No services added yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="d-flex justify-content-end gap-2 mt-4">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="d-inline-flex align-items-center justify-content-center gap-2">
                <div>{editMode ? "Updating..." : "Adding..."}</div>
                <PulseLoader size={8} color={"#ffffff"} loading={true} />
              </div>
            ) : editMode ? (
              "Update Department"
            ) : (
              "Add Department"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DepartmentForm;
