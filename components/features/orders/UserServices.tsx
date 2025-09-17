import React, { useMemo, useState, useCallback, useEffect } from "react";
import { PiEmptyBold } from "react-icons/pi";
import ServicesPlaceholder from "../../custom/ImagePlaceholders/ServicesPlaceholder";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { servicesAPIendpoint, useServices } from "@/data/hooks/service.hooks";
import Pagination from "@/components/custom/Pagination/Pagination";
import SearchInput from "@/components/custom/Inputs/SearchInput";
import { useMyProfile } from "@/data/hooks/user.hooks";
import { ORGANIZATION_ID } from "@/data/constants";
import { Service } from "@/types/items";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";

/**
 * Enhanced UserServices component with comprehensive error handling and safety checks
 * Manages user service browsing with pagination, search, and category filtering
 * Optimized with React.memo for performance
 */
const UserServices: React.FC = React.memo(() => {
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
    data: services,
    isLoading: loadingServices,
    error: queryError,
    isError,
  } = useServices(parseInt(ORGANIZATION_ID) || 0, {
    page: page,
    page_size: pageSize,
    category: currentCategory !== "All" ? currentCategory : null,
  });

  // Effect to handle query errors
  useEffect(() => {
    if (isError) {
      setError(queryError?.message || "Failed to load services");
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

  // Safe filtered services with validation
  const filteredService = useMemo(() => {
    try {
      if (!services?.results || !Array.isArray(services.results)) return [];

      const validServices = services.results.filter(
        (service) =>
          service && typeof service === "object" && service.id && service.name
      );

      if (!searchQuery || typeof searchQuery !== "string") return validServices;

      const query = searchQuery.toLowerCase().trim();
      if (!query) return validServices;

      return validServices.filter((service) => {
        const name = service.name || "";
        const description = service.description || "";
        const category = service.category?.category || "";

        return (
          name.toLowerCase().includes(query) ||
          description.toLowerCase().includes(query) ||
          category.toLowerCase().includes(query)
        );
      });
    } catch (error) {
      console.error("Error filtering services:", error);
      setError("Error processing services data");
      return [];
    }
  }, [services, searchQuery]);

  // Safe service status determination
  const getServiceStatus = useCallback(
    (service: Service) => {
      try {
        if (!service || !user || !user.id) {
          return (
            <div className="badge bg-secondary-light bg-opacity-10 text-secondary py-2">
              Unknown
            </div>
          );
        }

        const inProgressIds =
          service.userIDs_whose_services_is_in_progress || [];
        const completedIds =
          service.userIDs_whose_services_have_been_completed || [];

        // Ensure arrays and safe includes check
        const inProgress =
          Array.isArray(inProgressIds) &&
          inProgressIds.some((id) => id === user.id);

        const completed =
          Array.isArray(completedIds) &&
          completedIds.some((id) => id === user.id);

        if (completed) {
          return (
            <div className="badge bg-success-light text-success  py-2 px-2">
              <i className="bi bi-check-circle me-1"></i>
              Completed
            </div>
          );
        }

        if (inProgress) {
          return (
            <div className="badge bg-primary-light text-primary py-2 px-2">
              <i className="bi bi-clock me-1"></i>
              In Progress
            </div>
          );
        }

        return (
          <div className="badge bg-primary text-white py-2 px-2">
            <i className="bi bi-cart-check me-1"></i>
            Purchased
          </div>
        );
      } catch (error) {
        console.error("Error determining service status:", error);
        return (
          <div className="badge bg-primary text-white py-2 px-2">
            Unknown
          </div>
        );
      }
    },
    [user?.id]
  );

  // Safe service link check
  const shouldShowViewLink = useCallback(
    (service: Service) => {
      try {
        if (!service || !user || !user.id) return false;

        const completedIds =
          service.userIDs_whose_services_have_been_completed || [];
        return (
          !Array.isArray(completedIds) ||
          !completedIds.some((id) => id === user.id)
        );
      } catch (error) {
        console.error("Error checking view link visibility:", error);
        return false;
      }
    },
    [user?.id]
  );

  // Safe description truncation
  const getTruncatedDescription = useCallback(
    (description: string | undefined, maxLength = 80) => {
      if (!description || typeof description !== "string")
        return "No description available";

      if (description.length <= maxLength) return description;

      return `${description.substring(0, maxLength).trim()}...`;
    },
    []
  );

  // Safe count display
  const getServiceCount = useMemo(() => {
    const count = services?.count;
    if (typeof count !== "number" || isNaN(count)) return 0;
    return Math.max(0, count);
  }, [services?.count]);

  // Loading state
  if (loadingServices) {
    return (
      <div className="d-flex justify-content-center align-items-center p-5">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading services...</span>
          </div>
          <p className="text-muted">Loading your purchased services...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className="alert alert-danger d-flex align-items-center"
        role="alert"
      >
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        <div>
          <strong>Error:</strong> {error}
          <br />
          <small>
            Please try refreshing the page or contact support if the issue
            persists.
          </small>
        </div>
      </div>
    );
  }

  // No session state
  if (!user) {
    return (
      <div
        className="alert alert-warning d-flex align-items-center"
        role="alert"
      >
        <i className="bi bi-person-exclamation me-2"></i>
        <div>Please sign in to view your purchased services.</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header Section */}
      <div className="d-flex flex-column flex-md-row gap-3 align-items-center justify-content-between">
        <div>
          <h4 className="mt-3 mb-2">Services Purchased</h4>
          <p className="text-muted mb-0">
            {getServiceCount} Service{getServiceCount !== 1 ? "s" : ""}{" "}
            purchased
          </p>
        </div>
        <div className="mb-4 mb-md-0">
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            itemlabel="service"
          />
        </div>
      </div>

      {/* Search Results Header */}
      {searchQuery && (
        <div className="mb-3">
          <h5 className="mb-1">Search Results</h5>
          <p className="text-muted small">
            Found {filteredService.length} service
            {filteredService.length !== 1 ? "s" : ""} matching &ldquo;
            {searchQuery}&rdquo;
          </p>
        </div>
      )}

      {/* Services Grid */}
      <div className="row g-3 mt-2">
        {filteredService.length > 0 ? (
          filteredService.map((service) => {
            const serviceToken = service.service_token;
            const serviceName = service.name || "Unnamed Service";
            const serviceCategory =
              service.category?.category || "Uncategorized";
            const serviceDescription = getTruncatedDescription(
              service.description || ""
            );
            const hasPreview = service.preview && service.img_url;

            return (
              <div key={service.id} className="col-12 col-md-4">
                <div className="card p-4 h-100">
                  <div className="d-flex justify-content-between align-items-center">
                    {/* Service Image */}
                    <div className="me-3">
                      {hasPreview ? (
                        <img
                          src={service.img_url}
                          alt={`${serviceName} preview`}
                          width={68}
                          height={68}
                          className="rounded-circle object-fit-cover"
                          style={{ objectPosition: "center" }}
                        />
                      ) : null}
                      <div style={{ display: hasPreview ? "none" : "block" }}>
                        <ServicesPlaceholder />
                      </div>
                    </div>

                    {/* Service Info */}
                    <div className="flex-grow-1" style={{ minWidth: 0 }}>
                      <h6
                        className="text-capitalize mb-1 text-truncate"
                        title={serviceName}
                      >
                        {serviceName}
                      </h6>
                      <p className="small text-muted mb-2 " title={service.description}>
                        {serviceCategory} Service
                      </p>
                      <p
                        className="small text-muted mb-3 line-clamp-3"
                        title={service.description}
                      >
                        {serviceDescription}
                      </p>

                      {/* Action Section */}
                      <div className="d-flex justify-content-center gap-2 align-items-start flex-column mt-3">
                        {getServiceStatus(service)}

                        {shouldShowViewLink(service) && serviceToken && (
                          <Link
                            href={`/dashboard/my-orders/service?servicetoken=${encodeURIComponent(
                              serviceToken
                            )}`}
                            className="badge bg-secondary-light text-secondary py-2 px-2"
                            aria-label={`View ${serviceName} service details`}
                          >
                            <i className="bi bi-eye me-1"></i>
                            View Service
                          </Link>
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
              <h4 className="text-muted mb-2">No Services Found</h4>
              <p className="text-muted">
                {searchQuery
                  ? `No services match your search for "${searchQuery}"`
                  : "You haven't ordered any services yet"}
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
      {!loadingServices && services && getServiceCount >= pageSize && (
        <div className="mt-4 d-flex justify-content-center">
          <Pagination
            currentPage={String(page)}
            totalPages={Math.ceil(getServiceCount / pageSize)}
            handlePageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
});

// Add display name for debugging
UserServices.displayName = "UserServices";

export default UserServices;
