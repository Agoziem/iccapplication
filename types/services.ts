import { OrganizationMiniSchema } from "./organizations";

export type ServiceCategory = {
  id: number;
  category: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
};

export type ServiceSubCategory = {
  id: number;
  subcategory: string;
  category?: ServiceCategory | null;
  created_at: string;
  updated_at: string;
};

// Service models
export type Service = {
  id: number;
  name: string;
  description?: string | null;
  service_token?: string | null;
  service_flow?: string | null;
  preview?: string | null; // URL to image
  price: number;
  number_of_times_bought?: number | null;
  category?: ServiceCategory | null;
  subcategory?: ServiceSubCategory | null;
  organization?: OrganizationMiniSchema | null;
  userIDs_that_bought_this_service: number[];
  userIDs_whose_services_is_in_progress: number[];
  userIDs_whose_services_have_been_completed: number[];
  details_form_link?: string | null;
  created_at: string;
  updated_at: string;
};

export type ServiceMini = Pick<Service, 'id' | 'name' | 'description' | 'price' | 'preview'>;

// Service user details
export type ServiceUserDetails = {
  id: number;
  username: string;
  email: string;
  avatar_url?: string | null;
  user_count: number;
  date_joined: string;
};

// Response schemas
export type ServiceCategoryListResponse = {
  results: ServiceCategory[];
};

export type ServiceSubCategoryListResponse = {
  results: ServiceSubCategory[];
};

export type SuccessResponse = {
  message: string;
};

export type ErrorResponse = {
  error: string;
};

// Paginated types
export type PaginatedServiceResponse = {
  count: number;
  items: Service[];
};

export type PaginatedCategoryResponse = {
  count: number;
  items: ServiceCategory[];
};

export type PaginatedSubCategoryResponse = {
  count: number;
  items: ServiceSubCategory[];
};

export type PaginatedServiceUserResponse = {
  count: number;
  items: ServiceUserDetails[];
};
