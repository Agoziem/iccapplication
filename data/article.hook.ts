import { ORGANIZATION_ID } from "@/constants";
import { AxiosinstanceAuth, AxiosinstanceFormDataAuth } from "./instance";
import { Blog, BlogCategory, Comment, PaginatedBlogResponse } from "@/types/articles";
import { CreateBlogCategoryType, CreateBlogType, CreateCommentType, UpdateBlogCategoryType, UpdateBlogType, UpdateCommentType } from "@/schemas/articles";
import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from "react-query";

const Organizationid = ORGANIZATION_ID;

/**
 * Fetch article categories
 */
export const useGetArticlesCategories = (): UseQueryResult<BlogCategory[] | undefined> => {
  return useQuery("articlesCategories", async () => {
    const response = await AxiosinstanceAuth.get("/blog-categories/");
    return response.data;
  });
};

// create Article category
export const useCreateArticleCategory = (): UseMutationResult<BlogCategory | undefined, Error, CreateBlogCategoryType> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: CreateBlogCategoryType) => {
      const response = await AxiosinstanceAuth.post("/blog-categories/", data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("articlesCategories");
      },
    }
  );
};

// update Article category
export const useUpdateArticleCategory = (): UseMutationResult<BlogCategory | undefined, Error, { id: number; data: UpdateBlogCategoryType }> => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ id, data }: { id: number; data: UpdateBlogCategoryType }) => {
      const response = await AxiosinstanceAuth.put(`/blog-categories/${id}/`, data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("articlesCategories");
      },
    }
  );
};

// delete Article category
export const useDeleteArticleCategory = (): UseMutationResult<number, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (id: number) => {
      await AxiosinstanceAuth.delete(`/blog-categories/${id}/`);
      return id;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("articlesCategories");
      },
    }
  );
};

/**
 * Fetch articles with pagination
 */
export const useFetchArticles = (): UseQueryResult<PaginatedBlogResponse | undefined> => {
  return useQuery("articles", async () => {
    const response = await AxiosinstanceAuth.get("/blogs/");
    return response.data;
  });
};

/**
 * Fetch single article by slug
 */
export const useFetchArticleBySlug = (slug: string): UseQueryResult<Blog | undefined> => {
  return useQuery(["article", slug], async () => {
    const response = await AxiosinstanceAuth.get(`/blogs/slug/${slug}`);
    return response.data;
  });
};

/**
 * Create new article
 */
export const useCreateArticle = (): UseMutationResult<Blog | undefined, Error, { Blog: CreateBlogType; img?: File | null }> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: { Blog: CreateBlogType; img?: File | null }) => {
      const response = await AxiosinstanceFormDataAuth.post(`/blogs/organization/${Organizationid}/create-blog`, {
        Blog: data.Blog,
        img: data.img,
      });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("articles");
      },
    }
  );
};

/**
 * Update exi sting article
 */
export const useUpdateArticle = (): UseMutationResult<Blog | undefined, Error, { blogid: number; Blog: UpdateBlogType; img?: File | null }> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: { blogid: number; Blog: UpdateBlogType; img?: File | null }) => {
      const response = await AxiosinstanceFormDataAuth.put(`/blogs/${data.blogid}/`, {
        Blog: data.Blog,
        img: data.img,
      });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("articles");
      },
    }
  );
};

/**
 * Delete article
 */
export const useDeleteArticle = (): UseMutationResult<number, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (blogid: number) => {
      await AxiosinstanceAuth.delete(`/blogs/${blogid}`);
      return blogid;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("articles");
      },
    }
  );
}

// ------------------------------------------------------
// Comment fetcher and mutation functions
// ------------------------------------------------------

export const useFetchComments = (blog_id: number): UseQueryResult<Comment | undefined> => {
  return useQuery(["comments", blog_id], async () => {
    const response = await AxiosinstanceAuth.get(`/comments/blog/${blog_id}/`);
    return response.data;
  });
};

/**
 * Create new comment
 */
export const useCreateComment = (): UseMutationResult<Comment | undefined, Error, { comment: CreateCommentType; blog_id: number }> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: { comment: CreateCommentType; blog_id: number }) => {
      const response = await AxiosinstanceAuth.post(`/comments/blog/${data.blog_id}/`, data);
      return response.data;
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["comments", data.blog_id]);
      },
    }
  );
};

/**
 * Update existing comment
 */
export const useUpdateComment = (): UseMutationResult<Comment | undefined, Error, { comment_id: number; comment: UpdateCommentType }> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: { comment_id: number; comment: UpdateCommentType }) => {
      const response = await AxiosinstanceAuth.put(`/comments/${data.comment_id}`, data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("comments");
      },
    }
  );
};

/**
 * Delete comment
 */
export const useDeleteComment = (): UseMutationResult<number, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (commentid: number) => {
      await AxiosinstanceAuth.delete(`/comments/${commentid}`);
      return commentid;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("comments");
      },
    }
  );
};


/**
 * Increment article view count
 */
export const incrementView = async (article_id: number) => {
  try {
    await AxiosinstanceAuth.get(
      `/blogs/${article_id}/view`
    );
  } catch (error) {
    console.error("Failed to add view:", error);
    throw error;
  }
};

// ------------------------------------------------------
// Article Likes fetcher and mutation functions
// ------------------------------------------------------
export const addLike = async (blogid: number): Promise<void> => {
  try {
    await AxiosinstanceAuth.get(
      `/likes/blog/${blogid}`
    );
  } catch (error) {
    console.error("Failed to add like:", error);
    throw Error("Failed to add like");
  }
};

export const deleteLike = async (blogid: number): Promise<void> => {
  try {
    await AxiosinstanceAuth.delete(
      `/likes/blog/${blogid}`
    );
  } catch (error) {
    console.error("Failed to remove like:", error);
    throw Error("Failed to remove like");
  }
};
