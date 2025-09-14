import React, { useState, useCallback } from "react";
import { TiTimes } from "react-icons/ti";
import Alert from "@/components/custom/Alert/Alert";
import Modal from "@/components/custom/Modal/modal";

interface AlertState {
  show: boolean;
  message: string;
  type: "success" | "danger" | "warning" | "info";
}

/**
 * Individual Category Manager Components for different content types
 * Each component uses its specific mutation hooks with proper typing
 */
// ======================================================================
// Service Category Manager
// ======================================================================
import { 
  useCreateServiceCategory, 
  useUpdateServiceCategory, 
  useDeleteServiceCategory,
  useServiceCategories 
} from "@/data/hooks/service.hooks";

export const ServiceCategoryManager: React.FC = () => {
  const { data: serviceCategories = [] } = useServiceCategories();
  const serviceAddMutation = useCreateServiceCategory();
  const serviceUpdateMutation = useUpdateServiceCategory();
  const serviceDeleteMutation = useDeleteServiceCategory();

  const [categoryName, setCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [alert, setAlert] = useState<AlertState>({ show: false, message: "", type: "success" });
  const [modal, setModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<any>(null);

  const clearAlert = useCallback(() => {
    setTimeout(() => setAlert({ show: false, message: "", type: "success" }), 3000);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    try {
      if (editingCategory) {
        await serviceUpdateMutation.mutateAsync({
          categoryId: editingCategory.id,
          updateData: { category: categoryName }
        });
        setAlert({ show: true, message: "Service category updated successfully", type: "success" });
      } else {
        await serviceAddMutation.mutateAsync({ category: categoryName });
        setAlert({ show: true, message: "Service category created successfully", type: "success" });
      }
      setCategoryName("");
      setEditingCategory(null);
    } catch (error) {
      setAlert({ show: true, message: "Something went wrong", type: "danger" });
    }
    clearAlert();
  }, [categoryName, editingCategory, serviceAddMutation, serviceUpdateMutation, clearAlert]);

  const handleEdit = useCallback((category: any) => {
    setEditingCategory(category);
    setCategoryName(category.category);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!categoryToDelete) return;
    try {
      await serviceDeleteMutation.mutateAsync(categoryToDelete.id);
      setAlert({ show: true, message: "Service category deleted successfully", type: "success" });
      setModal(false);
      setCategoryToDelete(null);
    } catch (error) {
      setAlert({ show: true, message: "Failed to delete category", type: "danger" });
    }
    clearAlert();
  }, [categoryToDelete, serviceDeleteMutation, clearAlert]);

  return (
    <div className="card p-4">
      <h6 className="mb-3">Manage Service Categories</h6>
      
      {alert.show && <Alert type={alert.type}>{alert.message}</Alert>}
      
      <form onSubmit={handleSubmit}>
        <div className="d-flex align-items-center mb-3">
          <input
            type="text"
            className="form-control"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Service Category Name"
            required
          />
          <button 
            type="submit" 
            className="btn btn-primary rounded text-nowrap ms-2"
            disabled={serviceAddMutation.isLoading || serviceUpdateMutation.isLoading}
          >
            {(serviceAddMutation.isLoading || serviceUpdateMutation.isLoading) && (
              <span className="spinner-border spinner-border-sm me-2" />
            )}
            {editingCategory ? "Update" : "Add"} Category
          </button>
          {editingCategory && (
            <button 
              type="button" 
              className="btn btn-secondary ms-2"
              onClick={() => {
                setEditingCategory(null);
                setCategoryName("");
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div>
        {serviceCategories?.map((category, i) => (
          <div
            key={category.id}
            className={`badge bg-secondary-light text-secondary mt-2 p-2 px-3 ${
              serviceCategories.length === i + 1 ? "" : "me-2"
            }`}
          >
            <span
              onClick={() => handleEdit(category)}
              style={{ cursor: "pointer" }}
            >
              {category.category}
            </span>
            <TiTimes
              className="ms-2"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setCategoryToDelete(category);
                setModal(true);
              }}
            />
          </div>
        ))}
      </div>

      <Modal showmodal={modal} toggleModal={() => setModal(false)}>
        <p>Are you sure you want to delete this Service Category?</p>
        <h6>{categoryToDelete?.category}</h6>
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-danger rounded"
            onClick={handleDelete}
            disabled={serviceDeleteMutation.isLoading}
          >
            {serviceDeleteMutation.isLoading && (
              <span className="spinner-border spinner-border-sm me-2" />
            )}
            Yes
          </button>
          <button className="btn btn-primary rounded ms-2" onClick={() => setModal(false)}>
            No
          </button>
        </div>
      </Modal>
    </div>
  );
};

// ==========================================================================
// Product Category Manager
// ==========================================================================
import { 
  useAddProductCategory, 
  useUpdateProductCategory, 
  useDeleteProductCategory,
  useProductCategories 
} from "@/data/hooks/product.hooks";

export const ProductCategoryManager: React.FC = () => {
  const { data: productCategories = [] } = useProductCategories();
  const productAddMutation = useAddProductCategory();
  const productUpdateMutation = useUpdateProductCategory();
  const productDeleteMutation = useDeleteProductCategory();

  const [categoryName, setCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [alert, setAlert] = useState<AlertState>({ show: false, message: "", type: "success" });
  const [modal, setModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<any>(null);

  const clearAlert = useCallback(() => {
    setTimeout(() => setAlert({ show: false, message: "", type: "success" }), 3000);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    try {
      if (editingCategory) {
        await productUpdateMutation.mutateAsync({
          categoryId: editingCategory.id,
          updateData: { category: categoryName }
        });
        setAlert({ show: true, message: "Product category updated successfully", type: "success" });
      } else {
        await productAddMutation.mutateAsync({ category: categoryName });
        setAlert({ show: true, message: "Product category created successfully", type: "success" });
      }
      setCategoryName("");
      setEditingCategory(null);
    } catch (error) {
      setAlert({ show: true, message: "Something went wrong", type: "danger" });
    }
    clearAlert();
  }, [categoryName, editingCategory, productAddMutation, productUpdateMutation, clearAlert]);

  const handleEdit = useCallback((category: any) => {
    setEditingCategory(category);
    setCategoryName(category.category);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!categoryToDelete) return;
    try {
      await productDeleteMutation.mutateAsync(categoryToDelete.id);
      setAlert({ show: true, message: "Product category deleted successfully", type: "success" });
      setModal(false);
      setCategoryToDelete(null);
    } catch (error) {
      setAlert({ show: true, message: "Failed to delete category", type: "danger" });
    }
    clearAlert();
  }, [categoryToDelete, productDeleteMutation, clearAlert]);

  return (
    <div className="card p-4">
      <h6 className="mb-3">Manage Product Categories</h6>
      
      {alert.show && <Alert type={alert.type}>{alert.message}</Alert>}
      
      <form onSubmit={handleSubmit}>
        <div className="d-flex align-items-center mb-3">
          <input
            type="text"
            className="form-control"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Product Category Name"
            required
          />
          <button 
            type="submit" 
            className="btn btn-primary rounded text-nowrap ms-2"
            disabled={productAddMutation.isLoading || productUpdateMutation.isLoading}
          >
            {(productAddMutation.isLoading || productUpdateMutation.isLoading) && (
              <span className="spinner-border spinner-border-sm me-2" />
            )}
            {editingCategory ? "Update" : "Add"} Category
          </button>
          {editingCategory && (
            <button 
              type="button" 
              className="btn btn-secondary ms-2"
              onClick={() => {
                setEditingCategory(null);
                setCategoryName("");
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div>
        {productCategories?.map((category, i) => (
          <div
            key={category.id}
            className={`badge bg-secondary-light text-secondary mt-2 p-2 px-3 ${
              productCategories.length === i + 1 ? "" : "me-2"
            }`}
          >
            <span
              onClick={() => handleEdit(category)}
              style={{ cursor: "pointer" }}
            >
              {category.category}
            </span>
            <TiTimes
              className="ms-2"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setCategoryToDelete(category);
                setModal(true);
              }}
            />
          </div>
        ))}
      </div>

      <Modal showmodal={modal} toggleModal={() => setModal(false)}>
        <p>Are you sure you want to delete this Product Category?</p>
        <h6>{categoryToDelete?.category}</h6>
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-danger rounded"
            onClick={handleDelete}
            disabled={productDeleteMutation.isLoading}
          >
            {productDeleteMutation.isLoading && (
              <span className="spinner-border spinner-border-sm me-2" />
            )}
            Yes
          </button>
          <button className="btn btn-primary rounded ms-2" onClick={() => setModal(false)}>
            No
          </button>
        </div>
      </Modal>
    </div>
  );
};

// ========================================================
// Video Category Manager
// ========================================================
import { 
  useCreateVideoCategory, 
  useUpdateVideoCategory, 
  useDeleteVideoCategory,
  useVideoCategories 
} from "@/data/hooks/video.hooks";

export const VideoCategoryManager: React.FC = () => {
  const { data: videoCategories = [] } = useVideoCategories();
  const videoAddMutation = useCreateVideoCategory();
  const videoUpdateMutation = useUpdateVideoCategory();
  const videoDeleteMutation = useDeleteVideoCategory();

  const [categoryName, setCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [alert, setAlert] = useState<AlertState>({ show: false, message: "", type: "success" });
  const [modal, setModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<any>(null);

  const clearAlert = useCallback(() => {
    setTimeout(() => setAlert({ show: false, message: "", type: "success" }), 3000);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    try {
      if (editingCategory) {
        await videoUpdateMutation.mutateAsync({
          categoryId: editingCategory.id,
          updateData: { category: categoryName }
        });
        setAlert({ show: true, message: "Video category updated successfully", type: "success" });
      } else {
        await videoAddMutation.mutateAsync({ category: categoryName });
        setAlert({ show: true, message: "Video category created successfully", type: "success" });
      }
      setCategoryName("");
      setEditingCategory(null);
    } catch (error) {
      setAlert({ show: true, message: "Something went wrong", type: "danger" });
    }
    clearAlert();
  }, [categoryName, editingCategory, videoAddMutation, videoUpdateMutation, clearAlert]);

  const handleEdit = useCallback((category: any) => {
    setEditingCategory(category);
    setCategoryName(category.category);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!categoryToDelete) return;
    try {
      await videoDeleteMutation.mutateAsync(categoryToDelete.id);
      setAlert({ show: true, message: "Video category deleted successfully", type: "success" });
      setModal(false);
      setCategoryToDelete(null);
    } catch (error) {
      setAlert({ show: true, message: "Failed to delete category", type: "danger" });
    }
    clearAlert();
  }, [categoryToDelete, videoDeleteMutation, clearAlert]);

  return (
    <div className="card p-4">
      <h6 className="mb-3">Manage Video Categories</h6>
      
      {alert.show && <Alert type={alert.type}>{alert.message}</Alert>}
      
      <form onSubmit={handleSubmit}>
        <div className="d-flex align-items-center mb-3">
          <input
            type="text"
            className="form-control"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Video Category Name"
            required
          />
          <button 
            type="submit" 
            className="btn btn-primary rounded text-nowrap ms-2"
            disabled={videoAddMutation.isLoading || videoUpdateMutation.isLoading}
          >
            {(videoAddMutation.isLoading || videoUpdateMutation.isLoading) && (
              <span className="spinner-border spinner-border-sm me-2" />
            )}
            {editingCategory ? "Update" : "Add"} Category
          </button>
          {editingCategory && (
            <button 
              type="button" 
              className="btn btn-secondary ms-2"
              onClick={() => {
                setEditingCategory(null);
                setCategoryName("");
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div>
        {videoCategories?.map((category, i) => (
          <div
            key={category.id}
            className={`badge bg-secondary-light text-secondary mt-2 p-2 px-3 ${
              videoCategories.length === i + 1 ? "" : "me-2"
            }`}
          >
            <span
              onClick={() => handleEdit(category)}
              style={{ cursor: "pointer" }}
            >
              {category.category}
            </span>
            <TiTimes
              className="ms-2"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setCategoryToDelete(category);
                setModal(true);
              }}
            />
          </div>
        ))}
      </div>

      <Modal showmodal={modal} toggleModal={() => setModal(false)}>
        <p>Are you sure you want to delete this Video Category?</p>
        <h6>{categoryToDelete?.category}</h6>
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-danger rounded"
            onClick={handleDelete}
            disabled={videoDeleteMutation.isLoading}
          >
            {videoDeleteMutation.isLoading && (
              <span className="spinner-border spinner-border-sm me-2" />
            )}
            Yes
          </button>
          <button className="btn btn-primary rounded ms-2" onClick={() => setModal(false)}>
            No
          </button>
        </div>
      </Modal>
    </div>
  );
};

// Article Category Manager  
import { 
  useArticleCategories,
  useCreateArticleCategory,
  useUpdateArticleCategory,
  useDeleteArticleCategory
} from "@/data/hooks/articles.hooks";

export const ArticleCategoryManager: React.FC = () => {
  const { data: articleCategories = [] } = useArticleCategories();
  const articleAddMutation = useCreateArticleCategory();
  const articleUpdateMutation = useUpdateArticleCategory();
  const articleDeleteMutation = useDeleteArticleCategory();

  const [categoryName, setCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [alert, setAlert] = useState<AlertState>({ show: false, message: "", type: "success" });
  const [modal, setModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<any>(null);

  const clearAlert = useCallback(() => {
    setTimeout(() => setAlert({ show: false, message: "", type: "success" }), 3000);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    try {
      if (editingCategory) {
        await articleUpdateMutation.mutateAsync({
          id: editingCategory.id,
          categoryData: { category: categoryName }
        });
        setAlert({ show: true, message: "Article category updated successfully", type: "success" });
      } else {
        await articleAddMutation.mutateAsync({ category: categoryName });
        setAlert({ show: true, message: "Article category created successfully", type: "success" });
      }
      setCategoryName("");
      setEditingCategory(null);
    } catch (error) {
      setAlert({ show: true, message: "Something went wrong", type: "danger" });
    }
    clearAlert();
  }, [categoryName, editingCategory, articleAddMutation, articleUpdateMutation, clearAlert]);

  const handleEdit = useCallback((category: any) => {
    setEditingCategory(category);
    setCategoryName(category.category);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!categoryToDelete) return;
    try {
      await articleDeleteMutation.mutateAsync(categoryToDelete.id);
      setAlert({ show: true, message: "Article category deleted successfully", type: "success" });
      setModal(false);
      setCategoryToDelete(null);
    } catch (error) {
      setAlert({ show: true, message: "Failed to delete category", type: "danger" });
    }
    clearAlert();
  }, [categoryToDelete, articleDeleteMutation, clearAlert]);

  return (
    <div className="card p-4">
      <h6 className="mb-3">Manage Article Categories</h6>
      
      {alert.show && <Alert type={alert.type}>{alert.message}</Alert>}
      
      <form onSubmit={handleSubmit}>
        <div className="d-flex align-items-center mb-3">
          <input
            type="text"
            className="form-control"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Article Category Name"
            required
          />
          <button 
            type="submit" 
            className="btn btn-primary rounded text-nowrap ms-2"
            disabled={articleAddMutation.isLoading || articleUpdateMutation.isLoading}
          >
            {(articleAddMutation.isLoading || articleUpdateMutation.isLoading) && (
              <span className="spinner-border spinner-border-sm me-2" />
            )}
            {editingCategory ? "Update" : "Add"} Category
          </button>
          {editingCategory && (
            <button 
              type="button" 
              className="btn btn-secondary ms-2"
              onClick={() => {
                setEditingCategory(null);
                setCategoryName("");
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div>
        {articleCategories?.map((category, i) => (
          <div
            key={category.id}
            className={`badge bg-secondary-light text-secondary mt-2 p-2 px-3 ${
              articleCategories.length === i + 1 ? "" : "me-2"
            }`}
          >
            <span
              onClick={() => handleEdit(category)}
              style={{ cursor: "pointer" }}
            >
              {category.category}
            </span>
            <TiTimes
              className="ms-2"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setCategoryToDelete(category);
                setModal(true);
              }}
            />
          </div>
        ))}
      </div>

      <Modal showmodal={modal} toggleModal={() => setModal(false)}>
        <p>Are you sure you want to delete this Article Category?</p>
        <h6>{categoryToDelete?.category}</h6>
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-danger rounded"
            onClick={handleDelete}
            disabled={articleDeleteMutation.isLoading}
          >
            {articleDeleteMutation.isLoading && (
              <span className="spinner-border spinner-border-sm me-2" />
            )}
            Yes
          </button>
          <button className="btn btn-primary rounded ms-2" onClick={() => setModal(false)}>
            No
          </button>
        </div>
      </Modal>
    </div>
  );
};
