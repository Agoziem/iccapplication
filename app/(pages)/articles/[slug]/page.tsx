import Article from "@/components/features/Articles/article";

export async function generateMetadata({ params }) {
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

const ArticlePage = ({ params }) => {
  return <Article params={params} />;
};

export default ArticlePage;
