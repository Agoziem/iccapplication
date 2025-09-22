"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ImageUploader from "@/components/custom/Imageuploader/ImageUploader";
import Tiptap from "@/components/custom/Richtexteditor/Tiptap";
import {
  useCreateService,
  useServiceSubCategories,
  useUpdateService,
  useServiceCategories,
} from "@/data/hooks/service.hooks";
import { PulseLoader } from "react-spinners";
import {
  CreateService,
  Service,
  ServiceCategory,
  ServiceSubCategory,
} from "@/types/items";
import { createServiceSchema, updateServiceSchema } from "@/schemas/items";
import { ORGANIZATION_ID } from "@/data/constants";
import { toast } from "sonner";

// Create extended schemas for form validation

interface ServiceFormProps {
  service?: Service | null;
  editMode: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  service,
  editMode = false,
  onSuccess,
  onCancel,
}) => {
  // React Hook Form setup
  const [selectedCategory, setSelectedCategory] =
    useState<ServiceCategory | null>(null);

  const form = useForm<CreateService>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      preview: "",
      category: 0,
      subcategory: 0,
      organization: Number(ORGANIZATION_ID) || 0,
    },
  });

  // Hooks for API calls
  const { mutateAsync: createService, isLoading: isCreating } =
    useCreateService();
  const { mutateAsync: updateService, isLoading: isUpdating } =
    useUpdateService();
  const { data: serviceCategories, isLoading: loadingCategories } =
    useServiceCategories();
  const { data: subcategories, isLoading: loadingSubcategories } =
    useServiceSubCategories(selectedCategory?.id || 0);

  // Update form when service prop changes
  useEffect(() => {
    if (service && editMode) {
      form.reset({
        name: service.name || "",
        description: service.description || "",
        price: service.price || 0,
        preview: service.img_url || "",
        category: service.category?.id || 0,
        subcategory: service.subcategory?.id || 0,
        organization: Number(ORGANIZATION_ID) || 0,
      });
      setSelectedCategory(service.category || null);
    }
  }, [service, editMode, form]);

  // Watch category changes for subcategory loading
  const selectedCategoryId = form.watch("category");

  // Update selected category when form category changes
  useEffect(() => {
    if (serviceCategories && selectedCategoryId) {
      const category = serviceCategories.find(
        (cat) => cat.id === selectedCategoryId
      );
      setSelectedCategory(category || null);
    }
  }, [selectedCategoryId, serviceCategories]);

  // Form submission handler
  const handleSubmit = async (data: CreateService) => {
    try {
      const formData = {
        ...data,
      };

      if (editMode && service?.id) {
        await updateService({
          serviceId: service.id,
          serviceData: {
            ...formData,
            preview: formData.preview || undefined,
          },
        });
      } else {
        await createService({
          organizationId: parseInt(ORGANIZATION_ID),
          serviceData: formData,
        });
      }

      onSuccess();
      toast.success(`Service ${editMode ? "updated" : "created"} successfully!`);
    } catch (error) {
      console.error("Service form error:", error);
      toast.error("An error occurred while saving the service.");
    }
  };

  const isSubmitting = isCreating || isUpdating;

  return (
    <div className="p-3">
      <h5 className="text-center mb-4">
        {editMode ? "Edit Service" : "Add New Service"}
      </h5>
      <hr />

      <form onSubmit={form.handleSubmit(handleSubmit)} noValidate>
        {/* Service Preview Image */}
        <div className="mb-2">
          <label htmlFor="preview" className="form-label">
            Service Preview Image
          </label>
          <Controller
            name="preview"
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <ImageUploader
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Upload image"
                  error={fieldState.error?.message}
                />
              </>
            )}
          />
        </div>

        {/* Name */}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name *
          </label>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <input
                  {...field}
                  type="text"
                  className={`form-control ${
                    fieldState.error ? "is-invalid" : ""
                  }`}
                  id="name"
                  placeholder="Enter service name"
                />
                {fieldState.error && (
                  <div className="invalid-feedback">
                    {fieldState.error.message}
                  </div>
                )}
              </>
            )}
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description *
          </label>
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Tiptap
                  item={field.value ?? ""}
                  setItem={field.onChange}
                  placeholder="Enter service description"
                />
                {fieldState.error && (
                  <div className="text-danger small mt-1">
                    {fieldState.error.message}
                  </div>
                )}
              </>
            )}
          />
        </div>

        {/* Price */}
        <div className="mb-3">
          <label htmlFor="price" className="form-label">
            Price (₦) *
          </label>
          <Controller
            name="price"
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <input
                  {...field}
                  type="text"
                  className={`form-control ${
                    fieldState.error ? "is-invalid" : ""
                  }`}
                  id="price"
                  placeholder="Enter service price"
                  onChange={field.onChange}
                />
                {fieldState.error && (
                  <div className="invalid-feedback">
                    {fieldState.error.message}
                  </div>
                )}
              </>
            )}
          />
        </div>

        {/* Category */}
        <div className="mb-3">
          <label htmlFor="category" className="form-label">
            Category *
          </label>
          <Controller
            name="category"
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <select
                  {...field}
                  className={`form-select ${
                    fieldState.error ? "is-invalid" : ""
                  }`}
                  id="category"
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 0)
                  }
                  disabled={loadingCategories}
                >
                  <option value={0}>Select a category</option>
                  {serviceCategories?.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.category}
                    </option>
                  ))}
                </select>
                {loadingCategories && (
                  <div className="form-text">
                    <PulseLoader size={8} color="#0d6efd" />
                  </div>
                )}
                {fieldState.error && (
                  <div className="invalid-feedback">
                    {fieldState.error.message}
                  </div>
                )}
              </>
            )}
          />
        </div>

        {/* Subcategory */}
        <div className="mb-3">
          <label htmlFor="subcategory" className="form-label">
            Subcategory
          </label>
          <Controller
            name="subcategory"
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <select
                  {...field}
                  className={`form-select ${
                    fieldState.error ? "is-invalid" : ""
                  }`}
                  id="subcategory"
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 0)
                  }
                  disabled={!selectedCategoryId || loadingSubcategories}
                >
                  <option value={0}>
                    {!selectedCategoryId
                      ? "Select a category first"
                      : "Select a subcategory (optional)"}
                  </option>
                  {subcategories?.map((subcategory) => (
                    <option key={subcategory.id} value={subcategory.id}>
                      {subcategory.subcategory}
                    </option>
                  ))}
                </select>
                {loadingSubcategories && (
                  <div className="form-text">
                    <PulseLoader size={8} color="#0d6efd" />
                  </div>
                )}
                {fieldState.error && (
                  <div className="invalid-feedback">
                    {fieldState.error.message}
                  </div>
                )}
              </>
            )}
          />
        </div>

        {/* show form errors here*/}
        {Object.keys(form.formState.errors).length > 0 && (
          <div className="alert alert-danger" role="alert">
            Please fix the errors above before submitting the form.
            <ul>
              {Object.entries(form.formState.errors).map(([field, error]) => (
                <li key={field}>
                  <strong>{field}:</strong> {error?.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Form Actions */}
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
              <>
                <PulseLoader size={8} color="#ffffff" className="me-2" />
                {editMode ? "Updating..." : "Creating..."}
              </>
            ) : editMode ? (
              "Update Service"
            ) : (
              "Create Service"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceForm;
