import ArticleImageUploader from "@/components/custom/Imageuploader/ArticleImageUploader";
import React, { useContext, useEffect, useState } from "react";
import Alert from "@/components/custom/Alert/Alert";
import Tiptap from "@/components/custom/Richtexteditor/Tiptap";
import { TiTimes } from "react-icons/ti";
import { ArticleDefault } from "@/constants";
import { Controller, useForm } from "react-hook-form";
import { ArticleSchema } from "@/schemas/articles";
import { zodResolver } from "@hookform/resolvers/zod";
import { createArticle, updateArticle } from "@/data/articles/fetcher";
import { useSession } from "next-auth/react";
import {
  useCreateArticle,
  useUpdateArticle,
} from "@/data/articles/articles.hook";

/**
 * @param {{ article: Article;setArticle: (value:Article) => void; editMode: any; setEditMode: any; articles: ArticlesResponse; categories: any;  }} param0
 */
const ArticleForm = ({
  article,
  setArticle,
  editMode,
  setEditMode,
  categories,
}) => {
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [tag, setTag] = useState({ id: null, tag: "" });
  const [saving, setSaving] = useState(false);
  const [hasStartedEditing, setHasStartedEditing] = useState(false); // New state to track if editing has started
  const [progressRestoredMessage, setProgressRestoredMessage] = useState("");
  const { data: session } = useSession();
  const Organizationid = process.env.NEXT_PUBLIC_ORGANIZATION_ID;
  const { mutateAsync: createArticle } = useCreateArticle();
  const { mutateAsync: updateArticle } = useUpdateArticle();

  
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
    if (article) reset(article);
  }, [article]);

  // Load draft from local storage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem("draftArticle");
    if (savedDraft) {
      reset(JSON.parse(savedDraft));
      setProgressRestoredMessage("Your Draft was restored");
      setTimeout(() => {
        setProgressRestoredMessage("");
      }, 3000);
    }
  }, []);

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

  const createSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  };

  const closeEditMode = () => {
    setEditMode(false);
    reset(ArticleDefault);
    setHasStartedEditing(false); // Reset editing state
    localStorage.removeItem("editArticle");
    localStorage.removeItem("draftArticle");
  };


  /** @param {Article} data */
  const addArticle = async (data) => {
    try {
      const { category, tags, organization, ...restData } = data;

      // sublime relational fields to their Ids to avoid issues at the backend
      const data_to_submit = {
        ...restData,
        category: category?.id || null,
        tags: tags?.map((tag) => tag.tag) || [],
        author: editMode ? article.author.id : session?.user?.id,
        organization: Organizationid,
      };

      if (editMode) {
        await updateArticle(data_to_submit);
      } else {
        await createArticle(data_to_submit);
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
        setAlert({ show: false, message: "", type: "" });
      }, 3000);
      closeEditMode();
    }
  };

  // handle Validation Error
  const onError = (errors) => {
    console.log("Form errors:", errors);
    Object.entries(errors).forEach(([field, error]) => {
      console.error(`${field}: ${error.message}`);
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
            <div className="invalid-feedback">{errors.title.message}</div>
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
            <div className="invalid-feedback">{errors.subtitle.message}</div>
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
            <div className="text-danger">{errors.body.message}</div>
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
            <div className="invalid-feedback">{errors.readTime.message}</div>
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
                value={field.value.category}
                onChange={(e) => {
                  const selectedCategory = categories.find(
                    (cat) => cat.category === e.target.value
                  );
                  field.onChange(
                    selectedCategory || {
                      id: null,
                      category: "",
                      description: "",
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
            <div className="invalid-feedback">{errors.category.message}</div>
          )}

          {errors.category?.category && (
            <div className="invalid-feedback">
              {errors.category.category.message}
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
                    field.onChange([...field.value, tag]);
                    setTag({ id: null, tag: "" });
                    setHasStartedEditing(true);
                  }}
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
                    setValue(
                      "tags",
                      watch("tags").filter((tag) => tag.tag !== t.tag)
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
              <input type="text" className="form-control" {...field} readOnly />
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
                  value={{ img, img_url, img_name }} // Get current form values
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
            <div className="text-danger">{errors.img.message}</div>
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
