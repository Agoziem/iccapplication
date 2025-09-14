import { z } from "zod";
import {
  categorySchema,
  categoryArraySchema,
  createCategorySchema,
  updateCategorySchema,
  subcategorySchema,
  subcategoryArraySchema,
  createSubcategorySchema,
  updateSubcategorySchema,
  categoryWithSubcategoriesSchema,
  categoryFilterSchema
} from "../schemas/categories";

// Extract TypeScript types from Zod schemas
export type Category = z.infer<typeof categorySchema>;
export type CategoryArray = z.infer<typeof categoryArraySchema>;
export type CreateCategory = z.infer<typeof createCategorySchema>;
export type UpdateCategory = z.infer<typeof updateCategorySchema>;

export type Subcategory = z.infer<typeof subcategorySchema>;
export type SubcategoryArray = z.infer<typeof subcategoryArraySchema>;
export type CreateSubcategory = z.infer<typeof createSubcategorySchema>;
export type UpdateSubcategory = z.infer<typeof updateSubcategorySchema>;

export type CategoryWithSubcategories = z.infer<typeof categoryWithSubcategoriesSchema>;
export type CategoryFilter = z.infer<typeof categoryFilterSchema>;

// Additional utility types
export type CategorySummary = Pick<Category, 'id' | 'category'>;
export type ExtendedCategory = Category & {
  id: number;
  category: string;
  description: string;
};
export type SubcategorySummary = Pick<Subcategory, 'id' | 'subcategory'>;