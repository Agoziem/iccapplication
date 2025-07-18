"use client";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  fetchProducts,
  fetchProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/data/product/fetcher";

// Hook to fetch all products
export const useFetchProducts = (url) => {
  return useQuery(
    ["products", url], // Dynamic key for caching
    () => fetchProducts(url),
    {
      enabled: !!url, // Ensure query only runs if URL is provided
    }
  );
};

// Hook to fetch a single product
export const useFetchProduct = (url,product_id) => {
  return useQuery(
    ["product",product_id, url], // Unique key for fetching specific product
    () => fetchProduct(url),
    {
      enabled: !!product_id, // Ensure query only runs if URL is provided
    }
  );
};

// Hook to create a new product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation(createProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]); // Invalidate product list on success
    },
  });
};

// Hook to update a product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation(updateProduct, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["product", variables.id]); // Invalidate specific product
      queryClient.invalidateQueries(["products"]); // Invalidate the product list
    },
  });
};

// Hook to delete a product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]); // Invalidate the product list on success
    },
  });
};
