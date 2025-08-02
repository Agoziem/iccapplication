
import { z } from "zod";

// Category
export const CreateServicesCategorySchema = z.object({
  category: z.string(),
  description: z.string().optional(),
});
export type CreateServicesCategoryType = z.infer<typeof CreateServicesCategorySchema>;

export const UpdateServicesCategorySchema = z.object({
    category: z.string().optional(),
    description: z.string().optional(),
});
export type UpdateServicesCategoryType = z.infer<typeof UpdateServicesCategorySchema>;

// SubCategory
export const CreateServicesSubCategorySchema = z.object({
  subcategory: z.string(),
  category: z.number(), // id of category
});
export type CreateServicesSubCategoryType = z.infer<typeof CreateServicesSubCategorySchema>;

export const UpdateServicesSubCategorySchema = z.object({
  subcategory: z.string().optional(),
  category: z.number().optional(),
});
export type UpdateServicesSubCategoryType = z.infer<typeof UpdateServicesSubCategorySchema>;

// Create Service
export const CreateServiceSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  service_flow: z.string().optional(),
  price: z.number(), // DecimalField -> number
  details_form_link: z.string().url().optional(),
  category: z.number().optional(),
  subcategory: z.number().optional(),
  organization: z.number(),
});
export type CreateServiceType = z.infer<typeof CreateServiceSchema>;

// Update Service
export const UpdateServiceSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  service_flow: z.string().optional(),
  price: z.number().optional(),
  details_form_link: z.string().url().optional(),
  category: z.number().optional(),
  subcategory: z.number().optional(),
  organization: z.number().optional(),
});
export type UpdateServiceType = z.infer<typeof UpdateServiceSchema>;
