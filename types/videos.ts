export type VideoMini = {
  id: number;
  title: string;
  price: number;
  free: boolean;
};

export type VideoUserDetails = {
  id: number;
  username: string;
  email: string;
  avatar_url?: string | null;
  user_count: number;
  date_joined: string; // ISO format from datetime
};

export type Category = {
  id: number;
  category: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
};

export type SubCategory = {
  id: number;
  subcategory: string;
  category: Category | number | null;
  created_at: string;
  updated_at: string;
};

export type OrganizationMini = {
  id: number;
  name: string;
  logo?: string | null;
};

export type Video = {
  id: number;
  title: string;
  description: string;
  price: number;
  free: boolean;
  video?: string | null;
  thumbnail?: string | null;
  category: Category | null;
  subcategory: SubCategory | null;
  organization: OrganizationMini | null;
  video_token: string;
  number_of_times_bought: number;
  userIDs_that_bought_this_video: number[]; // Or User[] if you expand
  created_at: string;
  updated_at: string;
};

export type PaginatedVideoResponse = {
  count: number;
  items: Video[];
};

export type PaginatedVideoUserResponse = {
  count: number;
  items: VideoUserDetails[];
};

export type CategoryListResponse = {
  results: Category[];
};

export type SubCategoryListResponse = {
  results: SubCategory[];
};

export type SuccessResponse = {
  message: string;
};

export type ErrorResponse = {
  error: string;
};
