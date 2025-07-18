"use client";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAdminContext } from "@/data/payments/Admincontextdata";
import { useCart } from "@/data/carts/Cartcontext";
import CartButton from "@/components/custom/Offcanvas/CartButton";
import CategoryTabs from "@/components/features/Categories/Categoriestab";
import ProductCard from "@/components/features/Products/ProductCard";
import { RiShoppingBasketFill } from "react-icons/ri";
import Pagination from "@/components/custom/Pagination/Pagination";
import { useRouter } from "next/navigation";
import { productsAPIendpoint } from "@/data/product/fetcher";
import SearchInput from "@/components/custom/Inputs/SearchInput";
import { useFetchCategories } from "@/data/categories/categories.hook";
import { useFetchProducts } from "@/data/product/product.hook";
import AnimationContainer from "@/components/animation/animation-container";

const Products = () => {
  const { openModal } = useAdminContext();
  const { cart, addToCart, removeFromCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "All";
  const page = searchParams.get("page") || "1";
  const pageSize = "10";
  const [allCategories, setAllCategories] = useState([]);
  const Organizationid = process.env.NEXT_PUBLIC_ORGANIZATION_ID;
  const [searchQuery, setSearchQuery] = useState(""); // State for search input

  const {
    data: categories,
    isLoading: loadingCategories,
    error: categoryError,
  } = useFetchCategories(`${productsAPIendpoint}/categories/`);

  // ----------------------------------------------------
  // Add a new category to the list of categories
  // ----------------------------------------------------
  useEffect(() => {
    if (!categories) return;
    if (categories.length > 0)
      setAllCategories([
        { id: 0, category: "All", description: "All Categories" },
        ...categories,
      ]);
  }, [categories]);

  // ----------------------------------------
  // Fetch Products based on category
  // ----------------------------------------
  const {
    data: products,
    isLoading: loadingProducts,
    error,
  } = useFetchProducts(
    `${productsAPIendpoint}/products/${Organizationid}/?category=${currentCategory}&page=${page}&page_size=${pageSize}`
  );

  // ----------------------------------------
  // Fetch Products based on category
  // ----------------------------------------
  const {
    data: trendingproducts,
    isLoading: loadingTrendingProducts,
    error: trendingError,
  } = useFetchProducts(
    `${productsAPIendpoint}/trendingproducts/${Organizationid}/?category=${currentCategory}&page=1&page_size=6`
  );

  // -----------------------------------------
  // Handle page change
  // -----------------------------------------
  /**  @param {string} newPage */
  const handlePageChange = (newPage) => {
    router.push(
      `?category=${currentCategory}&page=${newPage}&page_size=${pageSize}`,
      {
        scroll: false,
      }
    );
  };

  // -------------------------------
  // Handle category change
  // -------------------------------
  /**  @param {string} category */
  const handleCategoryChange = (category) => {
    router.push(`?category=${category}&page=${page}&page_size=${pageSize}`, {
      scroll: false,
    });
  };

  // Memoized filtered services based on search query
  const filteredProducts = useMemo(() => {
    if (!products?.results) return [];
    if (!searchQuery) return products.results;

    return products.results.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center pe-3 mb-3 flex-wrap">
        <div>
          <h3 className="me-2">{currentCategory} Products</h3>
          <p className="mb-0 text-primary">
            {products?.count} Product{products?.count > 1 ? "s" : ""}
          </p>
        </div>
        <CartButton />
      </div>
      <hr />

      {/* categories */}
      <div className="mb-4  ps-2 ps-md-0">
        {/* Categories */}
        <h5 className="mb-3 fw-bold">categories</h5>
        <div className="d-flex flex-column flex-md-row gap-3 align-items-start align-items-md-center justify-content-between">
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
              categories={allCategories}
              currentCategory={currentCategory}
              setCurrentCategory={handleCategoryChange}
            />
          )}
          <div className="ms-0 ms-md-auto mb-4 mb-md-0">
            <SearchInput
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              itemlabel="product"
            />
          </div>
        </div>
      </div>

      {/* Products Section */}
      {searchQuery && <h5>Search Results</h5>}
      <div className="row">
        {
          // loading
          loadingProducts && !error ? (
            <div className="d-flex justify-content-center">
              {/* spinner */}
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : filteredProducts?.length > 0 ? (
            filteredProducts?.map((product, index) => (
              <AnimationContainer
                delay={0.1 * index}
                key={product.id}
                className="col-12 col-md-4"
              >
                <ProductCard
                  product={product}
                  addToCart={addToCart}
                  removeFromCart={removeFromCart}
                  cart={cart}
                  openModal={openModal}
                />
              </AnimationContainer>
            ))
          ) : (
            // Show "no services available" message if no services at all
            <div className="mt-3 mb-3 text-center">
              <RiShoppingBasketFill
                className="mt-2"
                style={{
                  fontSize: "6rem",
                  color: "var(--bgDarkerColor)",
                }}
              />
              <p className="mt-3 mb-3">No Product available at the moment</p>
            </div>
          )
        }

        {!loadingProducts &&
          products &&
          Math.ceil(products.count / parseInt(pageSize)) > 1 && (
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(products.count / parseInt(pageSize))}
              handlePageChange={handlePageChange}
            />
          )}
      </div>

      {/* Trending Products */}
      {!loadingTrendingProducts && trendingproducts?.results.length > 0 && (
        <>
          <hr />
          <div className="mb-3">
            <h5>Top Trending Products</h5>
          </div>
        </>
      )}
      <div className="row">
        {!loadingTrendingProducts && trendingproducts?.results.length > 0
          ? trendingproducts?.results.map((product) => (
              <div key={product.id} className="col-12 col-md-4">
                <ProductCard
                  product={product}
                  addToCart={addToCart}
                  removeFromCart={removeFromCart}
                  cart={cart}
                  openModal={openModal}
                />
              </div>
            ))
          : null}
      </div>
    </div>
  );
};

export default Products;
