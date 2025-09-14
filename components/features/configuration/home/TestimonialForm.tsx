"use client";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PulseLoader } from "react-spinners";
import toast from "react-hot-toast";
import { FiUser, FiStar, FiMessageSquare, FiBriefcase } from "react-icons/fi";
import ImageUploader from "@/components/custom/Imageuploader/ImageUploader";
import { useCreateTestimonial, useUpdateTestimonial } from "@/data/hooks/organization.hooks";
import { Testimonial } from "@/types/organizations";
import { CreateTestimonialSchema, UpdateTestimonialSchema } from "@/schemas/organizations";
import { ORGANIZATION_ID } from "@/data/constants";

type CreateTestimonialFormData = z.infer<typeof CreateTestimonialSchema>;
type UpdateTestimonialFormData = z.infer<typeof UpdateTestimonialSchema>;

interface TestimonialFormProps {
  testimonial?: Testimonial | null;
  editMode?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const TestimonialForm: React.FC<TestimonialFormProps> = ({
  testimonial,
  editMode = false,
  onSuccess,
  onCancel,
}) => {
  // API Hooks
  const { mutateAsync: createTestimonial, isLoading: isCreating } = useCreateTestimonial();
  const { mutateAsync: updateTestimonial, isLoading: isUpdating } = useUpdateTestimonial();

  const isSubmitting = isCreating || isUpdating;

  // Form setup
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateTestimonialFormData | UpdateTestimonialFormData>({
    resolver: zodResolver(editMode ? UpdateTestimonialSchema : CreateTestimonialSchema),
    mode: "onChange",
    defaultValues: editMode && testimonial
      ? {
          name: testimonial.name || "",
          content: testimonial.content || "",
          role: testimonial.role || "",
          rating: testimonial.rating || 5,
          img: testimonial.img || testimonial.img_url,
        }
      : {
          name: "",
          content: "",
          role: "",
          rating: 5,
        },
  });

  const watchedName = watch("name");

  // Initialize form when editing
  useEffect(() => {
    if (editMode && testimonial) {
      reset({
        name: testimonial.name || "",
        content: testimonial.content || "",
        role: testimonial.role || "",
        rating: testimonial.rating || 5,
        img: testimonial.img || testimonial.img_url,
      });
    }
  }, [editMode, testimonial, reset]);

  const onSubmit = async (data: CreateTestimonialFormData | UpdateTestimonialFormData) => {
    try {
      if (editMode && testimonial?.id) {
        await updateTestimonial({
          testimonialId: testimonial.id,
          updateData: data as any,
          organizationId: parseInt(ORGANIZATION_ID || "0"),
        });
        toast.success("Testimonial updated successfully!");
      } else {
        await createTestimonial({
          organizationId: parseInt(ORGANIZATION_ID || "0"),
          testimonialData: data as any,
        });
        toast.success("Testimonial created successfully!");
      }

      onSuccess?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred while saving the testimonial";
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
              <FiMessageSquare size={24} className="text-primary me-2" />
              <h4 className="mb-0 fw-bold">
                {editMode ? `Edit "${watchedName || testimonial?.name}"` : "Add New Testimonial"}
              </h4>
            </div>
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
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="row g-4">
        {/* Left Column */}
        <div className="col-lg-8">
          {/* Personal Information */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h6 className="card-title d-flex align-items-center mb-3">
                <FiUser size={18} className="text-primary me-2" />
                Personal Information
              </h6>
              
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="name" className="form-label fw-medium">
                    Full Name *
                  </label>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className={`form-control ${errors.name ? "is-invalid" : ""}`}
                        placeholder="Enter full name"
                      />
                    )}
                  />
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name.message}</div>
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
                        className={`form-control ${errors.role ? "is-invalid" : ""}`}
                        placeholder="e.g., Student, Client, etc."
                      />
                    )}
                  />
                  {errors.role && (
                    <div className="invalid-feedback">{errors.role.message}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label htmlFor="rating" className="form-label fw-medium">
                    <FiStar size={16} className="me-1" />
                    Rating *
                  </label>
                  <Controller
                    name="rating"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className={`form-select ${errors.rating ? "is-invalid" : ""}`}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 5)}
                      >
                        <option value={5}>⭐⭐⭐⭐⭐ (5 stars)</option>
                        <option value={4}>⭐⭐⭐⭐ (4 stars)</option>
                        <option value={3}>⭐⭐⭐ (3 stars)</option>
                        <option value={2}>⭐⭐ (2 stars)</option>
                        <option value={1}>⭐ (1 star)</option>
                      </select>
                    )}
                  />
                  {errors.rating && (
                    <div className="invalid-feedback">{errors.rating.message}</div>
                  )}
                </div>

                <div className="col-12">
                  <label htmlFor="content" className="form-label fw-medium">
                    Testimonial Content *
                  </label>
                  <Controller
                    name="content"
                    control={control}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        className={`form-control ${errors.content ? "is-invalid" : ""}`}
                        rows={5}
                        placeholder="Write your testimonial here..."
                      />
                    )}
                  />
                  {errors.content && (
                    <div className="invalid-feedback">{errors.content.message}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="card-title d-flex align-items-center mb-3">
                <FiUser size={18} className="text-primary me-2" />
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
                      error={typeof errors.img?.message === 'string' ? errors.img.message : undefined}
                    />
                  )}
                />
                <small className="text-muted">
                  Upload a profile photo for the testimonial (optional)
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="col-12">
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
              ) : (
                editMode ? "Update Testimonial" : "Create Testimonial"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TestimonialForm;
