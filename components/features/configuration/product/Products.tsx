"use client";
import React, { useEffect, useMemo, useState, useTransition } from "react";
import { useAdminContext } from "@/providers/context/Admincontextdata";
import Modal from "@/components/custom/Modal/modal";
import Alert from "@/components/custom/Alert/Alert";
import ProductCard from "./ProductCard";
import ProductForm from "./ProductForm";
import CategoryTabs from "@/components/features/Categories/Categoriestab";
import CategoriesForm from "@/components/features/Categories/Categories";
import Pagination from "@/components/custom/Pagination/Pagination";
import { RiShoppingBasketFill } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import {
  useDeleteProduct,
  useProductCategories,
  useProducts,
  useProductSubCategories,
} from "@/data/hooks/product.hooks";
import SearchInput from "@/components/custom/Inputs/SearchInput";
import { PulseLoader } from "react-spinners";
import { Product, ProductCategory } from "@/types/items";
import { ProductCategoryManager } from "../../Categories/CategoryManager";
import ProductsSubCatForm from "../../SubCategories/productssub";
import { ORGANIZATION_ID } from "@/data/constants";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";

type AlertState = {
  show: boolean;
  message: string;
  type: "info" | "success" | "warning" | "danger";
};

const Products = () => {
  const adminctx = useAdminContext();
  const [product, setProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [alert, setAlert] = useState<AlertState>({ show: false, message: "", type: "info" });
  const [addorupdate, setAddorupdate] = useState({ mode: "add", state: false });

  const [currentCategory, setCurrentCategory] = useQueryState(
    "category",
    parseAsString.withDefault("All")
  );
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [pageSize, setPageSize] = useQueryState(
    "page_size",
    parseAsInteger.withDefault(10)
  );
  const [allCategories, setAllCategories] = useState<ProductCategory[] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isdeleting, startDeletion] = useTransition();

  // Hooks
  const { mutateAsync: deleteProduct } = useDeleteProduct();
  const { data: productCategories, isLoading: loadingCategories, error: categoryError } = useProductCategories();
  // Fetch Products
  const {
    data: products,
    isLoading: loadingProducts,
    error: productsError,
  } = useProducts(parseInt(ORGANIZATION_ID) || 0);

  // -----------------------------------------
  // Handle page change
  // -----------------------------------------
  const handlePageChange = (newPage: string | number) => {
    const pageNum = typeof newPage === "string" ? parseInt(newPage) : newPage;
    if (isNaN(pageNum) || pageNum < 1) return;
    setPage(pageNum);
  };

  // -------------------------------
  // Handle category change
  // -------------------------------
  const handleCategoryChange = (category: ProductCategory | null) => {
    setCurrentCategory(category?.category || "All");
  };

  // Memoized filtered Products based on search query
  const filteredProducts = useMemo(() => {
    if (!products?.results) return [];
    if (!searchQuery) return products.results;

    return products.results.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  // ----------------------------------------------------
  // close modal
  // ----------------------------------------------------
  const closeModal = () => {
    setShowModal(false);
    setShowModal2(false);
    setProduct(null);
    setAddorupdate({ mode: "", state: false });
  };

  const handleAlert = (message: string, type: AlertState["type"]) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "info" }), 3000);
  };

  //----------------------------------------------------
  // Delete a product
  //----------------------------------------------------

  const handleDelete = async (id: number) => {
    startDeletion(async () => {
      try {
        await deleteProduct(id);
        handleAlert("Product deleted Successfully", "success");
        setShowModal2(false);
        setProduct(null);
      } catch (error: any) {
        console.log(error.message);
        handleAlert("Error deleting Product", "danger");
      }
    });
  };

  //   ------------------------------------------------------
  //   // Edit a product
  //   // ------------------------------------------------------
  const handleEdit = (product: Product) => {
    setProduct(product);
    setAddorupdate({ mode: "update", state: true });
    setShowModal(true);
  };

  //   ------------------------------------------------------
  //   // Delete a product confirmation
  //   // ------------------------------------------------------
  const handleDeleteConfirm = (product: Product) => {
    setProduct(product);
    setShowModal2(true);
  };

  //   ------------------------------------------------------
  //   // Handle form success
  //   // ------------------------------------------------------
  const handleFormSuccess = () => {
    handleAlert(
      addorupdate.mode === "add" ? "Product created successfully!" : "Product updated successfully!", 
      "success"
    );
    closeModal();
  };

  return (
    <div>
      <hr />
      <div className="row">
        <div className="col-12 col-md-7">
          <ProductCategoryManager />
        </div>

        <div className="col-12 col-md-5">
          <ProductsSubCatForm />
        </div>
      </div>

      {/* categories */}
      <div className="mb-3 ps-2 ps-md-0">
        {/* Categories */}
        <h5 className="mb-3 fw-bold">categories</h5>
        {loadingCategories && !categoryError ? (
          <div className="d-flex gap-2 align-items-center">
            {/* spinner */}
            <div
              className="spinner-border spinner-border-sm text-primary"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            fetching Products Categories
          </div>
        ) : (
          <CategoryTabs
            categories={allCategories || []}
            currentCategory={currentCategory}
            setCurrentCategory={(categoryName: string) => {
              const category = allCategories?.find(cat => cat.category === categoryName);
              handleCategoryChange(category || null);
            }}
          />
        )}
      </div>

      <div className="d-flex flex-column flex-md-row flex-wrap align-items-start align-items-md-center gap-3 pe-3 pb-3 mb-3">
        <button
          className="btn btn-primary border-0 rounded mb-2 mt-4 mt-md-0 mb-md-0"
          style={{ backgroundColor: "var(--bgDarkerColor)" }}
          onClick={() => {
            setAddorupdate({ mode: "add", state: true });
            setShowModal(true);
          }}
        >
          <i className="bi bi-plus-circle me-2 h5 mb-0"></i> Add{" "}
          {currentCategory} Product
        </button>
        <div>
          <h5 className="mb-1">{currentCategory} Products</h5>
          <p className="mb-0 text-primary">
            {(products?.count ?? 0)} Product{(products?.count ?? 0) !== 1 ? "s" : ""} in Total
          </p>
        </div>
        <div className="ms-0 ms-md-auto mb-4 mb-md-0">
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            itemlabel="product"
          />
        </div>
      </div>

      {alert.show && <Alert type={alert.type}>{alert.message}</Alert>}
      {searchQuery && <h5>Search Results</h5>}
      <div className="row">
        {
          // loading
          loadingProducts && !productsError && (
            <div className="d-flex justify-content-center">
              {/* spinner */}
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )
        }
        {!loadingProducts && filteredProducts?.length > 0 ? (
          filteredProducts?.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEdit}
              onDelete={handleDeleteConfirm}
              onView={adminctx?.openModal}
            />
          ))
        ) : (
          <div className="mt-3 mb-3 text-center">
            <RiShoppingBasketFill
              className="mt-2"
              style={{
                fontSize: "6rem",
                color: "var(--bgDarkerColor)",
              }}
            />
            <p className="mt-3 mb-3">no Products available</p>
          </div>
        )}

        {!loadingProducts &&
          products &&
          Math.ceil(products.count / pageSize) > 1 && (
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(products.count / pageSize)}
              handlePageChange={handlePageChange}
            />
          )}
      </div>

      <Modal
        showmodal={showModal}
        toggleModal={closeModal}
        overlayclose={false}
      >
        <ProductForm
          product={product}
          editMode={addorupdate.mode === "update"}
          onSuccess={handleFormSuccess}
          onCancel={closeModal}
        />
      </Modal>

      <Modal showmodal={showModal2} toggleModal={closeModal}>
        <div className="p-3">
          <p className="text-center">Delete Product</p>
          <hr />
          <h5 className="text-center mb-4">{product?.name}</h5>
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-danger border-0 rounded me-2"
              onClick={() => product && handleDelete(product.id)}
              disabled={isdeleting}
            >
              {isdeleting ? (
                <div className="d-inline-flex align-items-center justify-content-center gap-2">
                  <div>deleting Product</div>
                  <PulseLoader size={8} color={"#ffffff"} loading={true} />
                </div>
              ) : (
                "Delete"
              )}
            </button>
            <button
              className="btn btn-accent-secondary border-0 rounded"
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Products;
