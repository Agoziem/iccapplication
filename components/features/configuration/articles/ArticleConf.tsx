"use client";
import React, { useState } from "react";
import ArticleForm from "./ArticleForm";
import ArticleList from "./ArticleList";
import ArticleCategoryForm from "./ArticleCategoryForm";
import { useSearchParams } from "next/navigation";
import { articleAPIendpoint } from "@/data/articles/articles.hook";
import { ArticleDefault } from "@/constants";
import { useFetchCategories } from "@/data/categories.hook";
import { useFetchArticles } from "@/data/articles/articles.hook";
import { Article } from "@/types/articles";

const ArticleConf: React.FC = () => {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "All";
  const page = searchParams.get("page") || "1";
  const pageSize = "10";
  const [editMode, setEditMode] = useState<boolean>(false);
  const Organizationid = process.env.NEXT_PUBLIC_ORGANIZATION_ID;
  const [article, setArticle] = useState<Article>(ArticleDefault);

  const {
    data: categories,
    isLoading: loadingCategories,
    error: categoryError,
  } = useFetchCategories(`${articleAPIendpoint}/getCategories/`);

  const {
    data: articles,
    isLoading: loadingArticles,
    error: articleError,
  } = useFetchArticles(
    `${articleAPIendpoint}/orgblogs/${Organizationid}/?category=${currentCategory}&page=${page}&page_size=${pageSize}`,
  );

  if (!categories || loadingCategories || !articles || loadingArticles) {
    return <div>Loading...</div>;
  }

  if (categoryError) {
    return <div>Error loading categories: {categoryError.message}</div>;
  } 

  return (
    <div className="row mt-4 justify-content-between">
      <div className="col-12 col-md-8">
        <div>
          <ArticleCategoryForm
            categories={categories}
          />
        </div>
        <ArticleForm
          article={article}
          setArticle= {setArticle}
          editMode={editMode}
          setEditMode={setEditMode}
          articles={articles}
          categories={categories}
        />
      </div>
      <div className="col-12 col-md-4">
        <ArticleList
          articles={articles}
          article={article}
          setArticle={setArticle}
          editMode={editMode}
          setEditMode={setEditMode}
          loading={loadingArticles}
          currentPage={page}
          pageSize ={pageSize}
        />
      </div>
    </div>
  );
};

export default ArticleConf;
