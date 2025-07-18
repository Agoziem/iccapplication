export interface Tag {
  id?: number | null;
  tag?: string | null;
}

export type Tags = Tag[];

export interface ArticleCategory {
  id?: number | null;
  category: string;
  description?: string | null;
}

export type ArticleCategories = ArticleCategory[];

export interface UserMini {
  id?: number;
  username: string;
  img?: string | null;
}

export interface Article {
  id?: number | null;
  organization?: number | null;
  author: UserMini;
  img?: File | string | null;
  img_url?: string | null;
  img_name?: string | null;
  title: string;
  subtitle: string;
  body: string;
  tags?: Tag[];
  slug?: string | null;
  category?: ArticleCategory | null;
  readTime: number;
  views: number;
  likes?: number[];
  date: Date;
  updated_at: Date;
}

export interface ArticlesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Article[];
}

export type Articles = Article[];

export interface ArticleComment {
  id?: number;
  user: UserMini;
  blog: number;
  comment: string;
  date: Date;
  updated_at?: Date;
}

export type ArticleComments = ArticleComment[];

