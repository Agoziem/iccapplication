import axios from "axios";
import { Article, ArticleComment, ArticleCategories, ArticlesResponse } from "@/types/articles";
import { converttoformData } from "@/utils/formutils";

// Define comment response type
type CommentResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: ArticleComment[];
};

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}`,
});

const Organizationid = process.env.NEXT_PUBLIC_ORGANIZATION_ID;

export const articleAPIendpoint = "/blogsapi";


/**
 * Fetch article categories
 */
export const fetchArticlesCategories = async (url: string): Promise<ArticleCategories | undefined> => {
  const response = await axiosInstance.get(url);
  return response.data;
};

/**
 * Fetch articles with pagination
 */
export const fetchArticles = async (url: string): Promise<ArticlesResponse | undefined> => {
  const response = await axiosInstance.get(url);
  return response.data;
};

/**
 * Fetch single article by slug
 */
export const fetchArticlebySlug = async (url: string): Promise<Article | undefined> => {
  const response = await axiosInstance.get(url);
  return response.data;
};

/**
 * Create new article
 */
export const createArticle = async (data: Partial<Article>): Promise<Article | undefined> => {
  const formData = converttoformData(data, ["tags"]);
  const response = await axiosInstance.post(
    `${articleAPIendpoint}/addblog/${Organizationid}/${data.author?.id}/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

/**
 * Update existing article
 */
export const updateArticle = async (data: Partial<Article>): Promise<Article | undefined> => {
  const formData = converttoformData(data, ["tags"]);
  const response = await axiosInstance.put(
    `${articleAPIendpoint}/updateblog/${data.id}/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

/**
 * Delete article
 */
export const deleteArticle = async (blogid: number): Promise<number> => {
  await axiosInstance.delete(`${articleAPIendpoint}/deleteblog/${blogid}/`);
  return blogid;
};

// ------------------------------------------------------
// Comment fetcher and mutation functions
// ------------------------------------------------------
/**
 * Fetch comments with pagination
 */
export const fetchComments = async (url: string): Promise<CommentResponse | undefined> => {
  const response = await axiosInstance.get(url);
  return response.data;
};

/**
 * Create new comment
 */
export const createComment = async (data: ArticleComment): Promise<ArticleComment | undefined> => {
  const response = await axiosInstance.post(
    `${articleAPIendpoint}/addcomment/${data.blog}/${data.user.id}/`,
    data
  );
  return response.data;
};

/**
 * Update existing comment
 */
export const updateComment = async (data: ArticleComment): Promise<ArticleComment | undefined> => {
  const response = await axiosInstance.put(
    `${articleAPIendpoint}/updatecomment/${data.id}/`,
    data
  );
  return response.data;
};

/**
 * Delete comment
 */
export const deleteComment = async (commentid: number): Promise<number> => {
  await axiosInstance.delete(`${articleAPIendpoint}/deletecomment/${commentid}/`);
  return commentid;
};

// ------------------------------------------------------
// Article View fetcher and mutation functions
// ------------------------------------------------------
/**
 * Increment article view count
 */
export const incrementView = async (article: Article): Promise<Article> => {
  try {
    await axiosInstance.get(`${articleAPIendpoint}/addviews/${article.id}/`);
    const updatedArticle = { ...article, views: (article.views || 0) + 1 };
    return updatedArticle;
  } catch (error) {
    console.error("Failed to add view:", error);
    throw error;
  }
};

// ------------------------------------------------------
// Article Likes fetcher and mutation functions
// ------------------------------------------------------
export const addLike = async ({ Article, userid }: { Article: Article; userid: number }): Promise<void> => {
  try {
    await axiosInstance.get(`${articleAPIendpoint}/addlike/${Article.id}/${userid}/`);
  } catch (error) {
    console.error("Failed to add like:", error);
    throw Error("Failed to add like");
  }
};

export const deleteLike = async ({ Article, userid }: { Article: Article; userid: number }): Promise<void> => {
  try {
    await axiosInstance.delete(`${articleAPIendpoint}/deletelike/${Article.id}/${userid}/`);
  } catch (error) {
    console.error("Failed to remove like:", error);
    throw Error("Failed to remove like");
  }
};
