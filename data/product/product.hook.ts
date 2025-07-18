"use client";
import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from "react-query";
import type { Product, Products } from "@/types/items";
import { z } from "zod";
import { productsResponseSchema } from "@/schemas/items";
import {
  fetchProducts,
  fetchProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/data/product/fetcher";

type ProductsResponse = z.infer<typeof productsResponseSchema>;

// Hook to fetch all products
export const useFetchProducts = (url: string): UseQueryResult<ProductsResponse | undefined, Error> => {
  return useQuery(
    ["products", url], // Dynamic key for caching
    () => fetchProducts(url),
    {
      enabled: !!url, // Ensure query only runs if URL is provided
    }
  );
};

// Hook to fetch a single product
export const useFetchProduct = (url: string, product_id: number): UseQueryResult<Product | undefined, Error> => {
  return useQuery(
    ["product", product_id, url], // Unique key for fetching specific product
    () => fetchProduct(url),
    {
      enabled: !!product_id, // Ensure query only runs if product_id is provided
    }
  );
};

// Hook to create a new product
export const useCreateProduct = (): UseMutationResult<Product | undefined, Error, Omit<Product, "id" | "created_at" | "updated_at">> => {
  const queryClient = useQueryClient();
  return useMutation(createProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]); // Invalidate product list on success
    },
  });
};

// Hook to update a product
export const useUpdateProduct = (): UseMutationResult<Product | undefined, Error, Partial<Product> & { id: number }> => {
  const queryClient = useQueryClient();
  return useMutation(updateProduct, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["product", variables.id]); // Invalidate specific product
      queryClient.invalidateQueries(["products"]); // Invalidate the product list
    },
  });
};

// Hook to delete a product
export const useDeleteProduct = (): UseMutationResult<number, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation(deleteProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]); // Invalidate the product list on success
    },
  });
};
