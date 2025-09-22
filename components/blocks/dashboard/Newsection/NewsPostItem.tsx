import React, { useMemo } from "react";
import Link from "next/link";
import ArticlePlaceholder from "@/components/features/configuration/articles/ArticlePlaceholder";
import { ArticleResponse, PaginatedArticleResponse } from "@/types/articles";
import moment from "moment";

interface NewsPostItemProps {
  item: ArticleResponse;
  index: number;
  items: PaginatedArticleResponse | undefined;
}

const NewsPostItem: React.FC<NewsPostItemProps> = React.memo(({ item, index, items }) => {
  // Memoized show divider condition
  const shouldShowDivider = useMemo(() => {
    if (!items?.results) return false;
    return index < items.results.length - 1;
  }, [index, items?.results]);

  // Memoized truncated subtitle
  const truncatedSubtitle = useMemo(() => {
    if (!item.subtitle) return "";
    const maxLength = 100;
    return item.subtitle.length > maxLength 
      ? `${item.subtitle.substring(0, maxLength)}...` 
      : item.subtitle;
  }, [item.subtitle]);

  return (
    <article className="post-item" role="listitem">
      <div className="d-flex align-items-start">
        <div className="post-image flex-shrink-0">
          {item.img_url ? (
            <img
              src={item.img_url}
              alt={`Thumbnail for ${item.title}`}
              className="rounded shadow-sm"
              style={{
                width: "60px",
                height: "60px",
                objectFit: "cover",
                objectPosition: "top center",
              }}
              loading="lazy"
            />
          ) : (
            <ArticlePlaceholder />
          )}
        </div>
        
        <div className="ms-3 flex-grow-1">
          <h6 className="mb-2 line-clamp-3">
            <Link 
              href={`/articles/${item.slug}`}
              className="text-decoration-none "
              title={item.title}
            >
              {item.title}
            </Link>
          </h6>
          
          {truncatedSubtitle && (
            <p className="text-muted small mb-0 lh-sm line-clamp-3">
              {truncatedSubtitle}
            </p>
          )}
          
          <small className="text-secondary">
            {item.date ? moment(item.date).fromNow() : 'No date'}
          </small>
        </div>
      </div>

      {shouldShowDivider && (
        <hr className="my-3" style={{ width: "100%" }} />
      )}
    </article>
  );
});

NewsPostItem.displayName = "NewsPostItem";

export default NewsPostItem;
