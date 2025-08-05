import { UserMini } from "./users";

export interface Tag {
  id: number;
  tag: string;
}

export interface BlogCategory {
  id: number;
  category: string;
  description?: string;
}

export interface Comment {
  id: number;
  comment: string;
  blog_id?: number | null;
  user: UserMini;
  created_at: string;
  updated_at: string;
}

export interface Blog {
  id: number;
  title: string;
  subtitle?: string;
  body: string;
  slug: string;
  category?: BlogCategory;
  tags: Tag[];
  author?: UserMini;
  organization: number | null;
  img?: string | null;
  readTime: number;
  views: number;
  date: string;
  updated_at: string;
  likes: number[];
  likes_count: number;
}


// --- Response Types ---
export interface BlogListResponse {
  blogs: Blog[];
}

export interface BlogCategoryListResponse {
  categories: BlogCategory[];
}

export interface CommentListResponse {
  comments: Comment[];
}

export interface TagListResponse {
  tags: Tag[];
}

export interface BlogStats {
  total_blogs: number;
  total_views: number;
  total_likes: number;
  total_comments: number;
}

export interface BlogResponse {
  id: number;
  title: string;
  subtitle?: string;
  slug?: string;
  author?: UserMini;
  category?: BlogCategory;
  img_url?: string | null;
  views: number[];
  likes_count: number;
  date: string;
  readTime: number;
}

export interface LikeResponse {
  liked: boolean;
  likes_count: number;
}

export interface PaginatedBlogResponse {
  count: number;
  items: Blog[];
}

export interface PaginatedBlogSummaryResponse {
  count: number;
  items: BlogResponse[];
}

export interface PaginatedCommentResponse {
  count: number;
  items: Comment[];
}
