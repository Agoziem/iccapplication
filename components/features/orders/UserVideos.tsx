import React, { useMemo, useState, useCallback, useEffect } from "react";
import { PiEmptyBold } from "react-icons/pi";
import VideosPlaceholder from "../../custom/ImagePlaceholders/Videosplaceholder";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "@/components/custom/Pagination/Pagination";
import SearchInput from "@/components/custom/Inputs/SearchInput";
import { useMyProfile } from "@/data/hooks/user.hooks";
import { useUserBoughtVideos, useVideos } from "@/data/hooks/video.hooks";
import { ORGANIZATION_ID } from "@/data/constants";
import { Video } from "@/types/items";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";

/**
 * Enhanced UserVideos component with comprehensive error handling and safety checks
 * Manages user video browsing with pagination, search, and category filtering
 * Optimized with React.memo for performance
 */
const UserVideos: React.FC = React.memo(() => {
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
    data: videos,
    isLoading: loadingVideos,
    error: queryError,
    isError,
  } = useUserBoughtVideos(parseInt(ORGANIZATION_ID) || 0, user?.id || 0, {
    page: page,
    page_size: pageSize,
    category: currentCategory !== "All" ? currentCategory : null,
  });

  // Effect to handle query errors
  useEffect(() => {
    if (isError) {
      setError(queryError?.message || "Failed to load videos");
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

  // Safe filtered videos with validation
  const filteredVideos = useMemo(() => {
    try {
      if (!videos?.results || !Array.isArray(videos.results)) return [];

      const validVideos = videos.results.filter(
        (video) => video && typeof video === "object" && video.id && video.title
      );

      if (!searchQuery || typeof searchQuery !== "string") return validVideos;

      const query = searchQuery.toLowerCase().trim();
      if (!query) return validVideos;

      return validVideos.filter((video) => {
        const title = video.title || "";
        const description = video.description || "";
        const category = video.category?.category || "";

        return (
          title.toLowerCase().includes(query) ||
          description.toLowerCase().includes(query) ||
          category.toLowerCase().includes(query)
        );
      });
    } catch (error) {
      console.error("Error filtering videos:", error);
      setError("Error processing videos data");
      return [];
    }
  }, [videos, searchQuery]);

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

  // Safe video token extraction
  const getVideoToken = useCallback((video: Video) => {
    const token = video?.video_token;
    if (!token || typeof token !== "string") return null;
    return token;
  }, []);

  // Safe count display
  const getVideoCount = useMemo(() => {
    const count = videos?.count;
    if (typeof count !== "number" || isNaN(count)) return 0;
    return Math.max(0, count);
  }, [videos?.count]);

  // Loading state
  if (loadingVideos) {
    return (
      <div className="d-flex justify-content-center align-items-center p-5">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading videos...</span>
          </div>
          <p className="text-muted">Loading your purchased videos...</p>
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

  // No user state
  if (!user) {
    return (
      <div
        className="alert alert-warning d-flex align-items-center"
        role="alert"
      >
        <i className="bi bi-person-exclamation me-2"></i>
        <div>Please sign in to view your purchased videos.</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header Section */}
      <div className="d-flex flex-column flex-md-row gap-3 align-items-center justify-content-between">
        <div>
          <h4 className="mt-3 mb-2">Videos Purchased</h4>
          <p className="text-muted mb-0">
            {getVideoCount} Video{getVideoCount !== 1 ? "s" : ""} purchased
          </p>
        </div>
        <div className="mb-4 mb-md-0">
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            itemlabel="video"
          />
        </div>
      </div>

      {/* Search Results Header */}
      {searchQuery && (
        <div className="mb-3">
          <h5 className="mb-1">Search Results</h5>
          <p className="text-muted small">
            Found {filteredVideos.length} video
            {filteredVideos.length !== 1 ? "s" : ""} matching &ldquo;
            {searchQuery}&rdquo;
          </p>
        </div>
      )}

      {/* Videos Grid */}
      <div className="row g-3 mt-2 ">
        {filteredVideos.length > 0 ? (
          filteredVideos.map((video) => {
            const videoTitle = video.title || "Untitled Video";
            const videoCategory = video.category?.category || "Uncategorized";
            const videoDescription = getTruncatedDescription(video.description);
            const videoToken = getVideoToken(video);
            const hasThumbnail = video.thumbnail && video.img_url;

            return (
              <div key={video.id} className="col-12 col-md-6 col-lg-4 ">
                <div className="card h-100 p-4">
                  <div className="d-flex align-items-start gap-3">
                    {/* Video Thumbnail */}
                    <div className="flex-shrink-0">
                      {hasThumbnail ? (
                        <img
                          src={video.img_url}
                          alt={`${videoTitle} thumbnail`}
                          width={68}
                          height={68}
                          className="rounded-circle object-fit-cover border"
                          style={{ objectPosition: "center" }}
                        />
                      ) : null}
                      <div style={{ display: hasThumbnail ? "none" : "block" }}>
                        <VideosPlaceholder />
                      </div>
                    </div>

                    {/* Video Info */}
                    <div className="flex-grow-1" style={{ minWidth: 0 }}>
                      <h6
                        className="text-capitalize mb-1 text-truncate"
                        title={videoTitle}
                      >
                        {videoTitle}
                      </h6>
                      <p
                        className="small text-muted mb-2 line-clamp-3"
                        title={video.description}
                      >
                        {videoDescription}
                      </p>

                      {/* Footer Section */}
                      <div className="d-flex flex-column gap-2  justify-content-between align-items-start mt-auto">
                        <p className="small text-muted mb-0">
                          {videoCategory} Video
                        </p>

                        {videoToken ? (
                          <Link
                            href={`/dashboard/my-orders/video/?videotoken=${encodeURIComponent(
                              videoToken
                            )}`}
                            className="badge bg-primary text-white py-2 px-3"
                            aria-label={`Watch ${videoTitle} video`}
                          >
                            <i className="bi bi-play-circle me-1"></i>
                            Watch Video
                          </Link>
                        ) : (
                          <span className="badge bg-secondary bg-opacity-10 text-secondary">
                            Video Unavailable
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
              <h4 className="text-muted mb-2">No Videos Found</h4>
              <p className="text-muted">
                {searchQuery
                  ? `No videos match your search for "${searchQuery}"`
                  : "You haven't purchased any videos yet"}
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
      {!loadingVideos && videos && getVideoCount > pageSize && (
        <div className="mt-4 d-flex justify-content-center">
          <Pagination
            currentPage={String(page)}
            totalPages={Math.ceil(getVideoCount / pageSize)}
            handlePageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
});

// Add display name for debugging
UserVideos.displayName = "UserVideos";

export default UserVideos;
