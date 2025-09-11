/**
 * @fileoverview Services API Fetcher Functions
 * 
 * Comprehensive API integration for services module following strict API documentation.
 * Implements all documented servicesapi endpoints with enhanced error handling,
 * validation, and production-grade features.
 * 
 * Features:
 * - Enhanced axios configuration with timeouts and interceptors
 * - Comprehensive Zod schema validation
 * - Production-grade error handling and logging
 * - Full TypeScript compatibility with JSDoc documentation
 * - Strict compliance with documented API endpoints only
 * 
 * @version 2.0.0
 * @author Innovation CyberCafe Team
 * @typedef {import('@/types/users').User} User
 */

import { 
  ServiceSchema, 
  ServicesSchema,
  ServiceCategorySchema,
  ServiceSubCategorySchema,
  ServiceCategoriesSchema,
  CreateServiceCategorySchema,
  CreateServiceSubCategorySchema
} from "@/schemas/items";
import { UserSchema, UsersSchema } from "@/schemas/users";
import { converttoformData } from "@/utils/formutils";
import { z } from "zod";
import axios from "axios";

// =================== AXIOS CONFIGURATION =================== //

/**
 * Enhanced axios instance with production-grade configuration
 * Features timeouts, interceptors, and comprehensive error handling
 */
export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}`,
  timeout: 15000, // 15 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging and auth
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`🏢 [SERVICES API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('🏢 [SERVICES API] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`🏢 [SERVICES API] ✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    return response;
  },
  (error) => {
    const errorMsg = error.response?.data?.detail || error.response?.data?.error || error.message;
    console.error(`🏢 [SERVICES API] ❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status || 'Network Error'}: ${errorMsg}`);
    return Promise.reject(error);
  }
);

// =================== CONFIGURATION =================== //

const Organizationid = process.env.NEXT_PUBLIC_ORGANIZATION_ID;
export const servicesAPIendpoint = "/servicesapi";

// =================== CORE SERVICE OPERATIONS =================== //

/**
 * GET /servicesapi/services/{organization_id}/
 * Fetch all services for an organization
 * 
 * @async
 * @function fetchServices
 * @param {Object} params - Query parameters for filtering, pagination, etc.
 * @returns {Promise<Service[]>} Array of service objects with validation
 * @throws {Error} When API request fails or validation errors occur
 */
export const fetchServices = async (params) => {
  try {
    const response = await axiosInstance.get(`${servicesAPIendpoint}/services/${Organizationid}/`, { params });
    
    const validation = ServicesSchema.safeParse(response.data);
    if (!validation.success) {
      console.error('🏢 [FETCHER] Services validation error:', validation.error.issues);
      throw new Error('Invalid services data structure received from server');
    }
    
    console.log(`🏢 [FETCHER] Successfully fetched ${validation.data.length} services`);
    return validation.data;
  } catch (error) {
    console.error('🏢 [FETCHER] Error fetching services:', error);
    throw error;
  }
};

/**
 * GET /servicesapi/service/{service_id}/
 * Fetch a single service by ID
 * 
 * @async
 * @function fetchService
 * @param {number} serviceId - Service ID to retrieve
 * @returns {Promise<Service>} Service object with validation
 * @throws {Error} When service not found or validation fails
 */
export const fetchService = async (serviceId) => {
  try {
    if (!serviceId) {
      throw new Error('Service ID is required');
    }
    
    const response = await axiosInstance.get(`${servicesAPIendpoint}/service/${serviceId}/`);
    
    const validation = ServiceSchema.safeParse(response.data);
    if (!validation.success) {
      console.error('🏢 [FETCHER] Single service validation error:', validation.error.issues);
      throw new Error('Invalid service data structure received from server');
    }
    
    console.log(`🏢 [FETCHER] Successfully fetched service: ${serviceId}`);
    return validation.data;
  } catch (error) {
    console.error(`🏢 [FETCHER] Error fetching service ${serviceId}:`, error);
    throw error;
  }
};

/**
 * GET /servicesapi/service_by_token/{servicetoken}/
 * Fetch a service by its token
 * 
 * @async
 * @function fetchServiceByToken
 * @param {string} serviceToken - Service token to retrieve
 * @returns {Promise<Service>} Service object with validation
 * @throws {Error} When service not found or validation fails
 */
export const fetchServiceByToken = async (serviceToken) => {
  try {
    if (!serviceToken) {
      throw new Error('Service token is required');
    }
    
    const response = await axiosInstance.get(`${servicesAPIendpoint}/service_by_token/${serviceToken}/`);
    
    const validation = ServiceSchema.safeParse(response.data);
    if (!validation.success) {
      console.error('🏢 [FETCHER] Service by token validation error:', validation.error.issues);
      throw new Error('Invalid service data structure received from server');
    }
    
    console.log(`🏢 [FETCHER] Successfully fetched service by token: ${serviceToken}`);
    return validation.data;
  } catch (error) {
    console.error(`🏢 [FETCHER] Error fetching service by token ${serviceToken}:`, error);
    throw error;
  }
};

/**
 * GET /servicesapi/trendingservices/{organization_id}/
 * Fetch trending services for an organization
 * 
 * @async
 * @function fetchTrendingServices
 * @param {number} organizationId - Organization ID
 * @returns {Promise<Service[]>} Array of trending service objects
 * @throws {Error} When API request fails or validation errors occur
 */
export const fetchTrendingServices = async (organizationId = parseInt(Organizationid)) => {
  try {
    const response = await axiosInstance.get(`${servicesAPIendpoint}/trendingservices/${organizationId}/`);
    
    const validation = ServicesSchema.safeParse(response.data);
    if (!validation.success) {
      console.error('🏢 [FETCHER] Trending services validation error:', validation.error.issues);
      throw new Error('Invalid trending services data structure received from server');
    }
    
    console.log(`🏢 [FETCHER] Successfully fetched ${validation.data.length} trending services`);
    return validation.data;
  } catch (error) {
    console.error('🏢 [FETCHER] Error fetching trending services:', error);
    throw error;
  }
};

/**
 * POST /servicesapi/add_service/{organization_id}/
 * Create a new service
 * 
 * @async
 * @function createService
 * @param {Object} data - Service creation data
 * @returns {Promise<Service>} Created service object with validation
 * @throws {Error} When validation fails or creation unsuccessful
 */
export const createService = async (data) => {
  try {
    const formData = converttoformData(data, [
      "category",
      "subcategory", 
      "userIDs_that_bought_this_service",
      "userIDs_whose_services_is_in_progress",
      "userIDs_whose_services_have_been_completed"
    ]);
    
    const response = await axiosInstance.post(
      `${servicesAPIendpoint}/add_service/${parseInt(Organizationid)}/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    const validation = ServiceSchema.safeParse(response.data);
    if (!validation.success) {
      console.error('🏢 [FETCHER] Create service validation error:', validation.error.issues);
      throw new Error('Invalid service data received from server');
    }
    
    console.log(`🏢 [FETCHER] Successfully created service with ID: ${validation.data.id}`);
    return validation.data;
  } catch (error) {
    console.error('🏢 [FETCHER] Error creating service:', error);
    throw error;
  }
};

/**
 * PUT /servicesapi/update_service/{service_id}/
 * Update an existing service
 * 
 * @async
 * @function updateService
 * @param {number} serviceId - Service ID to update
 * @param {Object} data - Service update data (partial)
 * @returns {Promise<Service>} Updated service object with validation
 * @throws {Error} When service not found or validation fails
 */
export const updateService = async (serviceId, data) => {
  try {
    if (!serviceId) {
      throw new Error('Service ID is required for update');
    }
    
    const formData = converttoformData(data, [
      "category",
      "subcategory",
      "userIDs_that_bought_this_service",
      "userIDs_whose_services_is_in_progress",
      "userIDs_whose_services_have_been_completed"
    ]);
    
    const response = await axiosInstance.put(
      `${servicesAPIendpoint}/update_service/${serviceId}/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    const validation = ServiceSchema.safeParse(response.data);
    if (!validation.success) {
      console.error('🏢 [FETCHER] Update service validation error:', validation.error.issues);
      throw new Error('Invalid service data received from server');
    }
    
    console.log(`🏢 [FETCHER] Successfully updated service: ${serviceId}`);
    return validation.data;
  } catch (error) {
    console.error(`🏢 [FETCHER] Error updating service ${serviceId}:`, error);
    throw error;
  }
};

/**
 * DELETE /servicesapi/delete_service/{service_id}/
 * Delete a service
 * 
 * @async
 * @function deleteService
 * @param {number} serviceId - Service ID to delete
 * @returns {Promise<number>} Deleted service ID for confirmation
 * @throws {Error} When service not found or deletion fails
 */
export const deleteService = async (serviceId) => {
  try {
    if (!serviceId) {
      throw new Error('Service ID is required for deletion');
    }
    
    await axiosInstance.delete(`${servicesAPIendpoint}/delete_service/${serviceId}/`);
    
    console.log(`🏢 [FETCHER] Successfully deleted service: ${serviceId}`);
    return serviceId;
  } catch (error) {
    console.error(`🏢 [FETCHER] Error deleting service ${serviceId}:`, error);
    throw error;
  }
};

// =================== SERVICE USER MANAGEMENT =================== //

/**
 * GET /servicesapi/servicesusers/{service_id}/
 * Fetch all users associated with a service
 * 
 * @async
 * @function fetchServiceUsers
 * @param {number} serviceId - Service ID
 * @returns {Promise<Object[]>} Array of users with validation
 * @throws {Error} When service not found or validation fails
 */
export const fetchServiceUsers = async (serviceId) => {
  try {
    if (!serviceId) {
      throw new Error('Service ID is required');
    }
    
    const response = await axiosInstance.get(`${servicesAPIendpoint}/servicesusers/${serviceId}/`);
    
    const validation = UsersSchema.safeParse(response.data);
    if (!validation.success) {
      console.error('🏢 [FETCHER] Service users validation error:', validation.error.issues);
      throw new Error('Invalid service users data structure received from server');
    }
    
    console.log(`🏢 [FETCHER] Successfully fetched ${validation.data.length} users for service: ${serviceId}`);
    return validation.data;
  } catch (error) {
    console.error(`🏢 [FETCHER] Error fetching service users for ${serviceId}:`, error);
    throw error;
  }
};

/**
 * GET /servicesapi/servicesusers/{service_id}/in-progress/
 * Fetch users with services in progress
 * 
 * @async
 * @function fetchServiceUsersInProgress
 * @param {number} serviceId - Service ID
 * @returns {Promise<Object[]>} Array of users with services in progress
 * @throws {Error} When service not found or validation fails
 */
export const fetchServiceUsersInProgress = async (serviceId) => {
  try {
    if (!serviceId) {
      throw new Error('Service ID is required');
    }
    
    const response = await axiosInstance.get(`${servicesAPIendpoint}/servicesusers/${serviceId}/in-progress/`);
    
    const validation = UsersSchema.safeParse(response.data);
    if (!validation.success) {
      console.error('🏢 [FETCHER] Service users in progress validation error:', validation.error.issues);
      throw new Error('Invalid service users data structure received from server');
    }
    
    console.log(`🏢 [FETCHER] Successfully fetched ${validation.data.length} users with services in progress: ${serviceId}`);
    return validation.data;
  } catch (error) {
    console.error(`🏢 [FETCHER] Error fetching service users in progress for ${serviceId}:`, error);
    throw error;
  }
};

/**
 * GET /servicesapi/servicesusers/{service_id}/completed/
 * Fetch users with completed services
 * 
 * @async
 * @function fetchServiceUsersCompleted
 * @param {number} serviceId - Service ID
 * @returns {Promise<Object[]>} Array of users with completed services
 * @throws {Error} When service not found or validation fails
 */
export const fetchServiceUsersCompleted = async (serviceId) => {
  try {
    if (!serviceId) {
      throw new Error('Service ID is required');
    }
    
    const response = await axiosInstance.get(`${servicesAPIendpoint}/servicesusers/${serviceId}/completed/`);
    
    const validation = UsersSchema.safeParse(response.data);
    if (!validation.success) {
      console.error('🏢 [FETCHER] Service users completed validation error:', validation.error.issues);
      throw new Error('Invalid service users data structure received from server');
    }
    
    console.log(`🏢 [FETCHER] Successfully fetched ${validation.data.length} users with completed services: ${serviceId}`);
    return validation.data;
  } catch (error) {
    console.error(`🏢 [FETCHER] Error fetching service users completed for ${serviceId}:`, error);
    throw error;
  }
};

/**
 * GET /servicesapi/userboughtservices/{organization_id}/{user_id}/
 * Fetch services bought by a user in an organization
 * 
 * @async
 * @function fetchUserBoughtServices
 * @param {number} organizationId - Organization ID
 * @param {number} userId - User ID
 * @returns {Promise<Service[]>} Array of services bought by user
 * @throws {Error} When user or organization not found or validation fails
 */
export const fetchUserBoughtServices = async (organizationId, userId) => {
  try {
    if (!organizationId || !userId) {
      throw new Error('Organization ID and User ID are required');
    }
    
    const response = await axiosInstance.get(`${servicesAPIendpoint}/userboughtservices/${organizationId}/${userId}/`);
    
    const validation = ServicesSchema.safeParse(response.data);
    if (!validation.success) {
      console.error('🏢 [FETCHER] User bought services validation error:', validation.error.issues);
      throw new Error('Invalid user bought services data structure received from server');
    }
    
    console.log(`🏢 [FETCHER] Successfully fetched ${validation.data.length} services bought by user: ${userId}`);
    return validation.data;
  } catch (error) {
    console.error(`🏢 [FETCHER] Error fetching services bought by user ${userId}:`, error);
    throw error;
  }
};

/**
 * POST /servicesapi/services/{service_id}/{user_id}/add-to-progress/
 * Add user to service progress
 * 
 * @async
 * @function addUserToServiceProgress
 * @param {number} serviceId - Service ID
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Server response data
 * @throws {Error} When operation fails
 */
export const addUserToServiceProgress = async (serviceId, userId) => {
  try {
    if (!serviceId || !userId) {
      throw new Error('Service ID and User ID are required');
    }
    
    const response = await axiosInstance.post(`${servicesAPIendpoint}/services/${serviceId}/${userId}/add-to-progress/`);
    
    console.log(`🏢 [FETCHER] Successfully added user ${userId} to service ${serviceId} progress`);
    return response.data;
  } catch (error) {
    console.error(`🏢 [FETCHER] Error adding user ${userId} to service ${serviceId} progress:`, error);
    throw error;
  }
};

/**
 * POST /servicesapi/services/{service_id}/{user_id}/add-to-completed/
 * Add user to service completed
 * 
 * @async
 * @function addUserToServiceCompleted
 * @param {number} serviceId - Service ID
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Server response data
 * @throws {Error} When operation fails
 */
export const addUserToServiceCompleted = async (serviceId, userId) => {
  try {
    if (!serviceId || !userId) {
      throw new Error('Service ID and User ID are required');
    }
    
    const response = await axiosInstance.post(`${servicesAPIendpoint}/services/${serviceId}/${userId}/add-to-completed/`);
    
    console.log(`🏢 [FETCHER] Successfully added user ${userId} to service ${serviceId} completed`);
    return response.data;
  } catch (error) {
    console.error(`🏢 [FETCHER] Error adding user ${userId} to service ${serviceId} completed:`, error);
    throw error;
  }
};

/**
 * POST /servicesapi/services/{service_id}/{user_id}/remove-from-progress/
 * Remove user from service progress
 * 
 * @async
 * @function removeUserFromServiceProgress
 * @param {number} serviceId - Service ID
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Server response data
 * @throws {Error} When operation fails
 */
export const removeUserFromServiceProgress = async (serviceId, userId) => {
  try {
    if (!serviceId || !userId) {
      throw new Error('Service ID and User ID are required');
    }
    
    const response = await axiosInstance.post(`${servicesAPIendpoint}/services/${serviceId}/${userId}/remove-from-progress/`);
    
    console.log(`🏢 [FETCHER] Successfully removed user ${userId} from service ${serviceId} progress`);
    return response.data;
  } catch (error) {
    console.error(`🏢 [FETCHER] Error removing user ${userId} from service ${serviceId} progress:`, error);
    throw error;
  }
};

/**
 * POST /servicesapi/services/{service_id}/{user_id}/remove-from-completed/
 * Remove user from service completed
 * 
 * @async
 * @function removeUserFromServiceCompleted
 * @param {number} serviceId - Service ID
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Server response data
 * @throws {Error} When operation fails
 */
export const removeUserFromServiceCompleted = async (serviceId, userId) => {
  try {
    if (!serviceId || !userId) {
      throw new Error('Service ID and User ID are required');
    }
    
    const response = await axiosInstance.post(`${servicesAPIendpoint}/services/${serviceId}/${userId}/remove-from-completed/`);
    
    console.log(`🏢 [FETCHER] Successfully removed user ${userId} from service ${serviceId} completed`);
    return response.data;
  } catch (error) {
    console.error(`🏢 [FETCHER] Error removing user ${userId} from service ${serviceId} completed:`, error);
    throw error;
  }
};

/**
 * GET /servicesapi/categories/
 * Fetch all service categories
 * 
 * @async
 * @function fetchServiceCategories
 * @returns {Promise<ServiceCategory[]>} Array of service categories
 * @throws {Error} When API request fails or validation errors occur
 */
export const fetchServiceCategories = async () => {
  try {
    const response = await axiosInstance.get(`${servicesAPIendpoint}/categories/`);
    
    const validation = ServiceCategoriesSchema.safeParse(response.data);
    if (!validation.success) {
      console.error('🏢 [FETCHER] Service categories validation error:', validation.error.issues);
      throw new Error('Invalid service categories data structure received from server');
    }
    
    console.log(`🏢 [FETCHER] Successfully fetched ${validation.data.length} service categories`);
    return validation.data;
  } catch (error) {
    console.error('🏢 [FETCHER] Error fetching service categories:', error);
    throw error;
  }
};

/**
 * GET /servicesapi/subcategories/{category_id}/
 * Fetch subcategories for a specific category
 * 
 * @async
 * @function fetchServiceSubcategories
 * @param {number} categoryId - Category ID
 * @returns {Promise<ServiceSubCategory[]>} Array of subcategories
 * @throws {Error} When category not found or validation fails
 */
export const fetchServiceSubcategories = async (categoryId) => {
  try {
    if (!categoryId) {
      throw new Error('Category ID is required');
    }
    
    const response = await axiosInstance.get(`${servicesAPIendpoint}/subcategories/${categoryId}/`);
    
    // Assuming the API returns an array of subcategories
    const SubcategoriesSchema = z.array(ServiceSubCategorySchema);
    const validation = SubcategoriesSchema.safeParse(response.data);
    if (!validation.success) {
      console.error('🏢 [FETCHER] Service subcategories validation error:', validation.error.issues);
      throw new Error('Invalid service subcategories data structure received from server');
    }
    
    console.log(`🏢 [FETCHER] Successfully fetched ${validation.data.length} subcategories for category: ${categoryId}`);
    return validation.data;
  } catch (error) {
    console.error(`🏢 [FETCHER] Error fetching subcategories for category ${categoryId}:`, error);
    throw error;
  }
};

/**
 * GET /servicesapi/subcategory/{subcategory_id}/
 * Fetch a single subcategory by ID
 * 
 * @async
 * @function fetchServiceSubcategory
 * @param {number} subcategoryId - Subcategory ID
 * @returns {Promise<ServiceSubCategory>} Subcategory object
 * @throws {Error} When subcategory not found or validation fails
 */
export const fetchServiceSubcategory = async (subcategoryId) => {
  try {
    if (!subcategoryId) {
      throw new Error('Subcategory ID is required');
    }
    
    const response = await axiosInstance.get(`${servicesAPIendpoint}/subcategory/${subcategoryId}/`);
    
    const validation = ServiceSubCategorySchema.safeParse(response.data);
    if (!validation.success) {
      console.error('🏢 [FETCHER] Service subcategory validation error:', validation.error.issues);
      throw new Error('Invalid service subcategory data structure received from server');
    }
    
    console.log(`🏢 [FETCHER] Successfully fetched subcategory: ${subcategoryId}`);
    return validation.data;
  } catch (error) {
    console.error(`🏢 [FETCHER] Error fetching subcategory ${subcategoryId}:`, error);
    throw error;
  }
};

/**
 * POST /servicesapi/add_category/
 * Create a new service category
 * 
 * @async
 * @function createServiceCategory
 * @param {Object} data - Category creation data
 * @returns {Promise<ServiceCategory>} Created category object
 * @throws {Error} When validation fails or creation unsuccessful
 */
export const createServiceCategory = async (data) => {
  try {
    const inputValidation = CreateServiceCategorySchema.safeParse(data);
    if (!inputValidation.success) {
      console.error('🏢 [FETCHER] Create category input validation error:', inputValidation.error.issues);
      throw new Error('Invalid category creation data');
    }
    
    const response = await axiosInstance.post(`${servicesAPIendpoint}/add_category/`, inputValidation.data);
    
    const validation = ServiceCategorySchema.safeParse(response.data);
    if (!validation.success) {
      console.error('🏢 [FETCHER] Create category response validation error:', validation.error.issues);
      throw new Error('Invalid category data received from server');
    }
    
    console.log(`🏢 [FETCHER] Successfully created service category with ID: ${validation.data.id}`);
    return validation.data;
  } catch (error) {
    console.error('🏢 [FETCHER] Error creating service category:', error);
    throw error;
  }
};

/**
 * POST /servicesapi/create_subcategory/
 * Create a new service subcategory
 * 
 * @async
 * @function createServiceSubcategory
 * @param {Object} data - Subcategory creation data
 * @returns {Promise<ServiceSubCategory>} Created subcategory object
 * @throws {Error} When validation fails or creation unsuccessful
 */
export const createServiceSubcategory = async (data) => {
  try {
    const inputValidation = CreateServiceSubCategorySchema.safeParse(data);
    if (!inputValidation.success) {
      console.error('🏢 [FETCHER] Create subcategory input validation error:', inputValidation.error.issues);
      throw new Error('Invalid subcategory creation data');
    }
    
    const response = await axiosInstance.post(`${servicesAPIendpoint}/create_subcategory/`, inputValidation.data);
    
    const validation = ServiceSubCategorySchema.safeParse(response.data);
    if (!validation.success) {
      console.error('🏢 [FETCHER] Create subcategory response validation error:', validation.error.issues);
      throw new Error('Invalid subcategory data received from server');
    }
    
    console.log(`🏢 [FETCHER] Successfully created service subcategory with ID: ${validation.data.id}`);
    return validation.data;
  } catch (error) {
    console.error('🏢 [FETCHER] Error creating service subcategory:', error);
    throw error;
  }
};

/**
 * PUT /servicesapi/update_category/{category_id}/
 * Update an existing service category
 * 
 * @async
 * @function updateServiceCategory
 * @param {number} categoryId - Category ID to update
 * @param {Object} data - Category update data
 * @returns {Promise<ServiceCategory>} Updated category object
 * @throws {Error} When category not found or validation fails
 */
export const updateServiceCategory = async (categoryId, data) => {
  try {
    if (!categoryId) {
      throw new Error('Category ID is required for update');
    }
    
    const inputValidation = CreateServiceCategorySchema.safeParse(data);
    if (!inputValidation.success) {
      console.error('🏢 [FETCHER] Update category input validation error:', inputValidation.error.issues);
      throw new Error('Invalid category update data');
    }
    
    const response = await axiosInstance.put(`${servicesAPIendpoint}/update_category/${categoryId}/`, inputValidation.data);
    
    const validation = ServiceCategorySchema.safeParse(response.data);
    if (!validation.success) {
      console.error('🏢 [FETCHER] Update category response validation error:', validation.error.issues);
      throw new Error('Invalid category data received from server');
    }
    
    console.log(`🏢 [FETCHER] Successfully updated service category: ${categoryId}`);
    return validation.data;
  } catch (error) {
    console.error(`🏢 [FETCHER] Error updating service category ${categoryId}:`, error);
    throw error;
  }
};

/**
 * PUT /servicesapi/update_subcategory/{subcategory_id}/
 * Update an existing service subcategory
 * 
 * @async
 * @function updateServiceSubcategory
 * @param {number} subcategoryId - Subcategory ID to update
 * @param {Object} data - Subcategory update data
 * @returns {Promise<ServiceSubCategory>} Updated subcategory object
 * @throws {Error} When subcategory not found or validation fails
 */
export const updateServiceSubcategory = async (subcategoryId, data) => {
  try {
    if (!subcategoryId) {
      throw new Error('Subcategory ID is required for update');
    }
    
    const inputValidation = CreateServiceSubCategorySchema.safeParse(data);
    if (!inputValidation.success) {
      console.error('🏢 [FETCHER] Update subcategory input validation error:', inputValidation.error.issues);
      throw new Error('Invalid subcategory update data');
    }
    
    const response = await axiosInstance.put(`${servicesAPIendpoint}/update_subcategory/${subcategoryId}/`, inputValidation.data);
    
    const validation = ServiceSubCategorySchema.safeParse(response.data);
    if (!validation.success) {
      console.error('🏢 [FETCHER] Update subcategory response validation error:', validation.error.issues);
      throw new Error('Invalid subcategory data received from server');
    }
    
    console.log(`🏢 [FETCHER] Successfully updated service subcategory: ${subcategoryId}`);
    return validation.data;
  } catch (error) {
    console.error(`🏢 [FETCHER] Error updating service subcategory ${subcategoryId}:`, error);
    throw error;
  }
};

/**
 * DELETE /servicesapi/delete_category/{category_id}/
 * Delete a service category
 * 
 * @async
 * @function deleteServiceCategory
 * @param {number} categoryId - Category ID to delete
 * @returns {Promise<number>} Deleted category ID for confirmation
 * @throws {Error} When category not found or deletion fails
 */
export const deleteServiceCategory = async (categoryId) => {
  try {
    if (!categoryId) {
      throw new Error('Category ID is required for deletion');
    }
    
    await axiosInstance.delete(`${servicesAPIendpoint}/delete_category/${categoryId}/`);
    
    console.log(`🏢 [FETCHER] Successfully deleted service category: ${categoryId}`);
    return categoryId;
  } catch (error) {
    console.error(`🏢 [FETCHER] Error deleting service category ${categoryId}:`, error);
    throw error;
  }
};

/**
 * DELETE /servicesapi/delete_subcategory/{subcategory_id}/
 * Delete a service subcategory
 * 
 * @async
 * @function deleteServiceSubcategory
 * @param {number} subcategoryId - Subcategory ID to delete
 * @returns {Promise<number>} Deleted subcategory ID for confirmation
 * @throws {Error} When subcategory not found or deletion fails
 */
export const deleteServiceSubcategory = async (subcategoryId) => {
  try {
    if (!subcategoryId) {
      throw new Error('Subcategory ID is required for deletion');
    }
    
    await axiosInstance.delete(`${servicesAPIendpoint}/delete_subcategory/${subcategoryId}/`);
    
    console.log(`🏢 [FETCHER] Successfully deleted service subcategory: ${subcategoryId}`);
    return subcategoryId;
  } catch (error) {
    console.error(`🏢 [FETCHER] Error deleting service subcategory ${subcategoryId}:`, error);
    throw error;
  }
};

// =================== LEGACY FUNCTION ALIASES =================== //

/** @deprecated Use updateService instead */
export const addService = createService;