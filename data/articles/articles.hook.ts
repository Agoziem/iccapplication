"use client";
import { useQuery, useMutation, useQueryClient } from "react-query";
import * as articleAPI from "@/data/articles/fetcher"; // Assuming your API file is located here

// Custom Hooks

/** Fetch Articles */
export const useFetchArticles = (url) =>
  useQuery(["articles", url], () => articleAPI.fetchArticles(url), {
    enabled: !!url,
  });

/** Fetch Article by Slug */
export const useFetchArticleBySlug = (url, slug) =>
  useQuery(["article", slug], () => articleAPI.fetchArticlebySlug(url), {
    enabled: !!slug,
  });

/** Fetch Article Categories */
export const useFetchArticleCategories = (url) =>
  useQuery(["categories", url], () => articleAPI.fetchArticlesCategories(url), {
    enabled: !!url,
  });

/** Create Article */
export const useCreateArticle = () => {
  const queryClient = useQueryClient();
  return useMutation(articleAPI.createArticle, {
    onSuccess: () => {
      queryClient.invalidateQueries("articles"); // Refetch articles
    },
  });
};

/** Update Article */
export const useUpdateArticle = () => {
  const queryClient = useQueryClient();
  return useMutation(articleAPI.updateArticle, {
    onSuccess: () => {
      queryClient.invalidateQueries("articles"); // Refetch articles
    },
  });
};

/** Delete Article */
export const useDeleteArticle = () => {
  const queryClient = useQueryClient();
  return useMutation(articleAPI.deleteArticle, {
    onSuccess: () => {
      queryClient.invalidateQueries("articles"); // Refetch articles
    },
  });
};

/** Fetch Comments */
export const useFetchComments = (url, article_id) =>
  useQuery(["comments", article_id, url], () => articleAPI.fetchComments(url), {
    enabled: !!article_id,
  });

/** Create Comment */
export const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation(articleAPI.createComment, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["comments", variables.blog]); // Refetch comments
    },
  });
};

/** Update Comment */
export const useUpdateComment = () => {
  const queryClient = useQueryClient();
  return useMutation(articleAPI.updateComment, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["comments", variables.blog]); // Refetch comments
    },
  });
};

/** Delete Comment */
export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation(articleAPI.deleteComment, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries("comments"); // Refetch comments
    },
  });
};

/** Increment Views of an Article */
export const useIncrementView = () => {
  const queryClient = useQueryClient();
  return useMutation(articleAPI.incrementView, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["article", variables.slug]); // Refetch the article
    },
  });
};

/** Add Like */
export const useAddLike = () => {
  const queryClient = useQueryClient();
  return useMutation(articleAPI.addLike, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["article", variables.Article.slug]); // Refetch the article
    },
  });
};

/** Delete Like */
export const useDeleteLike = () => {
  const queryClient = useQueryClient();
  return useMutation(articleAPI.deleteLike, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["article", variables.Article.slug]); // Refetch the article
    },
  });
};
