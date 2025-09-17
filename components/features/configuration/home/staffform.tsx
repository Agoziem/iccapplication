"use client";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PulseLoader } from "react-spinners";
import toast from "react-hot-toast";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiLinkedin,
} from "react-icons/fi";
import ImageUploader from "@/components/custom/Imageuploader/ImageUploader";
import {
  useCreateStaff,
  useUpdateStaff,
} from "@/data/hooks/organization.hooks";
import { Staff } from "@/types/organizations";
import { CreateStaffSchema, UpdateStaffSchema } from "@/schemas/organizations";
import { ORGANIZATION_ID } from "@/data/constants";

type CreateStaffFormData = z.infer<typeof CreateStaffSchema>;
type UpdateStaffFormData = z.infer<typeof UpdateStaffSchema>;

interface StaffFormProps {
  staff?: Staff | null;
  editMode?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const StaffForm: React.FC<StaffFormProps> = ({
  staff,
  editMode = false,
  onSuccess,
  onCancel,
}) => {
  // API Hooks
  const { mutateAsync: createStaff, isLoading: isCreating } = useCreateStaff();
  const { mutateAsync: updateStaff, isLoading: isUpdating } = useUpdateStaff();

  const isSubmitting = isCreating || isUpdating;

  // Form setup
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateStaffFormData | UpdateStaffFormData>({
    resolver: zodResolver(editMode ? UpdateStaffSchema : CreateStaffSchema),
    mode: "onChange",
    defaultValues:
      editMode && staff
        ? {
            first_name: staff.first_name || "",
            last_name: staff.last_name || "",
            other_names: staff.other_names || "",
            role: staff.role || "",
            email: staff.email || "",
            phone: staff.phone || "",
            address: staff.address || "",
            facebooklink: staff.facebooklink || "",
            instagramlink: staff.instagramlink || "",
            twitterlink: staff.twitterlink || "",
            linkedinlink: staff.linkedinlink || "",
            img: staff.img_url,
          }
        : {
            first_name: "",
            last_name: "",
            other_names: "",
            role: "",
            email: "",
            phone: "",
            address: "",
            facebooklink: "",
            instagramlink: "",
            twitterlink: "",
            linkedinlink: "",
            img: "",
          },
  });

  const watchedFirstName = watch("first_name");
  const watchedLastName = watch("last_name");

  // Initialize form when editing
  useEffect(() => {
    if (editMode && staff) {
      reset({
        first_name: staff.first_name || "",
        last_name: staff.last_name || "",
        other_names: staff.other_names || "",
        role: staff.role || "",
        email: staff.email || "",
        phone: staff.phone || "",
        address: staff.address || "",
        facebooklink: staff.facebooklink || "",
        instagramlink: staff.instagramlink || "",
        twitterlink: staff.twitterlink || "",
        linkedinlink: staff.linkedinlink || "",
        img: staff.img_url || "",
      });
    }
  }, [editMode, staff, reset]);

  const onSubmit = async (data: CreateStaffFormData | UpdateStaffFormData) => {
    try {
      if (editMode && staff?.id) {
        await updateStaff({
          staffId: staff.id,
          updateData: data as any,
        });
        toast.success("Staff updated successfully!");
      } else {
        await createStaff({
          organizationId: parseInt(ORGANIZATION_ID || "0"),
          staffData: data as any,
        });
        toast.success("Staff created successfully!");
      }

      onSuccess?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while saving the staff member";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <h5 className="mb-0 fw-bold">
                {editMode
                  ? `Edit "${watchedFirstName} ${watchedLastName}"`
                  : "Add New Staff Member"}
              </h5>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Personal Information */}
        <div className="mb-4">
          <h6 className="card-title d-flex align-items-center text-secondary mb-3">
            <FiUser size={18} className="me-2" />
            Personal Information
          </h6>

          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="first_name" className="form-label fw-medium">
                First Name *
              </label>
              <Controller
                name="first_name"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className={`form-control ${
                      errors.first_name ? "is-invalid" : ""
                    }`}
                    placeholder="Enter first name"
                  />
                )}
              />
              {errors.first_name && (
                <div className="invalid-feedback">
                  {errors.first_name.message}
                </div>
              )}
            </div>

            <div className="col-md-6">
              <label htmlFor="last_name" className="form-label fw-medium">
                Last Name *
              </label>
              <Controller
                name="last_name"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className={`form-control ${
                      errors.last_name ? "is-invalid" : ""
                    }`}
                    placeholder="Enter last name"
                  />
                )}
              />
              {errors.last_name && (
                <div className="invalid-feedback">
                  {errors.last_name.message}
                </div>
              )}
            </div>

            <div className="col-md-6">
              <label htmlFor="other_names" className="form-label fw-medium">
                Other Names
              </label>
              <Controller
                name="other_names"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className={`form-control ${
                      errors.other_names ? "is-invalid" : ""
                    }`}
                    placeholder="Enter other names"
                  />
                )}
              />
              {errors.other_names && (
                <div className="invalid-feedback">
                  {errors.other_names.message}
                </div>
              )}
            </div>

            <div className="col-md-6">
              <label htmlFor="role" className="form-label fw-medium">
                <FiBriefcase size={16} className="me-1" />
                Role/Position
              </label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className={`form-control ${
                      errors.role ? "is-invalid" : ""
                    }`}
                    placeholder="e.g., Manager, Developer, etc."
                  />
                )}
              />
              {errors.role && (
                <div className="invalid-feedback">{errors.role.message}</div>
              )}
            </div>

            <div className="col-md-6">
              <label htmlFor="email" className="form-label fw-medium">
                <FiMail size={16} className="me-1" />
                Email Address
              </label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    placeholder="Enter email address"
                  />
                )}
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email.message}</div>
              )}
            </div>

            <div className="col-md-6">
              <label htmlFor="phone" className="form-label fw-medium">
                <FiPhone size={16} className="me-1" />
                Phone Number
              </label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="tel"
                    className={`form-control ${
                      errors.phone ? "is-invalid" : ""
                    }`}
                    placeholder="Enter phone number"
                  />
                )}
              />
              {errors.phone && (
                <div className="invalid-feedback">{errors.phone.message}</div>
              )}
            </div>

            <div className="col-12">
              <label htmlFor="address" className="form-label fw-medium">
                <FiMapPin size={16} className="me-1" />
                Address
              </label>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    className={`form-control ${
                      errors.address ? "is-invalid" : ""
                    }`}
                    rows={3}
                    placeholder="Enter address"
                  />
                )}
              />
              {errors.address && (
                <div className="invalid-feedback">{errors.address.message}</div>
              )}
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="mb-4">
          <h6 className="card-title mb-3 text-secondary">Social Media Links</h6>

          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="facebooklink" className="form-label fw-medium">
                <FiFacebook size={16} className="me-1" style={{ color: "#3b5998" }} />
                Facebook
              </label>
              <Controller
                name="facebooklink"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="url"
                    className={`form-control ${
                      errors.facebooklink ? "is-invalid" : ""
                    }`}
                    placeholder="https://facebook.com/username"
                  />
                )}
              />
              {errors.facebooklink && (
                <div className="invalid-feedback">
                  {errors.facebooklink.message}
                </div>
              )}
            </div>

            <div className="col-md-6">
              <label htmlFor="instagramlink" className="form-label fw-medium">
                <FiInstagram size={16} className="me-1 text-danger" />
                Instagram
              </label>
              <Controller
                name="instagramlink"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="url"
                    className={`form-control ${
                      errors.instagramlink ? "is-invalid" : ""
                    }`}
                    placeholder="https://instagram.com/username"
                  />
                )}
              />
              {errors.instagramlink && (
                <div className="invalid-feedback">
                  {errors.instagramlink.message}
                </div>
              )}
            </div>

            <div className="col-md-6">
              <label htmlFor="twitterlink" className="form-label fw-medium">
                <FiTwitter size={16} className="me-1 text-info" />
                Twitter
              </label>
              <Controller
                name="twitterlink"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="url"
                    className={`form-control ${
                      errors.twitterlink ? "is-invalid" : ""
                    }`}
                    placeholder="https://twitter.com/username"
                  />
                )}
              />
              {errors.twitterlink && (
                <div className="invalid-feedback">
                  {errors.twitterlink.message}
                </div>
              )}
            </div>

            <div className="col-md-6">
              <label htmlFor="linkedinlink" className="form-label fw-medium">
                <FiLinkedin size={16} className="me-1" style={{ color: "#0077b5" }} />
                LinkedIn
              </label>
              <Controller
                name="linkedinlink"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="url"
                    className={`form-control ${
                      errors.linkedinlink ? "is-invalid" : ""
                    }`}
                    placeholder="https://linkedin.com/in/username"
                  />
                )}
              />
              {errors.linkedinlink && (
                <div className="invalid-feedback">
                  {errors.linkedinlink.message}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h6 className="card-title d-flex align-items-center text-secondary mb-3">
            <FiUser size={18} className="me-2" />
            Profile Image
          </h6>

          {/* Profile Image Upload */}
          <div className="mb-4">
            <label className="form-label fw-medium">Profile Photo</label>
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
            <small className="text-muted">
              Upload a professional profile photo
            </small>
          </div>
        </div>

        {/* Submit Button */}
        <div className="">
          <div className="d-flex justify-content-end gap-2">
            {onCancel && (
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || !isValid}
            >
              {isSubmitting ? (
                <div className="d-flex align-items-center">
                  <PulseLoader size={8} color="#ffffff" className="me-2" />
                  {editMode ? "Updating..." : "Creating..."}
                </div>
              ) : editMode ? (
                "Update Staff Member"
              ) : (
                "Create Staff Member"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default StaffForm;
