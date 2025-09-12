"use client";
import React, { useEffect, useState } from "react";
import ArticleComments from "./articlecomments";
import ShareButtons from "./sharebuttons";
import Link from "next/link";
import { FaLongArrowAltRight } from "react-icons/fa";
import ArticleLikes from "./ArticleLikes";
import ArticleCommentsForm from "./ArticleCommentsForm";
import { useSession } from "next-auth/react";
import { MdOutlineArticle } from "react-icons/md";
import ArticleErrorBoundary, { ArticleLoadingSkeleton, CommentsErrorBoundary } from "./ArticleErrorBoundary";
import NextBreadcrumb from "../../custom/Breadcrumb/breadcrumb";
import BackButton from "../../custom/backbutton/BackButton";
import Pagination from "../../custom/Pagination/Pagination";
import { useSearchParams } from "next/navigation";
import { articleAPIendpoint } from "@/data/hooks/articles.hooks";
import {
  useFetchArticleBySlug,
  useFetchArticles,
  useFetchComments,
  useIncrementView,
} from "@/data/hooks/articles.hooks";

const Article = ({ params }) => {
  const { slug } = params;
  const Organizationid = process.env.NEXT_PUBLIC_ORGANIZATION_ID;
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "1";
  const pageSize = "10";
  const [commentpage, setCommentPage] = useState("1");
  const [otherArticles, setOtherArticles] = useState([]);
  const { data: session } = useSession();
  const { mutateAsync: incrementView } = useIncrementView();

  // ------------------------------------------------------------
  // fetch article by slug with error handling
  // ------------------------------------------------------------
  const { data: article, isLoading: articleLoading, isError: articleError, error } = useFetchArticleBySlug(slug);

  // ----------------------------------------------------------
  // fetch articles by Categories
  // ----------------------------------------------------------
  const { data: articles } = useFetchArticles(
    article?.category.id
      ? `${articleAPIendpoint}/orgblogs/${Organizationid}/?category=${article?.category.category}&page=${page}&page_size=${pageSize}`
      : null
  );

  // ------------------------------------------------------------
  // Filter the main article from the other articles
  // ------------------------------------------------------------
  useEffect(() => {
    if (!articles) return;
    if (articles.results.length > 0) {
      setOtherArticles(
        articles.results.filter((blog) => blog.id !== article?.id)
      );
    }
  }, [articles]);

  // ------------------------------------------------------------
  // Fetch comments and paginate them with error handling
  // ------------------------------------------------------------
  const { data: comments, isLoading: loadingComments, isError: commentsError } = useFetchComments(
    article?.id,
    { page: commentpage, page_size: pageSize }
  );

  // ------------------------------------------------------------
  // handle comment page change
  // ------------------------------------------------------------

  /** @param {string} page */
  const handleCommentPageChange = (page) => {
    setCommentPage(page);
  };

  // ------------------------------------------------------------
  // Increment views
  // ------------------------------------------------------------

  const incrementViews = () => {
    if (article && article.id) {
      incrementView(article.id);
    }
  };

  // ------------------------------------------------------------
  // Fetch comments and increment views on article load
  // ------------------------------------------------------------
  useEffect(() => {
    if (article) {
      incrementViews();
    }
  }, []);

  // Loading state
  if (articleLoading) {
    return <ArticleLoadingSkeleton />;
  }

  // Error state
  if (articleError || !article) {
    return (
      <ArticleErrorBoundary 
        error={error} 
        resetError={() => window.location.reload()} 
      />
    );
  }

  return (
    <>
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
            <h1 className="text-wrap text-break">{article?.title || 'Untitled Article'}</h1>
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
                      : 'A'}
                  </div>
                )}
              </div>
              <div className="ms-3">
                <p className="mb-0 fw-bold">{article.author?.username || 'Anonymous'}</p>
                <div>
                  <span>
                    <small>{article.category?.category}</small>
                  </span>
                  {" . "}
                  <span className="me-3">
                    <small>
                      {article.date 
                        ? new Date(article.date).toDateString() 
                        : 'Unknown Date'}
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
                  __html: article.body || '<p>No content available.</p>',
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
                        session?.user?.id && !isNaN(parseInt(session.user.id)) 
                          ? parseInt(session.user.id) 
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
                  {comments ? comments.count : "0"} comment
                  {comments?.count > 1 && "s"}
                </span>
              </div>

              <div className="my-3 my-md-0">
                <ArticleCommentsForm article={article} comments={comments} />
                <ArticleLikes article={article} />
              </div>
            </div>
            <hr />
            <div className="share-post my-4">
              <h5 className="mb-3">Share this post</h5>
              <ShareButtons
                url={`${process.env.NEXT_PUBLIC_URL}/articles/${article.slug || slug}`}
                title={article.title || 'Untitled Article'}
              />
            </div>
            {/* Comments Section with Error Handling */}
            {commentsError ? (
              <CommentsErrorBoundary 
                error={commentsError} 
                onRetry={() => window.location.reload()}
              />
            ) : comments ? (
              <div className="comments mt-5">
                <hr />
                <h5 className="my-4">
                  {comments?.count || 0} Comment{(comments?.count || 0) > 1 ? "s" : ""}
                </h5>
                <div>
                  {(comments.count || 0) > 0 ? (
                    <ArticleComments comments={comments.results || []} />
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
                          <p className="mb-1 small ">
                            {blog.subtitle.length > 100
                              ? blog.subtitle.slice(0, 100) + "..."
                              : blog.subtitle}
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
              {otherArticles && otherArticles.length > 1 && (
                <div>
                  <div className="d-flex justify-content-center mt-0 mb-5">
                    <Link href="/articles" className="btn btn-primary px-5">
                      View articles
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Article;
