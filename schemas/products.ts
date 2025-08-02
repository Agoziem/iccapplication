import { z } from "zod";

// Category
export const CreateProductCategorySchema = z.object({
  category: z.string(),
  description: z.string().optional(),
});
export type CreateProductCategoryType = z.infer<typeof CreateProductCategorySchema>;

export const UpdateProductCategorySchema = z.object({
    category: z.string().optional(),
    description: z.string().optional(),
});
export type UpdateProductCategoryType = z.infer<typeof UpdateProductCategorySchema>;

// SubCategory
export const CreateSubCategorySchema = z.object({
  subcategory: z.string(),
  category: z.number(), // id of category
});
export type CreateSubCategoryType = z.infer<typeof CreateSubCategorySchema>;

export const UpdateSubCategorySchema = z.object({
  subcategory: z.string().optional(),
  category: z.number().optional(),
});
export type UpdateSubCategoryType = z.infer<typeof UpdateSubCategorySchema>;

// Product
export const CreateProductSchema = z.object({
  name: z.string(),
  description: z.string().default("No description available"),
  price: z.number(),
  category: z.number(),
  subcategory: z.number().optional(),
  digital: z.boolean().optional().default(true),
  free: z.boolean().optional().default(false),
  rating: z.number().int().min(0).optional().default(0),
});

export type CreateProductType = z.infer<typeof CreateProductSchema>;

export const UpdateProductSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  category: z.number().optional(),
  subcategory: z.number().optional(),
  digital: z.boolean().optional(),
  free: z.boolean().optional(),
  rating: z.number().int().min(0).optional(),
});
export type UpdateProductType = z.infer<typeof UpdateProductSchema>;
