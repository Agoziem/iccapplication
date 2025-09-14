"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ArticleImageUploader from "@/components/custom/Imageuploader/ArticleImageUploader";
import Alert from "@/components/custom/Alert/Alert";
import Tiptap from "@/components/custom/Richtexteditor/Tiptap";
import {
  useCreateArticle,
  useUpdateArticle,
} from "@/data/hooks/articles.hooks";
import { CreateArticleSchema, UpdateArticleSchema } from "@/schemas/articles";
import {
  ArticleResponse,
  CategoryArray,
  CreateArticle,
  UpdateArticle,
} from "@/types/articles";
import { useMyProfile } from "@/data/hooks/user.hooks";
import useLocalStorage from "@/hooks/useLocalStorage";
import { ORGANIZATION_ID } from "@/data/constants";

interface ArticleFormProps {
  article: ArticleResponse | null;
  setArticle: (article: ArticleResponse | null) => void;
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
  categories: CategoryArray;
}

interface AlertState {
  show: boolean;
  message: string;
  variant: "success" | "danger" | "warning" | "info";
}

// Create a simplified form schema that matches the actual API requirements

const ArticleForm: React.FC<ArticleFormProps> = ({
  article,
  setArticle,
  editMode,
  setEditMode,
  categories,
}) => {
  // State management
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    message: "",
    variant: "success",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasStartedEditing, setHasStartedEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [progressRestoredMessage, setProgressRestoredMessage] =
    useState<string>("");
  const ArticleFormSchema = editMode
    ? UpdateArticleSchema
    : CreateArticleSchema;
  type ArticleFormType = z.infer<typeof ArticleFormSchema>;

  // LocalStorage for draft saving
  const [draftArticle, setDraftArticle] = useLocalStorage<
    ArticleFormType | undefined
  >("articledraft", undefined);

  // Clear draft function
  const clearDraftArticle = useCallback(() => {
    setDraftArticle(undefined);
  }, [setDraftArticle]);

  // Hooks
  const { data: user } = useMyProfile();
  const { mutateAsync: createArticleMutation, isLoading: isCreating } =
    useCreateArticle();
  const { mutateAsync: updateArticleMutation, isLoading: isUpdating } =
    useUpdateArticle();

  // Determine if we're in edit mode and set default values
  const isEditMode = editMode && article !== null;

  const defaultValues = useMemo<ArticleFormType>(() => {
    // Always provide required fields with fallback defaults
    if (isEditMode && article) {
      return {
        id: article.id ?? 0,
        title: article.title ?? "",
        subtitle: article.subtitle ?? "",
        body: article.body ?? "",
        category: typeof article.category === "object" ? article.category.id ?? 0 : article.category ?? 0,
        tags: article.tags?.map((tag) => typeof tag === "string" ? tag : tag.tag) ?? [],
        img: article.img_url ?? undefined,
        readTime: article.readTime ?? 5,
        author: typeof article.author === "object" ? article.author.id ?? user?.id ?? 0 : article.author ?? user?.id ?? 0,
        organization: typeof article.organization === "string" ? parseInt(article.organization) || 1 : article.organization ?? 1,
      };
    }
    // For create mode, always provide required fields
    return {
      title: "",
      subtitle: "",
      body: "",
      category: 1,
      tags: [],
      img: undefined,
      readTime: 5,
      author: user?.id ?? 1,
      organization: typeof ORGANIZATION_ID === "string" ? parseInt(ORGANIZATION_ID) || 1 : ORGANIZATION_ID ?? 1,
    };
  }, [isEditMode, article, user?.id, ORGANIZATION_ID]);

  // Form setup with discriminated union validation
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
    getValues,
    reset,
  } = useForm<ArticleFormType>({
    resolver: zodResolver(ArticleFormSchema),
    defaultValues: defaultValues,
    mode: "onChange",
  });

  const watchedValues = watch();

  // Show alert function
  const showAlert = useCallback(
    (message: string, variant: AlertState["variant"] = "info") => {
      setAlert({ show: true, message, variant });
      setTimeout(() => {
        setAlert({ show: false, message: "", variant: "success" });
      }, 5000);
    },
    []
  );

  // Close edit mode and reset form
  const closeEditMode = useCallback(() => {
    setEditMode(false);
    setArticle(null);
    reset(defaultValues);
    clearDraftArticle();
    setHasStartedEditing(false);
  }, [setEditMode, setArticle, clearDraftArticle, reset, defaultValues]);

  // Effect to reset form when switching between create/edit modes
  useEffect(() => {
    if (article && editMode) {
      reset(defaultValues);
    }
  }, [article, editMode, reset, defaultValues]);

  // Load draft from localStorage on component mount
  useEffect(() => {
    if (!editMode && draftArticle) {
      try {
        reset({ ...defaultValues, ...draftArticle });
        setProgressRestoredMessage("Your draft has been restored");
        setHasStartedEditing(true);
        setTimeout(() => setProgressRestoredMessage(""), 4000);
      } catch (error) {
        console.error("Error loading saved draft:", error);
        clearDraftArticle();
      }
    }
  }, [editMode, draftArticle, defaultValues, reset, clearDraftArticle]);

  // Auto-save draft functionality
  useEffect(() => {
    if (!editMode && hasStartedEditing && isDirty) {
      setSaving(true);
      const timeoutId = setTimeout(() => {
        try {
          setDraftArticle(getValues());
          setSaving(false);
        } catch (error) {
          console.error("Error saving draft:", error);
          setSaving(false);
        }
      }, 1000); // Debounce save for 1 second

      return () => {
        clearTimeout(timeoutId);
        setSaving(false);
      };
    }
  }, [
    watchedValues,
    editMode,
    hasStartedEditing,
    isDirty,
    setDraftArticle,
    getValues,
  ]);

  // Form submission handlers
  const handleFormError = useCallback(
    (errors: any) => {
      console.error("Form validation errors:", errors);
      showAlert(
        "Please fix the errors in the form before submitting.",
        "danger"
      );
    },
    [showAlert]
  );

  // Handle form submission
  const handleFormSubmit = useCallback(
    async (data: ArticleFormType) => {
      if (!user?.id) {
        showAlert(
          "User information not available. Please refresh and try again.",
          "danger"
        );
        return;
      }

      try {
        setIsSubmitting(true);

        if (editMode && article?.id) {
          // Update existing article
          const updateData: UpdateArticle & { id: number } = {
            id: article.id,
            title: data.title ?? "",
            subtitle: data.subtitle ?? "",
            body: data.body ?? "",
            category: data.category ?? 1,
            tags: data.tags ?? [],
            img: data.img ?? "",
            readTime: data.readTime ?? 5,
            author: typeof data.author === "number" ? data.author : user.id ?? 1,
          };
          await updateArticleMutation(updateData);
          showAlert("Article updated successfully!", "success");
        } else {
          // Create new article
          const createData: CreateArticle = {
            title: data.title ?? "",
            subtitle: data.subtitle ?? "",
            body: data.body ?? "",
            category: data.category ?? 1,
            tags: data.tags ?? [],
            img: data.img ?? "",
            readTime: data.readTime ?? 5,
            author: user.id ?? 1,
            organization: typeof ORGANIZATION_ID === "string" ? parseInt(ORGANIZATION_ID) || 1 : ORGANIZATION_ID ?? 1,
          };
          await createArticleMutation(createData);
          showAlert("Article created successfully!", "success");
        }
        setTimeout(() => {
          closeEditMode();
        }, 2000);
      } catch (error: any) {
        console.error("Error submitting article:", error);
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to submit article. Please try again.";
        showAlert(errorMessage, "danger");
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      user,
      article,
      updateArticleMutation,
      createArticleMutation,
      setArticle,
      showAlert,
      clearDraftArticle,
      closeEditMode,
    ]
  );

  // Handle input changes to track editing state
  const handleInputChange = useCallback(() => {
    if (!hasStartedEditing) {
      setHasStartedEditing(true);
    }
  }, [hasStartedEditing]);

  return (
    <div className="card p-4 px-md-5 py-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">
          {editMode ? "Edit Article" : "Create New Article"}
        </h4>
        {saving && (
          <small className="text-muted">
            <i className="bi bi-cloud-arrow-up me-1" />
            Saving draft...
          </small>
        )}
      </div>

      {progressRestoredMessage && (
        <div className="alert alert-info d-flex align-items-center mb-3">
          <i className="bi bi-info-circle me-2" />
          {progressRestoredMessage}
        </div>
      )}

      <hr />

      <form
        onSubmit={handleSubmit(handleFormSubmit, handleFormError)}
        noValidate
        aria-label={editMode ? "Edit article form" : "Create article form"}
      >
        {/* Alert Component */}
        {alert.show && <Alert type={alert.variant}>{alert.message}</Alert>}

        <div className="row">
          {/* Title Field */}
          <div className="col-12 mb-3">
            <label htmlFor="article-title" className="form-label">
              Title <span className="text-danger">*</span>
            </label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  id="article-title"
                  className={`form-control ${errors.title ? "is-invalid" : ""}`}
                  placeholder="Enter article title"
                  onChange={(e) => {
                    field.onChange(e);
                    handleInputChange();
                  }}
                  disabled={isSubmitting}
                  aria-describedby={errors.title ? "title-error" : undefined}
                />
              )}
            />
            {errors.title && (
              <div id="title-error" className="invalid-feedback">
                <i className="bi bi-exclamation-circle me-1" />
                {errors.title.message as string}
              </div>
            )}
          </div>

          {/* Subtitle Field */}
          <div className="col-12 mb-3">
            <label htmlFor="article-subtitle" className="form-label">
              Subtitle
            </label>
            <Controller
              name="subtitle"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  id="article-subtitle"
                  className={`form-control ${
                    errors.subtitle ? "is-invalid" : ""
                  }`}
                  placeholder="Enter article subtitle (optional)"
                  onChange={(e) => {
                    field.onChange(e);
                    handleInputChange();
                  }}
                  disabled={isSubmitting}
                  aria-describedby={
                    errors.subtitle ? "subtitle-error" : undefined
                  }
                />
              )}
            />
            {errors.subtitle && (
              <div id="subtitle-error" className="invalid-feedback">
                <i className="bi bi-exclamation-circle me-1" />
                {errors.subtitle.message as string}
              </div>
            )}
          </div>

          {/* Category Field */}
          <div className="col-md-6 mb-3">
            <label htmlFor="article-category" className="form-label">
              Category <span className="text-danger">*</span>
            </label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  id="article-category"
                  className={`form-select ${
                    errors.category ? "is-invalid" : ""
                  }`}
                  onChange={(e) => {
                    field.onChange(Number(e.target.value));
                    handleInputChange();
                  }}
                  disabled={isSubmitting}
                  aria-describedby={
                    errors.category ? "category-error" : undefined
                  }
                >
                  <option value={0}>Select a category</option>
                  {categories?.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.category}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.category && (
              <div id="category-error" className="invalid-feedback">
                <i className="bi bi-exclamation-circle me-1" />
                {errors.category.message as string}
              </div>
            )}
          </div>

          {/* Read Time Field */}
          <div className="col-md-6 mb-3">
            <label htmlFor="article-read-time" className="form-label">
              Estimated Read Time (minutes)
            </label>
            <Controller
              name="readTime"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  id="article-read-time"
                  min={1}
                  max={60}
                  className={`form-control ${
                    errors.readTime ? "is-invalid" : ""
                  }`}
                  placeholder="5"
                  onChange={(e) => {
                    field.onChange(Number(e.target.value));
                    handleInputChange();
                  }}
                  disabled={isSubmitting}
                  aria-describedby={
                    errors.readTime ? "read-time-error" : undefined
                  }
                />
              )}
            />
            {errors.readTime && (
              <div id="read-time-error" className="invalid-feedback">
                <i className="bi bi-exclamation-circle me-1" />
                {errors.readTime.message as string}
              </div>
            )}
            <div className="form-text">
              Estimated time for readers to complete the article
            </div>
          </div>

          {/* Tags Field */}
          <div className="col-12 mb-3">
            <label htmlFor="article-tags" className="form-label">
              Tags
            </label>
            <Controller
              name="tags"
              control={control}
              render={({ field }) => {
                const [currentTag, setCurrentTag] = useState("");
                const tags = field.value || [];

                const addTag = () => {
                  if (currentTag.trim() && !tags.includes(currentTag.trim())) {
                    const newTags = [...tags, currentTag.trim()];
                    field.onChange(newTags);
                    setCurrentTag("");
                    handleInputChange();
                  }
                };

                const removeTag = (tagToRemove: string) => {
                  const newTags = tags.filter((tag) => tag !== tagToRemove);
                  field.onChange(newTags);
                  handleInputChange();
                };

                const handleKeyPress = (e: React.KeyboardEvent) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                };

                return (
                  <div>
                    <div className="input-group mb-2">
                      <input
                        type="text"
                        id="article-tags"
                        className={`form-control ${
                          errors.tags ? "is-invalid" : ""
                        }`}
                        placeholder="Type a tag and press Enter or click Add"
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isSubmitting}
                        aria-describedby={
                          errors.tags ? "tags-error" : undefined
                        }
                      />
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={addTag}
                        disabled={!currentTag.trim() || isSubmitting}
                      >
                        <i className="bi bi-plus me-1" />
                        Add
                      </button>
                    </div>

                    {/* Display Tags */}
                    {tags.length > 0 && (
                      <div className="d-flex flex-wrap gap-2 mb-2">
                        {tags.map((tag, index) => (
                          <span
                            key={index}
                            className="badge bg-secondary d-flex align-items-center"
                          >
                            {tag}
                            <button
                              type="button"
                              className="btn-close btn-close-white ms-2"
                              style={{ fontSize: "0.6em" }}
                              onClick={() => removeTag(tag)}
                              disabled={isSubmitting}
                              aria-label={`Remove ${tag} tag`}
                            />
                          </span>
                        ))}
                      </div>
                    )}

                    {errors.tags && (
                      <div id="tags-error" className="text-danger">
                        <i className="bi bi-exclamation-circle me-1" />
                        {errors.tags.message as string}
                      </div>
                    )}
                  </div>
                );
              }}
            />
            <div className="form-text">
              Add relevant tags to help categorize your article. Press Enter or
              click Add to add each tag.
            </div>
          </div>

          {/* Featured Image Field */}
          <div className="col-12 mb-3">
            <label className="form-label">
              Featured Image <span className="text-danger">*</span>
            </label>
            <Controller
              name="img"
              control={control}
              render={({ field: { value, onChange, onBlur } }) => {
                return (
                  <ArticleImageUploader
                    name="img"
                    value={value}
                    onChange={(file) => {
                      onChange(file);
                      handleInputChange();
                    }}
                    onBlur={onBlur}
                    error={errors.img?.message as string}
                    disabled={isSubmitting}
                  />
                );
              }}
            />
            {errors.img && (
              <div className="text-danger mt-2">
                <i className="bi bi-exclamation-circle me-1" />
                {errors.img?.message as string}
              </div>
            )}
            <div className="form-text">
              Upload a featured image for your article. Recommended size:
              1200x630px.
            </div>
          </div>

          {/* Body/Content Field */}
          <div className="col-12 mb-3">
            <label className="form-label">
              Article Content <span className="text-danger">*</span>
            </label>
            <Controller
              name="body"
              control={control}
              render={({ field }) => (
                <div
                  className={`${
                    errors.body ? "border border-danger rounded" : ""
                  }`}
                >
                  <Tiptap
                    item={field.value || ""}
                    setItem={(content: string) => {
                      field.onChange(content);
                      handleInputChange();
                    }}
                    placeholder="Start writing your article content here..."
                    editable={!isSubmitting}
                    className="min-height-300"
                  />
                </div>
              )}
            />
            {errors.body && (
              <div className="text-danger mt-2">
                <i className="bi bi-exclamation-circle me-1" />
                {errors.body.message as string}
              </div>
            )}
            <div className="form-text">
              Write your article content using the rich text editor. You can
              format text, add links, and more.
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="d-flex justify-content-between align-items-center mt-4">
          <div>
            {!editMode && hasStartedEditing && (
              <small className="text-muted">
                <i className="bi bi-info-circle me-1" />
                Your progress is automatically saved as you type
              </small>
            )}
          </div>

          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={closeEditMode}
              disabled={isSubmitting}
            >
              <i className="bi bi-x-circle me-1" />
              Cancel
            </button>

            <button
              type="submit"
              className={`btn ${editMode ? "btn-warning" : "btn-primary"}`}
              disabled={isSubmitting || isCreating || isUpdating}
            >
              {isSubmitting ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                  {editMode ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <i
                    className={`bi ${
                      editMode ? "bi-pencil" : "bi-plus-circle"
                    } me-1`}
                  />
                  {editMode ? "Update Article" : "Create Article"}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ArticleForm;
