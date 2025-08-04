import {
  ServiceCategory,
  ServiceSubCategory,
} from "@/types/services";
import { ProductCategory, ProductSubCategory } from "@/types/products";
import { AxiosinstanceAuth } from "./instance";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "react-query";

// =========================================
// Types
// =========================================
export type ItemType = "services" | "products" | "videos";
export type CategoryLevel = "category" | "subcategory";

export type BaseCategory = {
  id: number;
  category: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
};

export type BaseSubCategory = BaseCategory & {
  subcategory: string;
  category?: BaseCategory | null;
};

type CategoryMap = {
  services: {
    category: ServiceCategory;
    subcategory: ServiceSubCategory;
  };
  products: {
    category: ProductCategory;
    subcategory: ProductSubCategory;
  };
  videos: {
    category: ProductCategory;
    subcategory: ProductSubCategory;
  };
};

// =========================================
// Category Endpoint Mapping
// =========================================
export const categoryEndpoints = {
  services: {
    category: "service-categories",
    subcategory: "service-subcategories",
  },
  products: {
    category: "product-categories",
    subcategory: "product-subcategories",
  },
  videos: {
    category: "video-categories",
    subcategory: "video-subcategories",
  },
} as const;

// =========================================
// URL Builder
// =========================================
export const buildCategoryUrl = (
  type: ItemType,
  level: CategoryLevel,
  action: "all" | "single" | "create" | "update" | "delete",
  id?: number
): string => {
  const base = `/${categoryEndpoints[type][level]}/`;
  if (action === "all" || action === "create") return base;
  if (!id) throw new Error("ID is required for this action");
  return `${base}${id}/`;
};

// =========================================
// React Query Hooks
// =========================================

// GET ALL
export const useGetCategories = <T extends ItemType, L extends CategoryLevel>(
  type: T,
  level: L
) =>
  useQuery<CategoryMap[T][L][]>([type, level, "categories"], async () => {
    const url = buildCategoryUrl(type, level, "all");
    const res = await AxiosinstanceAuth.get(url);
    return res.data;
  });

// GET SINGLE
export const useGetCategory = <T extends ItemType, L extends CategoryLevel>(
  type: T,
  level: L,
  id: number
) =>
  useQuery<CategoryMap[T][L]>([type, level, "category", id], async () => {
    const url = buildCategoryUrl(type, level, "single", id);
    const res = await AxiosinstanceAuth.get<CategoryMap[T][L]>(url);
    return res.data;
  });

// CREATE
export const useCreateCategory = (type: ItemType, level: CategoryLevel) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<BaseCategory>) => {
      const url = buildCategoryUrl(type, level, "create");
      const res = await AxiosinstanceAuth.post(url, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries([type, level, "categories"]);
    },
  });
};

// UPDATE
export const useUpdateCategory = (type: ItemType, level: CategoryLevel) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<BaseCategory>;
    }) => {
      const url = buildCategoryUrl(type, level, "update", id);
      const res = await AxiosinstanceAuth.put(url, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries([type, level, "categories"]);
    },
  });
};

// DELETE
export const useDeleteCategory = (type: ItemType, level: CategoryLevel) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildCategoryUrl(type, level, "delete", id);
      await AxiosinstanceAuth.delete(url);
    },
    onSuccess: () => {
      queryClient.invalidateQueries([type, level, "categories"]);
    },
  });
};
