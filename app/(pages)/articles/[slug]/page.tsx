import Article from "@/components/features/Articles/article";
import { articleAPIendpoint } from "@/data/hooks/articles.hooks";
import { AxiosInstance } from "@/data/instance";
import { ArticleResponse } from "@/types/articles";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  // Fetch product data
  const fetchArticleBySlug = async (slug: string): Promise<ArticleResponse> => {
    const response = await AxiosInstance.get(
      `${articleAPIendpoint}/blogbyslug/${slug}/`
    );
    return response.data;
  };

  const article = await fetchArticleBySlug(slug);

  return {
    title: article.title,
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
