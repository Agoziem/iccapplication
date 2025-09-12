"use client";
import React, { useContext, useEffect, useState } from "react";
import "./articles.css";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { BiSolidLike } from "react-icons/bi";
import Link from "next/link";
import NextBreadcrumb from "../../custom/Breadcrumb/breadcrumb";
import { useSearchParams } from "next/navigation";
import ArticlePlaceholder from "../configuration/articles/ArticlePlaceholder";
import BackButton from "../../custom/backbutton/BackButton";
import Pagination from "../../custom/Pagination/Pagination";
import CategoryTabs from "../Categories/Categoriestab";
import {
  articleAPIendpoint,
} from "@/data/hooks/articles.hooks";
import { useRouter } from "next/navigation";
import { useFetchArticleCategories, useFetchArticles } from "@/data/hooks/articles.hooks";

/**
 * Error Component for Categories
 */
const CategoriesError = ({ error, onRetry }) => (
  <div className="alert alert-warning" role="alert">
    <div className="d-flex align-items-center">
      <i className="bi bi-exclamation-triangle-fill me-2"></i>
      <div>
        <strong>Failed to load categories</strong>
        <p className="mb-0 small">{error?.message || "Could not fetch article categories"}</p>
        <button className="btn btn-sm btn-outline-warning mt-1" onClick={onRetry}>
          Retry
        </button>
      </div>
    </div>
  </div>
);

/**
 * Error Component for Articles List
 */
const ArticlesError = ({ error, onRetry }) => (
  <div className="alert alert-danger text-center" role="alert">
    <i className="bi bi-exclamation-circle-fill mb-3" style={{ fontSize: "3rem" }}></i>
    <h5>Failed to Load Articles</h5>
    <p className="mb-3">{error?.message || "Could not fetch articles at this time"}</p>
    <button className="btn btn-primary" onClick={onRetry}>
      <i className="bi bi-arrow-clockwise me-1"></i>
      Try Again
    </button>
  </div>
);

const ArticlesList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "All";
  const page = searchParams.get("page") || "1";
  const pageSize = "10";
  const [allCategories, setAllCategories] = useState([]);

  const Organizationid = process.env.NEXT_PUBLIC_ORGANIZATION_ID;
  // Fetch categories with error handling
  const {
    data: categories,
    isLoading: loadingCategories,
    isError: categoryError,
    error: categoryErrorDetails,
  } = useFetchArticleCategories();

  // --------------------------------------
  // Add All categories once fetched with validation
  // -----------------------------------------
  useEffect(() => {
    if (categories && Array.isArray(categories) && categories.length > 0) {
      const allCategoriesWithDefault = [{ id: 0, category: "All" }, ...categories];
      setAllCategories(allCategoriesWithDefault);
    } else if (!loadingCategories && !categoryError) {
      // Set only "All" if no categories are available
      setAllCategories([{ id: 0, category: "All" }]);
    }
  }, [categories, loadingCategories, categoryError]);

  // ----------------------------------------
  // Fetch articles based on category with error handling
  // ----------------------------------------
  const {
    data: articles,
    isLoading: loadingArticles,
    isError: articleError,
    error: articleErrorDetails,
  } = useFetchArticles(
    `${articleAPIendpoint}/orgblogs/${Organizationid}/?category=${currentCategory}&page=${page}&page_size=${pageSize}`
  );

  // -----------------------------------------
  // Handle page change with validation
  // -----------------------------------------
  /**  @param {string} newPage */
  const handlePageChange = (newPage) => {
    if (!newPage || isNaN(parseInt(newPage)) || parseInt(newPage) < 1) {
      console.error("Invalid page number:", newPage);
      return;
    }
    
    router.push(
      `?category=${encodeURIComponent(currentCategory)}&page=${newPage}&page_size=${pageSize}`,
      {
        scroll: false,
      }
    );
  };

  // -------------------------------
  // Handle category change with validation
  // -------------------------------
  /**  @param {string} category */
  const handleCategoryChange = (category) => {
    if (!category || typeof category !== 'string') {
      console.error("Invalid category:", category);
      return;
    }
    
    router.push(`?category=${encodeURIComponent(category)}&page=1&page_size=${pageSize}`, {
      scroll: false,
    });
  };

  return (
    <div>
      <div className="articles_list mx-auto px-3 px-md-0">
        {/* categories */}
        <div className="mb-3 ps-2 ps-md-0">
          {/* Categories */}
          <h5 className="mb-3 fw-bold">categories</h5>
          {categoryError ? (
            <CategoriesError 
              error={categoryErrorDetails} 
              onRetry={() => window.location.reload()}
            />
          ) : loadingCategories ? (
            <div className="d-flex gap-2 align-items-center">
              {/* spinner */}
              <div className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              fetching Article Categories
            </div>
          ) : (
            <CategoryTabs
              categories={allCategories || []}
              currentCategory={currentCategory}
              setCurrentCategory={handleCategoryChange}
            />
          )}
        </div>

        <div className="ps-3">
          <NextBreadcrumb capitalizeLinks />
          <BackButton />
        </div>
        <div>
          <h4 className="my-3 text-center">{currentCategory} Articles</h4>
          <hr />
          <ul className="list-group list-group-flush mx-auto mb-5">
            {articleError ? (
              <ArticlesError 
                error={articleErrorDetails} 
                onRetry={() => window.location.reload()}
              />
            ) : loadingArticles ? (
              <div className="d-flex justify-content-center">
                {/* spinner */}
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : articles?.results?.length > 0 ? (
              articles.results.map((item, index, articlesArray) => {
                // Add null safety for each article item
                if (!item || !item.id) {
                  return null;
                }
                
                return (
                  <Link href={`/articles/${item.slug || item.id}`} key={item.id}>
                    <li
                      className="list-group-item d-flex align-items-center py-3"
                      style={{
                        backgroundColor: "var(--bgColor)",
                        color: "var(--primary)",
                        border: "none",
                        borderBottom:
                          index === articlesArray.length - 1
                            ? "none"
                            : "1px solid var(--bgDarkColor)",
                      }}
                    >
                      <div className="me-3">
                        {item.img_url ? (
                          <img
                            src={item.img_url}
                            alt="article"
                            width={90}
                            height={90}
                            className="object-fit-cover rounded"
                          />
                        ) : (
                          <ArticlePlaceholder />
                        )}
                      </div>

                      <div className="ms-2">
                        <h5 className="mb-1 text-wrap text-break">
                          {item.title || 'Untitled Article'}
                        </h5>
                        <p className="my-0 mb-1 text-wrap text-break">
                          {item.subtitle ? `${item.subtitle}...` : 'No description available'}
                        </p>
                        <div
                          className="d-flex align-items-center"
                          style={{ color: "var(--bgDarkerColor)" }}
                        >
                          <span className="me-3 small">
                            <MdOutlineRemoveRedEye className="h5" />{" "}
                            {item.views || 0}
                          </span>
                          <span className="me-3 small">
                            <BiSolidLike className="h5" /> {item.likes?.length || 0}
                          </span>
                          <span className="me-3 small">{item.author?.username || 'Anonymous'}</span>
                        </div>
                      </div>
                    </li>
                  </Link>
                );
              })
            ) : (
              <div className="col-12 d-flex justify-content-center">
                <p
                  className="p-3 text-primary text-center bg-primary-light mt-1 mb-3 rounded"
                  style={{ minWidth: "300px" }}
                >
                  No Articles yet
                </p>
              </div>
            )}
          </ul>
          {!loadingArticles &&
            !articleError &&
            articles &&
            articles.count &&
            Math.ceil((articles.count || 0) / parseInt(pageSize)) > 1 && (
              <Pagination
                currentPage={page}
                totalPages={Math.ceil((articles.count || 0) / parseInt(pageSize))}
                handlePageChange={handlePageChange}
              />
            )}
        </div>
      </div>
    </div>
  );
};

export default ArticlesList;
