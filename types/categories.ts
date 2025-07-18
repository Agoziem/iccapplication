export interface Category {
  id?: number | null;
  category: string;
  description?: string | null;
}

export type Categories = Category[];

export interface SubCategory {
  id?: number;
  category: Category;
  subcategory: string;
}

export type SubCategories = SubCategory[];
