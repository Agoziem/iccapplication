import ArticlePlaceholder from "@/components/features/configuration/articles/ArticlePlaceholder";
import Link from "next/link";
import React from "react";

function NewsPostItem({ item, index, items }) {
  return (
    <div className="post-item ">
      <div className="d-flex">
        {item.img_url ? (
          <div className="post-image">
            <img
              src={item.img_url}
              alt={item.title}
              style={{
                width: "90px",
                height: "90px",
                objectFit: "cover",
                objectPosition: "top center",
              }}
            />
          </div>
        ) : (
          <ArticlePlaceholder />
        )}
        <div className="ms-3">
          <h6 className="text-wrap text-break">
            <Link href={`/articles/${item.slug}`}>{item.title}</Link>
          </h6>
          <p>{item.subtitle}...</p>
        </div>
      </div>

      {index < items.length - 1 && <hr style={{ width: "100%" }} />}
    </div>
  );
}

export default NewsPostItem;
