import { z } from "zod";


// --- Create & Update Blog Schemas ---
export const CreateBlogSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  body: z.string().optional(),
  category: z.number().optional(),
  tags: z.array(z.string()),
  author: z.number(),
  organization: z.number().optional(),
  readTime: z.number().optional().default(0),
});

export type CreateBlogType = z.infer<typeof CreateBlogSchema>;

export const UpdateBlogSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  body: z.string().optional(),
  category: z.number().optional(),
  tags: z.array(z.string()),
  author: z.number().optional(),
  readTime: z.number().optional(),
});

export type UpdateBlogType = z.infer<typeof UpdateBlogSchema>;

// --- Create & Update Category Schemas ---
export const CreateBlogCategorySchema = z.object({
  category: z.string(),
  description: z.string().optional().default("None"),
});

export type CreateBlogCategoryType = z.infer<typeof CreateBlogCategorySchema>;

export const UpdateBlogCategorySchema = z.object({
  category: z.string().optional(),
  description: z.string().optional(),
});
export type UpdateBlogCategoryType = z.infer<typeof UpdateBlogCategorySchema>;

// --- Create & Update Comment Schemas ---
export const CreateCommentSchema = z.object({
  comment: z.string(),
});
export type CreateCommentType = z.infer<typeof CreateCommentSchema>;

export const UpdateCommentSchema = z.object({
  comment: z.string(),
});
export type UpdateCommentType = z.infer<typeof UpdateCommentSchema>;
