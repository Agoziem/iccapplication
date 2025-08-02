import { ORGANIZATION_ID } from "@/constants";
import { PaginatedProductResponse, Product } from "@/types/products";
import { AxiosinstanceAuth, AxiosinstanceFormDataAuth } from "./instance";
import { CreateProductType, UpdateProductType } from "@/schemas/products";
import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from "react-query";
const Organizationid = ORGANIZATION_ID;

// ======================================================
// React Query Hooks - Products
// ======================================================

/**
 * Hook to fetch all products
 */
export const useGetProducts = (category?: string): UseQueryResult<PaginatedProductResponse> => {
  return useQuery(
    ["products", category],
    async () => {
      const response = await AxiosinstanceAuth.get(`/products/${Organizationid}?category=${category}`);
      return response.data;
    }
  );
};

/**
 * Hook to fetch trending products
 */
export const useGetTrendingProducts = (period: string): UseQueryResult<PaginatedProductResponse> => {
  return useQuery(
    ["trendingProducts", period],
    async () => {
      const response = await AxiosinstanceAuth.get(`/products/trending/${Organizationid}/${period}`);
      return response.data;
    },
    {
      enabled: !!period,
    }
  );
};

/**
 * Hook to fetch user products
 */
export const useGetUserProducts = (category?: string): UseQueryResult<PaginatedProductResponse> => {
  return useQuery(
    ["userProducts", category],
    async () => {
      const response = await AxiosinstanceAuth.get(`/products/user/${Organizationid}?category=${category}`);
      return response.data;
    }
  );
};

/**
 * Hook to fetch free products
 */
export const useGetFreeProducts = (): UseQueryResult<Product[]> => {
  return useQuery("freeProducts", async () => {
    const response = await AxiosinstanceAuth.get(`/products/free/${Organizationid}`);
    return response.data;
  });
};

/**
 * Hook to fetch digital products
 */
export const useGetDigitalProducts = (): UseQueryResult<Product[]> => {
  return useQuery("digitalProducts", async () => {
    const response = await AxiosinstanceAuth.get(`/products/digital/${Organizationid}`);
    return response.data;
  });
};

/**
 * Hook to fetch physical products
 */
export const useGetPhysicalProducts = (): UseQueryResult<Product[]> => {
  return useQuery("physicalProducts", async () => {
    const response = await AxiosinstanceAuth.get(`/products/physical/${Organizationid}`);
    return response.data;
  });
};

/**
 * Hook to fetch single product
 */
export const useGetProduct = (id: number): UseQueryResult<Product> => {
  return useQuery(
    ["product", id],
    async () => {
      const response = await AxiosinstanceAuth.get(`/products/product/${id}`);
      return response.data;
    },
    {
      enabled: !!id,
    }
  );
};

/**
 * Hook to rate a product
 */
export const useRateProduct = (): UseMutationResult<
  Product,
  Error,
  { productId: number; rating: number }
> => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ productId, rating }: { productId: number; rating: number }) => {
      const response = await AxiosinstanceAuth.post(`/api/products/product/${productId}/rate`, { rating });
      return response.data;
    },
    {
      onSuccess: (data, variables) => {
        // Invalidate and update product queries
        queryClient.invalidateQueries(["product", variables.productId]);
        queryClient.invalidateQueries("products");
        queryClient.invalidateQueries("userProducts");
      },
      onError: (error) => {
        console.error("Failed to rate product:", error);
      },
    }
  );
};

/**
 * Hook to create a new product
 */
export const useCreateProduct = (): UseMutationResult<
  Product,
  Error,
  { product: CreateProductType; preview?: File | null; product_file?: File | null }
> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: { product: CreateProductType; preview?: File | null; product_file?: File | null }) => {
      const response = await AxiosinstanceFormDataAuth.post(`/products/${Organizationid}`, data);
      return response.data;
    },
    {
      onSuccess: () => {
        // Invalidate all product-related queries
        queryClient.invalidateQueries("products");
        queryClient.invalidateQueries("userProducts");
        queryClient.invalidateQueries("freeProducts");
        queryClient.invalidateQueries("digitalProducts");
        queryClient.invalidateQueries("physicalProducts");
      },
      onError: (error) => {
        console.error("Failed to create product:", error);
      },
    }
  );
};

/**
 * Hook to update an existing product
 */
export const useUpdateProduct = (): UseMutationResult<
  Product,
  Error,
  { product_id: number; product: UpdateProductType; preview?: File | null; product_file?: File | null }
> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: { 
      product_id: number; 
      product: UpdateProductType; 
      preview?: File | null; 
      product_file?: File | null 
    }) => {
      const response = await AxiosinstanceFormDataAuth.put(
        `/products/product/${data.product_id}`,
        {
          product: data.product,
          preview: data.preview,
          product_file: data.product_file,
        }
      );
      return response.data;
    },
    {
      onSuccess: (data, variables) => {
        // Invalidate all product-related queries
        queryClient.invalidateQueries("products");
        queryClient.invalidateQueries("userProducts");
        queryClient.invalidateQueries("freeProducts");
        queryClient.invalidateQueries("digitalProducts");
        queryClient.invalidateQueries("physicalProducts");
        queryClient.invalidateQueries(["product", variables.product_id]);
      },
      onError: (error) => {
        console.error("Failed to update product:", error);
      },
    }
  );
};

/**
 * Hook to delete a product
 */
export const useDeleteProduct = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (id: number) => {
      await AxiosinstanceAuth.delete(`/products/product/${id}`);
    },
    {
      onSuccess: () => {
        // Invalidate all product-related queries
        queryClient.invalidateQueries("products");
        queryClient.invalidateQueries("userProducts");
        queryClient.invalidateQueries("freeProducts");
        queryClient.invalidateQueries("digitalProducts");
        queryClient.invalidateQueries("physicalProducts");
      },
      onError: (error) => {
        console.error("Failed to delete product:", error);
      },
    }
  );
};
