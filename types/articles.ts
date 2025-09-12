import { z } from "zod";
import { 
  tagSchema, 
  tagArraySchema, 
  categorySchema, 
  categoryArraySchema, 
  ArticleResponseSchema, 
  PaginatedArticleResponseSchema,
  CreateArticleSchema,
  UpdateArticleSchema,
  commentSchema, 
  commentResponseSchema, 
  createCommentSchema, 
  updateCommentSchema, 
  createCategorySchema,
  updateCategorySchema
} from "../schemas/articles";

// Extract TypeScript types from Zod schemas
export type Tag = z.infer<typeof tagSchema>;
export type TagArray = z.infer<typeof tagArraySchema>;
export type Category = z.infer<typeof categorySchema>;
export type CategoryArray = z.infer<typeof categoryArraySchema>;
export type ArticleResponse = z.infer<typeof ArticleResponseSchema>;
export type PaginatedArticleResponse = z.infer<typeof PaginatedArticleResponseSchema>;
export type CreateArticle = z.infer<typeof CreateArticleSchema>;
export type UpdateArticle = z.infer<typeof UpdateArticleSchema>;
export type Comment = z.infer<typeof commentSchema>;
export type CommentResponse = z.infer<typeof commentResponseSchema>;
export type CreateComment = z.infer<typeof createCommentSchema>;
export type UpdateComment = z.infer<typeof updateCommentSchema>;
export type CreateCategory = z.infer<typeof createCategorySchema>;
export type UpdateCategory = z.infer<typeof updateCategorySchema>;


// Additional utility types
export type ArticleWithComments = ArticleResponse & {
  comments?: Comment[];
};

export type ArticlePreview = Pick<ArticleResponse, 'id' | 'title' | 'subtitle' | 'img_url' | 'slug' | 'category' | 'author' | 'date' | 'readTime' | 'views'>;

export type ArticleFormData = Omit<ArticleResponse, 'id' | 'date' | 'updated_at' | 'views' | 'likes'>;