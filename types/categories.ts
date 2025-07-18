import {
  categorySchema,
  categoryArraySchema,
  subcategorySchema,
} from "@/schemas/categories";
import { z } from "zod";

export type Category = z.infer<typeof categorySchema>;

export type Categories = Category[];

export type SubCategory = z.infer<typeof subcategorySchema>;

export type SubCategories = SubCategory[];
