"use client";
import { useQuery, useMutation, useQueryClient } from "react-query";
import * as articleAPI from "@/data/articles/fetcher";

/**
 * @fileoverview React Query hooks for blog articles, categories, and comments management.
 * Provides comprehensive CRUD operations with automatic cache invalidation and error handling.
 * 
 * @see {@link http://127.0.0.1:8000/swagger/} - Django REST API Documentation
 * @author Innovation CyberCafe Frontend Team
 * @version 1.0.0
 */

// =================== Article Category Hooks =================== //

/**
 * Hook to fetch article categories with caching and automatic refetching
 * Retrieves all available blog categories for article classification and filtering.
 * 
 * @function useFetchArticleCategories
 * @param {Object} [options] - Query configuration options
 * @param {boolean} [options.enabled=true] - Whether to enable automatic query execution
 * @param {number} [options.staleTime=300000] - Cache time in milliseconds (default: 5 minutes)
 * @returns {Object} React Query result object with categories data, loading state, and error handling
 * 
 * @example
 * ```javascript
 * const { data: categories, isLoading, error } = useFetchArticleCategories();
 * ```
 */
export const useFetchArticleCategories = (options = {}) =>
  useQuery(
    ["articleCategories"],
    () => articleAPI.fetchArticlesCategories(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      ...options,
    }
  );

/**
 * Hook to create a new article category
 * Creates a new blog category with automatic cache invalidation.
 * 
 * @function useCreateArticleCategory
 * @returns {Object} React Query mutation object
 * 
 * @example
 * ```javascript
 * const createCategory = useCreateArticleCategory();
 * createCategory.mutate({ category: "Technology", description: "Tech articles" });
 * ```
 */
export const useCreateArticleCategory = () => {
  const queryClient = useQueryClient();
  return useMutation(articleAPI.createArticleCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries(["articleCategories"]);
    },
  });
};

/**
 * Hook to update an existing article category
 * Updates category information with automatic cache invalidation.
 * 
 * @function useUpdateArticleCategory
 * @returns {Object} React Query mutation object for category updates
 * 
 * @example
 * ```javascript
 * const updateCategory = useUpdateArticleCategory();
 * updateCategory.mutate([1, { category: "Updated Tech", description: "Updated description" }]);
 * ```
 */
export const useUpdateArticleCategory = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (variables) => articleAPI.updateArticleCategory(variables[0], variables[1]),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["articleCategories"]);
      },
    }
  );
};

/**
 * Hook to delete an article category
 * Removes a category with automatic cache invalidation.
 * 
 * @function useDeleteArticleCategory
 * @returns {Object} React Query mutation object for category deletion
 * 
 * @example
 * ```javascript
 * const deleteCategory = useDeleteArticleCategory();
 * deleteCategory.mutate(categoryId);
 * ```
 */
export const useDeleteArticleCategory = () => {
  const queryClient = useQueryClient();
  return useMutation(articleAPI.deleteArticleCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries(["articleCategories"]);
    },
  });
};

// =================== Article Management Hooks =================== //

/**
 * Hook to fetch articles with URL-based filtering
 * Retrieves blog articles using a custom URL endpoint for organization-specific articles.
 * 
 * @function useFetchArticles
 * @param {string} [url] - Custom API URL for fetching articles (optional, uses default if not provided)
 * @param {Object} [options] - React Query options
 * @returns {import("react-query").UseQueryResult<PaginatedBlogResponse, Error>} React Query result with articles data
 *
 * @example
 * ```javascript
 * const { data, isLoading } = useFetchArticles();
 * // Or with custom URL:
 * const { data } = useFetchArticles('/api/special-articles/');
 * ```
 */
export const useFetchArticles = (url, options = {}) =>
  useQuery(
    ["articles", url],
    () => articleAPI.fetchArticles(url),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      ...options,
    }
  );

/**
 * Hook to fetch articles by user ID
 * Retrieves all articles authored by a specific user.
 * 
 * @function useFetchArticlesByUser
 * @param {number} userId - User ID to fetch articles for
 * @param {Object} [params] - Additional query parameters
 * @param {Object} [options] - React Query options
 * @returns {import("react-query").UseQueryResult<PaginatedBlogResponse, Error>} React Query result with user's articles
 *
 * @example
 * ```javascript
 * const { data: userArticles } = useFetchArticlesByUser(123, { page: 1 });
 * ```
 */
export const useFetchArticlesByUser = (userId, params = {}, options = {}) =>
  useQuery(
    ["userArticles", userId, params],
    () => articleAPI.fetchArticlesByUser(userId, params),
    {
      enabled: !!userId,
      keepPreviousData: true,
      ...options,
    }
  );

/**
 * Hook to fetch articles by organization ID
 * Retrieves all articles for a specific organization with optional category filtering.
 * 
 * @function useFetchArticlesByOrganization
 * @param {number} organizationId - Organization ID to fetch articles for
 * @param {Object} [params] - Additional query parameters
 * @param {Object} [options] - React Query options
 * @returns {Object} React Query result with organization's articles
 * 
 * @example
 * ```javascript
 * const { data: orgArticles } = useFetchArticlesByOrganization(1, { category: "News" });
 * ```
 */
export const useFetchArticlesByOrganization = (organizationId, params = {}, options = {}) =>
  useQuery(
    ["organizationArticles", organizationId, params],
    () => articleAPI.fetchArticlesByOrganization(organizationId, params),
    {
      enabled: !!organizationId,
      keepPreviousData: true,
      ...options,
    }
  );

/**
 * Hook to fetch a single article by slug
 * Retrieves complete article data using URL-friendly slug identifier.
 * 
 * @function useFetchArticleBySlug
 * @param {string} slug - Article slug identifier
 * @param {Object} [options] - React Query options
 * @returns {import("react-query").UseQueryResult<Article, Error>} React Query result with single article
 * 
 * @example
 * ```javascript
 * const { data: article, isLoading } = useFetchArticleBySlug("my-blog-post");
 * ```
 */
export const useFetchArticleBySlug = (slug, options = {}) =>
  useQuery(
    ["article", "slug", slug],
    () => articleAPI.fetchArticleBySlug(slug),
    {
      enabled: !!slug,
      staleTime: 5 * 60 * 1000, // 5 minutes
      ...options,
    }
  );

/**
 * Hook to fetch a single article by ID
 * Retrieves complete article data using numeric identifier.
 * 
 * @function useFetchArticleById
 * @param {number} blogId - Article ID
 * @param {Object} [options] - React Query options
 * @returns {import("react-query").UseQueryResult<Article, Error>} React Query result with single article
 * 
 * @example
 * ```javascript
 * const { data: article } = useFetchArticleById(123);
 * ```
 */
export const useFetchArticleById = (blogId, options = {}) =>
  useQuery(
    ["article", "id", blogId],
    () => articleAPI.fetchArticleById(blogId),
    {
      enabled: !!blogId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      ...options,
    }
  );

/**
 * Hook to create a new article
 * Creates a blog article with automatic cache invalidation.
 * 
 * @function useCreateArticle
 * @returns {Object} React Query mutation object for article creation
 * 
 * @example
 * ```javascript
 * const createArticle = useCreateArticle();
 * const articleData = { title: "New Post", body: "Content...", category: 1 };
 * createArticle.mutate(articleData);
 * ```
 */
export const useCreateArticle = () => {
  const queryClient = useQueryClient();
  return useMutation(articleAPI.createArticle, {
    onSuccess: () => {
      queryClient.invalidateQueries(["articles"]);
      queryClient.invalidateQueries(["userArticles"]);
      queryClient.invalidateQueries(["organizationArticles"]);
    },
  });
};

/**
 * Hook to update an existing article
 * Updates article information with automatic cache invalidation.
 * 
 * @function useUpdateArticle
 * @returns {Object} React Query mutation object for article updates
 * 
 * @example
 * ```javascript
 * const updateArticle = useUpdateArticle();
 * updateArticle.mutate({ id: 1, title: "Updated Title", body: "Updated content..." });
 * ```
 */
export const useUpdateArticle = () => {
  const queryClient = useQueryClient();
  return useMutation(articleAPI.updateArticle, {
    onSuccess: (data, variables) => {
      // Invalidate all article-related queries
      queryClient.invalidateQueries(["articles"]);
      queryClient.invalidateQueries(["userArticles"]);
      queryClient.invalidateQueries(["organizationArticles"]);
      // Invalidate specific article cache
      if (variables.id) {
        queryClient.invalidateQueries(["article", "id", variables.id]);
      }
      if (data.slug) {
        queryClient.invalidateQueries(["article", "slug", data.slug]);
      }
    },
  });
};

/**
 * Hook to delete an article
 * Removes an article with comprehensive cache invalidation.
 * 
 * @function useDeleteArticle
 * @returns {Object} React Query mutation object for article deletion
 * 
 * @example
 * ```javascript
 * const deleteArticle = useDeleteArticle();
 * deleteArticle.mutate(articleId);
 * ```
 */
export const useDeleteArticle = () => {
  const queryClient = useQueryClient();
  return useMutation(articleAPI.deleteArticle, {
    onSuccess: () => {
      queryClient.invalidateQueries(["articles"]);
      queryClient.invalidateQueries(["userArticles"]);
      queryClient.invalidateQueries(["organizationArticles"]);
    },
  });
};

// =================== Comment Management Hooks =================== //

/**
 * Hook to fetch comments for an article
 * Retrieves all comments for a specific blog article.
 * 
 * @function useFetchComments
 * @param {number} blogId - Blog ID to fetch comments for
 * @param {Object} [options] - React Query options
 * @returns {Object} React Query result with article comments
 * 
 * @example
 * ```javascript
 * const { data: comments, isLoading } = useFetchComments(123);
 * ```
 */
export const useFetchComments = (blogId, options = {}) =>
  useQuery(
    ["comments", blogId],
    () => articleAPI.fetchComments(blogId),
    {
      enabled: !!blogId,
      staleTime: 1 * 60 * 1000, // 1 minute
      ...options,
    }
  );

/**
 * Hook to create a new comment
 * Creates a comment on a blog article with automatic cache invalidation.
 * 
 * @function useCreateComment
 * @returns {Object} React Query mutation object for comment creation
 * 
 * @example
 * ```javascript
 * const createComment = useCreateComment();
 * createComment.mutate({ blog: 123, comment: "Great article!", user: 456 });
 * ```
 */
export const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation(articleAPI.createComment, {
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["comments", variables.blog]);
      // Update article comment count if available
      queryClient.invalidateQueries(["article"]);
    },
  });
};

/**
 * Hook to update an existing comment
 * Updates comment content with automatic cache invalidation.
 * 
 * @function useUpdateComment
 * @returns {Object} React Query mutation object for comment updates
 * 
 * @example
 * ```javascript
 * const updateComment = useUpdateComment();
 * updateComment.mutate({ id: 1, comment: "Updated comment text", blog: 123 });
 * ```
 */
export const useUpdateComment = () => {
  const queryClient = useQueryClient();
  return useMutation(articleAPI.updateComment, {
    onSuccess: (data, variables) => {
      if (data.blog) {
        queryClient.invalidateQueries(["comments", data.blog]);
      }
    },
  });
};

/**
 * Hook to delete a comment
 * Removes a comment with automatic cache invalidation.
 * 
 * @function useDeleteComment
 * @returns {Object} React Query mutation object for comment deletion
 * 
 * @example
 * ```javascript
 * const deleteComment = useDeleteComment();
 * deleteComment.mutate(commentId);
 * ```
 */
export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation(articleAPI.deleteComment, {
    onSuccess: () => {
      queryClient.invalidateQueries(["comments"]);
      queryClient.invalidateQueries(["article"]);
    },
  });
};

// =================== Article Interaction Hooks =================== //

/**
 * Hook to increment article view count
 * Tracks article engagement by incrementing view counter.
 * 
 * @function useIncrementView
 * @returns {Object} React Query mutation object for view increment
 * 
 * @example
 * ```javascript
 * const incrementView = useIncrementView();
 * incrementView.mutate(articleObject);
 * ```
 */
export const useIncrementView = () => {
  const queryClient = useQueryClient();
  return useMutation(articleAPI.incrementView, {
    onSuccess: (data, variables) => {
      // Update specific article cache with new view count
      if (variables.id) {
        queryClient.setQueryData(["article", "id", variables.id], data);
      }
      if (variables.slug) {
        queryClient.setQueryData(["article", "slug", variables.slug], data);
      }
    },
  });
};

/**
 * Hook to add a like to an article
 * Creates a like record for user engagement tracking.
 * 
 * @function useAddLike
 * @returns {Object} React Query mutation object for adding likes
 * 
 * @example
 * ```javascript
 * const addLike = useAddLike();
 * addLike.mutate({ article: articleObject, userId: 123 });
 * ```
 */
export const useAddLike = () => {
  const queryClient = useQueryClient();
  return useMutation(articleAPI.addLike, {
    onSuccess: (data, variables) => {
      // Invalidate article queries to refresh like count
      if (variables.article?.id) {
        queryClient.invalidateQueries(["article", "id", variables.article.id]);
      }
      if (variables.article?.slug) {
        queryClient.invalidateQueries(["article", "slug", variables.article.slug]);
      }
    },
  });
};

/**
 * Hook to remove a like from an article
 * Deletes a like record for user engagement tracking.
 * 
 * @function useDeleteLike
 * @returns {Object} React Query mutation object for removing likes
 * 
 * @example
 * ```javascript
 * const deleteLike = useDeleteLike();
 * deleteLike.mutate({ article: articleObject, userId: 123 });
 * ```
 */
export const useDeleteLike = () => {
  const queryClient = useQueryClient();
  return useMutation(articleAPI.deleteLike, {
    onSuccess: (data, variables) => {
      // Invalidate article queries to refresh like count
      if (variables.article?.id) {
        queryClient.invalidateQueries(["article", "id", variables.article.id]);
      }
      if (variables.article?.slug) {
        queryClient.invalidateQueries(["article", "slug", variables.article.slug]);
      }
    },
  });
};
