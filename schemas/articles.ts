import { z } from "zod";
import { UserminiSchema } from "./users";
import { imageSchema } from "./custom-validation";


export const tagSchema = z.object({
  id: z.number().optional(),
  tag: z.string().max(100),
});


export const tagArraySchema = z.array(tagSchema);


export const categorySchema = z.object({
  id: z.number().optional(),
  category: z.string().max(100),
  description: z.string().min(1).optional(),
});


export const categoryArraySchema = z.array(categorySchema);


export const ArticleResponseSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, { message: "Title is required" }).max(100),
  subtitle: z.string().max(100).optional(),
  body: z.string().optional(),
  slug: z.string().max(100).optional(),
  category: categorySchema,
  tags: z.array(tagSchema).default([]),
  author: UserminiSchema,
  organization: z.number().optional(),
  img: imageSchema,
  img_url: z.string().optional(),
  img_name: z.string().optional(),
  readTime: z.number().default(0),
  views: z.number().default(0),
  date: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  likes: z.array(z.number()).default([]),
});

// ✅ Create Blog Schema
export const CreateArticleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(), // subtitle can be optional if allowed
  body: z.string().min(1, "Body is required"),
  category: z.number().int(),
  tags: z.array(z.string()).optional(),
  author: z.number().int(),
  organization: z.number().int(),
  img: imageSchema,
  readTime: z.number().int().positive().optional(), // assuming it's minutes
});

// ✅ Update Article Schema
export const UpdateArticleSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  body: z.string().optional(),
  category: z.number().int().optional(),
  tags: z.array(z.string()).optional(),
  author: z.number().int().optional(),
  img: imageSchema,
  readTime: z.number().int().positive().optional(),
});



export const PaginatedArticleResponseSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(ArticleResponseSchema),
});


export const commentSchema = z.object({
  id: z.number().optional(),
  user: UserminiSchema,
  comment: z.string().min(1, { message: "Comment cannot be empty" }),
  date: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  blog: z.number(),
});


export const commentResponseSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(commentSchema),
});


export const createCommentSchema = z.object({
  comment: z.string().min(1, { message: "Comment cannot be empty" }),
});


export const updateCommentSchema = z.object({
  comment: z.string().min(1, { message: "Comment cannot be empty" }),
});


export const createCategorySchema = z.object({
  category: z.string().max(100),
});

export const updateCategorySchema = z.object({
  category: z.string().max(100),
  description: z.string().min(1).optional(),
});
