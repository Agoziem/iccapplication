import { z } from "zod";
import { 
  tagSchema, 
  tagArraySchema, 
  categorySchema, 
  categoryArraySchema, 
  ArticleSchema, 
  ArticleResponseSchema, 
  commentSchema, 
  commentResponseSchema, 
  createCommentSchema, 
  updateCommentSchema, 
  createCategorySchema 
} from "../schemas/articles";

// Extract TypeScript types from Zod schemas
export type Tag = z.infer<typeof tagSchema>;
export type TagArray = z.infer<typeof tagArraySchema>;
export type Category = z.infer<typeof categorySchema>;
export type CategoryArray = z.infer<typeof categoryArraySchema>;
export type Article = z.infer<typeof ArticleSchema>;
export type ArticleResponse = z.infer<typeof ArticleResponseSchema>;
export type Comment = z.infer<typeof commentSchema>;
export type CommentResponse = z.infer<typeof commentResponseSchema>;
export type CreateComment = z.infer<typeof createCommentSchema>;
export type UpdateComment = z.infer<typeof updateCommentSchema>;
export type CreateCategory = z.infer<typeof createCategorySchema>;

// Additional utility types
export type ArticleWithComments = Article & {
  comments?: Comment[];
};

export type ArticlePreview = Pick<Article, 'id' | 'title' | 'subtitle' | 'img_url' | 'slug' | 'category' | 'author' | 'date' | 'readTime' | 'views'>;

export type ArticleFormData = Omit<Article, 'id' | 'date' | 'updated_at' | 'views' | 'likes'>;