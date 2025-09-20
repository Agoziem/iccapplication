"use client";
import React, { useEffect, useState, useCallback } from "react";
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
import { useRouter } from "next/navigation";
import { useArticleCategories, useArticles } from "@/data/hooks/articles.hooks";
import { ArticlesError, CategoriesError } from "./ArticleErrorBoundary";
import { Category } from "@/types/articles";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";

interface CategoryWithAll extends Category {
  id: number;
  category: string;
}

const ArticlesList: React.FC = () => {
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
  const [allCategories, setAllCategories] = useState<CategoryWithAll[]>([]);
  // Fetch categories with error handling
  const {
    data: categories,
    isLoading: loadingCategories,
    isError: categoryError,
    error: categoryErrorDetails,
  } = useArticleCategories();

  // --------------------------------------
  // Add All categories once fetched with validation
  // -----------------------------------------
  useEffect(() => {
    if (categories && Array.isArray(categories) && categories.length > 0) {
      const allCategoriesWithDefault: CategoryWithAll[] = [
        { id: 0, category: "All", description: "All articles" },
        ...categories.map((cat) => ({
          id: cat.id || 0,
          category: cat.category,
          description: cat.description,
        })),
      ];
      setAllCategories(allCategoriesWithDefault);
    } else if (!loadingCategories && !categoryError) {
      // Set only "All" if no categories are available
      setAllCategories([
        { id: 0, category: "All", description: "All articles" },
      ]);
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
  } = useArticles(undefined, {
    category: currentCategory !== "All" ? currentCategory : undefined,
    page: page,
    page_size: pageSize,
  });

  // -----------------------------------------
  // Handle page change with validation
  // -----------------------------------------
  const handlePageChange = useCallback(
    (newPage: string | number) => {
      if (typeof newPage === "string") {
        const pageNum = parseInt(newPage, 10);
        setPage(isNaN(pageNum) || pageNum < 1 ? 1 : pageNum);
      } else {
        setPage(newPage < 1 ? 1 : newPage);
      }
    },
    [currentCategory, pageSize, router]
  );

  // -------------------------------
  // Handle category change with validation
  // -------------------------------
  const handleCategoryChange = useCallback(
    (category: string) => {
      setCurrentCategory(category);
      setPage(1);
    },
    [pageSize, router]
  );

  // Calculate total pages with memoization
  const totalPages = useCallback(() => {
    if (!articles?.count) return 0;
    return Math.ceil(articles.count / pageSize);
  }, [articles?.count, pageSize]);

  // Memoize pagination visibility
  const shouldShowPagination = useCallback(() => {
    return (
      !loadingArticles && !articleError && articles?.count && totalPages() > 1
    );
  }, [loadingArticles, articleError, articles?.count, totalPages]);

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
              <div
                className="spinner-border spinner-border-sm text-primary"
                role="status"
              >
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
            ) : articles && articles.results && articles.results.length > 0 ? (
              articles.results.map((item, index, articlesArray) => {
                // Add null safety for each article item
                if (!item || !item.id) {
                  return null;
                }

                return (
                  <Link
                    href={`/articles/${item.slug}`}
                    key={item.id}
                  >
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
                            alt={item.title || "Article image"}
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
                          {item.title || "Untitled Article"}
                        </h5>
                        <p className="my-0 mb-1 text-wrap text-break">
                          {item.subtitle
                            ? `${item.subtitle}...`
                            : "No description available"}
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
                            <BiSolidLike className="h5" />{" "}
                            {item.likes?.length || 0}
                          </span>
                          <span className="me-3 small">
                            {item.author?.username || "Anonymous"}
                          </span>
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
          {shouldShowPagination() && (
            <Pagination
              currentPage={page}
              totalPages={totalPages()}
              handlePageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticlesList;
