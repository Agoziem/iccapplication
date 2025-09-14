import React, { useState, useCallback, useMemo, useEffect } from "react";
import { TiTimes } from "react-icons/ti";
import Alert from "@/components/custom/Alert/Alert";
import Modal from "@/components/custom/Modal/modal";
import {
  useCreateProductSubCategory,
  useDeleteProductSubCategory,
  useProductCategories,
  useProductSubCategories,
  useUpdateProductSubCategory,
} from "@/data/hooks/product.hooks";
import { ProductCategory, ProductSubCategory } from "@/types/items";

type AlertType = "success" | "danger" | "warning" | "info";

interface AlertState {
  show: boolean;
  message: string;
  type: AlertType;
}

/**
 * Enhanced ProductsSub component with comprehensive error handling and type safety
 * Manages product subcategories with create, update, and delete functionality
 * Optimized with React.memo and proper TypeScript typing
 */
const ProductsSubCatForm: React.FC = React.memo(() => {
  const [currentCategory, setCurrentCategory] = useState<ProductCategory | null>(null);
  const [item, setItem] = useState<ProductSubCategory | null>(null);
  const [edit, setEdit] = useState(false);
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    message: "",
    type: "success",
  });
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data: subcategories, isLoading: loadingsubcategories } =
    useProductSubCategories(currentCategory?.id || 0);

  const { data: categories, isLoading: loadingCategories } =
    useProductCategories();

  // Memoized safe categories list
  const safeCategories = useMemo(() => {
    return categories || [];
  }, [categories]);

  const closeModal = useCallback(() => {
    setItem(null);
    setModal(false);
  }, []);

  const showAlert = useCallback((message: string, type: AlertType) => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "success" });
    }, 3000);
  }, []);

  // Mutations
  const { mutateAsync: createSubCategory } = useCreateProductSubCategory();
  const { mutateAsync: updateSubCategory } = useUpdateProductSubCategory();
  const { mutateAsync: deleteSubCategory } = useDeleteProductSubCategory();

  // Handle create and edit item with proper typing
  const handleItem = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!item || !currentCategory) return;
    
    setLoading(true);
    try {
      if (edit && item.id) {
        await updateSubCategory({
          subcategoryId: item.id,
          updateData: {
            category: currentCategory.id,
            subcategory: item.subcategory,
          },
        });
        showAlert("Subcategory Updated", "success");
      } else {
        await createSubCategory({
          category: currentCategory.id,
          subcategory: item.subcategory,
        });
        setItem({ id: 0, subcategory: "", category: currentCategory });
        showAlert("Subcategory Created", "success");
      }
      setEdit(false);
      setCurrentCategory(null);
    } catch (error) {
      console.error("Error handling subcategory:", error);
      showAlert("Something went wrong", "danger");
    } finally {
      setLoading(false);
    }
  }, [item, currentCategory, edit, createSubCategory, updateSubCategory, showAlert]);

  // Delete item with proper error handling
  const deleteItem = useCallback(async (id: number) => {
    try {
      await deleteSubCategory(id);
      showAlert("Subcategory deleted", "success");
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      showAlert("Something went wrong", "danger");
    }
  }, [deleteSubCategory, showAlert]);

  // Handle category change with proper typing
  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "") {
      setCurrentCategory(null);
      return;
    }
    const category = safeCategories.find((c) => c.category === e.target.value);
    setCurrentCategory(category || null);
  }, [safeCategories]);

  // Handle subcategory input change
  const handleSubCategory = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentCategory) return;
    
    setItem(prev => ({
      ...prev,
      id: prev?.id || 0,
      category: currentCategory,
      subcategory: e.target.value,
    }));
  }, [currentCategory]);

  // Handle edit subcategory
  const handleEditSubcategory = useCallback((subcategory: ProductSubCategory) => {
    setItem(subcategory);
    setEdit(true);
  }, []);

  // Handle delete modal
  const handleDeleteModal = useCallback((subcategory: ProductSubCategory) => {
    setItem(subcategory);
    setModal(true);
  }, []);

  // Safe subcategories list
  const safeSubcategories = useMemo(() => {
    return subcategories || [];
  }, [subcategories]);

  return (
    <div className="card p-4">
      <h6 className="mb-3">Create Sub-Category</h6>
      {alert.show && (
        <div className="mb-3">
          <Alert type={alert.type}>{alert.message}</Alert>
        </div>
      )}
      
      {/* Form */}
      <form onSubmit={handleItem}>
        <div className="mb-2">
          <select
            className="form-select mb-3"
            onChange={handleCategoryChange}
            value={currentCategory?.category || ""}
            required
            disabled={loadingCategories}
            aria-label="Select category"
          >
            {loadingCategories ? (
              <option>Loading...</option>
            ) : (
              <>
                <option value="">Select Category</option>
                {safeCategories.map((category) => (
                  <option key={category.id} value={category.category}>
                    {category.category}
                  </option>
                ))}
              </>
            )}
          </select>
        </div>
        
        <div className="d-flex align-items-center mb-3">
          <input
            type="text"
            className="form-control"
            value={item?.subcategory || ""}
            onChange={handleSubCategory}
            placeholder="Subcategory Name"
            required
            disabled={!currentCategory || loading}
            aria-label="Subcategory name"
          />
          <button 
            type="submit"
            className="btn btn-primary rounded text-nowrap ms-2"
            disabled={!currentCategory || !item?.subcategory?.trim() || loading}
          >
            {loading ? (
              <>
                <div className="spinner-border spinner-border-sm me-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                {edit ? "Updating..." : "Adding..."}
              </>
            ) : (
              edit ? "Update subcategory" : "Add subcategory"
            )}
          </button>
        </div>
      </form>

      {/* Subcategories List */}
      {loadingsubcategories ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading subcategories...</span>
          </div>
        </div>
      ) : safeSubcategories.length > 0 ? (
        <div>
          {safeSubcategories.map((subcategory, i) => (
            <div
              key={subcategory.id || i}
              className={`badge bg-secondary-light text-secondary mt-2 p-2 px-3 ${
                safeSubcategories.length === i + 1 ? "" : "me-2"
              }`}
            >
              <span
                onClick={() => handleEditSubcategory(subcategory)}
                style={{ cursor: "pointer" }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleEditSubcategory(subcategory);
                  }
                }}
                aria-label={`Edit subcategory: ${subcategory.subcategory}`}
              >
                {subcategory.subcategory}
              </span>
              <TiTimes
                className="ms-2"
                style={{ cursor: "pointer" }}
                onClick={() => handleDeleteModal(subcategory)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleDeleteModal(subcategory);
                  }
                }}
                aria-label={`Delete subcategory: ${subcategory.subcategory}`}
              />
            </div>
          ))}
        </div>
      ) : currentCategory ? (
        <p className="text-muted text-center mt-3">
          No subcategories found for {currentCategory.category}
        </p>
      ) : null}

      {/* Delete Confirmation Modal */}
      <Modal showmodal={modal} toggleModal={closeModal}>
        <p>
          Are you sure you want to delete this subcategory under{" "}
          <span className="fw-bold text-secondary">
            {item?.category?.category}
          </span>
          ?
        </p>
        <h6 className="text-danger">{item?.subcategory}</h6>
        <div className="d-flex justify-content-end gap-2 mt-3">
          <button
            className="btn btn-danger rounded"
            onClick={() => {
              if (item?.id) {
                deleteItem(item.id);
                closeModal();
              }
            }}
            aria-label="Confirm deletion"
          >
            Yes, Delete
          </button>
          <button
            className="btn btn-secondary rounded"
            onClick={closeModal}
            aria-label="Cancel deletion"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
});

ProductsSubCatForm.displayName = 'ProductsSubCatForm';

export default ProductsSubCatForm;
