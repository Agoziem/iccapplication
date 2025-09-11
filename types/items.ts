import { z } from "zod";
import {
  ServiceCategorySchema,
  ServiceSubCategorySchema,
  ProductCategorySchema,
  ProductSubCategorySchema,
  VideoCategorySchema,
  VideoSubCategorySchema,
  ServiceSchema,
  CreateServiceCategorySchema,
  CreateServiceSubCategorySchema,
  ProductSchema,
  CreateProductCategorySchema,
  CreateProductSubCategorySchema,
  VideoSchema,
  CreateVideoCategorySchema,
  CreateVideoSubCategorySchema,
  PaginatedServiceResponseSchema,
  PaginatedProductResponseSchema,
  PaginatedVideoResponseSchema,
  ServicesSchema,
  ProductsSchema,
  VideosSchema,
  ServiceCategoriesSchema,
  ProductCategoriesSchema,
  VideoCategoriesSchema
} from "../schemas/items";

// Category types
export type ServiceCategory = z.infer<typeof ServiceCategorySchema>;
export type ServiceSubCategory = z.infer<typeof ServiceSubCategorySchema>;
export type ProductCategory = z.infer<typeof ProductCategorySchema>;
export type ProductSubCategory = z.infer<typeof ProductSubCategorySchema>;
export type VideoCategory = z.infer<typeof VideoCategorySchema>;
export type VideoSubCategory = z.infer<typeof VideoSubCategorySchema>;

// Create category types
export type CreateServiceCategory = z.infer<typeof CreateServiceCategorySchema>;
export type CreateServiceSubCategory = z.infer<typeof CreateServiceSubCategorySchema>;
export type CreateProductCategory = z.infer<typeof CreateProductCategorySchema>;
export type CreateProductSubCategory = z.infer<typeof CreateProductSubCategorySchema>;
export type CreateVideoCategory = z.infer<typeof CreateVideoCategorySchema>;
export type CreateVideoSubCategory = z.infer<typeof CreateVideoSubCategorySchema>;

// Item types
export type Service = z.infer<typeof ServiceSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type Video = z.infer<typeof VideoSchema>;

// Paginated response types
export type PaginatedServiceResponse = z.infer<typeof PaginatedServiceResponseSchema>;
export type PaginatedProductResponse = z.infer<typeof PaginatedProductResponseSchema>;
export type PaginatedVideoResponse = z.infer<typeof PaginatedVideoResponseSchema>;

// Array types
export type Services = z.infer<typeof ServicesSchema>;
export type Products = z.infer<typeof ProductsSchema>;
export type Videos = z.infer<typeof VideosSchema>;
export type ServiceCategories = z.infer<typeof ServiceCategoriesSchema>;
export type ProductCategories = z.infer<typeof ProductCategoriesSchema>;
export type VideoCategories = z.infer<typeof VideoCategoriesSchema>;

// Additional utility types
export type ServicePreview = Pick<Service, 'id' | 'name' | 'description' | 'price' | 'img_url' | 'category'>;
export type ProductPreview = Pick<Product, 'id' | 'name' | 'description' | 'price' | 'img_url' | 'category' | 'rating'>;
export type VideoPreview = Pick<Video, 'id' | 'title' | 'description' | 'price' | 'img_url' | 'category' | 'free'>;

export type ServiceSummary = Pick<Service, 'id' | 'name' | 'price'>;
export type ProductSummary = Pick<Product, 'id' | 'name' | 'price'>;
export type VideoSummary = Pick<Video, 'id' | 'title' | 'price'>;

export type CategorySummary = Pick<ServiceCategory | ProductCategory | VideoCategory, 'id' | 'category'>;