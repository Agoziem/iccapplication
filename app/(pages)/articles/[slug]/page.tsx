import Article from "@/components/features/Articles/article";
import { API_URL, SITE_URL } from "@/data/constants";
import { ArticleResponse } from "@/types/articles";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;

  // Fetch article data
  const fetchArticleBySlug = async (
    slug: string
  ): Promise<ArticleResponse | null> => {
    try {
      const response = await fetch(
        `${API_URL}/blogsapi/blogbyslug/${slug}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store", // Ensure fresh data for metadata
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch article: ${response.status} ${response.statusText}`
        );
      }

      const article: ArticleResponse = await response.json();
      return article;
    } catch (error) {
      console.error("Error fetching article:", error);
      // Return a default article object to prevent metadata generation errors
      return null;
    }
  };

  const article = await fetchArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found",
      metadataBase: new URL(SITE_URL || 'http://localhost:3000'),
      openGraph: {
        title: "Article Not Found",
        description: "The requested article could not be found.",
      },
    };
  }
  return {
    title: article.title,
    metadataBase: new URL(SITE_URL || 'http://localhost:3000'),
    openGraph: {
      title: article.title,
      description: article.subtitle,
      images: [article.img_url], // URL of the product image
    },
  };
}

const ArticlePage = () => {
  return <Article />;
};

export default ArticlePage;
