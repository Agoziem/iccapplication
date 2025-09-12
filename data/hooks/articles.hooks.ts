import { converttoformData } from "@/utils/formutils";
import { AxiosInstance, AxiosInstancemultipart, AxiosInstanceWithToken, AxiosInstancemultipartWithToken } from "../instance";
import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult, Query } from "react-query";
import { 
  Category, 
  CategoryArray, 
  CreateCategory, 
  UpdateCategory,
  ArticleResponse, 
  PaginatedArticleResponse,
  Comment,
  CreateComment,
  UpdateComment,
  ArticleFormData,
  CommentResponse,
  UpdateArticle,
  CreateArticle
} from "@/types/articles";
import { ORGANIZATION_ID } from "../constants";

export const articleAPIendpoint = "/blogsapi";

// Query Keys
export const ARTICLE_KEYS = {
  all: ['articles'] as const,
  categories: () => [...ARTICLE_KEYS.all, 'categories'] as const,
  category: (id: number) => [...ARTICLE_KEYS.categories(), id] as const,
  articles: () => [...ARTICLE_KEYS.all, 'articles'] as const,
  article: (id: number) => [...ARTICLE_KEYS.articles(), id] as const,
  articlesByOrg: (orgId: number, params?: Record<string, any>) => [...ARTICLE_KEYS.all, 'articlesByOrg', orgId, params] as const,
  articleBySlug: (slug: string) => [...ARTICLE_KEYS.all, 'articleBySlug', slug] as const,
  comments: (articleId: number, params?: Record<string, any>) => [...ARTICLE_KEYS.all, 'comments', articleId, params] as const,
  comment: (id: number) => [...ARTICLE_KEYS.all, 'comment', id] as const,
};


export const fetchArticlesCategories = async (url = `${articleAPIendpoint}/getCategories/`): Promise<CategoryArray> => {
  const response = await AxiosInstance.get(url);
  return response.data;
};

export const createArticleCategory = async (categoryData: CreateCategory): Promise<Category> => {
  const response = await AxiosInstanceWithToken.post(
    `${articleAPIendpoint}/addCategory/`,
    categoryData
  );
  return response.data;
};

export const updateArticleCategory = async (categoryId: number, categoryData: CreateCategory): Promise<Category> => {
  const response = await AxiosInstanceWithToken.put(
    `${articleAPIendpoint}/updateCategory/${categoryId}/`,
    categoryData
  );
  return response.data;
};

export const deleteArticleCategory = async (categoryId: number): Promise<void> => {
  await AxiosInstanceWithToken.delete(`${articleAPIendpoint}/deleteCategory/${categoryId}/`);
};

export const fetchArticles = async (url?: string): Promise<PaginatedArticleResponse> => {
  const apiUrl = url || `${articleAPIendpoint}/orgblogs/${ORGANIZATION_ID}/`;
  const response = await AxiosInstance.get(apiUrl);
  return response.data;
};

export const fetchArticlesByOrganization = async (organizationId: number, params: Record<string, any> = {}): Promise<PaginatedArticleResponse> => {
  const queryString = new URLSearchParams(params).toString();
  const url = `${articleAPIendpoint}/orgblogs/${organizationId}/${queryString ? `?${queryString}` : ''}`;
  const response = await AxiosInstance.get(url);
  return response.data;
};

export const fetchArticleBySlug = async (slug: string): Promise<ArticleResponse> => {
  const response = await AxiosInstance.get(`${articleAPIendpoint}/blogbyslug/${slug}/`);
  return response.data;
};

export const fetchArticleById = async (blogId: number): Promise<ArticleResponse> => {
  const response = await AxiosInstance.get(`${articleAPIendpoint}/blog/${blogId}/`);
  return response.data;
};

export const createArticle = async (organizationId: number, userId: number, articleData: CreateArticle): Promise<ArticleResponse> => {
  const formData = converttoformData(articleData);
  const response = await AxiosInstancemultipartWithToken.post(
    `${articleAPIendpoint}/addblog/${organizationId}/${userId}/`,
    formData
  );
  return response.data;
};

export const updateArticle = async (articleData: UpdateArticle & { id: number }): Promise<ArticleResponse> => {
  const formData = converttoformData(articleData);
  const response = await AxiosInstancemultipartWithToken.put(
    `${articleAPIendpoint}/updateblog/${articleData.id}/`,
    formData
  );
  return response.data;
};

export const deleteArticle = async (blogId: number): Promise<void> => {
  await AxiosInstanceWithToken.delete(`${articleAPIendpoint}/deleteblog/${blogId}/`);
};

export const fetchComments = async (blogId: number, params?: Record<string, any>): Promise<CommentResponse> => {
  const response = await AxiosInstance.get(`${articleAPIendpoint}/getcomments/${blogId}/`, { params });
  return response.data;
};

export const createComment = async (blogId: number, userId: number, commentData: CreateComment): Promise<Comment> => {
  const response = await AxiosInstanceWithToken.post(
    `${articleAPIendpoint}/addcomment/${blogId}/${userId}/`,
    commentData
  );
  return response.data;
};

export const updateComment = async (commentData: UpdateComment & { id: number }): Promise<Comment> => {
  const response = await AxiosInstanceWithToken.put(
    `${articleAPIendpoint}/updatecomment/${commentData.id}/`,
    commentData
  );
  return response.data;
};

export const deleteComment = async (commentId: number): Promise<void> => {
  await AxiosInstanceWithToken.delete(`${articleAPIendpoint}/deletecomment/${commentId}/`);
};

export const addLike = async (blogId: number, userId: number): Promise<ArticleResponse> => {
  const response = await AxiosInstanceWithToken.get(`${articleAPIendpoint}/addlike/${blogId}/${userId}/`);
  return response.data;
};

export const deleteLike = async (blogId: number, userId: number): Promise<ArticleResponse> => {
  const response = await AxiosInstanceWithToken.delete(`${articleAPIendpoint}/deletelike/${blogId}/${userId}/`);
  return response.data;
};

export const addViews = async (blogId: number): Promise<ArticleResponse> => {
  const response = await AxiosInstance.get(`${articleAPIendpoint}/addviews/${blogId}/`);
  return response.data;
};

// React Query Hooks

// Categories Hooks
export const useArticleCategories = (): UseQueryResult<CategoryArray, Error> => {
  return useQuery({
    queryKey: ARTICLE_KEYS.categories(),
    queryFn: () => fetchArticlesCategories(),
    onError: (error: Error) => {
      console.error('Error fetching article categories:', error);
      throw error;
    },
  });
};

export const useCreateArticleCategory = (): UseMutationResult<Category, Error, CreateCategory> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createArticleCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(ARTICLE_KEYS.categories());
    },
    onError: (error: Error) => {
      console.error('Error creating article category:', error);
      throw error;
    },
  });
};

export const useUpdateArticleCategory = (): UseMutationResult<Category, Error, { id: number; categoryData: UpdateCategory }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, categoryData }) => updateArticleCategory(id, categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries(ARTICLE_KEYS.categories());
    },
    onError: (error: Error) => {
      console.error('Error updating article category:', error);
      throw error;
    },
  });
};

export const useDeleteArticleCategory = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteArticleCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(ARTICLE_KEYS.categories());
    },
    onError: (error: Error) => {
      console.error('Error deleting article category:', error);
      throw error;
    },
  });
};

// Articles Hooks
export const useArticles = (url?: string): UseQueryResult<ArticleResponse, Error> => {
  return useQuery({
    queryKey: url ? ARTICLE_KEYS.articles() : ARTICLE_KEYS.articles(),
    queryFn: () => fetchArticles(url),
    onError: (error: Error) => {
      console.error('Error fetching articles:', error);
      throw error;
    },
  });
};

export const useArticlesByOrganization = (
  organizationId: number,
  params?: Record<string, any>
): UseQueryResult<ArticleResponse, Error> => {
  return useQuery({
    queryKey: ARTICLE_KEYS.articlesByOrg(organizationId, params),
    queryFn: () => fetchArticlesByOrganization(organizationId, params),
    enabled: !!organizationId,
    onError: (error: Error) => {
      console.error('Error fetching articles by organization:', error);
      throw error;
    },
  });
};

export const useArticleBySlug = (slug: string): UseQueryResult<ArticleResponse, Error> => {
  return useQuery({
    queryKey: ARTICLE_KEYS.articleBySlug(slug),
    queryFn: () => fetchArticleBySlug(slug),
    enabled: !!slug,
    onError: (error: Error) => {
      console.error('Error fetching article by slug:', error);
      throw error;
    },
  });
};

export const useArticle = (id: number): UseQueryResult<ArticleResponse, Error> => {
  return useQuery({
    queryKey: ARTICLE_KEYS.article(id),
    queryFn: () => fetchArticleById(id),
    enabled: !!id,
    onError: (error: Error) => {
      console.error('Error fetching article:', error);
      throw error;
    },
  });
};

export const useCreateArticle = (): UseMutationResult<ArticleResponse, Error, { organizationId: number; userId: number; articleData: CreateArticle }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ organizationId, userId, articleData }) => createArticle(organizationId, userId, articleData),
    onSuccess: () => {
      queryClient.invalidateQueries(ARTICLE_KEYS.articles());
    },
    onError: (error: Error) => {
      console.error('Error creating article:', error);
      throw error;
    },
  });
};

export const useUpdateArticle = (): UseMutationResult<ArticleResponse, Error, UpdateArticle & { id: number }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateArticle,
    onSuccess: (data) => {
      queryClient.invalidateQueries(ARTICLE_KEYS.articles());
      if (data.id) {
        queryClient.invalidateQueries(ARTICLE_KEYS.article(data.id));
      }
    },
    onError: (error: Error) => {
      console.error('Error updating article:', error);
      throw error;
    },
  });
};

export const useDeleteArticle = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      queryClient.invalidateQueries(ARTICLE_KEYS.articles());
    },
    onError: (error: Error) => {
      console.error('Error deleting article:', error);
      throw error;
    },
  });
};

// Comments Hooks
export const useComments = (blogId: number, params?: Record<string, any>): UseQueryResult<CommentResponse, Error> => {
  return useQuery({
    queryKey: ARTICLE_KEYS.comments(blogId),
    queryFn: () => fetchComments(blogId, params),
    enabled: !!blogId,
    onError: (error: Error) => {
      console.error('Error fetching comments:', error);
      throw error;
    },
  });
};

export const useCreateComment = (): UseMutationResult<Comment, Error, { blogId: number; userId: number; commentData: CreateComment }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ blogId, userId, commentData }) => createComment(blogId, userId, commentData),
    onSuccess: (_, { blogId }) => {
      queryClient.invalidateQueries(ARTICLE_KEYS.comments(blogId));
    },
    onError: (error: Error) => {
      console.error('Error creating comment:', error);
      throw error;
    },
  });
};

export const useUpdateComment = (): UseMutationResult<Comment, Error, UpdateComment & { id: number }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateComment,
    onSuccess: (data) => {
      // We need to invalidate all comments since we don't know which article this comment belongs to
      queryClient.invalidateQueries(ARTICLE_KEYS.all);
    },
    onError: (error: Error) => {
      console.error('Error updating comment:', error);
      throw error;
    },
  });
};

export const useDeleteComment = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      // We need to invalidate all comments since we don't know which article this comment belongs to
      queryClient.invalidateQueries(ARTICLE_KEYS.all);
    },
    onError: (error: Error) => {
      console.error('Error deleting comment:', error);
      throw error;
    },
  });
};

// Like and View Mutations
export const useAddLike = (): UseMutationResult<ArticleResponse, Error, { blogId: number; userId: number }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ blogId, userId }) => addLike(blogId, userId),
    onSuccess: (data) => {
      if (data.id) {
        queryClient.invalidateQueries(ARTICLE_KEYS.article(data.id));
      }
      queryClient.invalidateQueries(ARTICLE_KEYS.articles());
    },
    onError: (error: Error) => {
      console.error('Error adding like:', error);
      throw error;
    },
  });
};

export const useDeleteLike = (): UseMutationResult<ArticleResponse, Error, { blogId: number; userId: number }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ blogId, userId }) => deleteLike(blogId, userId),
    onSuccess: (data) => {
      if (data.id) {
        queryClient.invalidateQueries(ARTICLE_KEYS.article(data.id));
      }
      queryClient.invalidateQueries(ARTICLE_KEYS.articles());
    },
    onError: (error: Error) => {
      console.error('Error deleting like:', error);
      throw error;
    },
  });
};

export const useAddViews = (): UseMutationResult<ArticleResponse, Error, number> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: addViews,
    onSuccess: (data) => {
      if (data.id) {
        queryClient.invalidateQueries(ARTICLE_KEYS.article(data.id));
      }
      queryClient.invalidateQueries(ARTICLE_KEYS.articles());
    },
    onError: (error: Error) => {
      console.error('Error adding view:', error);
      throw error;
    },
  });
};

// Additional Utility Hooks

// Hook to search articles
export const useSearchArticles = (searchTerm?: string): UseQueryResult<ArticleResponse, Error> => {
  return useQuery({
    queryKey: [...ARTICLE_KEYS.articles(), 'search', searchTerm],
    queryFn: () => fetchArticlesByOrganization(Number(ORGANIZATION_ID), searchTerm ? { search: searchTerm } : {}),
    enabled: !!searchTerm && searchTerm.length > 2,
    onError: (error: Error) => {
      console.error('Error searching articles:', error);
      throw error;
    },
  });
};

// Hook to get articles summary statistics
export const useArticlesStatistics = (): UseQueryResult<{
  totalArticles: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  articlesThisMonth: number;
}, Error> => {
  return useQuery({
    queryKey: [...ARTICLE_KEYS.articles(), 'statistics'],
    queryFn: async () => {
      const articlesResponse = await fetchArticlesByOrganization(Number(ORGANIZATION_ID));
      const articles = articlesResponse.results;
      
      const totalArticles = articlesResponse.count;
      const totalViews = articles.reduce((sum, article) => sum + (article.views || 0), 0);
      const totalLikes = articles.reduce((sum, article) => sum + (article.likes?.length || 0), 0);
      
      // Get current month's articles
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      
      const articlesThisMonth = articles.filter(article => {
        if (!article.date) return false;
        const articleDate = new Date(article.date);
        return articleDate.getMonth() === currentMonth && articleDate.getFullYear() === currentYear;
      }).length;
      
      // Calculate total comments (would need to iterate through each article's comments)
      // For now, we'll set it to 0 as it requires additional API calls
      const totalComments = 0;
      
      return {
        totalArticles,
        totalViews,
        totalLikes,
        totalComments,
        articlesThisMonth,
      };
    },
    onError: (error: Error) => {
      console.error('Error fetching articles statistics:', error);
      throw error;
    },
  });
};
