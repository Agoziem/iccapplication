import axios from "axios";
import {
  ArticleResponseSchema,
  ArticleSchema,
  categoryArraySchema,
  commentResponseSchema,
  commentSchema,
} from "@/schemas/articles";
import { converttoformData } from "@/utils/formutils";

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}`,
});

const Organizationid = process.env.NEXT_PUBLIC_ORGANIZATION_ID;

export const articleAPIendpoint = "/blogsapi";

// ------------------------------------------------------
// Article fetcher and mutation functions
// ------------------------------------------------------
/**
 * @async
 * @param {string} url
 */
export const fetchArticlesCategories = async (url) => {
  const response = await axiosInstance.get(url);
  const validation = categoryArraySchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

// ------------------------------------------------------
// Article Category fetcher and mutation functions
// ------------------------------------------------------

/**
 * @async
 * @param {string} url
 */
export const fetchArticles = async (url) => {
  const response = await axiosInstance.get(url);
  const validation = ArticleResponseSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * @async
 * @param {string} url
 */
export const fetchArticlebySlug = async (url) => {
  const response = await axiosInstance.get(url);
  const validation = ArticleSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * @async
 * @returns {Promise<Article>}
 */
export const createArticle = async (data) => {
  const formData = converttoformData(data,["tags"])
  const response = await axiosInstance.post(
    `${articleAPIendpoint}/addblog/${Organizationid}/${data.author}/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  const validation = ArticleSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * @async
 * @returns {Promise<Article>}
 */
export const updateArticle = async (data) => {
  const formData = converttoformData(data,["tags"])
  const response = await axiosInstance.put(
    `${articleAPIendpoint}/updateblog/${data.id}/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  const validation = ArticleSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * @async
 * @param {number} blogid
 * @returns {Promise<number>}
 */
export const deleteArticle = async (blogid) => {
  await axiosInstance.delete(`${articleAPIendpoint}/deleteblog/${blogid}/`);
  return blogid;
};

// ------------------------------------------------------
// Comment fetcher and mutation functions
// ------------------------------------------------------
/**
 * @async
 * @param {string} url
 */
export const fetchComments = async (url) => {
  const response = await axiosInstance.get(url);
  const validation = commentResponseSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * @async
 * @param {ArticleComment} data
 * @returns {Promise<ArticleComment>}
 */
export const createComment = async (data) => {
  const response = await axiosInstance.post(
    `${articleAPIendpoint}/addcomment/${data.blog}/${data.user.id}/`,
    data
  );
  const validation = commentSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * @async
 * @param {ArticleComment} data
 * @returns {Promise<ArticleComment>}
 */
export const updateComment = async (data) => {
  const response = await axiosInstance.put(
    `${articleAPIendpoint}/updatecomment/${data.id}/`,
    data
  );
  const validation = commentSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * @async
 * @param {number} commentid
 * @returns {Promise<number>}
 */
export const deleteComment = async (commentid) => {
  await axiosInstance.delete(
    `${articleAPIendpoint}/deletecomment/${commentid}/`
  );
  return commentid;
};

// ------------------------------------------------------
// Article View fetcher and mutation functions
// ------------------------------------------------------
/**
 * increase view
 * @async
 * @param {Article} Article
 */
export const incrementView = async (Article) => {
  try {
    await axiosInstance.get(`${articleAPIendpoint}/addviews/${Article.id}/`);
    const updatedArticle = { ...Article, readtime: Article.readTime + 1 };
    return updatedArticle;
  } catch (error) {
    console.error("Failed to add like:", error);
    throw error;
  }
};

// ------------------------------------------------------
// Article Likes fetcher and mutation functions
// ------------------------------------------------------
export const addLike = async ({Article, userid}) => {
  try {
    await axiosInstance.get(
      `${articleAPIendpoint}/addlike/${Article.id}/${userid}/`
    );
  } catch (error) {
    console.error("Failed to add like:", error);
    throw Error("Failed to add like");
  }
};


export const deleteLike = async ({Article, userid}) => {
  try {
    await axiosInstance.delete(
      `${articleAPIendpoint}/deletelike/${Article.id}/${userid}/`
    );
  } catch (error) {
    console.error("Failed to remove like:", error);
    throw Error("Failed to remove like");
  }
};
