import { converttoformData } from "@/utils/formutils";
import { AxiosInstance, AxiosInstancemultipart, AxiosInstanceWithToken, AxiosInstancemultipartWithToken } from "../instance";
import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from "react-query";
import {
  Product,
  ProductCategory,
  ProductSubCategory,
  CreateProductCategory,
  CreateProductSubCategory,
  PaginatedProductResponse,
  ProductCategories,
  DeleteResponse,
  CreateProduct,
  UpdateProduct
} from "@/types/items";

export const productsAPIendpoint = "/productsapi";

// Query Keys
export const PRODUCT_KEYS = {
  all: ['products'] as const,
  lists: () => [...PRODUCT_KEYS.all, 'list'] as const,
  list: (organizationId: number) => [...PRODUCT_KEYS.lists(), organizationId] as const,
  trending: (organizationId: number) => [...PRODUCT_KEYS.all, 'trending', organizationId] as const,
  userBought: (organizationId: number, userId: number) => [...PRODUCT_KEYS.all, 'userBought', organizationId, userId] as const,
  details: () => [...PRODUCT_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...PRODUCT_KEYS.details(), id] as const,
  categories: () => [...PRODUCT_KEYS.all, 'categories'] as const,
  subCategories: (categoryId: number) => [...PRODUCT_KEYS.categories(), 'subcategories', categoryId] as const,
  subCategory: (id: number) => [...PRODUCT_KEYS.categories(), 'subcategory', id] as const,
} as const;


// Product Management
export const fetchProducts = async (organizationId: number, params?: Record<string, any>): Promise<PaginatedProductResponse> => {
  const response = await AxiosInstance.get(`${productsAPIendpoint}/products/${organizationId}/`, { params });
  return response.data;
};

export const fetchProduct = async (productId: number): Promise<Product> => {
  const response = await AxiosInstance.get(`${productsAPIendpoint}/product/${productId}/`);
  return response.data;
};

export const addProduct = async (organizationId: number, productData: CreateProduct): Promise<Product> => {
  const formData = converttoformData(productData);
  const response = await AxiosInstancemultipartWithToken.post(`${productsAPIendpoint}/add-product/${organizationId}/`, formData);
  return response.data;
};

export const updateProduct = async (productId: number, productData: UpdateProduct): Promise<Product> => {
  const response = await AxiosInstancemultipartWithToken.put(`${productsAPIendpoint}/update-product/${productId}/`, productData);
  return response.data;
};

export const deleteProduct = async (productId: number): Promise<DeleteResponse> => {
  const response = await AxiosInstanceWithToken.delete(`${productsAPIendpoint}/delete-product/${productId}/`);
  return response.data;
};

export const fetchTrendingProducts = async (organizationId: number, params?: Record<string, any>): Promise<PaginatedProductResponse> => {
  const response = await AxiosInstance.get(`${productsAPIendpoint}/trendingproducts/${organizationId}/`, { params });
  return response.data;
};

export const fetchUserBoughtProducts = async (organizationId: number, userId: number, params?: Record<string, any>): Promise<PaginatedProductResponse> => {
  const response = await AxiosInstance.get(`${productsAPIendpoint}/userboughtproducts/${organizationId}/${userId}/`, { params });
  return response.data;
};

// Product Category Management
export const addProductCategory = async (categoryData: CreateProductCategory): Promise<ProductCategory> => {
  const response = await AxiosInstanceWithToken.post(`${productsAPIendpoint}/add_category/`, categoryData);
  return response.data;
};

export const fetchProductCategories = async (): Promise<ProductCategories> => {
  const response = await AxiosInstance.get(`${productsAPIendpoint}/categories/`);
  return response.data;
};

export const updateProductCategory = async (categoryId: number, updateData: Partial<CreateProductCategory>): Promise<ProductCategory> => {
  const response = await AxiosInstanceWithToken.put(`${productsAPIendpoint}/update_category/${categoryId}/`, updateData);
  return response.data;
};

export const deleteProductCategory = async (categoryId: number): Promise<DeleteResponse> => {
  const response = await AxiosInstanceWithToken.delete(`${productsAPIendpoint}/delete_category/${categoryId}/`);
  return response.data;
};

// Product SubCategory Management
export const createProductSubCategory = async (subCategoryData: CreateProductSubCategory): Promise<ProductSubCategory> => {
  const response = await AxiosInstanceWithToken.post(`${productsAPIendpoint}/create_subcategory/`, subCategoryData);
  return response.data;
};

export const fetchProductSubCategories = async (categoryId: number, params?: Record<string, any>): Promise<ProductSubCategory[]> => {
  const response = await AxiosInstance.get(`${productsAPIendpoint}/subcategories/${categoryId}/`, { params });
  return response.data;
};

export const fetchProductSubCategory = async (subcategoryId: number): Promise<ProductSubCategory> => {
  const response = await AxiosInstance.get(`${productsAPIendpoint}/subcategory/${subcategoryId}/`);
  return response.data;
};

export const updateProductSubCategory = async (subcategoryId: number, updateData: Partial<CreateProductSubCategory>): Promise<ProductSubCategory> => {
  const response = await AxiosInstanceWithToken.put(`${productsAPIendpoint}/update_subcategory/${subcategoryId}/`, updateData);
  return response.data;
};

export const deleteProductSubCategory = async (subcategoryId: number): Promise<DeleteResponse> => {
  const response = await AxiosInstanceWithToken.delete(`${productsAPIendpoint}/delete_subcategory/${subcategoryId}/`);
  return response.data;
};

// React Query Hooks

// Product Query Hooks
export const useProducts = (organizationId: number, params?: Record<string, any>): UseQueryResult<PaginatedProductResponse, Error> => {
  return useQuery({
    queryKey: [...PRODUCT_KEYS.list(organizationId), params],
    queryFn: () => fetchProducts(organizationId, params),
    onError: (error: Error) => {
      console.error('Error fetching products:', error);
      throw error;
    },
  });
};

export const useProduct = (productId: number): UseQueryResult<Product, Error> => {
  return useQuery({
    queryKey: PRODUCT_KEYS.detail(productId),
    queryFn: () => fetchProduct(productId),
    enabled: !!productId,
    onError: (error: Error) => {
      console.error('Error fetching product:', error);
      throw error;
    },
  });
};

export const useTrendingProducts = (organizationId: number, params?: Record<string, any>): UseQueryResult<PaginatedProductResponse, Error> => {
  return useQuery({
    queryKey: [...PRODUCT_KEYS.trending(organizationId), params],
    queryFn: () => fetchTrendingProducts(organizationId, params),
    onError: (error: Error) => {
      console.error('Error fetching trending products:', error);
      throw error;
    },
  });
};

export const useUserBoughtProducts = (organizationId: number, userId: number, params?: Record<string, any>): UseQueryResult<PaginatedProductResponse, Error> => {
  return useQuery({
    queryKey: [...PRODUCT_KEYS.userBought(organizationId, userId), params],
    queryFn: () => fetchUserBoughtProducts(organizationId, userId, params),
    enabled: !!organizationId && !!userId,
    onError: (error: Error) => {
      console.error('Error fetching user bought products:', error);
      throw error;
    },
  });
};

// Product Management Mutations
export const useAddProduct = (): UseMutationResult<Product, Error, { organizationId: number; productData: CreateProduct }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ organizationId, productData }) => addProduct(organizationId, productData),
    onSuccess: (data, { organizationId }) => {
      queryClient.invalidateQueries(PRODUCT_KEYS.list(organizationId));
      queryClient.invalidateQueries(PRODUCT_KEYS.lists());
      queryClient.invalidateQueries(PRODUCT_KEYS.trending(organizationId));
    },
    onError: (error: Error) => {
      console.error('Error adding product:', error);
      throw error;
    },
  });
};

export const useUpdateProduct = (): UseMutationResult<Product, Error, { productId: number; productData: UpdateProduct }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ productId, productData }) => updateProduct(productId, productData),
    onSuccess: (data, { productId }) => {
      queryClient.setQueryData(PRODUCT_KEYS.detail(productId), data);
      queryClient.invalidateQueries(PRODUCT_KEYS.lists());
    },
    onError: (error: Error) => {
      console.error('Error updating product:', error);
      throw error;
    },
  });
};

export const useDeleteProduct = (): UseMutationResult<DeleteResponse, Error, number> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: (_, productId) => {
      queryClient.removeQueries(PRODUCT_KEYS.detail(productId));
      queryClient.invalidateQueries(PRODUCT_KEYS.lists());
    },
    onError: (error: Error) => {
      console.error('Error deleting product:', error);
      throw error;
    },
  });
};

// Product Categories Hooks
export const useProductCategories = (): UseQueryResult<ProductCategories, Error> => {
  return useQuery({
    queryKey: PRODUCT_KEYS.categories(),
    queryFn: fetchProductCategories,
    onError: (error: Error) => {
      console.error('Error fetching product categories:', error);
      throw error;
    },
  });
};

export const useAddProductCategory = (): UseMutationResult<ProductCategory, Error, CreateProductCategory> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: addProductCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(PRODUCT_KEYS.categories());
    },
    onError: (error: Error) => {
      console.error('Error adding product category:', error);
      throw error;
    },
  });
};

export const useUpdateProductCategory = (): UseMutationResult<ProductCategory, Error, { categoryId: number; updateData: Partial<CreateProductCategory> }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ categoryId, updateData }) => updateProductCategory(categoryId, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries(PRODUCT_KEYS.categories());
    },
    onError: (error: Error) => {
      console.error('Error updating product category:', error);
      throw error;
    },
  });
};

export const useDeleteProductCategory = (): UseMutationResult<DeleteResponse, Error, number> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteProductCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(PRODUCT_KEYS.categories());
    },
    onError: (error: Error) => {
      console.error('Error deleting product category:', error);
      throw error;
    },
  });
};

// Product SubCategories Hooks
export const useProductSubCategories = (categoryId: number, params?: Record<string, any>): UseQueryResult<ProductSubCategory[], Error> => {
  return useQuery({
    queryKey: [...PRODUCT_KEYS.subCategories(categoryId), params],
    queryFn: () => fetchProductSubCategories(categoryId, params),
    enabled: !!categoryId,
    onError: (error: Error) => {
      console.error('Error fetching product subcategories:', error);
      throw error;
    },
  });
};

export const useProductSubCategory = (subcategoryId: number): UseQueryResult<ProductSubCategory, Error> => {
  return useQuery({
    queryKey: PRODUCT_KEYS.subCategory(subcategoryId),
    queryFn: () => fetchProductSubCategory(subcategoryId),
    enabled: !!subcategoryId,
    onError: (error: Error) => {
      console.error('Error fetching product subcategory:', error);
      throw error;
    },
  });
};

export const useCreateProductSubCategory = (): UseMutationResult<ProductSubCategory, Error, CreateProductSubCategory> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createProductSubCategory,
    onSuccess: (data) => {
      // Invalidate all subcategories queries since we don't have the category ID
      queryClient.invalidateQueries(PRODUCT_KEYS.categories());
    },
    onError: (error: Error) => {
      console.error('Error creating product subcategory:', error);
      throw error;
    },
  });
};

export const useUpdateProductSubCategory = (): UseMutationResult<ProductSubCategory, Error, { subcategoryId: number; updateData: Partial<CreateProductSubCategory> }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ subcategoryId, updateData }) => updateProductSubCategory(subcategoryId, updateData),
    onSuccess: (data, { subcategoryId }) => {
      queryClient.setQueryData(PRODUCT_KEYS.subCategory(subcategoryId), data);
      // Invalidate all subcategories queries
      queryClient.invalidateQueries(PRODUCT_KEYS.categories());
    },
    onError: (error: Error) => {
      console.error('Error updating product subcategory:', error);
      throw error;
    },
  });
};

export const useDeleteProductSubCategory = (): UseMutationResult<DeleteResponse, Error, number> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteProductSubCategory,
    onSuccess: (_, subcategoryId) => {
      queryClient.removeQueries(PRODUCT_KEYS.subCategory(subcategoryId));
      queryClient.invalidateQueries(PRODUCT_KEYS.categories());
    },
    onError: (error: Error) => {
      console.error('Error deleting product subcategory:', error);
      throw error;
    },
  });
};
