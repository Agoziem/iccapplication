import React, { useState } from "react";
import { TiTimes } from "react-icons/ti";
import Alert from "@/components/custom/Alert/Alert";
import Modal from "@/components/custom/Modal/modal";
import { SubCategorydefault } from "@/constants";
import {
  useCreateSubCategory,
  useDeleteSubCategory,
  useFetchSubCategories,
  useUpdateSubCategory,
} from "@/data/categories/categories.hook";

interface Category {
  id: number;
  category: string;
  description: string;
}

interface SubCategory {
  id?: number;
  subcategory: string;
  category: number;
}

interface AlertState {
  show: boolean;
  message: string;
  type: string;
}

interface SubCategoriesFormProps {
  categories: Category[];
  apiendpoint: string;
  addUrl: string;
  updateUrl: string;
  deleteUrl: string;
}

const SubCategoriesForm: React.FC<SubCategoriesFormProps> = ({
  categories, // array of categories
  apiendpoint,
  addUrl,
  updateUrl,
  deleteUrl,
}) => {
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [item, setItem] = useState<SubCategory>(SubCategorydefault as any);
  const [edit, setEdit] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    message: "",
    type: "",
  });
  const [modal, setModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { data: subcategories, isLoading: loadingsubcategories } =
    useFetchSubCategories(
      `${apiendpoint}/subcategories/${currentCategory?.id}/`,
      currentCategory?.id || 0
    );
  //   -----------------------------------------
  // close modal
  //   -----------------------------------------
  const closeModal = (): void => {
    setItem(SubCategorydefault as any);
    setModal(false);
  };

  //   -----------------------------------------
  // handle create and edit item
  //   -----------------------------------------
  const { mutateAsync: createSubCategory } = useCreateSubCategory();
  const { mutateAsync: updateSubCategory } = useUpdateSubCategory();
  const handleItem = async (e: React.FormEvent, url: string): Promise<void> => {
    e.preventDefault();
    try {
      if (edit) {
        await updateSubCategory(item as any);
      } else {
        await createSubCategory(item as any);
        setItem({ id: null, subcategory: "", category: null } as any);
        setAlert({
          show: true,
          message: edit ? `Subcategory Updated` : `Subcategory Created`,
          type: "success",
        });
      }
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
      setCurrentCategory(null);
    }
  };

  //   -----------------------------------------
  // delete item
  //   -----------------------------------------
  const { mutateAsync: deleteSubCategory } = useDeleteSubCategory();
  const deleteItem = async (id: number): Promise<void> => {
    try {
      await deleteSubCategory({ id, category_id: currentCategory?.id || 0 });
      setAlert({
        show: true,
        message: `Subcategory deleted`,
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
      setTimeout(() => {
        setAlert({ show: false, message: "", type: "" });
      }, 3000);
    }
  };

  //   -----------------------------------------
  // set current category and fetch subcategories on change of the categories select
  //   -----------------------------------------
  const handleCategoryChange = async (e: React.ChangeEvent<HTMLSelectElement>): Promise<void> => {
    if (e.target.value === "") return;
    const category = categories.find((c) => c.category === e.target.value);
    setCurrentCategory(category || null);
  };

  //   --------------------------------------------------------
  //   nest the category selected into the subcategory object
  //   --------------------------------------------------------
  const handleSubCategory = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setItem({
      ...item,
      category: currentCategory,
      subcategory: e.target.value,
    } as any);
  };

  return (
    <div className="card p-4">
      <h6 className="mb-3">Create Sub-Category</h6>
      {alert.show && (
        <div>
          <Alert type={alert.type as any}>{alert.message} </Alert>
        </div>
      )}
      {/* form */}
      <form
        onSubmit={(e) => {
          handleItem(e, edit ? `${updateUrl}/${item.id}/` : addUrl);
        }}
      >
        <div className="mb-2">
          <select
            className="form-select mb-3"
            onChange={handleCategoryChange}
            value={currentCategory?.category || ""}
            required
          >
            {loading ? (
              <option>Loading...</option>
            ) : (
              <>
                <option value="">Select Category</option>
                {categories?.map((category) => (
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
          />
          <button className="btn btn-primary rounded text-nowrap ms-2">
            {edit ? `Update subcategory` : `Add subcategory`}
          </button>
        </div>
      </form>

      {/* list items */}
      <div>
        {subcategories?.map((subcategory, i) => (
          <div
            key={subcategory.id}
            className={`badge bg-secondary-light text-secondary mt-2 p-2 px-3 ${
              subcategories.length === i + 1 ? "" : "me-2"
            }`}
          >
            <span
              onClick={() => {
                setItem(subcategory as any);
                setEdit(true);
              }}
              style={{ cursor: "pointer" }}
            >
              {subcategory.subcategory}
            </span>
            <TiTimes
              className="ms-2"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setItem(subcategory as any);
                setModal(true);
              }}
            />
          </div>
        ))}
      </div>
      <Modal showmodal={modal} toggleModal={() => closeModal()}>
        <p>
          Are you sure you want to delete this subcategory ? under{" "}
          <span className="fw-bold text-secondary">
            {(item?.category as any)?.category}
          </span>
        </p>
        <h6>{item?.subcategory}</h6>
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-danger rounded"
            onClick={() => {
              if (item?.id) deleteItem(item.id);
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

export default SubCategoriesForm;
