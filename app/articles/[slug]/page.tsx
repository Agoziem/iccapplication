import Article from "@/components/features/Articles/article";
import { Metadata } from "next";
import { FC } from "react";

interface ArticlePageParams {
  slug: string;
}

interface ArticlePageProps {
  params: ArticlePageParams;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = params;

  // Fetch product data
  const article = await fetch(
    `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/blogsapi/blogbyslug/${slug}`
  ).then((res) => res.json());

  return {
    title: article.title,
    openGraph: {
      title: article.title,
      description: article.subtitle,
      images: [article.img_url], // URL of the product image
    },
  };
}

const ArticlePage: FC<ArticlePageProps> = ({ params }) => {
  return <Article params={params} />;
};

export default ArticlePage;
