import React, { useState } from "react";
import { TiTimes } from "react-icons/ti";
import Alert from "@/components/custom/Alert/Alert";
import Modal from "@/components/custom/Modal/modal";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/data/categories/fetcher";
import { useCreateCategory, useDeleteCategory, useUpdateCategory } from "@/data/categories/categories.hook";
import { useUpdateComment } from "@/data/articles/articles.hook";

interface Category {
  id: number | null;
  category: string;
  description: string;
}

interface AlertState {
  show: boolean;
  message: string;
  type: string;
}

interface CategoriesFormProps {
  items: Category[];
  addUrl: string;
  updateUrl: string;
  deleteUrl: string;
  renderListItem?: (value: any) => React.ReactElement;
}

const categoryDefault: Category = { id: null, category: "", description: "" };

const CategoriesForm: React.FC<CategoriesFormProps> = ({
  items,
  addUrl,
  updateUrl,
  deleteUrl,
}) => {
  const [item, setItem] = useState<Category>(categoryDefault);
  const [edit, setEdit] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    message: "",
    type: "",
  });
  const [modal, setModal] = useState<boolean>(false);

  // -----------------------------------------
  // close modal
  // -----------------------------------------
  const closeModal = (): void => {
    setItem(categoryDefault);
    setModal(false);
  };

  // -----------------------------------------
  // handle create and edit item
  // -----------------------------------------
  const { mutateAsync:createCategory } = useCreateCategory();
  const { mutateAsync: updateCategory } = useUpdateCategory();

  const handleItem = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      if (edit) {
        await updateCategory({updateUrl, data: item});
      } else {
        await createCategory({createUrl: addUrl, data: item});
      }
      setItem(categoryDefault);
      setAlert({
        show: true,
        message: edit ? `Category Updated` : `Category Created`,
        type: "success",
      });
    } catch (error) {
      console.log(error);
      setAlert({
        show: true,
        message: "Something went wrong",
        type: "danger",
      });
    } finally {
      setEdit(false);
      setTimeout(() => {
        setAlert({ show: false, message: "", type: "" });
      }, 3000);
    }
  };

  // -----------------------------------------
  // delete item
  // -----------------------------------------
  const { mutateAsync: deleteCategory } = useDeleteCategory();

  const deleteItem = async (id: number): Promise<void> => {
    try {
      await deleteCategory({deleteUrl, id});
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="card p-4">
      <h6 className="mb-3">Create Category</h6>
      {alert.show && (
        <div>
          <Alert type={alert.type as any}>{alert.message} </Alert>
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
            onChange={(e) => setItem({ ...item, category : e.target.value })}
            placeholder={"Category Name"}
          />
          <button className="btn btn-primary rounded text-nowrap ms-2">
            {edit ? `Update Category` : `Add Category`}
          </button>
        </div>
      </form>

      {/* list items */}
      <div>
        {items?.map((item, i) => (
          <div
            key={item.id}
            className={`badge bg-secondary-light text-secondary mt-2 p-2 px-3 ${
              items.length === i + 1 ? "" : "me-2"
            }`}
          >
            <span
              onClick={() => {
                setItem(item);
                setEdit(true);
              }}
              style={{ cursor: "pointer" }}
            >
              {item.category}
            </span>
            <TiTimes
              className="ms-2"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setItem(item);
                setModal(true);
              }}
            />
          </div>
        ))}
      </div>
      <Modal showmodal={modal} toggleModal={() => closeModal()}>
        <p>Are you sure you want to delete this Category?</p>
        <h6>{item.category}</h6>
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-danger rounded"
            onClick={() => {
              if (item.id !== null) deleteItem(item.id);
              closeModal();
            }}
          >
            Yes
          </button>
          <button
            className="btn btn-primary rounded ms-2"
            onClick={() => closeModal()}
          >
            No
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CategoriesForm;
