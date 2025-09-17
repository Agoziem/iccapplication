"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { useAdminContext } from "@/providers/context/Admincontextdata";
import { useCart } from "@/providers/context/Cartcontext";
import {
  useServiceCategories,
  useServices,
  useTrendingServices,
} from "@/data/hooks/service.hooks";
import ServiceCard from "@/components/features/Services/ServiceCard";
import CartButton from "@/components/custom/Offcanvas/CartButton";
import CategoryTabs from "@/components/features/Categories/Categoriestab";
import Pagination from "@/components/custom/Pagination/Pagination";
import SearchInput from "@/components/custom/Inputs/SearchInput";
import { BsPersonFillGear } from "react-icons/bs";
import AnimationContainer from "@/components/animation/animation-container";
import { ORGANIZATION_ID } from "@/data/constants";
import {
  useQueryState,
  parseAsString,
  parseAsNumberLiteral,
  parseAsInteger,
} from "nuqs";

interface ExtendedCategory {
  id: number;
  category: string;
  description: string;
}

/**
 * Enhanced Services component with comprehensive error handling and performance optimization
 * Displays services with category filtering, search, and pagination functionality
 * Optimized with React.memo and proper TypeScript typing
 */
const Services: React.FC = React.memo(() => {
  const router = useRouter();
  const [currentCategory, setCurrentCategory] = useQueryState(
    "category",
    parseAsString.withDefault("All")
  );
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [pageSize, setPageSize] = useQueryState(
    "page_size",
    parseAsInteger.withDefault(10)
  );
  const [allCategories, setAllCategories] = useState<ExtendedCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(""); // State for search input

  const {
    data: categories,
    isLoading: loadingCategories,
    error: categoryError,
  } = useServiceCategories();

  useEffect(() => {
    if (categories && categories.length > 0) {
      setAllCategories([
        { id: 0, category: "All", description: "All Categories" },
        ...categories.map((cat) => ({
          id: cat.id || 0,
          category: cat.category || "",
          description: cat.description || "",
        })),
      ]);
    }
  }, [categories]);

  // Fetch services
  const {
    data: services,
    isLoading: loadingServices,
    error,
  } = useServices(parseInt(ORGANIZATION_ID) || 0, {
    category: currentCategory === "All" ? "" : currentCategory,
    page,
    page_size: pageSize,
  });

  // Fetch trending services
  const {
    data: trendingservices,
    isLoading: loadingTrendingServices,
    error: trendingError,
  } = useTrendingServices(parseInt(ORGANIZATION_ID) || 0, {
    category: currentCategory === "All" ? "" : currentCategory,
    page,
    page_size: 6,
  });

  // Handle category change
  const handleCategoryChange = useCallback(
    (category: string) => {
      setCurrentCategory(category);
      setPage(1);
    },
    [router, pageSize]
  );

  // Safe pagination handler
  const handlePageChange = useCallback(
    (newPage: string | number) => {
      if (typeof newPage === "string") {
        setPage(parseInt(newPage, 10));
      } else {
        setPage(newPage);
      }
    },
    [router, currentCategory, pageSize]
  );

  // Memoized filtered services based on search query
  const filteredServices = useMemo(() => {
    const serviceResults = services?.results || [];
    if (!searchQuery.trim()) return serviceResults;

    return serviceResults.filter(
      (service) =>
        service?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        false
    );
  }, [services?.results, searchQuery]);

  // Safe service count calculation
  const serviceCount = useMemo(() => {
    const count = services?.count || 0;
    return count > 1 ? `${count} Services` : `${count} Service`;
  }, [services?.count]);

  // Safe page calculation
  const totalPages = useMemo(() => {
    if (!services?.count) return 0;
    return Math.ceil(services.count / pageSize);
  }, [services?.count, pageSize]);

  // Safe trending services validation
  const validTrendingServices = useMemo(() => {
    return (
      trendingservices?.results?.filter((service) => service && service.id) ||
      []
    );
  }, [trendingservices?.results]);

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between pe-3 mb-3 flex-wrap">
        <div>
          <h3 className="me-2">{currentCategory} Services</h3>
          <p className="mb-0 text-primary">{serviceCount} in Total</p>
        </div>
        <CartButton />
      </div>
      <hr />

      {/* Categories and Search Input */}
      <div className="mb-4 ps-2 ps-md-0">
        <h5 className="mb-3 fw-bold">Categories</h5>
        <div className="d-flex flex-column flex-md-row gap-3 align-items-start align-items-md-center justify-content-between">
          {loadingCategories && !categoryError ? (
            <div className="d-flex gap-2 align-items-center">
              <div
                className="spinner-border spinner-border-sm text-primary"
                role="status"
                aria-label="Loading categories"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
              Fetching Service Categories
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
              itemlabel="service"
            />
          </div>
        </div>
      </div>

      {/* Services Section */}
      {searchQuery.trim() && <h5>Search Results</h5>}
      <div className="row">
        {loadingServices && !error ? (
          <div className="d-flex justify-content-center">
            <div
              className="spinner-border text-primary"
              role="status"
              aria-label="Loading services"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : filteredServices?.length > 0 ? (
          // <AnimatePresence mode="wait">
          //   {filteredServices?.map((service, index) => (
          //     <AnimationContainer
          //       delay={index * 0.1}
          //       key={`${currentCategory}-${service?.id || index}-${page}`}
          //       className="col-12 col-md-4"
          //     >
          //       <ServiceCard service={service} />
          //     </AnimationContainer>
          //   ))}
          // </AnimatePresence>
          <div className="row">
            {filteredServices?.map((service, index) => (
              <div key={service.id} className="col-12 col-md-4">
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-3 mb-3 text-center">
            <BsPersonFillGear
              className="mt-2"
              style={{ fontSize: "6rem", color: "var(--bgDarkerColor)" }}
              aria-hidden="true"
            />
            <p className="mt-3 mb-3">No Service available at the moment</p>
          </div>
        )}

        {!loadingServices && services && totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        )}
      </div>

      {/* Trending Services */}
      {!loadingTrendingServices && validTrendingServices.length > 0 && (
        <>
          <hr />
          <div className="mb-3">
            <h5>Top Trending Services</h5>
          </div>
          <div className="row">
            {validTrendingServices.map((service) => (
              <div key={service.id} className="col-12 col-md-4">
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
});

Services.displayName = "Services";

export default Services;
