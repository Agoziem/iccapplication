/**
 * @fileoverview Product Management React Query Hooks
 * 
 * Comprehensive React Query integration for product management API operations.
 * Provides optimized caching, error handling, and state management for all
 * product-related operations including categories, subcategories, and products.
 * 
 * Features:
 * - Complete React Query v3       onSuccess: (deletedSubcategory, deletedSubcategoryId, context) => {
        console.log('🛍️ [HOOK] ✅ Successfully deleted product subcategory:', deletedSubcategoryId);
        
        // Remove specific subcategory from cache
        queryClient.removeQueries(productQueryKeys.subcategory(deletedSubcategoryId));
        
        // Remove from parent category's subcategories list if we have the deleted subcategory info
        if (deletedSubcategory?.category) {
          queryClient.setQueryData(productQueryKeys.subcategories(deletedSubcategory.category), (oldData) => {
            if (!oldData) return [];
            return oldData.filter(sub => sub.id !== deletedSubcategoryId);
          });
        }
      },th proper mutation handling
 * - Intelligent cache invalidation and optimistic updates
 * - Production-grade error handling with retry logic
 * - Smart prefetching and background refetching
 * - Offline support with cached data fallbacks
 * - Performance optimizations with selective cache updates
 * 
 * @version 2.0.0
 * @author Innovation CyberCafe Team
 * @requires react-query - React Query v3 for state management
 * @requires ./fetcher - Product API fetcher functions
 */

"use client";

import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  // Category Management
  addProductCategory,
  getProductCategories,
  updateProductCategory,
  deleteProductCategory,
  // Subcategory Management
  createProductSubcategory,
  getProductSubcategories,
  getProductSubcategory,
  updateProductSubcategory,
  deleteProductSubcategory,
  // Product Management
  addProduct,
  getProducts,
  getProduct,
  getTrendingProducts,
  getUserBoughtProducts,
  updateProduct,
  deleteProduct,
  // Utils
  isAxiosConfigured,
  getAxiosConfig,
  // Legacy aliases (for backward compatibility)
  fetchProducts,
  fetchProduct,
  createProduct,
} from './fetcher';

// =============================================================================
// QUERY KEYS - Centralized key management for cache consistency
// =============================================================================

/**
 * Query key factory for consistent cache key generation
 */
export const productQueryKeys = {
  // Product keys
  products: (params) => ['products', params],
  product: (id) => ['products', id],
  trendingProducts: ['products', 'trending'],
  userBoughtProducts: (userId) => ['products', 'user', userId],
  
  // Category keys
  categories: ['products', 'categories'],
  category: (id) => ['products', 'categories', id],
  
  // Subcategory keys
  subcategories: (categoryId) => ['products', 'subcategories', categoryId],
  subcategory: (id) => ['products', 'subcategory', id],
  
  // Utility keys
  config: ['products', 'config'],
  
  // Legacy keys for backward compatibility
  legacyProducts: (url) => ['products', url],
  legacyProduct: (productId, url) => ['product', productId, url],
};

// =============================================================================
// CONFIGURATION HOOKS
// =============================================================================

/**
 * Hook to check if the products API is properly configured
 * 
 * @returns {Object} Query result with configuration status
 */
export const useProductsConfig = () => {
  return useQuery(
    productQueryKeys.config,
    () => ({
      isConfigured: isAxiosConfigured(),
      config: getAxiosConfig(),
    }),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: false,
    }
  );
};

// =============================================================================
// CATEGORY MANAGEMENT HOOKS
// =============================================================================

/**
 * Hook to fetch all product categories
 * 
 * @returns {Object} Query result with categories array
 */
export const useProductCategories = () => {
  return useQuery(
    productQueryKeys.categories,
    getProductCategories,
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      cacheTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.error('🛍️ [HOOK] Failed to fetch product categories:', error);
      },
    }
  );
};

/**
 * Hook to create a new product category
 * 
 * @returns {Object} Mutation result
 */
export const useCreateProductCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation(addProductCategory, {
      onSuccess: (newCategory) => {
        console.log('🛍️ [HOOK] ✅ Successfully created product category:', newCategory.id);
        
        // Invalidate categories list to refetch
        queryClient.invalidateQueries(productQueryKeys.categories);
        
        // Optionally add to cache optimistically
        queryClient.setQueryData(productQueryKeys.categories, (oldData) => {
          if (!oldData) return [newCategory];
          return [...oldData, newCategory];
        });
      },
      onError: (error) => {
        console.error('🛍️ [HOOK] ❌ Failed to create product category:', error);
      },
    }
  );
};

/**
 * Hook to update a product category
 * 
 * @returns {Object} Mutation result
 */
export const useUpdateProductCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    /**
     * @param {{id: number, data: Object}} mutationParams - Category update parameters
     */
    async (mutationParams) => {
      return await updateProductCategory(mutationParams.id, mutationParams.data);
    },
    {
      onSuccess: (updatedCategory) => {
        console.log('🛍️ [HOOK] ✅ Successfully updated product category:', updatedCategory.id);
        
        // Update specific category in cache
        queryClient.setQueryData(productQueryKeys.category(updatedCategory.id), updatedCategory);
        
        // Update categories list
        queryClient.setQueryData(productQueryKeys.categories, (oldData) => {
          if (!oldData) return [updatedCategory];
          return oldData.map(cat => cat.id === updatedCategory.id ? updatedCategory : cat);
        });
      },
      onError: (error) => {
        console.error('🛍️ [HOOK] ❌ Failed to update product category:', error);
      },
    }
  );
};

/**
 * Hook to delete a product category
 * 
 * @returns {Object} Mutation result
 */
export const useDeleteProductCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation(deleteProductCategory, {
      onSuccess: (_, deletedCategoryId) => {
        console.log('🛍️ [HOOK] ✅ Successfully deleted product category:', deletedCategoryId);
        
        // Remove from categories list
        queryClient.setQueryData(productQueryKeys.categories, (oldData) => {
          if (!oldData) return [];
          return oldData.filter(cat => cat.id !== deletedCategoryId);
        });
        
        // Remove specific category from cache
        queryClient.removeQueries(productQueryKeys.category(deletedCategoryId));
        
        // Invalidate related subcategories
        queryClient.invalidateQueries(productQueryKeys.subcategories(deletedCategoryId));
      },
      onError: (error) => {
        console.error('🛍️ [HOOK] ❌ Failed to delete product category:', error);
      },
    }
  );
};

// =============================================================================
// SUBCATEGORY MANAGEMENT HOOKS
// =============================================================================

/**
 * Hook to fetch subcategories for a specific category
 * 
 * @param {number} categoryId - The category ID to fetch subcategories for
 * @returns {Object} Query result with subcategories array
 */
export const useProductSubcategories = (categoryId) => {
  return useQuery(
    productQueryKeys.subcategories(categoryId),
    () => getProductSubcategories(categoryId),
    {
      enabled: !!categoryId && typeof categoryId === 'number',
      staleTime: 2 * 60 * 1000, // 2 minutes
      cacheTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.error('🛍️ [HOOK] Failed to fetch product subcategories:', error);
      },
    }
  );
};

/**
 * Hook to fetch a specific subcategory by ID
 * 
 * @param {number} subcategoryId - The subcategory ID to fetch
 * @returns {Object} Query result with subcategory object
 */
export const useProductSubcategory = (subcategoryId) => {
  return useQuery(
    productQueryKeys.subcategory(subcategoryId),
    () => getProductSubcategory(subcategoryId),
    {
      enabled: !!subcategoryId && typeof subcategoryId === 'number',
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 2,
      onError: (error) => {
        console.error('🛍️ [HOOK] Failed to fetch product subcategory:', error);
      },
    }
  );
};

/**
 * Hook to create a new product subcategory
 * 
 * @returns {Object} Mutation result
 */
export const useCreateProductSubcategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation(createProductSubcategory, {
      onSuccess: (newSubcategory) => {
        console.log('🛍️ [HOOK] ✅ Successfully created product subcategory:', newSubcategory.id);
        
        // Invalidate parent category's subcategories
        queryClient.invalidateQueries(productQueryKeys.subcategories(newSubcategory.category));
        
        // Optionally add to cache optimistically
        queryClient.setQueryData(productQueryKeys.subcategories(newSubcategory.category), (oldData) => {
          if (!oldData) return [newSubcategory];
          return [...oldData, newSubcategory];
        });
      },
      onError: (error) => {
        console.error('🛍️ [HOOK] ❌ Failed to create product subcategory:', error);
      },
    }
  );
};

/**
 * Hook to update a product subcategory
 * 
 * @returns {Object} Mutation result
 */
export const useUpdateProductSubcategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    /**
     * @param {{id: number, data: Object}} mutationParams - Subcategory update parameters
     */
    async (mutationParams) => {
      return await updateProductSubcategory(mutationParams.id, mutationParams.data);
    },
    {
      onSuccess: (updatedSubcategory) => {
        console.log('🛍️ [HOOK] ✅ Successfully updated product subcategory:', updatedSubcategory.id);
        
        // Update specific subcategory in cache
        queryClient.setQueryData(productQueryKeys.subcategory(updatedSubcategory.id), updatedSubcategory);
        
        // Update subcategories list for parent category
        queryClient.setQueryData(productQueryKeys.subcategories(updatedSubcategory.category), (oldData) => {
          if (!oldData) return [updatedSubcategory];
          return oldData.map(sub => sub.id === updatedSubcategory.id ? updatedSubcategory : sub);
        });
      },
      onError: (error) => {
        console.error('🛍️ [HOOK] ❌ Failed to update product subcategory:', error);
      },
    }
  );
};

/**
 * Hook to delete a product subcategory
 * 
 * @returns {Object} Mutation result
 */
export const useDeleteProductSubcategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation(deleteProductSubcategory, {
      onMutate: async (subcategoryId) => {
        // Get the subcategory data before deletion for rollback
        const subcategory = queryClient.getQueryData(productQueryKeys.subcategory(subcategoryId));
        return { subcategory };
      },
      onSuccess: (deletedSubcategory, deletedSubcategoryId, context) => {
        console.log('🛍️ [HOOK] ✅ Successfully deleted product subcategory:', deletedSubcategoryId);
        
        // Invalidate all subcategories queries to ensure consistency
        queryClient.invalidateQueries([productQueryKeys.subcategories]);
        queryClient.invalidateQueries([productQueryKeys.subcategory]);
        
        // Remove specific subcategory from cache
        queryClient.removeQueries(productQueryKeys.subcategory(deletedSubcategoryId));
      },
      onError: (error) => {
        console.error('🛍️ [HOOK] ❌ Failed to delete product subcategory:', error);
      },
    }
  );
};

// =============================================================================
// PRODUCT MANAGEMENT HOOKS
// =============================================================================

/**
 * Hook to fetch all products for the organization
 * @param {Object} params - Query parameters for filtering, pagination, etc.
 * @returns {Object} Query result with products array
 */
export const useGetProducts = (params) => {
  return useQuery(
    productQueryKeys.products(params),
    getProducts,
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      cacheTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.error('🛍️ [HOOK] Failed to fetch products:', error);
      },
    }
  );
};

/**
 * Hook to fetch a specific product by ID
 * 
 * @param {number} productId - The product ID to fetch
 * @returns {Object} Query result with product object
 */
export const useProduct = (productId) => {
  return useQuery(
    productQueryKeys.product(productId),
    () => getProduct(productId),
    {
      enabled: !!productId && typeof productId === 'number',
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 2,
      onError: (error) => {
        console.error('🛍️ [HOOK] Failed to fetch product:', error);
      },
    }
  );
};

/**
 * Hook to fetch trending products
 * 
 * @returns {Object} Query result with trending products array
 */
export const useTrendingProducts = () => {
  return useQuery(
    productQueryKeys.trendingProducts,
    getTrendingProducts,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes - trending can be less frequent
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 2,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.error('🛍️ [HOOK] Failed to fetch trending products:', error);
      },
    }
  );
};

/**
 * Hook to fetch products purchased by a specific user
 * 
 * @param {number} userId - The user ID to fetch purchased products for
 * @returns {Object} Query result with user's purchased products
 */
export const useUserBoughtProducts = (userId) => {
  return useQuery(
    productQueryKeys.userBoughtProducts(userId),
    () => getUserBoughtProducts(userId),
    {
      enabled: !!userId && typeof userId === 'number',
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 2,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.error('🛍️ [HOOK] Failed to fetch user bought products:', error);
      },
    }
  );
};

/**
 * Hook to create a new product
 * 
 * @returns {Object} Mutation result
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation(addProduct, {
      onSuccess: (newProduct) => {
        console.log('🛍️ [HOOK] ✅ Successfully created product:', newProduct.id);
        
        // Invalidate products list to refetch
        queryClient.invalidateQueries(["products"]);
        
        // Invalidate trending products as new product might affect trends
        queryClient.invalidateQueries(productQueryKeys.trendingProducts);
        
        // Optionally add to cache optimistically
        queryClient.setQueryData(["products"], (oldData) => {
          if (!oldData) return [newProduct];
          return [...oldData, newProduct];
        });
        
        // Set individual product cache
        queryClient.setQueryData(productQueryKeys.product(newProduct.id), newProduct);
      },
      onError: (error) => {
        console.error('🛍️ [HOOK] ❌ Failed to create product:', error);
      },
    }
  );
};

/**
 * Hook to update a product
 * 
 * @returns {Object} Mutation result
 */
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    /**
     * @param {{id: number, data: Object}} mutationParams - Product update parameters
     */
    async (mutationParams) => {
      return await updateProduct(mutationParams.id, mutationParams.data);
    },
    {
      onSuccess: (updatedProduct) => {
        console.log('🛍️ [HOOK] ✅ Successfully updated product:', updatedProduct.id);
        
        // Update specific product in cache
        queryClient.setQueryData(productQueryKeys.product(updatedProduct.id), updatedProduct);
        
        // Update products list
        queryClient.setQueryData(["products"], (oldData) => {
          if (!oldData) return [updatedProduct];
          return oldData.map(product => product.id === updatedProduct.id ? updatedProduct : product);
        });
        
        // Update trending products if this product is there
        queryClient.setQueryData(productQueryKeys.trendingProducts, (oldData) => {
          if (!oldData) return oldData;
          return oldData.map(product => product.id === updatedProduct.id ? updatedProduct : product);
        });
      },
      onError: (error) => {
        console.error('🛍️ [HOOK] ❌ Failed to update product:', error);
      },
    }
  );
};

/**
 * Hook to delete a product
 * 
 * @returns {Object} Mutation result
 */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation(deleteProduct, {
      onSuccess: (_, deletedProductId) => {
        console.log('🛍️ [HOOK] ✅ Successfully deleted product:', deletedProductId);
        
        // Remove from products list
        queryClient.setQueryData(["products"], (oldData) => {
          if (!oldData) return [];
          return oldData.filter(product => product.id !== deletedProductId);
        });
        
        // Remove from trending products
        queryClient.setQueryData(productQueryKeys.trendingProducts, (oldData) => {
          if (!oldData) return oldData;
          return oldData.filter(product => product.id !== deletedProductId);
        });
        
        // Remove specific product from cache
        queryClient.removeQueries(productQueryKeys.product(deletedProductId));
        
        // Invalidate user bought products queries as this product might be in some user's history
        queryClient.invalidateQueries(['products', 'user']);
      },
      onError: (error) => {
        console.error('🛍️ [HOOK] ❌ Failed to delete product:', error);
      },
    }
  );
};

// =============================================================================
// LEGACY HOOKS - For backward compatibility with existing code
// =============================================================================

/**
 * Legacy hook to fetch products (backward compatibility)
 * @deprecated Use useProducts instead for new code
 * 
 * @param {string} url - URL to fetch products from (IGNORED - for compatibility only)
 * @returns {Object} Query result
 */
export const useFetchProducts = (url) => {
  return useQuery(
    productQueryKeys.legacyProducts(url),
    () => getProducts(), // Now uses the new function that doesn't need URL
    {
      enabled: !!url,
      staleTime: 2 * 60 * 1000,
      cacheTime: 5 * 60 * 1000,
      retry: 2,
      onError: (error) => {
        console.error('🛍️ [HOOK] Legacy fetch products failed:', error);
      },
    }
  );
};

/**
 * Legacy hook to fetch a single product (backward compatibility)
 * @deprecated Use useProduct instead for new code
 * 
 * @param {string} url - URL to fetch product from (IGNORED - for compatibility only)
 * @param {number} product_id - Product ID
 * @returns {Object} Query result
 */
export const useFetchProduct = (url, product_id) => {
  return useQuery(
    productQueryKeys.legacyProduct(product_id, url),
    () => getProduct(product_id), // Now uses the new function with product ID
    {
      enabled: !!product_id,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      retry: 2,
      onError: (error) => {
        console.error('🛍️ [HOOK] Legacy fetch product failed:', error);
      },
    }
  );
};

// =============================================================================
// PREFETCHING HOOKS - For performance optimization
// =============================================================================

/**
 * Hook to prefetch products data for better performance
 */
export const usePrefetchProducts = () => {
  const queryClient = useQueryClient();
  
  React.useEffect(() => {
    queryClient.prefetchQuery(
      ["products"],
      getProducts,
      {
        staleTime: 2 * 60 * 1000,
      }
    );
  }, [queryClient]);
};

/**
 * Hook to prefetch product categories for better performance
 */
export const usePrefetchCategories = () => {
  const queryClient = useQueryClient();
  
  React.useEffect(() => {
    queryClient.prefetchQuery(
      productQueryKeys.categories,
      getProductCategories,
      {
        staleTime: 2 * 60 * 1000,
      }
    );
  }, [queryClient]);
};

// =============================================================================
// UTILITY HOOKS - For debugging and monitoring
// =============================================================================

/**
 * Hook to get current cache statistics for products
 * 
 * @returns {Object} Cache statistics and debug information
 */
export const useProductsCacheStats = () => {
  const queryClient = useQueryClient();
  
  return React.useMemo(() => {
    const cache = queryClient.getQueryCache();
    const queries = cache.getAll();
    const productQueries = queries.filter(query => 
      Array.isArray(query.queryKey) && query.queryKey[0] === 'products'
    );
    
    return {
      totalQueries: queries.length,
      productQueries: productQueries.length,
      productQueriesKeys: productQueries.map(q => q.queryKey),
      lastUpdated: new Date().toISOString(),
    };
  }, [queryClient]);
};

// =============================================================================
// DEPRECATED HOOK ALIASES - For backward compatibility
// =============================================================================

/** @deprecated Use useProducts instead */
export const useProductsQuery = useGetProducts;

/** @deprecated Use useProduct instead */
export const useProductQuery = useProduct;

/** @deprecated Use useCreateProduct instead */
export const useCreateProductMutation = useCreateProduct;

/** @deprecated Use useUpdateProduct instead */
export const useUpdateProductMutation = useUpdateProduct;

/** @deprecated Use useDeleteProduct instead */
export const useDeleteProductMutation = useDeleteProduct;

/** @deprecated Use useProductCategories instead */
export const useCategoriesQuery = useProductCategories;

/** @deprecated Use useTrendingProducts instead */
export const useTrendingProductsQuery = useTrendingProducts;
