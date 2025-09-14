import React, { useState, useCallback } from "react";
import { TiTimes } from "react-icons/ti";
import Alert from "@/components/custom/Alert/Alert";
import Modal from "@/components/custom/Modal/modal";
import { Category, CreateCategory, UpdateCategory } from "@/types/categories";
import { UseMutationResult } from "react-query";
import { DeleteResponse, SuccessResponse } from "@/types/items";

interface AlertState {
  show: boolean;
  message: string;
  type: "success" | "danger" | "warning" | "info";
}

interface CategoryFormProps {
  items: Category[];
  contentType: "service" | "product" | "video" | "article";
  addMutation: UseMutationResult<Category, Error, CreateCategory>;
  updateMutation: UseMutationResult<Category, Error, { categoryId: number; updateData: UpdateCategory }>;
  deleteMutation: UseMutationResult<DeleteResponse, Error, number>;
}

const categoryDefault: Partial<Category> = { 
  id: undefined, 
  category: "", 
  description: "" 
};

const CategoriesForm: React.FC<CategoryFormProps> = ({
  items,
  contentType,
  addMutation,
  updateMutation,
  deleteMutation,
}) => {
  const [item, setItem] = useState<Partial<Category>>(categoryDefault);
  const [edit, setEdit] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    message: "",
    type: "success",
  });
  const [modal, setModal] = useState<boolean>(false);

  // -----------------------------------------
  // close modal
  // -----------------------------------------
  const closeModal = useCallback(() => {
    setItem(categoryDefault);
    setModal(false);
  }, []);

  // -----------------------------------------
  // clear alert after timeout
  // -----------------------------------------
  const clearAlert = useCallback(() => {
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "success" });
    }, 3000);
  }, []);

  const handleItem = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!item.category?.trim()) {
      setAlert({
        show: true,
        message: "Category name is required",
        type: "warning",
      });
      clearAlert();
      return;
    }

    try {
      if (edit && item.id) {
        await updateMutation.mutateAsync({
          categoryId: item.id,
          updateData: {
            category: item.category,
            description: item.description,
          }
        });
      } else {
        await addMutation.mutateAsync({
          category: item.category,
          description: item.description,
        });
      }
      
      setItem(categoryDefault);
      setAlert({
        show: true,
        message: edit ? `${contentType} Category Updated` : `${contentType} Category Created`,
        type: "success",
      });
    } catch (error) {
      console.error("Category operation error:", error);
      setAlert({
        show: true,
        message: "Something went wrong",
        type: "danger",
      });
    } finally {
      setEdit(false);
      clearAlert();
    }
  }, [item, edit, updateMutation, addMutation, contentType, clearAlert]);

  // -----------------------------------------
  // delete item
  // -----------------------------------------
  const deleteItem = useCallback(async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
      setAlert({
        show: true,
        message: `${contentType} Category deleted successfully`,
        type: "success",
      });
      clearAlert();
    } catch (error) {
      console.error("Delete category error:", error);
      setAlert({
        show: true,
        message: "Failed to delete category",
        type: "danger",
      });
      clearAlert();
    }
  }, [deleteMutation, contentType, clearAlert]);

  const handleEditClick = useCallback((categoryItem: Category) => {
    setItem(categoryItem);
    setEdit(true);
  }, []);

  const handleDeleteClick = useCallback((categoryItem: Category) => {
    setItem(categoryItem);
    setModal(true);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setItem(prev => ({ ...prev, category: e.target.value }));
  }, []);

  return (
    <div className="card p-4">
      <h6 className="mb-3">Create {contentType} Category</h6>
      {alert.show && (
        <div>
          <Alert type={alert.type}>{alert.message}</Alert>
        </div>
      )}
      {/* form */}
      <form onSubmit={handleItem}>
        <div className="d-flex align-items-center mb-3">
          <input
            type="text"
            className="form-control"
            required
            value={item.category || ""}
            onChange={handleInputChange}
            placeholder={`${contentType} Category Name`}
          />
          <button 
            className="btn btn-primary rounded text-nowrap ms-2"
            type="submit"
            disabled={addMutation.isLoading || updateMutation.isLoading}
          >
            {(addMutation.isLoading || updateMutation.isLoading) && (
              <span className="spinner-border spinner-border-sm me-2" role="status" />
            )}
            {edit ? `Update Category` : `Add Category`}
          </button>
        </div>
      </form>

      {/* list items */}
      <div>
        {items?.map((categoryItem, i) => (
          <div
            key={categoryItem.id}
            className={`badge bg-secondary-light text-secondary mt-2 p-2 px-3 ${
              items.length === i + 1 ? "" : "me-2"
            }`}
          >
            <span
              onClick={() => handleEditClick(categoryItem)}
              style={{ cursor: "pointer" }}
            >
              {categoryItem.category}
            </span>
            <TiTimes
              className="ms-2"
              style={{ cursor: "pointer" }}
              onClick={() => handleDeleteClick(categoryItem)}
            />
          </div>
        ))}
      </div>
      
      <Modal showmodal={modal} toggleModal={closeModal}>
        <p>Are you sure you want to delete this {contentType} Category?</p>
        <h6>{item.category}</h6>
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-danger rounded"
            onClick={() => {
              if (item.id) {
                deleteItem(item.id);
              }
              closeModal();
            }}
            disabled={deleteMutation.isLoading}
          >
            {deleteMutation.isLoading && (
              <span className="spinner-border spinner-border-sm me-2" role="status" />
            )}
            Yes
          </button>
          <button
            className="btn btn-primary rounded ms-2"
            onClick={closeModal}
          >
            No
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CategoriesForm;
