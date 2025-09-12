"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAdminContext } from "@/providers/context/Admincontextdata";
import { useCart } from "@/providers/context/Cartcontext";
import CartButton from "@/components/custom/Offcanvas/CartButton";
import CategoryTabs from "@/components/features/Categories/Categoriestab";
import VideoCard from "@/components/features/Videos/VideoCard";
import { FaVideo } from "react-icons/fa6";
import Pagination from "@/components/custom/Pagination/Pagination";
import { vidoesapiAPIendpoint } from "@/data/hooks/video.hooks";
import SearchInput from "@/components/custom/Inputs/SearchInput";
import { useFetchCategories } from "@/data/categories/categories.hook";
import { useFetchVideos } from "@/data/hooks/video.hooks";
import AnimationContainer from "@/components/animation/animation-container";

const Videos = () => {
  const { openModal } = useAdminContext();
  const { cart, addToCart, removeFromCart } = useCart();

  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "All";
  const page = searchParams.get("page") || "1";
  const pageSize = "10";
  const Organizationid = process.env.NEXT_PUBLIC_ORGANIZATION_ID;
  const [allCategories, setAllCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input

  const {
    data: categories,
    isLoading: loadingCategories,
    error: categoryError,
  } = useFetchCategories(`${vidoesapiAPIendpoint}/categories/`);

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
  } = useFetchVideos(
    `${vidoesapiAPIendpoint}/videos/${Organizationid}/?category=${currentCategory}&page=${page}&page_size=${pageSize}`
  );

  const {
    data: trendingvideos,
    isLoading: loadingTrendingVideos,
    error: trendingError,
  } = useFetchVideos(
    `${vidoesapiAPIendpoint}/trendingvideos/${Organizationid}/?category=${currentCategory}&page=1&page_size=6`
  );

  const handlePageChange = (newPage) => {
    router.push(
      `?category=${currentCategory}&page=${newPage}&page_size=${pageSize}`,
      { scroll: false }
    );
  };

  const handleCategoryChange = (category) => {
    router.push(`?category=${category}&page=${page}&page_size=${pageSize}`, {
      scroll: false,
    });
  };

  // ---------------------------------------
  // Filter videos based on search input
  // ---------------------------------------
  let filteredVideos = videos?.results || [];
  if (searchQuery) {
    filteredVideos = filteredVideos.filter((video) =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center pe-3 mb-3 flex-wrap">
        <div>
          <h3 className="mb-1 me-2">{currentCategory} Videos</h3>
          <p className="mb-0 text-primary">
            {videos?.count} Video{videos?.count > 1 ? "s" : ""}
          </p>
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

      {searchQuery && <h5>Search Results</h5>}
      <div className="row">
        {loadingVideos && !error ? (
          <div className="d-flex justify-content-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : filteredVideos.length > 0 ? (
          filteredVideos.map((video,index) => (
            <AnimationContainer delay={index * 0.1} key={video.id} className="col-12 col-md-4 mb-3">
              <VideoCard
                video={video}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                cart={cart}
                openModal={openModal}
              />
            </AnimationContainer>
          ))
        ) : (
          <div className="mt-3 mb-3 text-center">
            <FaVideo
              className="mt-2"
              style={{ fontSize: "6rem", color: "var(--bgDarkerColor)" }}
            />
            <p className="mt-3 mb-3">No videos available at the moment</p>
          </div>
        )}

        {!loadingVideos &&
          videos &&
          Math.ceil(videos.count / parseInt(pageSize)) > 1 && (
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(videos.count / parseInt(pageSize))}
              handlePageChange={handlePageChange}
            />
          )}
      </div>

      {!loadingTrendingVideos && trendingvideos?.results.length > 0 && (
        <>
          <hr />
          <div className="mb-3">
            <h5>Top Trending Videos</h5>
          </div>
          <div className="row">
            {trendingvideos?.results.map((video) => (
              <div key={video.id} className="col-12 col-md-4 mb-3">
                <VideoCard
                  video={video}
                  addToCart={addToCart}
                  removeFromCart={removeFromCart}
                  cart={cart}
                  openModal={openModal}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Videos;
