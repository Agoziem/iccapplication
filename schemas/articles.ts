import { z } from "zod";
import { UserminiSchema } from "./users";


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

// File upload constraints
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/jpg"];


export const ArticleSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, { message: "Title is required" }).max(100),
  subtitle: z.string().max(100).optional(),
  body: z.string().optional(),
  slug: z.string().max(100).optional(),
  category: categorySchema,
  tags: z.array(tagSchema).default([]),
  author: UserminiSchema,
  organization: z.number().optional(),
  img: z
    .union([
      z
        .instanceof(File)
        .refine((file) => ALLOWED_FILE_TYPES.includes(file.type), {
          message: "Only .jpg, .jpeg, and .png files are allowed",
        })
        .refine((file) => file.size <= MAX_FILE_SIZE, {
          message: "File size must not exceed 5 MB",
        }),
      z.string(),
    ])
    .optional(),
  img_url: z.string().optional(),
  img_name: z.string().optional(),
  readTime: z.number().default(0),
  views: z.number().default(0),
  date: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  likes: z.array(z.number()).default([]),
});


export const ArticleResponseSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(ArticleSchema),
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
