import { z } from "zod";
import { documentSchema, imageSchema, videoSchema } from "./custom-validation";

// ------------------------------------
// Category Schemas (from API)
// ------------------------------------

/**
 * Service Category Schema (ServiceCategory from API)
 */
export const ServiceCategorySchema = z.object({
  id: z.number().optional(),
  category: z.string().max(100).optional(),
  description: z.string().optional(),
});

/**
 * Service SubCategory Schema (ServiceSubCategory from API)
 */
export const ServiceSubCategorySchema = z.object({
  id: z.number().optional(),
  category: ServiceCategorySchema,
  subcategory: z.string().min(1).max(100),
});

/**
 * Product Category Schema (ProductCategory from API)
 */
export const ProductCategorySchema = z.object({
  id: z.number(),
  category: z.string().max(100),
  description: z.string().optional(),
});

/**
 * Product SubCategory Schema (ProductSubCategory from API)
 */
export const ProductSubCategorySchema = z.object({
  id: z.number(),
  category: ProductCategorySchema,
  subcategory: z.string().min(1).max(100),
});

/**
 * Video Category Schema (VideoCategory from API)
 */
export const VideoCategorySchema = z.object({
  id: z.number().optional(),
  category: z.string().min(1).max(100),
  description: z.string().min(1),
});

/**
 * Video SubCategory Schema (VideoSubCategory from API)
 */
export const VideoSubCategorySchema = z.object({
  id: z.number().optional(),
  category: VideoCategorySchema,
  subcategory: z.string().min(1).max(100),
});

// ------------------------------------
// Service Schemas (from API)
// ------------------------------------

/**
 * Service Schema (ServiceSerializer from API)
 */
export const ServiceResponseSchema = z.object({
  id: z.number().optional(),
  organization: z.string().optional(),
  preview: z.string().url().optional(),
  img_url: z.string().optional(),
  img_name: z.string().optional(),
  category: ServiceCategorySchema.optional(),
  subcategory: ServiceSubCategorySchema.optional(),
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  service_token: z.string().max(100).optional(),
  service_flow: z.string().optional(),
  price: z.string(),
  number_of_times_bought: z.number().optional(),
  details_form_link: z.string().url().max(500).optional(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  userIDs_that_bought_this_service: z.array(z.number()).optional(),
  userIDs_whose_services_is_in_progress: z.array(z.number()).optional(),
  userIDs_whose_services_have_been_completed: z.array(z.number()).optional(),
});

/**
 * Create Service Category Schema (ServiceCreateCategory from API)
 */
export const CreateServiceCategorySchema = z.object({
  category: z.string().max(100).optional(),
});

/**
 * Create Service SubCategory Schema (ServiceCreateSubCategory from API)
 */
export const CreateServiceSubCategorySchema = z.object({
  subcategory: z.string().min(1).max(100),
  category: z.number(),
});

// ------------------------------------
// Product Schemas (from API)
// ------------------------------------

/**
 * Product Schema (ProductSerializer from API)
 */
export const ProductResponseSchema = z.object({
  id: z.number(),
  organization: z.string(),
  img_url: z.string().optional(),
  img_name: z.string().optional(),
  product_url: z.string().optional(),
  product_name: z.string(),
  category: ProductCategorySchema.optional(),
  subcategory: ProductSubCategorySchema.optional(),
  preview: z.string().url().optional(),
  name: z.string().min(1).max(200),
  description: z.string().min(1),
  price: z.string(),
  rating: z.number().optional(),
  product: z.string().url().optional(),
  product_token: z.string().max(200),
  number_of_times_bought: z.number().optional(),
  digital: z.boolean().optional(),
  created_at: z.coerce.date().optional(),
  last_updated_date: z.coerce.date().optional(),
  free: z.boolean().optional(),
  userIDs_that_bought_this_product: z.array(z.number()).optional(),
});

/**
 * Create Product Category Schema (ProductCreateCategory from API)
 */
export const CreateProductCategorySchema = z.object({
  category: z.string().max(100).optional(),
});

/**
 * Create Product SubCategory Schema (ProductCreateSubCategory from API)
 */
export const CreateProductSubCategorySchema = z.object({
  subcategory: z.string().min(1).max(100),
  category: z.number(),
});

// ------------------------------------
// Video Schemas (from API)
// ------------------------------------

/**
 * Video Schema (VideoSerializer from API)
 */
export const VideoResponseSchema = z.object({
  id: z.number(),
  organization: z.string(),
  thumbnail: z.string().url().optional(),
  video: z.string().url().optional(),
  video_url: z.string().optional(),
  video_name: z.string().optional(),
  img_url: z.string().optional(),
  img_name: z.string().optional(),
  category: VideoCategorySchema.optional(),
  subcategory: VideoSubCategorySchema.optional(),
  title: z.string().min(1).max(100),
  description: z.string().min(1),
  price: z.string().optional(),
  video_token: z.string().max(200),
  number_of_times_bought: z.number().optional(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  free: z.boolean().optional(),
  userIDs_that_bought_this_video: z.array(z.number()).optional(),
});

/**
 * Create Video Category Schema (VideoCreateCategory from API)
 */
export const CreateVideoCategorySchema = z.object({
  category: z.string().min(1).max(100),
});

/**
 * Create Video SubCategory Schema (VideoCreateSubCategory from API)
 */
export const CreateVideoSubCategorySchema = z.object({
  subcategory: z.string().min(1).max(100),
  category: z.number(),
});

// ------------------------------------
// Paginated Response Schemas (from API)
// ------------------------------------

/**
 * Paginated Service Response Schema (PaginatedServiceSerializer from API)
 */
export const PaginatedServiceResponseSchema = z.object({
  count: z.number(),
  next: z.string().url().nullable(),
  previous: z.string().url().nullable(),
  results: z.array(ServiceResponseSchema),
});

/**
 * Paginated Product Response Schema (PaginatedProductSerializer from API)
 */
export const PaginatedProductResponseSchema = z.object({
  count: z.number(),
  next: z.string().url().nullable(),
  previous: z.string().url().nullable(),
  results: z.array(ProductResponseSchema),
});

/**
 * Paginated Video Response Schema (PaginatedVideoSerializer from API)
 */
export const PaginatedVideoResponseSchema = z.object({
  count: z.number(),
  next: z.string().url().nullable(),
  previous: z.string().url().nullable(),
  results: z.array(VideoResponseSchema),
});

// ------------------------------------
// Array Schemas
// ------------------------------------

export const ServicesSchema = z.array(ServiceResponseSchema);
export const ProductsSchema = z.array(ProductResponseSchema);
export const VideosSchema = z.array(VideoResponseSchema);
export const ServiceCategoriesSchema = z.array(ServiceCategorySchema);
export const ProductCategoriesSchema = z.array(ProductCategorySchema);
export const VideoCategoriesSchema = z.array(VideoCategorySchema);

// ------------------------------------
// Simple Response Schemas
// ------------------------------------

/**
 * Success Response Schema for product operations
 */
export const SuccessResponseSchema = z.object({
  message: z.string().min(1),
});

/**
 * Error Response Schema for product operations
 */
export const ErrorResponseSchema = z.object({
  error: z.string().min(1),
});

/**
 * Delete Response Schema - returns the ID of deleted item
 */
export const DeleteResponseSchema = z.object({
  id: z.number(),
});

// ------------------------------------
// Create/Update Item Schemas
// ------------------------------------

/* ---------- Product ---------- */
export const createProductSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  preview: imageSchema,   // Image (file upload)
  product: documentSchema,   // File (upload)
  category: z.number(),
  subcategory: z.number(),
  organization: z.string().uuid(),          // assuming org is UUID in Django
});

export const updateProductSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  preview: imageSchema,
  product: documentSchema,
  category: z.number().optional(),
  subcategory: z.number().optional(),
});

/* ---------- Service ---------- */
export const createServiceSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  preview: imageSchema, // image
  category: z.number(),
  subcategory: z.number(),
  organization: z.string().uuid(),
});

export const updateServiceSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  preview: imageSchema,
  category: z.number().optional(),
  subcategory: z.number().optional(),
});

/* ---------- Video ---------- */
export const createVideoSchema = z.object({
  title: z.string(),
  description: z.string(),
  price: z.number(),
  thumbnail: imageSchema,
  video: videoSchema,
  category: z.number(),
  subcategory: z.number(),
  organization: z.string().uuid(),
});

export const updateVideoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  thumbnail: imageSchema,
  video: videoSchema,
  category: z.number().optional(),
  subcategory: z.number().optional(),
});