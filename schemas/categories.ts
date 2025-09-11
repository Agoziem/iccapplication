import { z } from "zod";

export const categorySchema = z.object({
  id: z.number().optional(),
  category: z.string().min(1, { message: "Category name is required" }).max(100, { message: "Category name must be at most 100 characters" }),
  description: z.string().optional(),
});


export const categoryArraySchema = z.array(categorySchema);

export const createCategorySchema = z.object({
  category: z.string().min(1, { message: "Category name is required" }).max(100, { message: "Category name must be at most 100 characters" }),
  description: z.string().optional(),
});


export const updateCategorySchema = z.object({
  category: z.string().min(1, { message: "Category name is required" }).max(100, { message: "Category name must be at most 100 characters" }).optional(),
  description: z.string().optional(),
});


export const subcategorySchema = z.object({
  id: z.number().optional(),
  category: categorySchema,
  subcategory: z.string().min(1, { message: "Subcategory name is required" }).max(100, { message: "Subcategory name must be at most 100 characters" }),
});


export const subcategoryArraySchema = z.array(subcategorySchema);


export const createSubcategorySchema = z.object({
  category: z.number().positive({ message: "Valid category ID is required" }),
  subcategory: z.string().min(1, { message: "Subcategory name is required" }).max(100, { message: "Subcategory name must be at most 100 characters" }),
});


export const updateSubcategorySchema = z.object({
  category: z.number().positive({ message: "Valid category ID is required" }).optional(),
  subcategory: z.string().min(1, { message: "Subcategory name is required" }).max(100, { message: "Subcategory name must be at most 100 characters" }).optional(),
});


export const categoryWithSubcategoriesSchema = z.object({
  id: z.number().optional(),
  category: z.string().min(1).max(100),
  description: z.string().optional(),
  subcategories: z.array(subcategorySchema).default([]),
});


export const categoryFilterSchema = z.object({
  search: z.string().optional(),
  ordering: z.string().optional(),
});