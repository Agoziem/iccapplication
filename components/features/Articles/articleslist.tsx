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
} from "@/data/articles/fetcher";
import { useRouter } from "next/navigation";
import { useFetchArticleCategories, useFetchArticles } from "@/data/articles/articles.hook";

const ArticlesList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "All";
  const page = searchParams.get("page") || "1";
  const pageSize = "10";
  const [allCategories, setAllCategories] = useState([]);

  const Organizationid = process.env.NEXT_PUBLIC_ORGANIZATION_ID;
  // Fetch categories
  const {
    data: categories,
    isLoading: loadingCategories,
    error: categoryError,
  } = useFetchArticleCategories(`${articleAPIendpoint}/getCategories/`)

  // --------------------------------------
  // Add All categories once fetched
  // -----------------------------------------
  useEffect(() => {
    if (categories?.length > 0) {
      setAllCategories([{ id: 0, category: "All" }, ...categories]);
    }
  }, [categories]);

  // ----------------------------------------
  // Fetch articles based on category
  // ----------------------------------------
  const {
    data: articles,
    isLoading: loadingArticles,
    error: articleError,
  } = useFetchArticles(
    `${articleAPIendpoint}/orgblogs/${Organizationid}/?category=${currentCategory}&page=${page}&page_size=${pageSize}`
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

  return (
    <div>
      <div className="articles_list mx-auto px-3 px-md-0">
        {/* categories */}
        <div className="mb-3 ps-2 ps-md-0">
          {/* Categories */}
          <h5 className="mb-3 fw-bold">categories</h5>
          {loadingCategories && !categoryError ? (
            <div className="d-flex gap-2 align-items-center">
              {/* spinner */}
              <div className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              fetching Article Categories
            </div>
          ) : (
            <CategoryTabs
              categories={allCategories}
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
            <>
              {
                // loading
                loadingArticles && !articleError && (
                  <div className="d-flex justify-content-center">
                    {/* spinner */}
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )
              }

              {!loadingArticles && articles && articles.results.length > 0 ? (
                articles.results.map((item, index, articles) => (
                  <Link href={`/articles/${item.slug}`} key={item.id}>
                    <li
                      className="list-group-item d-flex align-items-center py-3"
                      style={{
                        backgroundColor: "var(--bgColor)",
                        color: "var(--primary)",
                        border: "none",
                        borderBottom:
                          index === articles.length - 1
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
                          {item.title}
                        </h5>
                        <p className="my-0 mb-1 text-wrap text-break">
                          {item.subtitle}...
                        </p>
                        <div
                          className="d-flex align-items-center"
                          style={{ color: "var(--bgDarkerColor)" }}
                        >
                          <span className="me-3 small">
                            <MdOutlineRemoveRedEye className="h5" />{" "}
                            {item.views}
                          </span>
                          <span className="me-3 small">
                            <BiSolidLike className="h5" /> {item.likes?.length}
                          </span>
                          <span className="me-3 small">{item.author?.username}</span>
                        </div>
                      </div>
                    </li>
                  </Link>
                ))
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
            </>
          </ul>
          {!loadingArticles &&
            articles &&
            Math.ceil(articles.count / parseInt(pageSize)) > 1 && (
              <Pagination
                currentPage={page}
                totalPages={Math.ceil(articles.count / parseInt(pageSize))}
                handlePageChange={handlePageChange}
              />
            )}
        </div>
      </div>
    </div>
  );
};

export default ArticlesList;
