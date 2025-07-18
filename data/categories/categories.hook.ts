import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from "react-query";
import {
  Category,
  Categories,
  SubCategory,
  SubCategories,
} from "@/types/categories";
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
export const useFetchCategories = (
  url: string
): UseQueryResult<Categories, Error> =>
  useQuery(["categories", url], () => fetchCategories(url), {
    enabled: !!url,
  });

/** Fetch all subcategories */
export const useFetchSubCategories = (
  url: string,
  category_id: number
): UseQueryResult<SubCategories, Error> =>
  useQuery(["subcategories", category_id, url], () => fetchSubCategories(url), {
    enabled: !!category_id,
  });

/** Create a new category */
export const useCreateCategory = (): UseMutationResult<
  Category | undefined,
  Error,
  { createUrl: string; data: Partial<Category> }
> => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ createUrl, data }: { createUrl: string; data: Partial<Category> }) =>
      createCategory(createUrl, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["categories"]); // Refresh the category list
      },
    }
  );
};

/** Create a new subcategory */
export const useCreateSubCategory = (): UseMutationResult<
  SubCategory | undefined,
  Error,
  Partial<SubCategory>
> => {
  const queryClient = useQueryClient();
  return useMutation(
    (data: Partial<SubCategory>) =>
      createSubCategory(`/subcategories/create/`, data),
    {
      onSuccess: (data) => {
        if (data?.category && "id" in data.category) {
          queryClient.invalidateQueries(["subcategories", data.category.id]); // Refresh the subcategory list
        }
      },
    }
  );
};

/** Update a category */
export const useUpdateCategory = (): UseMutationResult<
  Category | undefined,
  Error,
  { updateUrl: string; data: Partial<Category> }
> => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ updateUrl, data }: { updateUrl: string; data: Partial<Category> }) =>
      updateCategory(updateUrl, data),
    {
      onSuccess: (_, { data }) => {
        queryClient.invalidateQueries(["categories"]); // Refresh the category list
        if (data.id) {
          queryClient.invalidateQueries(["category", data.id]); // Refresh the updated category
        }
      },
    }
  );
};

/** Update a subcategory */
export const useUpdateSubCategory = (): UseMutationResult<
  SubCategory | undefined,
  Error,
  Partial<SubCategory>
> => {
  const queryClient = useQueryClient();
  return useMutation(
    (data: Partial<SubCategory>) => {
      if (!data.id) throw new Error("SubCategory ID is required for update");
      return updateSubCategory(`/subcategories/${data.id}/update/`, data);
    },
    {
      onSuccess: (data) => {
        if (data?.category && "id" in data.category) {
          queryClient.invalidateQueries(["subcategories", data.category.id]); // Refresh the subcategory list
        }
      },
    }
  );
};

/** Delete a category */
export const useDeleteCategory = (): UseMutationResult<
  number,
  Error,
  { deleteUrl: string; id: number }
> => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ deleteUrl, id }: { deleteUrl: string; id: number }) =>
      deleteCategory(deleteUrl, id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["categories"]); // Refresh the category list
      },
    }
  );
};

/** Delete a subcategory */
export const useDeleteSubCategory = (): UseMutationResult<
  number,
  Error,
  { id: number; category_id: number }
> => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id, category_id }: { id: number; category_id: number }) =>
      deleteSubCategory(`/subcategories/${id}/delete/`, id),
    {
      onSuccess: (_, { category_id }) => {
        queryClient.invalidateQueries(["subcategories", category_id]); // Refresh the subcategory list
      },
    }
  );
};
