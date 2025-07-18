import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  fetchCategories,
  fetchSubCategories,
  createCategory,
  createSubCategory,
  updateCategory,
  updateSubCategory,
  deleteCategory,
  deleteSubCategory,
} from "@/data/categories/fetcher";

// Custom Hooks

/** Fetch all categories */
export const useFetchCategories = (url) =>
  useQuery(["categories", url], () => fetchCategories(url), {
    enabled: !!url,
  });

/** Fetch all subcategories */
export const useFetchSubCategories = (url, category_id) =>
  useQuery(["subcategories", category_id, url], () => fetchSubCategories(url), {
    enabled: !!category_id,
  });

/** Create a new category */
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation(
    /**
     * @param {{ createUrl: string, data: object }} param
     * @returns {Promise<object>}
     */
    ({ createUrl, data }) => createCategory(createUrl, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["categories"]); // Refresh the category list
      },
    }
  );
};

/** Create a new subcategory */
export const useCreateSubCategory = () => {
  const queryClient = useQueryClient();
  return useMutation(
    /** @param {SubCategory} data */
    (data) => createSubCategory(`/subcategories/create/`, data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["subcategories", data.category.id]); // Refresh the subcategory list
      },
    }
  );
};

/** Update a category */
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation(
    /**
     * @param {{ updateUrl: string, data: object }} param
     * @returns {Promise<object>}
     */
    ({ updateUrl, data }) => updateCategory(updateUrl, data),
    {
      onSuccess: (_, { data }) => {
        queryClient.invalidateQueries(["categories"]); // Refresh the category list
        queryClient.invalidateQueries(["category", data.id]); // Refresh the updated category
      },
    }
  );
};

/** Update a subcategory */
export const useUpdateSubCategory = () => {
  const queryClient = useQueryClient();
  return useMutation(
    /** @param {SubCategory} data */
    (data) => updateSubCategory(`/subcategories/${data.id}/update/`, data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["subcategories", data.category.id]); // Refresh the subcategory list
      },
    }
  );
};

/** Delete a category */
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation(
    /** @param {{ deleteUrl: string, id: number }} param */
    ({ deleteUrl, id }) => deleteCategory(deleteUrl, id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["categories"]); // Refresh the category list
      },
    }
  );
};

/** Delete a subcategory */
export const useDeleteSubCategory = () => {
  const queryClient = useQueryClient();
  return useMutation(
    /**
     * @param {{ id: number, category_id: number }} params
     */
    ({ id, category_id }) =>
      deleteSubCategory(`/subcategories/${id}/delete/`, id),
    {
      onSuccess: (_, { category_id }) => {
        queryClient.invalidateQueries(["subcategories", category_id]); // Refresh the subcategory list
      },
    }
  );
};
