import React, { useCallback, useState } from "react";
import { TiTimes } from "react-icons/ti";
import Alert from "@/components/custom/Alert/Alert";
import Modal from "@/components/custom/Modal/modal";
import {
  useCreateArticleCategory,
  useDeleteArticleCategory,
  useUpdateArticleCategory,
} from "@/data/hooks/articles.hooks";
import {
  CategoryArray,
  Category,
  CreateCategory,
  UpdateCategory,
} from "@/types/articles";

interface ArticleCategoryFormProps {
  categories: CategoryArray;
}

interface AlertState {
  show: boolean;
  message: string;
  type: "success" | "danger" | "warning" | "info";
}

const categoryDefault: Partial<Category> = {
  id: undefined,
  category: "",
  description: "",
};

const ArticleCategoryForm: React.FC<ArticleCategoryFormProps> = ({
  categories,
}) => {
  const [item, setItem] = useState<Partial<Category>>(categoryDefault);
  const [edit, setEdit] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    message: "",
    type: "success",
  });
  const [modal, setModal] = useState<boolean>(false);

  const { mutateAsync: createCategory, isLoading: isCreating } =
    useCreateArticleCategory();
  const { mutateAsync: updateCategory, isLoading: isUpdating } =
    useUpdateArticleCategory();
  const { mutateAsync: deleteCategory, isLoading: isDeleting } =
    useDeleteArticleCategory();

  // Show alert function
  const showAlert = useCallback(
    (message: string, type: AlertState["type"] = "success") => {
      setAlert({ show: true, message, type });
      setTimeout(
        () => setAlert({ show: false, message: "", type: "success" }),
        5000
      );
    },
    []
  );

  // Close modal
  const closeModal = useCallback(() => {
    setItem(categoryDefault);
    setModal(false);
    setEdit(false);
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!item.category?.trim()) {
        showAlert("Category name is required", "danger");
        return;
      }

      try {
        if (edit && item.id) {
          // Update category
          await updateCategory({
            id: item.id,
            categoryData: {
              category: item.category,
              description: item.description || "",
            },
          });
          showAlert("Category updated successfully", "success");
        } else {
          // Create category
          await createCategory({
            category: item.category,
          });
          showAlert("Category created successfully", "success");
        }
        closeModal();
      } catch (error: any) {
        console.error("Error submitting category:", error);
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "An error occurred. Please try again.";
        showAlert(errorMessage, "danger");
      }
    },
    [item, edit, createCategory, updateCategory, showAlert, closeModal]
  );

  // Handle delete
  const handleDelete = useCallback(
    async (categoryId: number) => {
      try {
        await deleteCategory(categoryId);
        showAlert("Category deleted successfully", "success");
        closeModal();
      } catch (error: any) {
        console.error("Error deleting category:", error);
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "An error occurred. Please try again.";
        showAlert(errorMessage, "danger");
      }
    },
    [deleteCategory, showAlert, closeModal]
  );

  // Handle edit
  const handleEdit = useCallback((category: Category) => {
    setItem(category);
    setEdit(true);
    setModal(true);
  }, []);

  return (
    <div className="card p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Article Categories</h5>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => {
            setItem(categoryDefault);
            setEdit(false);
            setModal(true);
          }}
        >
          <i className="bi bi-plus me-1" />
          Add Category
        </button>
      </div>

      {/* Alert */}
      {alert.show && <Alert type={alert.type}>{alert.message}</Alert>}

      {/* Categories List */}
      <div className="row">
        {categories.length > 0 ? (
          categories.map((category) => (
            <div key={category.id} className="col-12 col-md-6 col-lg-4 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <h6 className="card-title text-truncate">
                    {category.category}
                  </h6>
                  {category.description && (
                    <p className="card-text small text-muted text-truncate">
                      {category.description}
                    </p>
                  )}
                </div>
                <div className="card-footer bg-transparent">
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleEdit(category)}
                      disabled={isUpdating}
                    >
                      <i className="bi bi-pencil me-1" />
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => {
                        setItem(category);
                        setModal(true);
                      }}
                      disabled={isDeleting}
                    >
                      <i className="bi bi-trash me-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="text-center py-4">
              <p className="text-muted">
                No categories found. Create one to get started.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modal for Add/Edit/Delete */}
      <Modal showmodal={modal} toggleModal={closeModal}>
        <div>
          {item.id && !edit ? (
            // Delete confirmation
            <>
              <h5 className="mb-3">Delete Category</h5>
              <p>Are you sure you want to delete &ldquo;{item.category}&rdquo;?</p>
              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => item.id && handleDelete(item.id)}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-trash me-1" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            // Add/Edit form
            <>
              <h5 className="mb-3">{edit ? "Edit" : "Add"} Category</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="category" className="form-label">
                    Category Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="category"
                    value={item.category || ""}
                    onChange={(e) =>
                      setItem({ ...item, category: e.target.value })
                    }
                    placeholder="Enter category name"
                    required
                    disabled={isCreating || isUpdating}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    rows={3}
                    value={item.description || ""}
                    onChange={(e) =>
                      setItem({ ...item, description: e.target.value })
                    }
                    placeholder="Enter category description (optional)"
                    disabled={isCreating || isUpdating}
                  />
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                    disabled={isCreating || isUpdating}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={
                      isCreating || isUpdating || !item.category?.trim()
                    }
                  >
                    {isCreating || isUpdating ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        {edit ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        <i
                          className={`bi ${
                            edit ? "bi-pencil" : "bi-plus"
                          } me-1`}
                        />
                        {edit ? "Update" : "Create"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ArticleCategoryForm;
