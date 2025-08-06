
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

// CreateFormFieldSchema
export const CreateFormFieldSchema = z.object({
  field_type: z.string(),
  label: z.string(),
  placeholder: z.string().optional(),
  help_text: z.string().optional(),
  is_required: z.boolean().default(false),
  order: z.number().default(0),
  options: z.array(z.string()).optional(),
  min_value: z.number().optional(),
  max_value: z.number().optional(),
  min_length: z.number().int().optional(),
  max_length: z.number().int().optional(),
});
export type CreateFormFieldType = z.infer<typeof CreateFormFieldSchema>;

// UpdateFormFieldSchema
export const UpdateFormFieldSchema = z.object({
  field_type: z.string().optional(),
  label: z.string().optional(),
  placeholder: z.string().optional(),
  help_text: z.string().optional(),
  is_required: z.boolean().optional(),
  order: z.number().optional(),
  options: z.array(z.string()).optional(),
  min_value: z.number().optional(),
  max_value: z.number().optional(),
  min_length: z.number().int().optional(),
  max_length: z.number().int().optional(),
});
export type UpdateFormFieldType = z.infer<typeof UpdateFormFieldSchema>;

// CreateServiceFormSchema
export const CreateServiceFormSchema = z.object({
  title: z.string().default("Service Application Form"),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});
export type CreateServiceFormType = z.infer<typeof CreateServiceFormSchema>;

// UpdateServiceFormSchema
export const UpdateServiceFormSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  is_active: z.boolean().optional(),
});
export type UpdateServiceFormType = z.infer<typeof UpdateServiceFormSchema>;

// CreateFormSubmissionSchema
export const CreateFormSubmissionSchema = z.object({
  submission_data: z.record(z.any()),
});
export type CreateFormSubmissionType = z.infer<typeof CreateFormSubmissionSchema>;

// UpdateFormSubmissionSchema
export const UpdateFormSubmissionSchema = z.object({
  submission_data: z.record(z.any()),
});
export type UpdateFormSubmissionType = z.infer<typeof UpdateFormSubmissionSchema>;
