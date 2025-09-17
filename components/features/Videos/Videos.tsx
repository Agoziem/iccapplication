"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAdminContext } from "@/providers/context/Admincontextdata";
import { useCart } from "@/providers/context/Cartcontext";
import CartButton from "@/components/custom/Offcanvas/CartButton";
import CategoryTabs from "@/components/features/Categories/Categoriestab";
import VideoCard from "@/components/features/Videos/VideoCard";
import { FaVideo } from "react-icons/fa6";
import Pagination from "@/components/custom/Pagination/Pagination";
import SearchInput from "@/components/custom/Inputs/SearchInput";
import AnimationContainer from "@/components/animation/animation-container";
import {
  useTrendingVideos,
  useVideoCategories,
  useVideos,
} from "@/data/hooks/video.hooks";
import { ORGANIZATION_ID } from "@/data/constants";
import { Category } from "@/types/categories";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";

type ExtendedCategory = Category & {
  description: string;
};

/**
 * Enhanced Videos component with comprehensive error handling and performance optimization
 * Displays videos with category filtering, search, and pagination functionality
 * Optimized with React.memo and proper TypeScript typing
 */
const Videos: React.FC = React.memo(() => {
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
  } = useVideoCategories();

  useEffect(() => {
    if (!categories) return;
    if (categories.length > 0) {
      setAllCategories([
        { id: 0, category: "All", description: "All Categories" },
        ...categories,
      ]);
    }
  }, [categories]);

  const {
    data: videos,
    isLoading: loadingVideos,
    error: error,
  } = useVideos(parseInt(ORGANIZATION_ID) || 0, {
    category: currentCategory === "All" ? "" : currentCategory,
    page,
    page_size: pageSize,
  });

  const {
    data: trendingvideos,
    isLoading: loadingTrendingVideos,
    error: trendingError,
  } = useTrendingVideos(parseInt(ORGANIZATION_ID) || 0, {
    category: currentCategory === "All" ? "" : currentCategory,
    page: 1,
    page_size: 6,
  });

  // Safe pagination handler
  const handlePageChange = useCallback(
    (newPage: string | number) => {
      if (typeof newPage === "string") {
        const pageNum = parseInt(newPage, 10);
        if (isNaN(pageNum) || pageNum < 1) return;
        setPage(pageNum);
      } else {
        if (newPage < 1) return;
        setPage(newPage);
      }
    },
    [router, currentCategory, pageSize]
  );

  const handleCategoryChange = useCallback(
    (category: string) => {
      setCurrentCategory(category);
      setPage(1);
    },
    [router, page, pageSize]
  );

  // Filter videos based on search input with memoization
  const filteredVideos = useMemo(() => {
    const videoResults = videos?.results || [];
    if (!searchQuery.trim()) return videoResults;

    return videoResults.filter(
      (video) =>
        video?.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false
    );
  }, [videos?.results, searchQuery]);

  // Safe video count calculation
  const videoCount = useMemo(() => {
    const count = videos?.count || 0;
    return count > 1 ? `${count} Videos` : `${count} Video`;
  }, [videos?.count]);

  // Safe page calculation
  const totalPages = useMemo(() => {
    if (!videos?.count) return 0;
    return Math.ceil(videos.count / pageSize);
  }, [videos?.count, pageSize]);

  // Safe trending videos validation
  const validTrendingVideos = useMemo(() => {
    return trendingvideos?.results?.filter((video) => video && video.id) || [];
  }, [trendingvideos?.results]);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center pe-3 mb-3 flex-wrap">
        <div>
          <h3 className="mb-1 me-2">{currentCategory} Videos</h3>
          <p className="mb-0 text-primary">{videoCount}</p>
        </div>
        <CartButton />
      </div>
      <hr />

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
              Fetching Categories...
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
              itemlabel="video"
            />
          </div>
        </div>
      </div>

      {searchQuery.trim() && (
        <h5>Search Results for &ldquo;{searchQuery}&rdquo;</h5>
      )}
      <div className="row">
        {loadingVideos && !error ? (
          <div className="d-flex justify-content-center">
            <div
              className="spinner-border text-primary"
              role="status"
              aria-label="Loading videos"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : filteredVideos.length > 0 ? (
          filteredVideos.map((video, index) => (
            // <AnimationContainer
            //   delay={index * 0.1}
            //   key={video?.id || `video-${index}`}
            //   className="col-12 col-md-4 mb-3"
            // >
            //   <VideoCard video={video} />
            // </AnimationContainer>
            <div key={video?.id} className="col-12 col-md-4 mb-3">
              <VideoCard video={video} />
            </div>
          ))
        ) : (
          <div className="mt-3 mb-3 text-center">
            <FaVideo
              className="mt-2"
              style={{ fontSize: "6rem", color: "var(--bgDarkerColor)" }}
              aria-hidden="true"
            />
            <p className="mt-3 mb-3">No videos available at the moment</p>
          </div>
        )}

        {!loadingVideos && videos && totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        )}
      </div>

      {!loadingTrendingVideos && validTrendingVideos.length > 0 && (
        <>
          <hr />
          <div className="mb-3">
            <h5>Top Trending Videos</h5>
          </div>
          <div className="row">
            {validTrendingVideos.map((video) => (
              <div key={video.id} className="col-12 col-md-4 mb-3">
                <VideoCard video={video} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
});

Videos.displayName = "Videos";

export default Videos;
