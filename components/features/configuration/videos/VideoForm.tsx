"use client";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PulseLoader } from "react-spinners";
import toast from "react-hot-toast";
import {
  FiVideo,
  FiImage,
  FiTag,
  FiDollarSign,
  FiFileText,
} from "react-icons/fi";
import { BsCheck2Circle } from "react-icons/bs";
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
  const formDataSchema = editMode ? updateVideoSchema : createVideoSchema;
  type formDataType = z.infer<typeof formDataSchema>;

  // Form setup
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<formDataType>({
    resolver: zodResolver(formDataSchema),
    mode: "onChange",
    defaultValues: editMode
      ? {
          title: video?.title || "",
          description: video?.description || "",
          price: parseFloat(video?.price || "0"),
          category: video?.category?.id || 0,
          subcategory: video?.subcategory?.id || 0,
          thumbnail: video?.img_url || video?.thumbnail,
          video: video?.video_url || video?.video,
        }
      : {
          title: "",
          description: "",
          price: 0,
          category: 0,
          subcategory: 0,
          organization: ORGANIZATION_ID || "",
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
      setValue("subcategory", 0);
    }
  }, [selectedCategory, setValue]);

  // Initialize form when editing
  useEffect(() => {
    if (editMode && video) {
      reset({
        title: video.title,
        description: video.description,
        price: parseFloat(video.price || "0"),
        category: video.category?.id || 0,
        subcategory: video.subcategory?.id || 0,
        thumbnail: video.img_url || video.thumbnail,
        video: video.video_url || video.video,
      });
      setSelectedCategory(video.category || null);
    }
  }, [editMode, video, reset]);

  const onSubmit = async (data: formDataType) => {
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
          videoData: {
            title: data.title ?? "",
            description: data.description ?? "",
            price: data.price ?? 0,
            category: data.category ?? 0,
            subcategory: data.subcategory ?? 0,
            organization: ORGANIZATION_ID || "",
            thumbnail: data.thumbnail ?? "",
            video: data.video ?? "",
          },
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
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <FiVideo size={24} className="text-primary me-2" />
              <h4 className="mb-0 fw-bold">
                {editMode
                  ? `Edit "${watchedTitle || video?.title}"`
                  : "Add New Video"}
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
          {/* Video Title */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h6 className="card-title d-flex align-items-center mb-3">
                <FiFileText size={18} className="text-primary me-2" />
                Video Information
              </h6>

              <div className="row g-3">
                <div className="col-12">
                  <label htmlFor="title" className="form-label fw-medium">
                    Title *
                  </label>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className={`form-control ${
                          errors.title ? "is-invalid" : ""
                        }`}
                        placeholder="Enter video title"
                      />
                    )}
                  />
                  {errors.title && (
                    <div className="invalid-feedback">
                      {errors.title.message}
                    </div>
                  )}
                </div>

                <div className="col-12">
                  <label htmlFor="description" className="form-label fw-medium">
                    Description *
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
                        rows={4}
                        placeholder="Enter video description"
                      />
                    )}
                  />
                  {errors.description && (
                    <div className="invalid-feedback">
                      {errors.description.message}
                    </div>
                  )}
                </div>

                <div className="col-md-6">
                  <label htmlFor="price" className="form-label fw-medium">
                    <FiDollarSign size={16} className="me-1" />
                    Price *
                  </label>
                  <Controller
                    name="price"
                    control={control}
                    render={({ field }) => (
                      <div className="input-group">
                        <span className="input-group-text">₦</span>
                        <input
                          {...field}
                          type="number"
                          min="0"
                          step="0.01"
                          className={`form-control ${
                            errors.price ? "is-invalid" : ""
                          }`}
                          placeholder="0.00"
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </div>
                    )}
                  />
                  {errors.price && (
                    <div className="invalid-feedback">
                      {errors.price.message}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h6 className="card-title d-flex align-items-center mb-3">
                <FiTag size={18} className="text-primary me-2" />
                Categories
              </h6>

              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="category" className="form-label fw-medium">
                    Category *
                  </label>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className={`form-select ${
                          errors.category ? "is-invalid" : ""
                        }`}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                        disabled={loadingCategories}
                      >
                        <option value={0}>Select category</option>
                        {videoCategories?.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.category}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  {errors.category && (
                    <div className="invalid-feedback">
                      {errors.category.message}
                    </div>
                  )}
                  {loadingCategories && (
                    <small className="text-muted">
                      <PulseLoader size={8} className="me-2" />
                      Loading categories...
                    </small>
                  )}
                </div>

                <div className="col-md-6">
                  <label htmlFor="subcategory" className="form-label fw-medium">
                    Subcategory
                  </label>
                  <Controller
                    name="subcategory"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className={`form-select ${
                          errors.subcategory ? "is-invalid" : ""
                        }`}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                        disabled={loadingSubcategories || !selectedCategory}
                      >
                        <option value={0}>Select subcategory</option>
                        {videoSubcategories?.map((subcategory) => (
                          <option key={subcategory.id} value={subcategory.id}>
                            {subcategory.subcategory}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  {errors.subcategory && (
                    <div className="invalid-feedback">
                      {errors.subcategory.message}
                    </div>
                  )}
                  {loadingSubcategories && (
                    <small className="text-muted">
                      <PulseLoader size={8} className="me-2" />
                      Loading subcategories...
                    </small>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-lg-4">
          {/* Media Upload */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h6 className="card-title d-flex align-items-center mb-3">
                <FiImage size={18} className="text-primary me-2" />
                Media Files
              </h6>

              {/* Thumbnail Upload */}
              <div className="mb-4">
                <label className="form-label fw-medium">Video Thumbnail</label>
                <Controller
                  name="thumbnail"
                  control={control}
                  render={({ field }) => (
                    <ImageUploader
                      name="thumbnail"
                      value={field.value}
                      onChange={field.onChange}
                      error={
                        typeof errors.thumbnail?.message === "string"
                          ? errors.thumbnail.message
                          : undefined
                      }
                    />
                  )}
                />
              </div>

              {/* Video Upload */}
              <div>
                <label className="form-label fw-medium">Video File *</label>
                <Controller
                  name="video"
                  control={control}
                  render={({ field }) => (
                    <VideoUploader
                      name="video"
                      value={field.value}
                      onChange={field.onChange}
                      error={
                        typeof errors.video?.message === "string"
                          ? errors.video.message
                          : undefined
                      }
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Video Settings */}
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="card-title d-flex align-items-center mb-3">
                <BsCheck2Circle size={18} className="text-primary me-2" />
                Video Settings
              </h6>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="free"
                  defaultChecked={video?.free || false}
                />
                <label className="form-check-label fw-medium" htmlFor="free">
                  Free Video
                </label>
                <small className="text-muted d-block">
                  Make this video available for free
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="col-12">
          <div className="d-flex justify-content-end gap-3 pt-3 border-top">
            {onCancel && (
              <button
                type="button"
                className="btn btn-outline-secondary px-4"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="btn btn-primary px-4"
              disabled={isSubmitting || !isValid}
            >
              {isSubmitting ? (
                <div className="d-flex align-items-center">
                  <PulseLoader size={8} color="#ffffff" className="me-2" />
                  {editMode ? "Updating..." : "Creating..."}
                </div>
              ) : (
                <div className="d-flex align-items-center">
                  {editMode ? "Update Video" : "Create Video"}
                </div>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default VideoForm;
