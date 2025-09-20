"use client";
import React, { useState } from "react";
import ArticleForm from "./ArticleForm";
import ArticleList from "./ArticleList";
import ArticleCategoryForm from "./ArticleCategoryForm";
import { useArticleCategories, useArticles } from "@/data/hooks/articles.hooks";
import { ArticleResponse } from "@/types/articles";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";

const ArticleConf: React.FC = () => {
  const [currentCategory, setCurrentCategory] = useQueryState(
    "category",
    parseAsString.withDefault("All")
  );
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [pageSize, setPageSize] = useQueryState(
    "page_size",
    parseAsInteger.withDefault(10)
  );
  const [editMode, setEditMode] = useState(false);
  const [article, setArticle] = useState<ArticleResponse | null>(null);

  const {
    data: categories,
    isLoading: loadingCategories,
    error: categoryError,
  } = useArticleCategories();

  const {
    data: articles,
    isLoading: loadingArticles,
    error: articleError,
  } = useArticles(
    undefined,
    {
      category: currentCategory !== "All" ? currentCategory : undefined,
      page,
      page_size: pageSize,
    }
  );




  return (
    <div className="row mt-4 justify-content-between">
      <div className="col-12 col-md-8">
        <div>
          <ArticleCategoryForm
            categories={categories || []}
          />
        </div>
        <ArticleForm
          article={article}
          setArticle={setArticle}
          editMode={editMode}
          setEditMode={setEditMode}
          categories={categories || []}
        />
      </div>
      <div className="col-12 col-md-4">
        <ArticleList
          articles={articles || null}
          article={article}
          setArticle={setArticle}
          editMode={editMode}
          setEditMode={setEditMode}
          loading={loadingArticles}
          currentPage={page}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
};

export default ArticleConf;
