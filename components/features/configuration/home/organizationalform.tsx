"use client";
import React, { useTransition, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PulseLoader } from "react-spinners";
import ImageUploader from "@/components/custom/Imageuploader/ImageUploader";
import { useUpdateOrganization } from "@/data/hooks/organization.hooks";
import { Organization } from "@/types/organizations";
import { UpdateOrganizationSchema } from "@/schemas/organizations";
import { UpdateOrganization } from "@/types/organizations";

type UpdateOrganizationFormData = {
  name: string;
  description: string;
  vision: string;
  mission: string;
  email: string;
  phone: string;
  address: string;
  Organizationlogo?: File;
};

interface OrganizationalFormProps {
  OrganizationData: Organization | undefined;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const OrganizationalForm = ({
  OrganizationData,
  setEditMode,
}: OrganizationalFormProps) => {
  const [isPending, startTransition] = useTransition();
  const { mutateAsync: updateOrganization } = useUpdateOrganization();

  // Form setup
  const {
    control,
    handleSubmit: handleFormSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<UpdateOrganizationFormData>({
    resolver: zodResolver(UpdateOrganizationSchema),
    defaultValues: {
      name: "",
      description: "",
      vision: "",
      mission: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  // Initialize form with organization data
  useEffect(() => {
    if (OrganizationData) {
      setValue("name", OrganizationData.name || "");
      setValue("description", OrganizationData.description || "");
      setValue("vision", OrganizationData.vision || "");
      setValue("mission", OrganizationData.mission || "");
      setValue("email", OrganizationData.email || "");
      setValue("phone", OrganizationData.phone || "");
      setValue("address", OrganizationData.address || "");
    }
  }, [OrganizationData, setValue]);

  // Handle form submission
  const onSubmit = async (data: UpdateOrganizationFormData) => {
    startTransition(async () => {
      try {
        await updateOrganization({
          organizationId: OrganizationData?.id || 0,
          updateData: {
            name: data.name,
            description: data.description,
            vision: data.vision,
            mission: data.mission,
            email: data.email,
            phone: data.phone,
            address: data.address,
            logo: data.Organizationlogo || OrganizationData?.Organizationlogo,
          },
        });
        setEditMode(false);
      } catch (error) {
        console.error("Error updating organization:", error);
      }
    });
  };

  return (
    <div className="p-3">
      <h5 className="text-center mb-3">Edit Organization Details</h5>
      <hr />
      
      <form onSubmit={handleFormSubmit(onSubmit)}>
        {/* Organization Logo */}
        <div className="mb-4">
          <label className="form-label fw-bold text-primary">Organization Logo</label>
          <Controller
            name="Organizationlogo"
            control={control}
            render={({ field: { onChange, onBlur, name } }) => (
              <ImageUploader
                name={name}
                value={OrganizationData?.Organizationlogo}
                onChange={onChange}
                onBlur={onBlur}
                error={errors.Organizationlogo?.message}
                placeholder="Upload organization logo"
              />
            )}
          />
        </div>

        {/* Organization Name */}
        <div className="mb-3">
          <label htmlFor="name" className="form-label fw-bold text-primary">
            Organization Name <span className="text-danger">*</span>
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
                placeholder="Enter organization name"
              />
            )}
          />
          {errors.name && (
            <div className="invalid-feedback">{errors.name.message}</div>
          )}
        </div>

        {/* Organization Description */}
        <div className="mb-3">
          <label htmlFor="description" className="form-label fw-bold text-primary">
            Organization Description <span className="text-danger">*</span>
          </label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                className={`form-control ${errors.description ? "is-invalid" : ""}`}
                id="description"
                rows={4}
                placeholder="Enter organization description"
              />
            )}
          />
          {errors.description && (
            <div className="invalid-feedback">{errors.description.message}</div>
          )}
        </div>

        {/* Vision */}
        <div className="mb-3">
          <label htmlFor="vision" className="form-label fw-bold text-primary">
            Organization Vision <span className="text-danger">*</span>
          </label>
          <Controller
            name="vision"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                className={`form-control ${errors.vision ? "is-invalid" : ""}`}
                id="vision"
                rows={3}
                placeholder="Enter organization vision"
              />
            )}
          />
          {errors.vision && (
            <div className="invalid-feedback">{errors.vision.message}</div>
          )}
        </div>

        {/* Mission */}
        <div className="mb-3">
          <label htmlFor="mission" className="form-label fw-bold text-primary">
            Organization Mission <span className="text-danger">*</span>
          </label>
          <Controller
            name="mission"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                className={`form-control ${errors.mission ? "is-invalid" : ""}`}
                id="mission"
                rows={3}
                placeholder="Enter organization mission"
              />
            )}
          />
          {errors.mission && (
            <div className="invalid-feedback">{errors.mission.message}</div>
          )}
        </div>

        {/* Email */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label fw-bold text-primary">
            Organization Email <span className="text-danger">*</span>
          </label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                id="email"
                placeholder="Enter organization email"
              />
            )}
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email.message}</div>
          )}
        </div>

        {/* Phone */}
        <div className="mb-3">
          <label htmlFor="phone" className="form-label fw-bold text-primary">
            Organization Official Line <span className="text-danger">*</span>
          </label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="tel"
                className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                id="phone"
                placeholder="Enter official phone number"
              />
            )}
          />
          {errors.phone && (
            <div className="invalid-feedback">{errors.phone.message}</div>
          )}
        </div>

        {/* Address */}
        <div className="mb-4">
          <label htmlFor="address" className="form-label fw-bold text-primary">
            Organization Address <span className="text-danger">*</span>
          </label>
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className={`form-control ${errors.address ? "is-invalid" : ""}`}
                id="address"
                placeholder="Enter organization address"
              />
            )}
          />
          {errors.address && (
            <div className="invalid-feedback">{errors.address.message}</div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="d-flex flex-md-row flex-column gap-2 mt-4">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setEditMode(false)}
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
                <div>Saving Changes...</div>
                <PulseLoader size={8} color={"#ffffff"} loading={true} />
              </div>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrganizationalForm;
