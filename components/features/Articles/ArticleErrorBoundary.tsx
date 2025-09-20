import React from 'react';

const ArticleErrorBoundary = ({ error, resetError } : {
  error: Error;
  resetError: () => void;
}) => {
  return (
    <section className="px-4 px-md-5 mx-auto mb-5" style={{ maxWidth: "900px" }}>
      <div className="text-center" style={{ minHeight: "400px", paddingTop: "100px" }}>
        <div className="mb-4">
          <i className="bi bi-exclamation-triangle-fill text-warning" style={{ fontSize: "4rem" }}></i>
        </div>
        <h2 className="text-danger mb-3">Something went wrong</h2>
        <div className="alert alert-danger mx-auto" style={{ maxWidth: "600px" }}>
          <p className="mb-2">
            <strong>Error Details:</strong>
          </p>
          <p className="text-break">
            {error?.message || "An unexpected error occurred while loading the article."}
          </p>
        </div>
        
        <div className="mt-4">
          <button 
            className="btn btn-primary me-3" 
            onClick={resetError}
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            Try Again
          </button>
          <button 
            className="btn btn-outline-secondary" 
            onClick={() => window.history.back()}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Go Back
          </button>
        </div>
        
        <div className="mt-4">
          <small className="text-muted">
            If this problem persists, please contact support or try refreshing the page.
          </small>
        </div>
      </div>
    </section>
  );
};


export const ArticleLoadingSkeleton = () => {
  return (
    <section className="px-4 px-md-5 mx-auto mb-5" style={{ maxWidth: "900px" }}>
      <div className="pt-2 ps-3 mb-4">
        <div className="d-flex align-items-center">
          <div className="rounded" style={{ height: "20px", width: "200px", backgroundColor: "var(--bgDarkColor)" }}></div>
        </div>
      </div>
      
      {/* Article Header Skeleton */}
      <div className="article-header pb-4">
        <div className=" rounded mb-3" style={{ height: "40px", width: "70%", backgroundColor: "var(--bgDarkColor)" }}></div>
        
        <div className="d-flex my-4">
          <div className="rounded-circle " style={{ width: "50px", height: "50px", backgroundColor: "var(--bgDarkColor)" }}></div>
          <div className="ms-3">
            <div className="rounded mb-2" style={{ height: "20px", width: "150px", backgroundColor: "var(--bgDarkColor)" }}></div>
            <div className="rounded" style={{ height: "15px", width: "200px", backgroundColor: "var(--bgDarkColor)"   }}></div>
          </div>
        </div>
        
        <hr />
        
        <div className="d-flex">
          <div className="rounded me-3" style={{ height: "18px", width: "100px", backgroundColor: "var(--bgDarkColor)" }}></div>
          <div className="rounded" style={{ height: "18px", width: "80px", backgroundColor: "var(--bgDarkColor)" }}></div>
        </div>
        
        <hr />
      </div>
      
      {/* Article Body Skeleton */}
      <div className="article-body pb-4">
        <div className="rounded mb-4" style={{ height: "200px", width: "100%", backgroundColor: "var(--bgDarkColor)" }}></div>
        
        <div className="space-y-3">
          <div className="rounded mb-3" style={{ height: "20px", width: "100%", backgroundColor: "var(--bgDarkColor)" }}></div>
          <div className="rounded mb-3" style={{ height: "20px", width: "95%", backgroundColor: "var(--bgDarkColor)" }}></div>
          <div className="rounded mb-3" style={{ height: "20px", width: "90%", backgroundColor: "var(--bgDarkColor)" }}></div>
          <div className="rounded mb-3" style={{ height: "20px", width: "85%", backgroundColor: "var(--bgDarkColor)" }}></div>
        </div>
      </div>
    </section>
  );
};


export const CommentsErrorBoundary = ({ error, onRetry }: {
  error: Error;
  onRetry: () => void;
}) => {
  return (
    <div className="alert alert-warning" role="alert">
      <div className="d-flex align-items-center">
        <i className="bi bi-exclamation-triangle-fill me-3" style={{ fontSize: "1.5rem" }}></i>
        <div className="flex-grow-1">
          <h6 className="alert-heading">Failed to load comments</h6>
          <p className="mb-2">{error?.message || "Comments could not be loaded at this time."}</p>
          <button className="btn btn-sm btn-outline-warning" onClick={onRetry}>
            <i className="bi bi-arrow-clockwise me-1"></i>
            Retry
          </button>
        </div>
      </div>
    </div>
  );
};

export const CategoriesError = ({ error, onRetry } : {
  error: Error;
  onRetry: () => void;
}) => (
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


export const ArticlesError = ({ error, onRetry } : {
  error: Error;
  onRetry: () => void;
}) => (
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

export default ArticleErrorBoundary;
