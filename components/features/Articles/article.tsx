"use client";
import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import ArticleComments from "./articlecomments";
import ShareButtons from "./sharebuttons";
import Link from "next/link";
import { FaLongArrowAltRight } from "react-icons/fa";
import ArticleLikes from "./ArticleLikes";
import ArticleCommentsForm from "./ArticleCommentsForm";
import { MdOutlineArticle } from "react-icons/md";
import ArticleErrorBoundary, {
  ArticleLoadingSkeleton,
  CommentsErrorBoundary,
} from "./ArticleErrorBoundary";
import NextBreadcrumb from "../../custom/Breadcrumb/breadcrumb";
import BackButton from "../../custom/backbutton/BackButton";
import Pagination from "../../custom/Pagination/Pagination";
import { useParams, useSearchParams } from "next/navigation";
import {
  useAddViews,
  useArticleBySlug,
  useArticles,
  useComments,
} from "@/data/hooks/articles.hooks";
import { useMyProfile } from "@/data/hooks/user.hooks";
import { ArticleResponse } from "@/types/articles";
import { SITE_URL } from "@/data/constants";

interface ArticleProps {
  className?: string;
  style?: React.CSSProperties;
  showRelatedArticles?: boolean;
  maxRelatedArticles?: number;
}

const Article: React.FC<ArticleProps> = ({
  className = "",
  style = {},
  showRelatedArticles = true,
  maxRelatedArticles = 6
}) => {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "1";
  const pageSize = "10";
  const [commentpage, setCommentPage] = useState<string>("1");
  const [otherArticles, setOtherArticles] = useState<ArticleResponse[]>([]);
  const { data: user } = useMyProfile();
  const { mutateAsync: addView } = useAddViews();
  
  // Ref to track which articles have had their views incremented
  const viewsIncrementedRef = useRef<Set<string>>(new Set());

  // Ensure slug is a string
  const articleSlug = Array.isArray(slug) ? slug[0] : slug;

  // ------------------------------------------------------------
  // fetch article by slug with error handling
  // ------------------------------------------------------------
  const {
    data: article,
    isLoading: articleLoading,
    isError: articleError,
    error,
  } = useArticleBySlug(articleSlug as string);

  const { data: articles } = useArticles(
    undefined,
    { page: page, page_size: pageSize },
  );

  // ------------------------------------------------------------
  // Filter the main article from the other articles
  // ------------------------------------------------------------
  useMemo(() => {
    if (!articles?.results || !article?.id) return;
    
    const filteredArticles = articles.results
      .filter((blog) => blog.id !== article.id)
      .slice(0, maxRelatedArticles);
    
    setOtherArticles(filteredArticles);
  }, [articles, article?.id, maxRelatedArticles]);

  const {
    data: comments,
    isLoading: loadingComments,
    isError: commentsError,
    error: commentsErrorMessage,
    refetch: refetchComments
  } = useComments(article?.id, { page: commentpage, page_size: pageSize });


  const handleCommentPageChange = useCallback((page: string | number) => {
    setCommentPage(page.toString());
  }, []);

  const incrementViews = useCallback(async () => {
    if (!article?.slug) return;
    
    // Don't increment views if user is the author
    if (user && article.author?.id === user.id) {
      return;
    }
    
    // Check if we've already incremented views for this article in this session
    if (viewsIncrementedRef.current.has(article.slug)) {
      return;
    }
    
    // Check localStorage to prevent incrementing views multiple times across sessions
    // (optional - you can remove this if you want to allow view increments on each session)
    const viewedArticlesKey = 'viewed_articles';
    const viewedArticles = JSON.parse(localStorage.getItem(viewedArticlesKey) || '[]');
    if (viewedArticles.includes(article.slug)) {
      viewsIncrementedRef.current.add(article.slug);
      return;
    }
    
    try {
      await addView({ blogslug: article.slug });
      // Mark this article as having views incremented
      viewsIncrementedRef.current.add(article.slug);
      
      // Store in localStorage to prevent future increments (optional)
      const updatedViewedArticles = [...viewedArticles, article.slug];
      localStorage.setItem(viewedArticlesKey, JSON.stringify(updatedViewedArticles));
      
    } catch (error) {
      console.error("Failed to increment views:", error);
      // Don't mark as incremented if the request failed
    }
  }, [article?.slug, article?.author?.id, user?.id, addView]);

  // ------------------------------------------------------------
  // Increment views on article load (only once per article)
  // ------------------------------------------------------------
  useEffect(() => {
    if (article?.id) {
      incrementViews();
    }
  }, [article?.id, incrementViews]);

  // Cleanup effect to prevent memory leaks
  useEffect(() => {
    return () => {
      // Clear the ref when component unmounts
      viewsIncrementedRef.current.clear();
    };
  }, []);

  // Loading state
  if (articleLoading) {
    return <ArticleLoadingSkeleton />;
  }

  // Error state
  if (articleError || !article || error) {
    return (
      <ArticleErrorBoundary
        error={error || new Error("Article not found")}
        resetError={() => window.location.reload()}
      />
    );
  }

  return (
    <div className={`article-container ${className}`} style={style}>
      {article && (
        <section
          className="px-4 px-md-5 mx-auto mb-5"
          style={{ maxWidth: "900px" }}
        >
          <div className="pt-2 ps-3">
            <NextBreadcrumb capitalizeLinks />
            <BackButton />
          </div>
          <div className="article-header pb-4">
            <h1 className="text-wrap text-break">
              {article?.title || "Untitled Article"}
            </h1>
            <div className="d-flex my-4">
              <div>
                {article.author?.img ? (
                  <img
                    src={article.author?.img}
                    alt={article.author?.username}
                    width={50}
                    height={50}
                    className="rounded-circle object-fit-cover"
                    style={{ objectPosition: "top center" }}
                  />
                ) : (
                  <div
                    className="rounded-circle text-white d-flex justify-content-center align-items-center"
                    style={{
                      width: 50,
                      height: 50,
                      fontSize: "30px",
                      backgroundColor: "var(--bgDarkerColor)",
                    }}
                  >
                    {article.author?.username?.length > 0
                      ? article.author.username[0].toUpperCase()
                      : "A"}
                  </div>
                )}
              </div>
              <div className="ms-3">
                <p className="mb-0 fw-bold">
                  {article.author?.username || "Anonymous"}
                </p>
                <div>
                  <span>
                    <small>{article.category?.category}</small>
                  </span>
                  {" . "}
                  <span className="me-3">
                    <small>
                      {article.date
                        ? new Date(article.date).toDateString()
                        : "Unknown Date"}
                    </small>
                  </span>
                  {article.tags?.length > 0 &&
                    article.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="badge bg-secondary-light text-secondary rounded-5 px-3 py-2 me-1 mb-2 mb-md-0"
                      >
                        {tag.tag}
                      </span>
                    ))}
                </div>
              </div>
            </div>
            <hr />
            <div>
              <span className=" me-3">{article.readTime || 0} min read</span>
              <span className=" me-3">
                <i className="bi bi-eye-fill me-1"></i>
                {article.views || 0} view{(article.views || 0) > 1 && "s"}
              </span>
            </div>
            <hr />
          </div>
          <div className="article-body pb-4">
            {article.img_url && (
              <img
                src={article.img_url}
                width={400}
                height={400}
                alt="article"
                className="mb-4 rounded object-fit-cover"
                style={{ width: "100%", minWidth: "300px" }}
              />
            )}
            <div style={{ width: "100%" }}>
              <div
                dangerouslySetInnerHTML={{
                  __html: article.body || "<p>No content available.</p>",
                }}
                style={{
                  fontSize: "1.1rem",
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}
              />
            </div>
          </div>
          <div>
            <hr />
            <div className="d-md-flex justify-content-between align-items-center">
              <div>
                <span className="me-3">
                  <i
                    className={`bi ${
                      article.likes?.includes(
                        user?.id && !isNaN(user.id)
                          ? user.id
                          : -1
                      )
                        ? "bi-heart-fill text-danger"
                        : "bi-heart-fill text-primary"
                    } me-1`}
                  ></i>
                  {article?.likes?.length || 0} like
                  {(article.likes?.length || 0) > 1 && "s"}
                </span>
                <span className="me-3">
                  <i className="bi bi-chat-fill me-1"></i>
                  {comments?.count || 0} comment
                  {(comments?.count || 0) > 1 && "s"}
                </span>
              </div>

              <div className="my-3 my-md-0 d-flex align-items-center">
                <ArticleCommentsForm article={article} onCommentAdded={refetchComments} />
                <ArticleLikes article={article} />
              </div>
            </div>
            <hr />
            <div className="share-post my-4">
              <h5 className="mb-3">Share this post</h5>
              <ShareButtons
                url={`${SITE_URL}/articles/${
                  article.slug || slug
                }`}
                title={article.title || "Untitled Article"}
              />
            </div>
            {/* Comments Section with Error Handling */}
            {commentsError ? (
              <CommentsErrorBoundary
                error={commentsErrorMessage || new Error("Failed to load comments")}
                onRetry={() => window.location.reload()}
              />
            ) : comments ? (
              <div className="comments mt-5">
                <hr />
                <h5 className="my-4">
                  {comments?.count || 0} Comment
                  {(comments?.count || 0) > 1 ? "s" : ""}
                </h5>
                <div>
                  {(comments.count || 0) > 0 ? (
                    <ArticleComments comments={comments.results || []} refetchComments={refetchComments} />
                  ) : (
                    <p>No comments yet</p>
                  )}
                </div>
              </div>
            ) : loadingComments ? (
              <div className="text-center mt-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading comments...</span>
                </div>
                <p className="mt-2 text-muted">Loading comments...</p>
              </div>
            ) : null}
            {comments?.next && (
              <Pagination
                currentPage={commentpage}
                totalPages={Math.ceil(comments.count / parseInt(pageSize))}
                handlePageChange={handleCommentPageChange}
              />
            )}

            {!loadingComments &&
              comments &&
              Math.ceil(comments.count / parseInt(pageSize)) > 1 && (
                <Pagination
                  currentPage={commentpage}
                  totalPages={Math.ceil(comments.count / parseInt(pageSize))}
                  handlePageChange={handleCommentPageChange}
                />
              )}
          </div>
        </section>
      )}

      {showRelatedArticles && (
        <section className="bg-primary-light mt-5">
          <div className="px-5 py-4 mx-auto" style={{ maxWidth: "1200px" }}>
            <div className="text-center">
              <h4 className="fw-bold mb-4">Related Articles</h4>
              <div className="row justify-content-center">
              {otherArticles.length > 0 ? (
                otherArticles.map((blog, index) => (
                  <div
                    key={blog.id}
                    className="col-12 col-md d-flex justify-content-center"
                  >
                    <div className="card mx-auto" style={{ width: "350px" }}>
                      <div
                        className="blog-image"
                        style={{
                          position: "relative",
                          width: "100%",
                          height: "200px",
                        }}
                      >
                        {blog.img ? (
                          <img
                            src={blog.img_url}
                            className="object-fit-cover me-3"
                            alt="profile"
                            style={{
                              objectPosition: "top center",
                              width: "100%",
                              height: "100%",
                              borderRadius: "0.5rem 0.5rem 0 0",
                            }}
                          />
                        ) : (
                          <div
                            className="d-flex justify-content-center align-items-center me-3"
                            style={{
                              width: "100%",
                              height: "100%",
                              backgroundColor: "var(--bgDarkColor)",
                              color: "var(--bgDarkerColor)",
                              fontSize: "5rem",
                              borderRadius: "0.5rem 0.5rem 0 0",
                            }}
                          >
                            <MdOutlineArticle />
                          </div>
                        )}
                      </div>
                      <div className="px-4 py-3">
                        <div className="text-center">
                          <h6 className="text-primary mb-2">{blog.title}</h6>
                          <p className="mb-1 small">
                            {blog.subtitle && blog.subtitle.length > 100
                              ? blog.subtitle.slice(0, 100) + "..."
                              : blog.subtitle || "No description available"}
                          </p>
                        </div>
                        <div
                          className="d-flex justify-content-center my-3 text-primary"
                          style={{ fontSize: "1rem" }}
                        >
                          <Link
                            href={`/articles/${blog.slug}`}
                            className="mx-2 fw-medium text-primary bg-primary-light px-3 py-2 rounded"
                            style={{ cursor: "pointer" }}
                          >
                            Read more <FaLongArrowAltRight className="ms-2" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="mt-3 mb-3 text-center">
                  <MdOutlineArticle
                    className="mt-0"
                    style={{
                      fontSize: "6rem",
                      color: "var(--bgDarkerColor)",
                    }}
                  />
                  <p className="mt-3 mb-3">No Related Articles found</p>
                </div>
              )}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Article;
