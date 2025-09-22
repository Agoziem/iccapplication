"use client";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PulseLoader } from "react-spinners";
import toast from "react-hot-toast";
import VideoUploader from "@/components/custom/Fileuploader/VideoUploader";
import ImageUploader from "@/components/custom/Imageuploader/ImageUploader";
import {
  useCreateVideo,
  useUpdateVideo,
  useVideoCategories,
  useVideoSubCategories,
} from "@/data/hooks/video.hooks";
import {
  CreateVideo,
  UpdateVideo,
  Video,
  VideoCategory,
  VideoSubCategory,
} from "@/types/items";
import { createVideoSchema, updateVideoSchema } from "@/schemas/items";
import { ORGANIZATION_ID } from "@/data/constants";

interface VideoFormProps {
  video?: Video | null;
  editMode?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}
const VideoForm: React.FC<VideoFormProps> = ({
  video,
  editMode = false,
  onSuccess,
  onCancel,
}) => {
  const [selectedCategory, setSelectedCategory] =
    useState<VideoCategory | null>(null);

  // API Hooks
  const { mutateAsync: createVideo, isLoading: isCreating } = useCreateVideo();
  const { mutateAsync: updateVideo, isLoading: isUpdating } = useUpdateVideo();
  const { data: videoCategories, isLoading: loadingCategories } =
    useVideoCategories();
  const { data: videoSubcategories, isLoading: loadingSubcategories } =
    useVideoSubCategories(selectedCategory?.id || 0);

  const isSubmitting = isCreating || isUpdating;

  // Form setup
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateVideo>({
    resolver: zodResolver(createVideoSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      category: 0,
      subcategory: 0,
      organization: Number(ORGANIZATION_ID) || 0,
      thumbnail: "",
      video: "",
    },
  });

  const watchedCategory = watch("category");
  const watchedTitle = watch("title");

  // Update selected category when form category changes
  useEffect(() => {
    if (videoCategories && watchedCategory) {
      const category = videoCategories.find(
        (cat) => cat.id === watchedCategory
      );
      setSelectedCategory(category || null);
    }
  }, [watchedCategory, videoCategories]);

  // Reset subcategory when category changes
  useEffect(() => {
    if (selectedCategory) {
      if (editMode && video) {
        const currentSubcategory = videoSubcategories?.find(
          (sub) => sub.id === video?.subcategory?.id
        );
        setValue("subcategory", currentSubcategory ? currentSubcategory.id ? currentSubcategory.id : 0 : 0);
      } else {
        setValue("subcategory", 0);
      }
    }
  }, [selectedCategory, setValue, video]);

  // Initialize form when editing
  useEffect(() => {
    if (editMode && video) {
      reset({
        title: video.title,
        description: video.description,
        price: video.price || 0,
        category: video.category?.id || 0,
        subcategory: video.subcategory?.id || 0,
        thumbnail: video.img_url || video.thumbnail,
        video: video.video_url || video.video,
        organization: Number(ORGANIZATION_ID) || 0,
      });
      setSelectedCategory(video.category || null);
    }
  }, [editMode, video, reset]);

  const onSubmit = async (data: CreateVideo) => {
    try {
      if (editMode && video?.id) {
        await updateVideo({
          videoId: video.id,
          videoData: {
            ...data,
          },
        });
        toast.success("Video updated successfully!");
      } else {
        await createVideo({
          organizationId: parseInt(ORGANIZATION_ID || "0"),
          videoData: data,
        });
        toast.success("Video created successfully!");
      }

      onSuccess?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while saving the video";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="p-3">
      <h5 className="text-center mb-4">
        {editMode ? "Edit Video" : "Add New Video"}
      </h5>
      <hr />
      
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Video Thumbnail */}
        <div className="mb-2">
          <label htmlFor="thumbnail" className="form-label">
            Video Thumbnail
          </label>
          <Controller
            name="thumbnail"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <ImageUploader
                  name="thumbnail"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Upload video thumbnail"
                  error={fieldState.error?.message}
                />
              </>
            )}
          />
        </div>

        {/* Title */}
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title *
          </label>
          <Controller
            name="title"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <input
                  {...field}
                  type="text"
                  className={`form-control ${
                    fieldState.error ? "is-invalid" : ""
                  }`}
                  id="title"
                  placeholder="Enter video title"
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
            control={control}
            render={({ field, fieldState }) => (
              <>
                <textarea
                  {...field}
                  className={`form-control ${
                    fieldState.error ? "is-invalid" : ""
                  }`}
                  id="description"
                  placeholder="Enter video description"
                  rows={4}
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

        {/* Price */}
        <div className="mb-3">
          <label htmlFor="price" className="form-label">
            Price (₦) *
          </label>
          <Controller
            name="price"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <input
                  {...field}
                  type="text"
                  className={`form-control ${
                    fieldState.error ? "is-invalid" : ""
                  }`}
                  id="price"
                  placeholder="Enter video price"
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
            control={control}
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
                  {videoCategories?.map((category) => (
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
            control={control}
            render={({ field, fieldState }) => (
              <>
                <select
                  {...field}
                  id="subcategory"
                  className={`form-select ${
                    fieldState.error ? "is-invalid" : ""
                  }`}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 0)
                  }
                  disabled={!selectedCategory || loadingSubcategories}
                >
                  <option value={0}>
                    {!selectedCategory
                      ? "Select a category first"
                      : "Select a subcategory (optional)"}
                  </option>
                  {videoSubcategories?.map((subcategory) => (
                    <option key={subcategory.id} value={subcategory.id}>
                      {subcategory.subcategory}
                    </option>
                  ))}
                </select>
                {loadingSubcategories && (
                  <div className="form-text">
                    <PulseLoader size={8} color="var(--primary)" />
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

        {/* Video File */}
        <div className="mb-3">
          <label htmlFor="video" className="form-label">
            Video File *
          </label>
          <Controller
            name="video"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <VideoUploader
                  name="video"
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
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
        
        {/* show form errors here*/}
        {Object.keys(errors).length > 0 && (
          <div className="alert alert-danger" role="alert">
            Please fix the errors above before submitting the form.
            <ul>
              {Object.entries(errors).map(([field, error]) => (
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
              "Update Video"
            ) : (
              "Create Video"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VideoForm;
