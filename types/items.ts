import { Category, SubCategory } from "./categories";

export interface Organization {
  id?: number | null;
  name: string;
}

export interface Service {
  id?: number;
  organization?: Organization | null;
  preview?: File | string | null;
  img_url?: string | null;
  img_name?: string | null;
  name: string;
  description?: string | null;
  service_token?: string | null;
  service_flow?: string | null;
  price: string;
  number_of_times_bought?: number | null;
  category: Category | null;
  subcategory: SubCategory | null;
  userIDs_that_bought_this_service?: number[];
  userIDs_whose_services_is_in_progress?: number[];
  userIDs_whose_services_have_been_completed?: number[];
  created_at?: Date;
  updated_at?: Date;
  details_form_link?: string | null;
}

export type Services = Service[];

export interface Product {
  id?: number;
  organization?: Organization | null;
  preview?: File | string | null;
  img_url?: string | null;
  img_name?: string | null;
  name: string | null;
  description: string;
  price: string;
  rating: number;
  product?: File | string | null;
  product_url?: string | null;
  product_name?: string | null;
  product_token?: string;
  userIDs_that_bought_this_product?: number[];
  subcategory: SubCategory | null;
  number_of_times_bought?: number | null;
  digital: boolean;
  category?: Category | null;
  created_at?: Date;
  last_updated_date?: Date;
  free: boolean;
}

export type Products = Product[];

export interface Video {
  id?: number;
  title: string;
  description: string;
  price: string;
  video?: File | string | null;
  video_url?: string | null;
  video_name?: string | null;
  thumbnail?: File | string | null;
  img_url?: string | null;
  img_name?: string | null;
  organization?: Organization | null;
  category: Category;
  subcategory: SubCategory;
  video_token?: string;
  userIDs_that_bought_this_video?: number[];
  number_of_times_bought?: number | null;
  created_at?: Date;
  updated_at?: Date;
  free?: boolean;
}

export type Videos = Video[];

export interface ServiceUser {
  id: number;
  username: string;
  email?: string | null;
  avatar_url?: string | null;
  user_count: number;
  date_joined: Date;
}

export interface PaginatedServiceUser {
  count: number;
  next: string | null;
  previous: string | null;
  results: ServiceUser[];
}
