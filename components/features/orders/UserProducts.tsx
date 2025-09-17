import React, { useMemo, useState, useCallback, useEffect } from "react";
import { PiEmptyBold } from "react-icons/pi";
import ProductPlaceholder from "../../custom/ImagePlaceholders/Productplaceholder";
import Link from "next/link";
import { productsAPIendpoint, useProducts } from "@/data/hooks/product.hooks";
import { useSearchParams, useRouter } from "next/navigation";
import Pagination from "@/components/custom/Pagination/Pagination";
import SearchInput from "@/components/custom/Inputs/SearchInput";
import { useMyProfile } from "@/data/hooks/user.hooks";
import { ORGANIZATION_ID } from "@/data/constants";
import { Product } from "@/types/items";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";

/**
 * Enhanced UserProducts component with comprehensive error handling and safety checks
 * Manages user product browsing with pagination, search, and category filtering
 * Optimized with React.memo for performance
 */
const UserProducts: React.FC = React.memo(() => {
  const { data: user } = useMyProfile();
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

  
  // Safe state management
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Safe data fetching with validation
  const {
    data: products,
    isLoading: loadingProducts,
    error: queryError,
    isError
  } = useProducts(parseInt(ORGANIZATION_ID) || 0, {
    page: page,
    page_size: pageSize,
    category: currentCategory !== "All" ? currentCategory : null,
  });

  // Effect to handle query errors
  useEffect(() => {
    if (isError) {
      setError(queryError?.message || 'Failed to load products');
    } else {
      setError(null);
    }
  }, [isError, queryError]);

  // Safe page change handler
    const handlePageChange = useCallback(
      (newPage: string | number) => {
        const pageNumber =
          typeof newPage === "string" ? parseInt(newPage, 10) : newPage;
        if (isNaN(pageNumber) || pageNumber < 1) {
          console.error("Invalid page number:", newPage);
          return;
        }
        setPage(pageNumber);
      },
      [currentCategory, pageSize, router]
    );
  
    // Safe category change handler
    const handleCategoryChange = useCallback(
      (category: string) => {
        setCurrentCategory(category);
        setPage(1); // Reset to first page on category change
      },
      [page, pageSize, router]
    );

  // Safe filtered products with validation
  const filteredProducts = useMemo(() => {
    try {
      if (!products?.results || !Array.isArray(products.results)) return [];
      
      const validProducts = products.results.filter(product => 
        product && 
        typeof product === 'object' && 
        product.id && 
        product.name
      );

      if (!searchQuery || typeof searchQuery !== 'string') return validProducts;

      const query = searchQuery.toLowerCase().trim();
      if (!query) return validProducts;

      return validProducts.filter((product) => {
        const name = product.name || '';
        const description = product.description || '';
        const category = product.category?.category || '';
        
        return (
          name.toLowerCase().includes(query) ||
          description.toLowerCase().includes(query) ||
          category.toLowerCase().includes(query)
        );
      });
    } catch (error) {
      console.error('Error filtering products:', error);
      setError('Error processing products data');
      return [];
    }
  }, [products, searchQuery]);

  // Safe description truncation
  const getTruncatedDescription = useCallback((description: string | null, maxLength = 80) => {
    if (!description || typeof description !== 'string') return 'No description available';
    
    if (description.length <= maxLength) return description;
    
    return `${description.substring(0, maxLength).trim()}...`;
  }, []);

  // Safe URL validation
  const getSafeProductUrl = useCallback((product: Product) => {
    const url = product?.product_url;
    if (!url || typeof url !== 'string') return '#';
    
    try {
      // Basic URL validation
      if (url.startsWith('http://') || url.startsWith('https://')) {
        new URL(url); // Will throw if invalid
        return url;
      } else if (url.startsWith('/')) {
        return url; // Relative URL
      } else {
        return `https://${url}`; // Assume HTTPS if no protocol
      }
    } catch (error) {
      console.error('Invalid product URL:', url, error);
      return '#';
    }
  }, []);

  // Safe count display
  const getProductCount = useMemo(() => {
    const count = products?.count;
    if (typeof count !== 'number' || isNaN(count)) return 0;
    return Math.max(0, count);
  }, [products?.count]);

  // Loading state
  if (loadingProducts) {
    return (
      <div className="d-flex justify-content-center align-items-center p-5">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading products...</span>
          </div>
          <p className="text-muted">Loading your purchased products...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="alert alert-danger d-flex align-items-center" role="alert">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        <div>
          <strong>Error:</strong> {error}
          <br />
          <small>Please try refreshing the page or contact support if the issue persists.</small>
        </div>
      </div>
    );
  }

  // No session state
  if (!user) {
    return (
      <div className="alert alert-warning d-flex align-items-center" role="alert">
        <i className="bi bi-person-exclamation me-2"></i>
        <div>
          Please sign in to view your purchased products.
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header Section */}
      <div className="d-flex flex-column flex-md-row gap-3 align-items-center justify-content-between">
        <div>
          <h4 className="mt-3 mb-2">Products Purchased</h4>
          <p className="text-muted mb-0">
            {getProductCount} Product{getProductCount !== 1 ? "s" : ""} purchased
          </p>
        </div>
        <div className="mb-4 mb-md-0">
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            itemlabel="product"
          />
        </div>
      </div>

      {/* Search Results Header */}
      {searchQuery && (
        <div className="mb-3">
          <h5 className="mb-1">Search Results</h5>
          <p className="text-muted small">
            Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} matching &ldquo;{searchQuery}&rdquo;
          </p>
        </div>
      )}

      {/* Products Grid */}
      <div className="row g-3 mt-2">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const productName = product.name || 'Unnamed Product';
            const productCategory = product.category?.category || 'Uncategorized';
            const productDescription = getTruncatedDescription(product.description);
            const productUrl = getSafeProductUrl(product);
            const hasPreview = product.preview && product.img_url;

            return (
              <div key={product.id} className="col-12 col-md-6 col-lg-4">
                <div className="card h-100 p-3 border-0 shadow-sm">
                  <div className="d-flex align-items-start gap-3">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      {hasPreview ? (
                        <img
                          src={product.img_url}
                          alt={`${productName} preview`}
                          width={68}
                          height={68}
                          className="rounded-circle object-fit-cover border"
                          style={{ objectPosition: "center" }}
    
                        />
                      ) : null}
                      <div style={{ display: hasPreview ? 'none' : 'block' }}>
                        <ProductPlaceholder />
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex-grow-1" style={{ minWidth: 0 }}>
                      <h6 className="text-capitalize mb-1 text-truncate" title={productName}>
                        {productName}
                      </h6>
                      <p className="small text-muted mb-2 line-clamp-3" title={product.description}>
                        {productDescription}
                      </p>
                      
                      {/* Footer Section */}
                      <div className="d-flex flex-column gap-2 justify-content-between align-items-start mt-auto">
                        <p className="small text-muted mb-0">
                          {productCategory} Product
                        </p>
                        
                        {productUrl !== '#' ? (
                          <Link
                            href={productUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="badge bg-primary text-white py-2 px-2"
                            aria-label={`View ${productName} product`}
                          >
                            <i className="bi bi-box-arrow-up-right me-1"></i>
                            View Product
                          </Link>
                        ) : (
                          <span className="badge bg-secondary-light bg-opacity-10 text-secondary py-2 px-2 ">
                            No URL Available
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-12">
            <div className="text-center py-5">
              <PiEmptyBold
                className="mb-3 text-muted"
                style={{ fontSize: "4rem" }}
              />
              <h4 className="text-muted mb-2">No Products Found</h4>
              <p className="text-muted">
                {searchQuery 
                  ? `No products match your search for "${searchQuery}"` 
                  : "You haven't purchased any products yet"
                }
              </p>
              {searchQuery && (
                <button 
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loadingProducts && products && getProductCount > pageSize && (
        <div className="mt-4 d-flex justify-content-center">
          <Pagination
            currentPage={String(page)}
            totalPages={Math.ceil(getProductCount / pageSize)}
            handlePageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
});

// Add display name for debugging
UserProducts.displayName = 'UserProducts';

export default UserProducts;
