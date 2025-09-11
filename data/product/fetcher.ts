/**
 * @fileoverview Enhanced Product Management API Integration
 * 
 * Comprehensive API integration for product management following strict
 * API documentation compliance. Implements all 16 documented productsapi endpoints with
 * enhanced error handling, logging, and schema validation.
 * 
 * Features:
 * - Production-grade axios configuration with timeouts and interceptors
 * - Comprehensive error handling and detailed logging
 * - Strict schema validation using Zod with informative error messages
 * - Request/response interceptors for debugging and monitoring
 * - Full TypeScript support with proper JSDoc documentation
 * - Smart form data handling for file uploads
 * - Strict compliance with documented API endpoints only
 * 
 * @version 2.0.0
 * @author Innovation CyberCafe Team
 * @requires axios - HTTP client for API requests
 * @requires zod - Schema validation library
 * @requires ../schemas/items - Product validation schemas
 * @requires ../../utils/formutils - Form data conversion utilities
 */

/**
 * @typedef {import('zod').infer<typeof ProductSchema>} Product
 * @typedef {import('zod').infer<typeof ProductsSchema>} ProductArray
 * @typedef {import('zod').infer<typeof PaginatedProductResponseSchema>} PaginatedProductResponse
 * @typedef {import('zod').infer<typeof ProductCategorySchema>} ProductCategory
 * @typedef {import('zod').infer<typeof ProductSubCategorySchema>} ProductSubCategory
 * @typedef {import('zod').infer<typeof CreateProductCategorySchema>} CreateProductCategory
 * @typedef {import('zod').infer<typeof CreateProductSubCategorySchema>} CreateProductSubCategory
 * @typedef {{message: string}} SuccessResponse
 * @typedef {{error: string}} ErrorResponse
 */

import axios from "axios";
import { z } from "zod";
import {
  ProductSchema,
  ProductsSchema,
  PaginatedProductResponseSchema,
  ProductCategorySchema,
  ProductCategoriesSchema,
  ProductSubCategorySchema,
  CreateProductCategorySchema,
  CreateProductSubCategorySchema,
} from "@/schemas/items";
import { converttoformData } from "@/utils/formutils";

// =============================================================================
// SIMPLE RESPONSE SCHEMAS - For success/error responses
// =============================================================================

/**
 * Success Response Schema for product operations
 */
const SuccessResponseSchema = z.object({
  message: z.string().min(1),
});

/**
 * Error Response Schema for product operations
 */
const ErrorResponseSchema = z.object({
  error: z.string().min(1),
});

/**
 * Delete Response Schema - returns the ID of deleted item
 */
const DeleteResponseSchema = z.object({
  id: z.number(),
});

// =============================================================================
// AXIOS CONFIGURATION & SETUP
// =============================================================================

/**
 * Enhanced axios instance with production-grade configuration
 * @type {import('axios').AxiosInstance}
 */
export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}`,
  timeout: 15000, // 15 second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * Request interceptor for debugging and monitoring
 */
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`🛍️ [PRODUCT-API] ${config.method?.toUpperCase()} ${config.url}`, {
      data: config.data ? (config.data instanceof FormData ? '***FORM_DATA***' : '***DATA***') : 'No data',
      headers: config.headers,
    });
    return config;
  },
  (error) => {
    console.error('🛍️ [PRODUCT-API] Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for debugging and error handling
 */
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`🛍️ [PRODUCT-API] ✅ ${response.status} ${response.config.url}`, {
      status: response.status,
      data: response.data ? 'Response received' : 'No data',
    });
    return response;
  },
  (error) => {
    console.error(`🛍️ [PRODUCT-API] ❌ ${error.response?.status || 'Network Error'} ${error.config?.url}`, {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

/**
 * Organization ID from environment variables
 * @type {string}
 */
const organizationId = process.env.NEXT_PUBLIC_ORGANIZATION_ID;

/**
 * Products API endpoint base path
 * @type {string}
 */
export const productsAPIendpoint = "/productsapi";

// =============================================================================
// CATEGORY MANAGEMENT ENDPOINTS
// =============================================================================

/**
 * POST /productsapi/add_category/
 * Creates a new product category
 * 
 * @async
 * @function addProductCategory
 * @param {CreateProductCategory} categoryData - Category creation data
 * @returns {Promise<ProductCategory>} Created product category
 * @throws {Error} When API request fails or validation fails
 * 
 * @example
 * ```javascript
 * const category = await addProductCategory({
 *   category: "Electronics",
 *   description: "Electronic products and accessories"
 * });
 * console.log(category.id); // 123
 * ```
 */
export const addProductCategory = async (categoryData) => {
  try {
    console.log(`🛍️ [FETCHER] Creating product category: ${categoryData.category}`);
    
    const validation = CreateProductCategorySchema.safeParse(categoryData);
    if (!validation.success) {
      console.error('🛍️ [FETCHER] Add product category validation failed:', validation.error.issues);
      throw new Error(`Invalid category data: ${validation.error.issues.map(issue => issue.message).join(', ')}`);
    }

    const response = await axiosInstance.post(`${productsAPIendpoint}/add_category/`, validation.data);
    
    // Validate response
    const categoryValidation = ProductCategorySchema.safeParse(response.data);
    if (!categoryValidation.success) {
      console.error('🛍️ [FETCHER] Add product category response validation failed:', categoryValidation.error.issues);
      throw new Error('Failed to validate category data from server');
    }
    
    console.log(`🛍️ [FETCHER] ✅ Successfully created product category: ${categoryData.category}`);
    return categoryValidation.data;
  } catch (error) {
    console.error(`🛍️ [FETCHER] ❌ Failed to create product category ${categoryData.category}:`, error);
    throw new Error(`Failed to create product category: ${error.response?.data?.error || error.message}`);
  }
};

/**
 * GET /productsapi/categories/
 * Retrieves all product categories
 * 
 * @async
 * @function getProductCategories
 * @returns {Promise<ProductCategory[]>} Array of product categories
 * @throws {Error} When API request fails or validation fails
 * 
 * @example
 * ```javascript
 * const categories = await getProductCategories();
 * console.log(`Found ${categories.length} categories`);
 * ```
 */
export const getProductCategories = async () => {
  try {
    console.log('🛍️ [FETCHER] Fetching product categories');
    
    const response = await axiosInstance.get(`${productsAPIendpoint}/categories/`);
    
    // Validate response
    const validation = ProductCategoriesSchema.safeParse(response.data);
    if (!validation.success) {
      console.error('🛍️ [FETCHER] Get product categories response validation failed:', validation.error.issues);
      throw new Error('Failed to validate categories data from server');
    }
    
    console.log(`🛍️ [FETCHER] ✅ Successfully fetched ${validation.data.length} product categories`);
    return validation.data;
  } catch (error) {
    console.error('🛍️ [FETCHER] ❌ Failed to fetch product categories:', error);
    throw new Error(`Failed to fetch product categories: ${error.response?.data?.error || error.message}`);
  }
};

/**
 * PUT /productsapi/update_category/{category_id}/
 * Updates a product category by ID
 * 
 * @async
 * @function updateProductCategory
 * @param {number} categoryId - ID of the category to update
 * @param {CreateProductCategory} categoryData - Updated category data
 * @returns {Promise<ProductCategory>} Updated product category
 * @throws {Error} When API request fails or validation fails
 * 
 * @example
 * ```javascript
 * const updatedCategory = await updateProductCategory(123, {
 *   category: "Advanced Electronics",
 *   description: "Advanced electronic products"
 * });
 * ```
 */
export const updateProductCategory = async (categoryId, categoryData) => {
  try {
    console.log(`🛍️ [FETCHER] Updating product category ${categoryId}: ${categoryData.category}`);
    
    if (!categoryId || typeof categoryId !== 'number') {
      throw new Error('Category ID is required and must be a number');
    }

    const validation = CreateProductCategorySchema.safeParse(categoryData);
    if (!validation.success) {
      console.error('🛍️ [FETCHER] Update product category validation failed:', validation.error.issues);
      throw new Error(`Invalid category data: ${validation.error.issues.map(issue => issue.message).join(', ')}`);
    }

    const response = await axiosInstance.put(`${productsAPIendpoint}/update_category/${categoryId}/`, validation.data);
    
    // Validate response
    const categoryValidation = ProductCategorySchema.safeParse(response.data);
    if (!categoryValidation.success) {
      console.error('🛍️ [FETCHER] Update product category response validation failed:', categoryValidation.error.issues);
      throw new Error('Failed to validate updated category data from server');
    }
    
    console.log(`🛍️ [FETCHER] ✅ Successfully updated product category: ${categoryId}`);
    return categoryValidation.data;
  } catch (error) {
    console.error(`🛍️ [FETCHER] ❌ Failed to update product category ${categoryId}:`, error);
    throw new Error(`Failed to update product category: ${error.response?.data?.error || error.message}`);
  }
};

/**
 * DELETE /productsapi/delete_category/{category_id}/
 * Deletes a product category by ID
 * 
 * @async
 * @function deleteProductCategory
 * @param {number} categoryId - ID of the category to delete
 * @returns {Promise<{message: string}>} Success confirmation message
 * @throws {Error} When API request fails or validation fails
 * 
 * @example
 * ```javascript
 * const result = await deleteProductCategory(123);
 * console.log(result.message); // "Category deleted successfully"
 * ```
 */
export const deleteProductCategory = async (categoryId) => {
  try {
    console.log(`🛍️ [FETCHER] Deleting product category with ID: ${categoryId}`);
    
    if (!categoryId || typeof categoryId !== 'number') {
      throw new Error('Category ID is required and must be a number');
    }

    const response = await axiosInstance.delete(`${productsAPIendpoint}/delete_category/${categoryId}/`);
    
    console.log(`🛍️ [FETCHER] ✅ Successfully deleted product category: ${categoryId}`);
    return { message: 'Category deleted successfully' };
  } catch (error) {
    console.error(`🛍️ [FETCHER] ❌ Failed to delete product category ${categoryId}:`, error);
    throw new Error(`Failed to delete product category: ${error.response?.data?.error || error.message}`);
  }
};

// =============================================================================
// SUBCATEGORY MANAGEMENT ENDPOINTS
// =============================================================================

/**
 * POST /productsapi/create_subcategory/
 * Creates a new product subcategory
 * 
 * @async
 * @function createProductSubcategory
 * @param {CreateProductSubCategory} subcategoryData - Subcategory creation data
 * @returns {Promise<ProductSubCategory>} Created product subcategory
 * @throws {Error} When API request fails or validation fails
 * 
 * @example
 * ```javascript
 * const subcategory = await createProductSubcategory({
 *   subcategory: "Smartphones",
 *   category: 123
 * });
 * console.log(subcategory.id); // 456
 * ```
 */
export const createProductSubcategory = async (subcategoryData) => {
  try {
    console.log(`🛍️ [FETCHER] Creating product subcategory: ${subcategoryData.subcategory}`);
    
    const validation = CreateProductSubCategorySchema.safeParse(subcategoryData);
    if (!validation.success) {
      console.error('🛍️ [FETCHER] Create product subcategory validation failed:', validation.error.issues);
      throw new Error(`Invalid subcategory data: ${validation.error.issues.map(issue => issue.message).join(', ')}`);
    }

    const response = await axiosInstance.post(`${productsAPIendpoint}/create_subcategory/`, validation.data);
    
    // Validate response
    const subcategoryValidation = ProductSubCategorySchema.safeParse(response.data);
    if (!subcategoryValidation.success) {
      console.error('🛍️ [FETCHER] Create product subcategory response validation failed:', subcategoryValidation.error.issues);
      throw new Error('Failed to validate subcategory data from server');
    }
    
    console.log(`🛍️ [FETCHER] ✅ Successfully created product subcategory: ${subcategoryData.subcategory}`);
    return subcategoryValidation.data;
  } catch (error) {
    console.error(`🛍️ [FETCHER] ❌ Failed to create product subcategory ${subcategoryData.subcategory}:`, error);
    throw new Error(`Failed to create product subcategory: ${error.response?.data?.error || error.message}`);
  }
};

/**
 * GET /productsapi/subcategories/{category_id}/
 * Retrieves subcategories for a specific category
 * 
 * @async
 * @function getProductSubcategories
 * @param {number} categoryId - ID of the parent category
 * @returns {Promise<ProductSubCategory[]>} Array of product subcategories
 * @throws {Error} When API request fails or validation fails
 * 
 * @example
 * ```javascript
 * const subcategories = await getProductSubcategories(123);
 * console.log(`Found ${subcategories.length} subcategories`);
 * ```
 */
export const getProductSubcategories = async (categoryId) => {
  try {
    console.log(`🛍️ [FETCHER] Fetching product subcategories for category: ${categoryId}`);
    
    if (!categoryId || typeof categoryId !== 'number') {
      throw new Error('Category ID is required and must be a number');
    }

    const response = await axiosInstance.get(`${productsAPIendpoint}/subcategories/${categoryId}/`);
    
    // Validate response as array of subcategories
    const validation = z.array(ProductSubCategorySchema).safeParse(response.data);
    if (!validation.success) {
      console.error('🛍️ [FETCHER] Get product subcategories response validation failed:', validation.error.issues);
      throw new Error('Failed to validate subcategories data from server');
    }
    
    console.log(`🛍️ [FETCHER] ✅ Successfully fetched ${validation.data.length} product subcategories`);
    return validation.data;
  } catch (error) {
    console.error(`🛍️ [FETCHER] ❌ Failed to fetch product subcategories for category ${categoryId}:`, error);
    throw new Error(`Failed to fetch product subcategories: ${error.response?.data?.error || error.message}`);
  }
};

/**
 * GET /productsapi/subcategory/{subcategory_id}/
 * Retrieves a specific product subcategory by ID
 * 
 * @async
 * @function getProductSubcategory
 * @param {number} subcategoryId - ID of the subcategory to retrieve
 * @returns {Promise<ProductSubCategory>} Product subcategory object
 * @throws {Error} When API request fails or validation fails
 * 
 * @example
 * ```javascript
 * const subcategory = await getProductSubcategory(456);
 * console.log(subcategory.subcategory); // "Smartphones"
 * ```
 */
export const getProductSubcategory = async (subcategoryId) => {
  try {
    console.log(`🛍️ [FETCHER] Fetching product subcategory with ID: ${subcategoryId}`);
    
    if (!subcategoryId || typeof subcategoryId !== 'number') {
      throw new Error('Subcategory ID is required and must be a number');
    }

    const response = await axiosInstance.get(`${productsAPIendpoint}/subcategory/${subcategoryId}/`);
    
    // Validate response
    const validation = ProductSubCategorySchema.safeParse(response.data);
    if (!validation.success) {
      console.error('🛍️ [FETCHER] Get product subcategory response validation failed:', validation.error.issues);
      throw new Error('Failed to validate subcategory data from server');
    }
    
    console.log(`🛍️ [FETCHER] ✅ Successfully fetched product subcategory: ${subcategoryId}`);
    return validation.data;
  } catch (error) {
    console.error(`🛍️ [FETCHER] ❌ Failed to fetch product subcategory ${subcategoryId}:`, error);
    throw new Error(`Failed to fetch product subcategory: ${error.response?.data?.error || error.message}`);
  }
};

/**
 * PUT /productsapi/update_subcategory/{subcategory_id}/
 * Updates a product subcategory by ID
 * 
 * @async
 * @function updateProductSubcategory
 * @param {number} subcategoryId - ID of the subcategory to update
 * @param {CreateProductSubCategory} subcategoryData - Updated subcategory data
 * @returns {Promise<ProductSubCategory>} Updated product subcategory
 * @throws {Error} When API request fails or validation fails
 * 
 * @example
 * ```javascript
 * const updated = await updateProductSubcategory(456, {
 *   subcategory: "Premium Smartphones",
 *   category: 123
 * });
 * ```
 */
export const updateProductSubcategory = async (subcategoryId, subcategoryData) => {
  try {
    console.log(`🛍️ [FETCHER] Updating product subcategory ${subcategoryId}: ${subcategoryData.subcategory}`);
    
    if (!subcategoryId || typeof subcategoryId !== 'number') {
      throw new Error('Subcategory ID is required and must be a number');
    }

    const validation = CreateProductSubCategorySchema.safeParse(subcategoryData);
    if (!validation.success) {
      console.error('🛍️ [FETCHER] Update product subcategory validation failed:', validation.error.issues);
      throw new Error(`Invalid subcategory data: ${validation.error.issues.map(issue => issue.message).join(', ')}`);
    }

    const response = await axiosInstance.put(`${productsAPIendpoint}/update_subcategory/${subcategoryId}/`, validation.data);
    
    // Validate response
    const subcategoryValidation = ProductSubCategorySchema.safeParse(response.data);
    if (!subcategoryValidation.success) {
      console.error('🛍️ [FETCHER] Update product subcategory response validation failed:', subcategoryValidation.error.issues);
      throw new Error('Failed to validate updated subcategory data from server');
    }
    
    console.log(`🛍️ [FETCHER] ✅ Successfully updated product subcategory: ${subcategoryId}`);
    return subcategoryValidation.data;
  } catch (error) {
    console.error(`🛍️ [FETCHER] ❌ Failed to update product subcategory ${subcategoryId}:`, error);
    throw new Error(`Failed to update product subcategory: ${error.response?.data?.error || error.message}`);
  }
};

/**
 * DELETE /productsapi/delete_subcategory/{subcategory_id}/
 * Deletes a product subcategory by ID
 * 
 * @async
 * @function deleteProductSubcategory
 * @param {number} subcategoryId - ID of the subcategory to delete
 * @returns {Promise<{message: string}>} Success confirmation message
 * @throws {Error} When API request fails or validation fails
 * 
 * @example
 * ```javascript
 * const result = await deleteProductSubcategory(456);
 * console.log(result.message); // "Subcategory deleted successfully"
 * ```
 */
export const deleteProductSubcategory = async (subcategoryId) => {
  try {
    console.log(`🛍️ [FETCHER] Deleting product subcategory with ID: ${subcategoryId}`);
    
    if (!subcategoryId || typeof subcategoryId !== 'number') {
      throw new Error('Subcategory ID is required and must be a number');
    }

    const response = await axiosInstance.delete(`${productsAPIendpoint}/delete_subcategory/${subcategoryId}/`);
    
    console.log(`🛍️ [FETCHER] ✅ Successfully deleted product subcategory: ${subcategoryId}`);
    return { message: 'Subcategory deleted successfully' };
  } catch (error) {
    console.error(`🛍️ [FETCHER] ❌ Failed to delete product subcategory ${subcategoryId}:`, error);
    throw new Error(`Failed to delete product subcategory: ${error.response?.data?.error || error.message}`);
  }
};

// =============================================================================
// PRODUCT MANAGEMENT ENDPOINTS
// =============================================================================

/**
 * POST /productsapi/add-product/{organization_id}/
 * Creates a new product with file upload support
 * 
 * @async
 * @function addProduct
 * @param {Product} productData - Product creation data (may include files)
 * @returns {Promise<Product>} Created product object
 * @throws {Error} When API request fails or validation fails
 * 
 * @example
 * ```javascript
 * const product = await addProduct({
 *   name: "iPhone 15 Pro",
 *   description: "Latest iPhone with advanced features",
 *   category: 123,
 *   subcategory: 456,
 *   price: "999.99",
 *   image: imageFile
 * });
 * ```
 */
export const addProduct = async (productData) => {
  try {
    console.log(`🛍️ [FETCHER] Creating product: ${productData.name}`);
    
    if (!organizationId) {
      throw new Error('Organization ID is required but not found in environment variables');
    }

    // Convert to form data for file uploads
    const formData = converttoformData(productData, [
      "category",
      "subcategory",
      "userIDs_that_bought_this_product",
    ]);

    const response = await axiosInstance.post(
      `${productsAPIendpoint}/add-product/${organizationId}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    
    // Validate response
    const validation = ProductSchema.safeParse(response.data);
    if (!validation.success) {
      console.error('🛍️ [FETCHER] Add product response validation failed:', validation.error.issues);
      throw new Error('Failed to validate product data from server');
    }
    
    console.log(`🛍️ [FETCHER] ✅ Successfully created product: ${productData.name}`);
    return validation.data;
  } catch (error) {
    console.error(`🛍️ [FETCHER] ❌ Failed to create product ${productData.name}:`, error);
    throw new Error(`Failed to create product: ${error.response?.data?.error || error.message}`);
  }
};

/**
 * GET /productsapi/products/{organization_id}/
 * Retrieves all products for an organization
 * 
 * @async
 * @function getProducts
 * @returns {Promise<ProductArray>} Array of product objects
 * @throws {Error} When API request fails or validation fails
 * 
 * @example
 * ```javascript
 * const products = await getProducts();
 * console.log(`Found ${products.length} products`);
 * ```
 */
export const getProducts = async () => {
  try {
    console.log('🛍️ [FETCHER] Fetching organization products');
    
    if (!organizationId) {
      throw new Error('Organization ID is required but not found in environment variables');
    }

    const response = await axiosInstance.get(`${productsAPIendpoint}/products/${organizationId}/`);
    
    // Validate response
    const validation = ProductsSchema.safeParse(response.data);
    if (!validation.success) {
      console.error('🛍️ [FETCHER] Get products response validation failed:', validation.error.issues);
      throw new Error('Failed to validate products data from server');
    }
    
    console.log(`🛍️ [FETCHER] ✅ Successfully fetched ${validation.data.length} products`);
    return validation.data;
  } catch (error) {
    console.error('🛍️ [FETCHER] ❌ Failed to fetch products:', error);
    throw new Error(`Failed to fetch products: ${error.response?.data?.error || error.message}`);
  }
};

/**
 * GET /productsapi/product/{product_id}/
 * Retrieves a specific product by ID
 * 
 * @async
 * @function getProduct
 * @param {number} productId - ID of the product to retrieve
 * @returns {Promise<Product>} Product object
 * @throws {Error} When API request fails or validation fails
 * 
 * @example
 * ```javascript
 * const product = await getProduct(789);
 * console.log(product.name); // "iPhone 15 Pro"
 * ```
 */
export const getProduct = async (productId) => {
  try {
    console.log(`🛍️ [FETCHER] Fetching product with ID: ${productId}`);
    
    if (!productId || typeof productId !== 'number') {
      throw new Error('Product ID is required and must be a number');
    }

    const response = await axiosInstance.get(`${productsAPIendpoint}/product/${productId}/`);
    
    // Validate response
    const validation = ProductSchema.safeParse(response.data);
    if (!validation.success) {
      console.error('🛍️ [FETCHER] Get product response validation failed:', validation.error.issues);
      throw new Error('Failed to validate product data from server');
    }
    
    console.log(`🛍️ [FETCHER] ✅ Successfully fetched product: ${productId}`);
    return validation.data;
  } catch (error) {
    console.error(`🛍️ [FETCHER] ❌ Failed to fetch product ${productId}:`, error);
    throw new Error(`Failed to fetch product: ${error.response?.data?.error || error.message}`);
  }
};

/**
 * GET /productsapi/trendingproducts/{organization_id}/
 * Retrieves trending products for an organization
 * 
 * @async
 * @function getTrendingProducts
 * @returns {Promise<ProductArray>} Array of trending product objects
 * @throws {Error} When API request fails or validation fails
 * 
 * @example
 * ```javascript
 * const trendingProducts = await getTrendingProducts();
 * console.log(`Found ${trendingProducts.length} trending products`);
 * ```
 */
export const getTrendingProducts = async () => {
  try {
    console.log('🛍️ [FETCHER] Fetching trending products');
    
    if (!organizationId) {
      throw new Error('Organization ID is required but not found in environment variables');
    }

    const response = await axiosInstance.get(`${productsAPIendpoint}/trendingproducts/${organizationId}/`);
    
    // Validate response
    const validation = ProductsSchema.safeParse(response.data);
    if (!validation.success) {
      console.error('🛍️ [FETCHER] Get trending products response validation failed:', validation.error.issues);
      throw new Error('Failed to validate trending products data from server');
    }
    
    console.log(`🛍️ [FETCHER] ✅ Successfully fetched ${validation.data.length} trending products`);
    return validation.data;
  } catch (error) {
    console.error('🛍️ [FETCHER] ❌ Failed to fetch trending products:', error);
    throw new Error(`Failed to fetch trending products: ${error.response?.data?.error || error.message}`);
  }
};

/**
 * GET /productsapi/userboughtproducts/{organization_id}/{user_id}/
 * Retrieves products purchased by a specific user
 * 
 * @async
 * @function getUserBoughtProducts
 * @param {number} userId - ID of the user
 * @returns {Promise<ProductArray>} Array of products purchased by the user
 * @throws {Error} When API request fails or validation fails
 * 
 * @example
 * ```javascript
 * const userProducts = await getUserBoughtProducts(123);
 * console.log(`User has purchased ${userProducts.length} products`);
 * ```
 */
export const getUserBoughtProducts = async (userId) => {
  try {
    console.log(`🛍️ [FETCHER] Fetching products bought by user: ${userId}`);
    
    if (!userId || typeof userId !== 'number') {
      throw new Error('User ID is required and must be a number');
    }

    if (!organizationId) {
      throw new Error('Organization ID is required but not found in environment variables');
    }

    const response = await axiosInstance.get(`${productsAPIendpoint}/userboughtproducts/${organizationId}/${userId}/`);
    
    // Validate response
    const validation = ProductsSchema.safeParse(response.data);
    if (!validation.success) {
      console.error('🛍️ [FETCHER] Get user bought products response validation failed:', validation.error.issues);
      throw new Error('Failed to validate user products data from server');
    }
    
    console.log(`🛍️ [FETCHER] ✅ Successfully fetched ${validation.data.length} products for user ${userId}`);
    return validation.data;
  } catch (error) {
    console.error(`🛍️ [FETCHER] ❌ Failed to fetch products for user ${userId}:`, error);
    throw new Error(`Failed to fetch user products: ${error.response?.data?.error || error.message}`);
  }
};

/**
 * PUT /productsapi/update-product/{product_id}/
 * Updates a product by ID with file upload support
 * 
 * @async
 * @function updateProduct
 * @param {number} productId - ID of the product to update
 * @param {Product} productData - Updated product data (may include files)
 * @returns {Promise<Product>} Updated product object
 * @throws {Error} When API request fails or validation fails
 * 
 * @example
 * ```javascript
 * const updated = await updateProduct(789, {
 *   name: "iPhone 15 Pro Max",
 *   description: "Larger screen iPhone with advanced features",
 *   price: "1199.99"
 * });
 * ```
 */
export const updateProduct = async (productId, productData) => {
  try {
    console.log(`🛍️ [FETCHER] Updating product ${productId}: ${productData.name}`);
    
    if (!productId || typeof productId !== 'number') {
      throw new Error('Product ID is required and must be a number');
    }

    // Convert to form data for file uploads
    const formData = converttoformData(productData, [
      "category",
      "subcategory",
      "userIDs_that_bought_this_product",
    ]);

    const response = await axiosInstance.put(
      `${productsAPIendpoint}/update-product/${productId}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    
    // Validate response
    const validation = ProductSchema.safeParse(response.data);
    if (!validation.success) {
      console.error('🛍️ [FETCHER] Update product response validation failed:', validation.error.issues);
      throw new Error('Failed to validate updated product data from server');
    }
    
    console.log(`🛍️ [FETCHER] ✅ Successfully updated product: ${productId}`);
    return validation.data;
  } catch (error) {
    console.error(`🛍️ [FETCHER] ❌ Failed to update product ${productId}:`, error);
    throw new Error(`Failed to update product: ${error.response?.data?.error || error.message}`);
  }
};

/**
 * DELETE /productsapi/delete-product/{product_id}/
 * Deletes a product by ID
 * 
 * @async
 * @function deleteProduct
 * @param {number} productId - ID of the product to delete
 * @returns {Promise<{message: string}>} Success confirmation message
 * @throws {Error} When API request fails or validation fails
 * 
 * @example
 * ```javascript
 * const result = await deleteProduct(789);
 * console.log(result.message); // "Product deleted successfully"
 * ```
 */
export const deleteProduct = async (productId) => {
  try {
    console.log(`🛍️ [FETCHER] Deleting product with ID: ${productId}`);
    
    if (!productId || typeof productId !== 'number') {
      throw new Error('Product ID is required and must be a number');
    }

    const response = await axiosInstance.delete(`${productsAPIendpoint}/delete-product/${productId}/`);
    
    console.log(`🛍️ [FETCHER] ✅ Successfully deleted product: ${productId}`);
    return { message: 'Product deleted successfully' };
  } catch (error) {
    console.error(`🛍️ [FETCHER] ❌ Failed to delete product ${productId}:`, error);
    throw new Error(`Failed to delete product: ${error.response?.data?.error || error.message}`);
  }
};

// =============================================================================
// LEGACY FUNCTION ALIASES - For backward compatibility
// =============================================================================

/** @deprecated Use getProducts instead */
export const fetchProducts = getProducts;

/** @deprecated Use getProduct instead */
export const fetchProduct = getProduct;

/** @deprecated Use addProduct instead */
export const createProduct = addProduct;

/** @deprecated Use getProductCategories instead */
export const fetchProductCategories = getProductCategories;

/** @deprecated Use getProductSubcategories instead */
export const fetchProductSubcategories = getProductSubcategories;

/** @deprecated Use getTrendingProducts instead */
export const fetchTrendingProducts = getTrendingProducts;

/** @deprecated Use getUserBoughtProducts instead */
export const fetchUserBoughtProducts = getUserBoughtProducts;

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Checks if the axios instance is properly configured
 * @returns {boolean} Configuration validity
 */
export const isAxiosConfigured = () => {
  return !!(axiosInstance && axiosInstance.defaults.baseURL);
};

/**
 * Gets the current axios configuration
 * @returns {Object} Current axios configuration
 */
export const getAxiosConfig = () => {
  return {
    baseURL: axiosInstance.defaults.baseURL,
    timeout: axiosInstance.defaults.timeout,
    headers: axiosInstance.defaults.headers,
  };
};
