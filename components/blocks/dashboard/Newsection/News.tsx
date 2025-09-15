import React, { useMemo } from "react";
import NewsPostItem from "./NewsPostItem";
import "./news.css";
import Link from "next/link";
import { useArticles } from "@/data/hooks/articles.hooks";
import Loading from "@/components/custom/Loading/Loading";

const News: React.FC = React.memo(() => {
  const { data: articles, isLoading } = useArticles();

  // Memoized article slice
  const displayedArticles = useMemo(() => {
    if (!articles?.results) return [];
    return articles.results.slice(0, 6);
  }, [articles?.results]);

  // Memoized show more link condition
  const shouldShowMoreLink = useMemo(() => {
    return articles?.results && articles.results.length > 5;
  }, [articles?.results]);

  return (
    <div className="card" role="region" aria-label="News and articles section">
      <div className="card-body pb-4">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <h6 className="px-3 pt-2 mb-0 fw-semibold">
            <i className="bi bi-newspaper me-2" aria-hidden="true"></i>
            Articles &amp; Updates
          </h6>
        </div>
        <hr className="mt-2" />

        {isLoading ? (
          <div className="d-flex justify-content-center align-items-center py-4">
            <Loading item="Articles" />
          </div>
        ) : (
          <div className="news mt-3">
            {displayedArticles.length > 0 ? (
              <div className="news-list" role="list">
                {displayedArticles.map((item, index) => (
                  <NewsPostItem
                    key={item.id}
                    item={item}
                    index={index}
                    items={articles}
                  />
                ))}
              </div>
            ) : (
              <div className="d-flex flex-column justify-content-center align-items-center py-4">
                <i className="bi bi-newspaper fs-1 text-muted mb-2" aria-hidden="true"></i>
                <p className="fw-bold mb-1 text-muted">No Articles Available</p>
                <small className="text-muted">
                  Articles will appear here once they are published.
                </small>
              </div>
            )}
            
            {shouldShowMoreLink && (
              <div className="text-center mt-3">
                <Link
                  href="/articles"
                  className="btn btn-outline-secondary btn-sm"
                  aria-label="View all articles"
                >
                  <i className="bi bi-arrow-right me-2" aria-hidden="true"></i>
                  View All Articles
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

News.displayName = "News";

export default News;
