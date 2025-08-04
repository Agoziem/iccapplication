import { UserMini } from "./articles";
import { OrganizationMiniSchema } from "./organizations";

// Models
export type ProductCategory = {
  id: number;
  category: string;
  description?: string;
  created_at: string;
  updated_at: string;
};

export type ProductSubCategory = {
  id: number;
  subcategory: string;
  category?: ProductCategory;
  created_at: string;
  updated_at: string;
};

// Mini Types
export type ProductMini = {
  id: number;
  name: string;
  price: number;
};


export type Product = {
  id: number;
  organization?: OrganizationMiniSchema | null;
  preview?: string | null; // URL to image
  name: string;
  description: string;
  price: number;
  rating: number;
  product?: string | null; // URL to downloadable file
  product_token: string;
  userIDs_that_bought_this_product: UserMini[]; // list of users
  subcategory?: ProductSubCategory | null;
  number_of_times_bought?: number | null;
  digital: boolean;
  category?: ProductCategory | null;
  created_at: string; // ISO date
  last_updated_date: string; // ISO date
  free: boolean;
};


// Response Types
export type CategoryListResponse = {
  categories: ProductCategory[];
};

export type SubCategoryListResponse = {
  subcategories: ProductSubCategory[];
};


export type SuccessResponse = {
  message: string;
};

export type ErrorResponse = {
  error: string;
};

export type ProductStats = {
  total_products: number;
  total_buyers: number;
  categories_count: number;
  most_popular_product?: Record<string, any>; // Or define structure if known
};

export type UserProductsResponse = {
  user_id: number;
  products: Product[];
  total_purchased: number;
};

export type TrendingProductsResponse = {
  trending_products: Product[];
  period: string; // "all_time", "month", etc.
};

export type PaginatedProductResponse = {
  count: number;
  items: Product[];
};

