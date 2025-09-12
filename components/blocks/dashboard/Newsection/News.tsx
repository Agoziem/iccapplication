import NewsPostItem from "./NewsPostItem";
import "./news.css";
import Link from "next/link";
import { articleAPIendpoint, fetchArticles } from "@/data/hooks/articles.hooks";
import { useFetchArticles } from "@/data/hooks/articles.hooks";
import Loading from "@/components/custom/Loading/Loading";

function News() {
  const Organizationid = process.env.NEXT_PUBLIC_ORGANIZATION_ID;
  // ----------------------------------------------------------
  // fetch articles by Categories
  // ----------------------------------------------------------
  const { data: articles, isLoading } = useFetchArticles(
    `${articleAPIendpoint}/orgblogs/${Organizationid}/?category=All&page=1&page_size=6/`
  );

  return (
    <div className="card ">
      <div className="card-body pb-4">
        <h6 className="px-3 pt-2">Articles &amp; Updates</h6>
        <hr />

        {isLoading ? (
          <Loading item="Articles" />
        ) : (
          <div className="news mt-3">
            {articles && articles.results.length > 0 ? (
              articles.results
                .slice(0, 6)
                .map((item, index) => (
                  <NewsPostItem
                    key={item.id}
                    item={item}
                    index={index}
                    items={articles}
                  />
                ))
            ) : (
              <div className="d-flex justify-content-center align-items-center">
                <p className="fw-bold mb-1 py-4" style={{ marginLeft: "0px" }}>
                  No Articles Available
                </p>
              </div>
            )}
            {articles && articles.results.length > 5 && (
              <Link
                href={"/articles"}
                className="text-center text-secondary text-decoration-none"
              >
                View All Articles
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default News;
