import ArticleImageUploader from "@/components/custom/Imageuploader/ArticleImageUploader";
import React, { useContext, useEffect, useState } from "react";
import Alert from "@/components/custom/Alert/Alert";
import Tiptap from "@/components/custom/Richtexteditor/Tiptap";
import { TiTimes } from "react-icons/ti";
import { ArticleDefault } from "@/constants";
import { Controller, useForm, FieldErrors } from "react-hook-form";
import { ArticleSchema } from "@/schemas/articles";
import { zodResolver } from "@hookform/resolvers/zod";
import { createArticle, updateArticle } from "@/data/article.hook";
import { useSession } from "next-auth/react";
import {
  useCreateArticle,
  useUpdateArticle,
} from "@/data/articles/articles.hook";
import { Article, ArticlesResponse, Tag } from "@/types/articles";
import { Categories } from "@/types/categories";

type AlertType = "success" | "danger" | "warning" | "info";

interface AlertState {
  show: boolean;
  message: string;
  type: AlertType;
}

interface TagInput {
  id: number | null;
  tag: string;
}

interface ArticleFormProps {
  article: Article;
  setArticle: (value: Article) => void;
  editMode: boolean;
  setEditMode: (value: boolean) => void;
  articles?: ArticlesResponse;
  categories: Categories;
}

const ArticleForm: React.FC<ArticleFormProps> = ({
  article,
  setArticle,
  editMode,
  setEditMode,
  categories,
}) => {
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    message: "",
    type: "info",
  });
  const [tag, setTag] = useState<TagInput>({ id: null, tag: "" });
  const [saving, setSaving] = useState<boolean>(false);
  const [hasStartedEditing, setHasStartedEditing] = useState<boolean>(false);
  const [progressRestoredMessage, setProgressRestoredMessage] = useState<string>("");
  const { data: session } = useSession();
  const Organizationid = process.env.NEXT_PUBLIC_ORGANIZATION_ID;
  const { mutateAsync: createArticleMutation } = useCreateArticle();
  const { mutateAsync: updateArticleMutation } = useUpdateArticle();

  
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    getValues,
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(
      ArticleSchema.omit({
        author: true,
      })
    ),
    defaultValues: article,
  });

  useEffect(() => {
    console.log("working");
    if (article && Object.keys(article).length > 0) {
      reset(article);
    }
  }, [article, reset]);

  // Load draft from local storage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem("draftArticle");
    if (savedDraft && !editMode) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        reset(parsedDraft);
        setProgressRestoredMessage("Your Draft was restored");
        setTimeout(() => {
          setProgressRestoredMessage("");
        }, 3000);
      } catch (error) {
        console.error("Error parsing saved draft:", error);
        localStorage.removeItem("draftArticle");
      }
    }
  }, [reset, editMode]);

  const watchformvalues = watch();

  // Save draft to local storage periodically
  useEffect(() => {
    if (!editMode && hasStartedEditing) {
      setSaving(true);
      localStorage.setItem("draftArticle", JSON.stringify(getValues() || {}));
      setSaving(false);
    }
    const interval = setInterval(() => {
      if (!editMode && hasStartedEditing) {
        setSaving(true);
        localStorage.setItem("draftArticle", JSON.stringify(getValues() || {}));
        setSaving(false);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [watchformvalues, editMode, hasStartedEditing]);

  const createSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  };

  const closeEditMode = (): void => {
    setEditMode(false);
    reset(ArticleDefault);
    setHasStartedEditing(false);
    localStorage.removeItem("editArticle");
    localStorage.removeItem("draftArticle");
  };

  const addArticle = async (data: Article): Promise<void> => {
    try {
      const { category, tags, organization, ...restData } = data;

      // Submit relational fields to their IDs to avoid issues at the backend
      const data_to_submit = {
        ...restData,
        category: category?.id || null,
        tags: tags?.map((tag) => tag.tag) || [],
        author: editMode && article.author?.id ? article.author.id : session?.user?.id,
        organization: Organizationid,
      };

      if (editMode) {
        await updateArticleMutation(data_to_submit as Partial<Article>);
      } else {
        await createArticleMutation(data_to_submit as Partial<Article>);
      }
      setAlert({
        show: true,
        message: `Article ${editMode ? "edited" : "created"} Successfully`,
        type: "success",
      });
    } catch (error) {
      console.error("Error creating/updating article:", error);
      setAlert({
        show: true,
        message: "Something went wrong, please try again later",
        type: "danger",
      });
    } finally {
      setTimeout(() => {
        setAlert({ show: false, message: "", type: "info" });
      }, 3000);
      closeEditMode();
    }
  };

  // handle Validation Error
  const onError = (errors: FieldErrors<Article>): void => {
    console.log("Form errors:", errors);
    Object.entries(errors).forEach(([field, error]) => {
      if (error && typeof error === 'object' && 'message' in error) {
        console.error(`${field}: ${error.message}`);
      }
    });
  };

  return (
    <div className="card p-4 px-md-5 py-5">
      <h4 className="mb-3">{editMode ? "Edit Article" : "Create Article"}</h4>
      {progressRestoredMessage && (
        <div className="text-success fw-bold">{progressRestoredMessage}</div>
      )}
      <hr />
      <form onSubmit={handleSubmit(addArticle, onError)} noValidate>
        {/* Title */}
        <div className="form-group mb-3">
          <label>Title</label>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <input
                type="text"
                className={`form-control ${errors.title ? "is-invalid" : ""}`}
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  setValue("slug", createSlug(e.target.value));
                }}
              />
            )}
          />
          {errors.title && (
            <div className="invalid-feedback">
              {typeof errors.title.message === 'string' ? errors.title.message : 'Title is required'}
            </div>
          )}
        </div>

        {/* Subtitle */}
        <div className="form-group mb-3">
          <label>Subtitle</label>
          <input
            type="text"
            className={`form-control ${errors.subtitle ? "is-invalid" : ""}`}
            {...register("subtitle")}
          />
          {errors.subtitle && (
            <div className="invalid-feedback">
              {typeof errors.subtitle.message === 'string' ? errors.subtitle.message : 'Subtitle is required'}
            </div>
          )}
        </div>

        {/* Body (Tiptap Editor) */}
        <div className="form-group mb-3">
          <label>Body</label>
          <Controller
            name="body"
            control={control}
            render={({ field }) => (
              <Tiptap
                item={watch("body")}
                setItem={(value) =>
                  setValue("body", value, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  })
                }
                setHasStartedEditing={setHasStartedEditing}
              />
            )}
          />
          {errors.body && (
            <div className="text-danger">
              {typeof errors.body.message === 'string' ? errors.body.message : 'Body content is required'}
            </div>
          )}
        </div>

        {/* Read Time */}
        <div className="form-group mb-3">
          <label>Read Time (Minutes)</label>
          <input
            type="number"
            className={`form-control ${errors.readTime ? "is-invalid" : ""}`}
            min={1}
            {...register("readTime", { valueAsNumber: true })}
          />
          {errors.readTime && (
            <div className="invalid-feedback">
              {typeof errors.readTime.message === 'string' ? errors.readTime.message : 'Read time is required'}
            </div>
          )}
        </div>

        {/* Category */}
        <div className="form-group mb-4">
          <label>Category</label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <select
                className={`form-select ${errors.category ? "is-invalid" : ""}`}
                value={field.value?.category || ""}
                onChange={(e) => {
                  const selectedCategory = categories?.find(
                    (cat) => cat.category === e.target.value
                  );
                  field.onChange(
                    selectedCategory || {
                      id: null,
                      category: "",
                      description: null,
                    }
                  );
                }}
              >
                <option value="">Select Category</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.category}>
                    {category.category}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.category && (
            <div className="invalid-feedback">
              {typeof errors.category.message === 'string' ? errors.category.message : 'Category is required'}
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="form-group mb-3">
          <label>Tags</label>
          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <div className="d-flex align-items-center">
                <input
                  type="text"
                  className="form-control"
                  value={tag.tag}
                  onChange={(e) => setTag({ ...tag, tag: e.target.value })}
                />

                <button
                  type="button"
                  className="rounded btn btn-primary ms-2 flex-fill text-nowrap"
                  onClick={() => {
                    if (tag.tag.trim()) {
                      const currentTags = field.value || [];
                      const newTag: Tag = { id: tag.id, tag: tag.tag.trim() };
                      field.onChange([...currentTags, newTag]);
                      setTag({ id: null, tag: "" });
                      setHasStartedEditing(true);
                    }
                  }}
                  disabled={!tag.tag.trim()}
                >
                  Add Tag
                </button>
              </div>
            )}
          />

          {/* Tags list */}
          <div className="mt-3">
            {watch("tags")?.map((t, i) => (
              <div
                key={i}
                className="badge bg-secondary-light text-secondary rounded-pill py-2 px-3 me-2 mb-2"
              >
                {t.tag}
                <TiTimes
                  className="ms-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    const currentTags = watch("tags") || [];
                    setValue(
                      "tags",
                      currentTags.filter((tag) => tag.tag !== t.tag)
                    );
                    setHasStartedEditing(true);
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Slug (Generated automatically) */}
        <div className="form-group mb-3">
          <label>Slug</label>
          <Controller
            name="slug"
            control={control}
            render={({ field }) => (
              <input 
                type="text" 
                className="form-control" 
                {...field} 
                value={field.value || ""} 
                readOnly 
              />
            )}
          />
        </div>

        {/* Image Uploader using Controller */}
        <div className="mb-2">
          <Controller
            name="img"
            control={control}
            render={({ field }) => {
              const [img, img_url, img_name] = watch([
                "img",
                "img_url",
                "img_name",
              ]) || [null, "", ""];
              return (
                <ArticleImageUploader
                  value={{ 
                    img: img || null, 
                    img_url: img_url || null, 
                    img_name: img_name || null 
                  }}
                  onChange={(value) => {
                    console.log(value);
                    setValue("img", value.img, { shouldValidate: true });
                    setValue("img_url", value.img_url, {
                      shouldValidate: true,
                    });
                    setValue("img_name", value.img_name, {
                      shouldValidate: true,
                    });
                  }}
                />
              );
            }}
          />
          {errors.img && (
            <div className="text-danger">
              {typeof errors.img.message === 'string' ? errors.img.message : 'Image is required'}
            </div>
          )}
        </div>

        {/* Alert Message */}
        {alert.show && <Alert type={alert.type}>{alert.message}</Alert>}

        {/* Cancel and Submit Buttons */}
        <div className="d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-accent-secondary me-3"
            onClick={() => closeEditMode()}
          >
            Cancel {editMode ? "Edit" : "Create"}
          </button>
          <button
            type="submit"
            className={`btn btn-primary`}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : editMode
              ? "Update Article"
              : "Create Article"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArticleForm;
