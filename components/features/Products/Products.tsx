"use client";
import React, { useContext, useEffect, useMemo, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useAdminContext } from "@/providers/context/Admincontextdata";
import CartButton from "@/components/custom/Offcanvas/CartButton";
import CategoryTabs from "@/components/features/Categories/Categoriestab";
import ProductCard from "@/components/features/Products/ProductCard";
import { RiShoppingBasketFill } from "react-icons/ri";
import Pagination from "@/components/custom/Pagination/Pagination";
import { useRouter } from "next/navigation";
import { useProductCategories, useProducts, useTrendingProducts } from "@/data/hooks/product.hooks";
import SearchInput from "@/components/custom/Inputs/SearchInput";
import AnimationContainer from "@/components/animation/animation-container";
import { ORGANIZATION_ID } from "@/data/constants";
import { Category } from "@/types/categories";

type ExtendedCategory = Category & {
  description: string;
};

/**
 * Enhanced Products component with comprehensive error handling and safety checks
 * Manages product browsing with categories, search, pagination, and trending products
 * Optimized with React.memo for performance
 */
const Products: React.FC = React.memo(() => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams?.get("category") || "All";
  const page = searchParams?.get("page") || "1";
  const pageSize = "10";
  const [allCategories, setAllCategories] = useState<ExtendedCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(""); // State for search input

  const {
    data: categories,
    isLoading: loadingCategories,
    error: categoryError,
  } = useProductCategories();

  // ----------------------------------------------------
  // Add a new category to the list of categories with proper typing
  // ----------------------------------------------------
  useEffect(() => {
    if (!categories) return;
    if (categories.length > 0) {
      const allCategoriesWithAll: ExtendedCategory[] = [
        { id: 0, category: "All", description: "All Categories" },
        ...categories.map(cat => ({
          ...cat,
          description: cat.description || cat.category || 'Category'
        })),
      ];
      setAllCategories(allCategoriesWithAll);
    }
  }, [categories]);

  // ----------------------------------------
  // Fetch Products based on category
  // ----------------------------------------
  const {
    data: products,
    isLoading: loadingProducts,
    error,
  } = useProducts(parseInt(ORGANIZATION_ID) || 0, {
    category: currentCategory === "All" ? "" : currentCategory,
    page,
    page_size: pageSize,
  });

  // ----------------------------------------
  // Fetch Products based on category
  // ----------------------------------------
  const {
    data: trendingproducts,
    isLoading: loadingTrendingProducts,
    error: trendingError,
  } = useTrendingProducts(parseInt(ORGANIZATION_ID) || 0, {
    category: currentCategory === "All" ? "" : currentCategory,
    page: 1,
    page_size: 6,
  });
  // -----------------------------------------
  // Handle page change with proper type safety
  // -----------------------------------------
  const handlePageChange = useCallback((newPage: string | number) => {
    const pageValue = typeof newPage === 'number' ? newPage : parseInt(newPage, 10);
    
    if (isNaN(pageValue) || pageValue < 1) {
      console.error('Invalid page number:', newPage);
      return;
    }

    try {
      router.push(
        `?category=${encodeURIComponent(currentCategory)}&page=${pageValue}&page_size=${pageSize}`,
        {
          scroll: false,
        }
      );
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }, [currentCategory, pageSize, router]);

  // -------------------------------
  // Handle category change with proper validation
  // -------------------------------
  const handleCategoryChange = useCallback((category: string) => {
    if (!category || typeof category !== 'string') {
      console.error('Invalid category:', category);
      return;
    }

    try {
      router.push(`?category=${encodeURIComponent(category)}&page=1&page_size=${pageSize}`, {
        scroll: false,
      });
    } catch (error) {
      console.error('Category navigation error:', error);
    }
  }, [pageSize, router]);

  // Memoized filtered products based on search query
  const filteredProducts = useMemo(() => {
    if (!products?.results) return [];
    if (!searchQuery) return products.results;

    return products.results.filter((product) =>
      product.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  // Safe product count
  const safeProductCount = useMemo(() => {
    return products?.count || 0;
  }, [products?.count]);

  // Safe trending products check
  const safeTrendingProducts = useMemo(() => {
    return trendingproducts?.results || [];
  }, [trendingproducts?.results]);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center pe-3 mb-3 flex-wrap">
        <div>
          <h3 className="me-2">{currentCategory} Products</h3>
          <p className="mb-0 text-primary">
            {safeProductCount} Product{safeProductCount !== 1 ? "s" : ""}
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
      {!loadingTrendingProducts && safeTrendingProducts.length > 0 && (
        <>
          <hr />
          <div className="mb-3">
            <h5>Top Trending Products</h5>
          </div>
        </>
      )}
      <div className="row">
        {!loadingTrendingProducts && safeTrendingProducts.length > 0
          ? safeTrendingProducts.map((product) => (
              <div key={product.id} className="col-12 col-md-4">
                <ProductCard
                  product={product}
                />
              </div>
            ))
          : null}
      </div>
    </div>
  );
});

// Add display name for debugging
Products.displayName = 'Products';

export default Products;
