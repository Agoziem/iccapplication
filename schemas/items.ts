import { z } from "zod";
import { categorySchema, subcategorySchema } from "./categories";

// ------------------------------------
// File Validations
// ------------------------------------
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"] as const;
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/mpeg"] as const;
const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "image/jpeg",
  "image/png",
] as const;

const fileValidation = (allowedTypes: readonly string[], maxSize: number) =>
  z
    .instanceof(File)
    .refine((file) => allowedTypes.includes(file.type), {
      message: `Only files of types: ${allowedTypes.join(", ")} are allowed.`,
    })
    .refine((file) => file.size <= maxSize, {
      message: `File size must not exceed ${maxSize / (1024 * 1024)} MB.`,
    });

// ------------------------------------
// Service Schema
// ------------------------------------
export const serviceSchema = z.object({
  id: z.number().optional(),
  organization: z
    .object({
      id: z.number().optional().nullable(),
      name: z.string().max(100),
    })
    .optional()
    .nullable(),
  preview: z
    .union([fileValidation(ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE), z.string()])
    .optional()
    .nullable(),
  img_url: z.string().url().optional().nullable(),
  img_name: z.string().optional().nullable(),
  name: z.string().max(100),
  description: z.string().optional().nullable(),
  service_token: z.string().optional().nullable(),
  service_flow: z.string().optional().nullable(),
  price: z.string().refine((val) => !isNaN(parseFloat(val)), {
    message: "Price must be a valid number",
  }),
  number_of_times_bought: z.number().optional().nullable(),
  category: categorySchema.nullable(),
  subcategory: subcategorySchema.nullable(),
  userIDs_that_bought_this_service: z.array(z.number()).optional(),
  userIDs_whose_services_is_in_progress: z.array(z.number()).optional(),
  userIDs_whose_services_have_been_completed: z.array(z.number()).optional(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  details_form_link: z.string().optional().nullable(),
});

export const servicesResponseSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(serviceSchema),
});

// ------------------------------------
// Product Schema
// ------------------------------------
export const productSchema = z.object({
  id: z.number().optional(),
  organization: z
    .object({
      id: z.number().optional().nullable(),
      name: z.string().max(100),
    })
    .optional()
    .nullable(),
  preview: z
    .union([fileValidation(ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE), z.string()])
    .optional()
    .nullable(),
  img_url: z.string().url().optional().nullable(),
  img_name: z.string().optional().nullable(),
  name: z.string().max(200).nullable(),
  description: z.string().default("No description available"),
  price: z.string().refine((val) => !isNaN(parseFloat(val)), {
    message: "Price must be a valid number",
  }),
  rating: z.number().min(0).max(5).default(0),
  product: z
    .union([fileValidation(ALLOWED_DOCUMENT_TYPES, MAX_FILE_SIZE), z.string()])
    .optional()
    .nullable(),
  product_url: z.string().url().optional().nullable(),
  product_name: z.string().optional().nullable(),
  product_token: z.string().max(200).optional(),
  userIDs_that_bought_this_product: z.array(z.number()).optional(),
  subcategory: subcategorySchema.nullable(),
  number_of_times_bought: z.number().optional().nullable(),
  digital: z.boolean().default(true),
  category: categorySchema.optional().nullable(),
  created_at: z.coerce.date().optional(),
  last_updated_date: z.coerce.date().optional(),
  free: z.boolean().default(false),
});

export const productsResponseSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(productSchema),
});

// ----------------------------------------------
// Video Schema
// ----------------------------------------------
export const videoSchema = z.object({
  id: z.number().optional(),
  title: z.string().max(100),
  description: z.string(),
  price: z.string().refine((val) => !isNaN(parseFloat(val)), {
    message: "Price must be a valid number",
  }),
  video: z
    .union([fileValidation(ALLOWED_VIDEO_TYPES, MAX_FILE_SIZE), z.string()])
    .optional()
    .nullable(),
  video_url: z.string().url().optional().nullable(),
  video_name: z.string().optional().nullable(),
  thumbnail: z
    .union([fileValidation(ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE), z.string()])
    .optional()
    .nullable(),
  img_url: z.string().url().optional().nullable(),
  img_name: z.string().optional().nullable(),
  organization: z
    .object({
      id: z.number().optional().nullable(),
      name: z.string().max(100),
    })
    .optional()
    .nullable(),
  category: categorySchema,
  subcategory: subcategorySchema,
  video_token: z.string().optional(),
  userIDs_that_bought_this_video: z.array(z.number()).optional(),
  number_of_times_bought: z.number().optional().nullable(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  free: z.boolean().optional(),
});

export const videosResponseSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(videoSchema),
});

// Define the schema
export const UserPurchaseSchema = z.object({
  id: z.number().int().nonnegative(),
  username: z.string().min(1, "Username is required"),
  email: z.string().email().optional().nullable(),
  avatar_url: z.string().url().optional().nullable(),
  user_count: z.number().int().min(1, "Purchase count must be at least 1"),
  date_joined: z.coerce.date(),
});

export const UserPurchasedResponseSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(UserPurchaseSchema),
});
