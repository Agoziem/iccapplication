import Article from "@/components/features/Articles/article";
import { fetchArticleBySlug } from "@/data/hooks/articles.hooks";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  // Fetch product data
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
