"use client";
import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from "react-query";
import { Article, ArticleComment, ArticleCategories, ArticlesResponse } from "@/types/articles";
import * as articleAPI from "@/data/articles/fetcher";

// Define comment response type
type CommentResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: ArticleComment[];
};

// Custom Hooks

/** Fetch Articles */
export const useFetchArticles = (url: string): UseQueryResult<ArticlesResponse, Error> =>
  useQuery(["articles", url], () => articleAPI.fetchArticles(url), {
    enabled: !!url,
  });

/** Fetch Article by Slug */
export const useFetchArticleBySlug = (url: string, slug: string): UseQueryResult<Article, Error> =>
  useQuery(["article", slug], () => articleAPI.fetchArticlebySlug(url), {
    enabled: !!slug,
  });

/** Fetch Article Categories */
export const useFetchArticleCategories = (url: string): UseQueryResult<ArticleCategories, Error> =>
  useQuery(["categories", url], () => articleAPI.fetchArticlesCategories(url), {
    enabled: !!url,
  });

/** Create Article */
export const useCreateArticle = (): UseMutationResult<Article | undefined, Error, Partial<Article>> => {
  const queryClient = useQueryClient();
  return useMutation(articleAPI.createArticle, {
    onSuccess: () => {
      queryClient.invalidateQueries("articles"); // Refetch articles
    },
  });
};

/** Update Article */
export const useUpdateArticle = (): UseMutationResult<Article | undefined, Error, Partial<Article>> => {
  const queryClient = useQueryClient();
  return useMutation(articleAPI.updateArticle, {
    onSuccess: () => {
      queryClient.invalidateQueries("articles"); // Refetch articles
    },
  });
};

/** Delete Article */
export const useDeleteArticle = (): UseMutationResult<number, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation(articleAPI.deleteArticle, {
    onSuccess: () => {
      queryClient.invalidateQueries("articles"); // Refetch articles
    },
  });
};

/** Fetch Comments */
export const useFetchComments = (url: string, article_id: number): UseQueryResult<CommentResponse, Error> =>
  useQuery(["comments", article_id, url], () => articleAPI.fetchComments(url), {
    enabled: !!article_id,
  });

/** Create Comment */
export const useCreateComment = (): UseMutationResult<ArticleComment | undefined, Error, ArticleComment> => {
  const queryClient = useQueryClient();
  return useMutation(articleAPI.createComment, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["comments", variables.blog]); // Refetch comments
    },
  });
};

/** Update Comment */
export const useUpdateComment = (): UseMutationResult<ArticleComment | undefined, Error, ArticleComment> => {
  const queryClient = useQueryClient();
  return useMutation(articleAPI.updateComment, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["comments", variables.blog]); // Refetch comments
    },
  });
};

/** Delete Comment */
export const useDeleteComment = (): UseMutationResult<number, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation(articleAPI.deleteComment, {
    onSuccess: () => {
      queryClient.invalidateQueries("comments"); // Refetch comments
    },
  });
};

/** Increment Views of an Article */
export const useIncrementView = (): UseMutationResult<Article, Error, Article> => {
  const queryClient = useQueryClient();
  return useMutation(articleAPI.incrementView, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["article", variables.slug]); // Refetch the article
    },
  });
};

/** Add Like */
export const useAddLike = (): UseMutationResult<void, Error, { Article: Article; userid: number }> => {
  const queryClient = useQueryClient();
  return useMutation(articleAPI.addLike, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["article", variables.Article.slug]); // Refetch the article
    },
  });
};

/** Delete Like */
export const useDeleteLike = (): UseMutationResult<void, Error, { Article: Article; userid: number }> => {
  const queryClient = useQueryClient();
  return useMutation(articleAPI.deleteLike, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["article", variables.Article.slug]); // Refetch the article
    },
  });
};
