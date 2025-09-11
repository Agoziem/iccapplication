/**
 * @fileoverview Enhanced Video Management API Integration
 * 
 * Comprehensive API integration for video content management following strict
 * API documentation compliance. Implements all 17 documented videosapi endpoints with
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
 * @requires ../schemas/items - Video validation schemas
 * @requires ../../utils/formutils - Form data conversion utilities
 */

/**
 * @typedef {import('zod').infer<typeof VideoSchema>} Video
 * @typedef {import('zod').infer<typeof VideosSchema>} VideoArray
 * @typedef {import('zod').infer<typeof PaginatedVideoResponseSchema>} PaginatedVideoResponse
 * @typedef {import('zod').infer<typeof VideoCategorySchema>} VideoCategory
 * @typedef {import('zod').infer<typeof VideoSubCategorySchema>} VideoSubCategory
 * @typedef {import('zod').infer<typeof CreateVideoCategorySchema>} CreateVideoCategory
 * @typedef {import('zod').infer<typeof CreateVideoSubCategorySchema>} CreateVideoSubCategory
 * @typedef {{message: string}} SuccessResponse
 * @typedef {{error: string}} ErrorResponse
 */

import axios from "axios";
import { z } from "zod";
import {
  VideoSchema,
  VideosSchema,
  PaginatedVideoResponseSchema,
  VideoCategorySchema,
  VideoCategoriesSchema,
  VideoSubCategorySchema,
  CreateVideoCategorySchema,
  CreateVideoSubCategorySchema,
} from "@/schemas/items";
import { converttoformData } from "@/utils/formutils";

// =============================================================================
// SIMPLE RESPONSE SCHEMAS - For success/error responses
// =============================================================================

/**
 * Success Response Schema for video operations
 */
const SuccessResponseSchema = z.object({
  message: z.string().min(1),
});

/**
 * Error Response Schema for video operations
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
    console.log(`📹 [VIDEO-API] ${config.method?.toUpperCase()} ${config.url}`, {
      data: config.data ? (config.data instanceof FormData ? '***FORM_DATA***' : '***DATA***') : 'No data',
      headers: config.headers,
    });
    return config;
  },
  (error) => {
    console.error('📹 [VIDEO-API] Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for debugging and error handling
 */
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`📹 [VIDEO-API] ✅ ${response.status} ${response.config.url}`, {
      status: response.status,
      data: response.data ? 'Response received' : 'No data',
    });
    return response;
  },
  (error) => {
    console.error(`📹 [VIDEO-API] ❌ ${error.response?.status || 'Network Error'} ${error.config?.url}`, {
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
 * Videos API endpoint base path
 * @type {string}
 */
export const videosAPIendpoint = "/vidoesapi";

// =============================================================================
// CATEGORY MANAGEMENT ENDPOINTS
// =============================================================================

/**
 * POST /vidoesapi/add_category/
 * Creates a new video category
 * 
 * @async
 * @function addVideoCategory
 * @param {CreateVideoCategory} categoryData - Category creation data
 * @returns {Promise<VideoCategory>} Created video category
 * @throws {Error} When API request fails or validation fails
 * 
 * @example
 * ```javascript
 * const category = await addVideoCategory({
 *   category: "Educational",
 *   description: "Educational video content"
 * });
 * console.log(category.id); // 123
 * ```
 */
export const addVideoCategory = async (categoryData) => {
  try {
    console.log(`📹 [FETCHER] Creating video category: ${categoryData.category}`);
    
    const validation = CreateVideoCategorySchema.safeParse(categoryData);
    if (!validation.success) {
      console.error('📹 [FETCHER] Add video category validation failed:', validation.error.issues);
      throw new Error(`Invalid category data: ${validation.error.issues.map(issue => issue.message).join(', ')}`);
    }

    const response = await axiosInstance.post(`${videosAPIendpoint}/add_category/`, validation.data);
    
    // Validate response
    const categoryValidation = VideoCategorySchema.safeParse(response.data);
    if (!categoryValidation.success) {
      console.error('📹 [FETCHER] Add video category response validation failed:', categoryValidation.error.issues);
      throw new Error('Failed to validate category data from server');
    }
    
    console.log(`📹 [FETCHER] ✅ Successfully created video category: ${categoryData.category}`);
    return categoryValidation.data;
  } catch (error) {
    console.error(`📹 [FETCHER] ❌ Failed to create video category ${categoryData.category}:`, error);
    throw new Error(`Failed to create video category: ${error.response?.data?.error || error.message}`);
  }
};

/**
 * GET /vidoesapi/categories/
 * Retrieves all video categories
 * 
 * @async
 * @function getVideoCategories
 * @returns {Promise<VideoCategory[]>} Array of video categories
 * @throws {Error} When API request fails or validation fails
 * 
 * @example
 * ```javascript
 * const categories = await getVideoCategories();
 * console.log(`Found ${categories.length} categories`);
 * ```
 */
export const getVideoCategories = async () => {
  try {
    console.log('📹 [FETCHER] Fetching video categories');
    
    const response = await axiosInstance.get(`${videosAPIendpoint}/categories/`);
    
    // Validate response
    const validation = VideoCategoriesSchema.safeParse(response.data);
    if (!validation.success) {
      console.error('📹 [FETCHER] Get video categories response validation failed:', validation.error.issues);
      throw new Error('Failed to validate categories data from server');
    }
    
    console.log(`📹 [FETCHER] ✅ Successfully fetched ${validation.data.length} video categories`);
    return validation.data;
  } catch (error) {
    console.error('📹 [FETCHER] ❌ Failed to fetch video categories:', error);
    throw new Error(`Failed to fetch video categories: ${error.response?.data?.error || error.message}`);
  }
};

/**
 * PUT /vidoesapi/update_category/{category_id}/
 * Updates a video category by ID
 * 
 * @async
 * @function updateVideoCategory
 * @param {number} categoryId - ID of the category to update
 * @param {CreateVideoCategory} categoryData - Updated category data
 * @returns {Promise<VideoCategory>} Updated video category
 * @throws {Error} When API request fails or validation fails
 * 
 * @example
 * ```javascript
 * const updatedCategory = await updateVideoCategory(123, {
 *   category: "Advanced Educational",
 *   description: "Advanced educational content"
 * });
 * ```
 */
export const updateVideoCategory = async (categoryId, categoryData) => {
  try {
    console.log(`📹 [FETCHER] Updating video category ${categoryId}: ${categoryData.category}`);
    
    if (!categoryId || typeof categoryId !== 'number') {
      throw new Error('Category ID is required and must be a number');
    }

    const validation = CreateVideoCategorySchema.safeParse(categoryData);
    if (!validation.success) {
      console.error('📹 [FETCHER] Update video category validation failed:', validation.error.issues);
      throw new Error(`Invalid category data: ${validation.error.issues.map(issue => issue.message).join(', ')}`);
    }

    const response = await axiosInstance.put(`${videosAPIendpoint}/update_category/${categoryId}/`, validation.data);
    
    // Validate response
    const categoryValidation = VideoCategorySchema.safeParse(response.data);
    if (!categoryValidation.success) {
      console.error('📹 [FETCHER] Update video category response validation failed:', categoryValidation.error.issues);
      throw new Error('Failed to validate updated category data from server');
    }
    
    console.log(`📹 [FETCHER] ✅ Successfully updated video category: ${categoryId}`);
    return categoryValidation.data;
  } catch (error) {
    console.error(`📹 [FETCHER] ❌ Failed to update video category ${categoryId}:`, error);
    throw new Error(`Failed to update video category: ${error.response?.data?.error || error.message}`);
  }
};

/**
 * DELETE /vidoesapi/delete_category/{category_id}/
 * Deletes a video category by ID
 * 
 * @async
 * @function deleteVideoCategory
 * @param {number} categoryId - ID of the category to delete
 * @returns {Promise<{message: string}>} Success confirmation message
 * @throws {Error} When API request fails or validation fails
 * 
 * @example
 * ```javascript
 * const result = await deleteVideoCategory(123);
 * console.log(result.message); // "Category deleted successfully"
 * ```
 */
export const deleteVideoCategory = async (categoryId) => {
  try {
    console.log(`📹 [FETCHER] Deleting video category with ID: ${categoryId}`);
    
    if (!categoryId || typeof categoryId !== 'number') {
      throw new Error('Category ID is required and must be a number');
    }

    const response = await axiosInstance.delete(`${videosAPIendpoint}/delete_category/${categoryId}/`);
    
    console.log(`📹 [FETCHER] ✅ Successfully deleted video category: ${categoryId}`);
    return { message: 'Category deleted successfully' };
  } catch (error) {
    console.error(`📹 [FETCHER] ❌ Failed to delete video category ${categoryId}:`, error);
    throw new Error(`Failed to delete video category: ${error.response?.data?.error || error.message}`);
  }
};

// =============================================================================
// SUBCATEGORY MANAGEMENT ENDPOINTS
// =============================================================================

/**
 * POST /vidoesapi/create_subcategory/
 * Creates a new video subcategory
 * 
 * @async
 * @function createVideoSubcategory
 * @param {CreateVideoSubCategory} subcategoryData - Subcategory creation data
 * @returns {Promise<VideoSubCategory>} Created video subcategory
 * @throws {Error} When API request fails or validation fails
 * 
 * @example
 * ```javascript
 * const subcategory = await createVideoSubcategory({
 *   subcategory: "Mathematics",
 *   category: 123
 * });
 * console.log(subcategory.id); // 456
 * ```
 */
export const createVideoSubcategory = async (subcategoryData) => {
  try {
    console.log(`📹 [FETCHER] Creating video subcategory: ${subcategoryData.subcategory}`);
    
    const validation = CreateVideoSubCategorySchema.safeParse(subcategoryData);
    if (!validation.success) {
      console.error('📹 [FETCHER] Create video subcategory validation failed:', validation.error.issues);
      throw new Error(`Invalid subcategory data: ${validation.error.issues.map(issue => issue.message).join(', ')}`);
    }

    const response = await axiosInstance.post(`${videosAPIendpoint}/create_subcategory/`, validation.data);
    
    // Validate response
    const subcategoryValidation = VideoSubCategorySchema.safeParse(response.data);
    if (!subcategoryValidation.success) {
      console.error('📹 [FETCHER] Create video subcategory response validation failed:', subcategoryValidation.error.issues);
      throw new Error('Failed to validate subcategory data from server');
    }
    
    console.log(`📹 [FETCHER] ✅ Successfully created video subcategory: ${subcategoryData.subcategory}`);
    return subcategoryValidation.data;
  } catch (error) {
    console.error(`📹 [FETCHER] ❌ Failed to create video subcategory ${subcategoryData.subcategory}:`, error);
    throw new Error(`Failed to create video subcategory: ${error.response?.data?.error || error.message}`);
  }
};

/**
 * GET /vidoesapi/subcategories/{category_id}/
 * Retrieves subcategories for a specific category
 * 
 * @async
 * @function getVideoSubcategories
 * @param {number} categoryId - ID of the parent category
 * @returns {Promise<VideoSubCategory[]>} Array of video subcategories
 * @throws {Error} When API request fails or validation fails
 * 
 * @example
 * ```javascript
 * const subcategories = await getVideoSubcategories(123);
 * console.log(`Found ${subcategories.length} subcategories`);
 * ```
 */
export const getVideoSubcategories = async (categoryId) => {
  try {
    console.log(`📹 [FETCHER] Fetching video subcategories for category: ${categoryId}`);
    
    if (!categoryId || typeof categoryId !== 'number') {
      throw new Error('Category ID is required and must be a number');
    }

    const response = await axiosInstance.get(`${videosAPIendpoint}/subcategories/${categoryId}/`);
    
    // Validate response as array of subcategories
    const validation = z.array(VideoSubCategorySchema).safeParse(response.data);
    if (!validation.success) {
      console.error('📹 [FETCHER] Get video subcategories response validation failed:', validation.error.issues);
      throw new Error('Failed to validate subcategories data from server');
    }
    
    console.log(`📹 [FETCHER] ✅ Successfully fetched ${validation.data.length} video subcategories`);
    return validation.data;
  } catch (error) {
    console.error(`📹 [FETCHER] ❌ Failed to fetch video subcategories for category ${categoryId}:`, error);
    throw new Error(`Failed to fetch video subcategories: ${error.response?.data?.error || error.message}`);
  }
};

/**
 * GET /vidoesapi/subcategory/{subcategory_id}/
 * Retrieves a specific video subcategory by ID
 * 
 * @async
 * @function getVideoSubcategory
 * @param {number} subcategoryId - ID of the subcategory to retrieve
 * @returns {Promise<VideoSubCategory>} Video subcategory object
 * @throws {Error} When API request fails or validation fails
 * 
 * @example
 * ```javascript
 * const subcategory = await getVideoSubcategory(456);
 * console.log(subcategory.subcategory); // "Mathematics"
 * ```
 */
export const getVideoSubcategory = async (subcategoryId) => {
  try {
    console.log(`📹 [FETCHER] Fetching video subcategory with ID: ${subcategoryId}`);
    
    if (!subcategoryId || typeof subcategoryId !== 'number') {
      throw new Error('Subcategory ID is required and must be a number');
    }

    const response = await axiosInstance.get(`${videosAPIendpoint}/subcategory/${subcategoryId}/`);
    
    // Validate response
    const validation = VideoSubCategorySchema.safeParse(response.data);
    if (!validation.success) {
      console.error('📹 [FETCHER] Get video subcategory response validation failed:', validation.error.issues);
      throw new Error('Failed to validate subcategory data from server');
    }
    
    console.log(`📹 [FETCHER] ✅ Successfully fetched video subcategory: ${subcategoryId}`);
    return validation.data;
  } catch (error) {
    console.error(`📹 [FETCHER] ❌ Failed to fetch video subcategory ${subcategoryId}:`, error);
    throw new Error(`Failed to fetch video subcategory: ${error.response?.data?.error || error.message}`);
  }
};

/**
 * PUT /vidoesapi/update_subcategory/{subcategory_id}/
 * Updates a video subcategory by ID
 * 
 * @async
 * @function updateVideoSubcategory
 * @param {number} subcategoryId - ID of the subcategory to update
 * @param {CreateVideoSubCategory} subcategoryData - Updated subcategory data
 * @returns {Promise<VideoSubCategory>} Updated video subcategory
 * @throws {Error} When API request fails or validation fails
 * 
 * @example
 * ```javascript
 * const updated = await updateVideoSubcategory(456, {
 *   subcategory: "Advanced Mathematics",
 *   category: 123
 * });
 * ```
 */
export const updateVideoSubcategory = async (subcategoryId, subcategoryData) => {
  try {
    console.log(`📹 [FETCHER] Updating video subcategory ${subcategoryId}: ${subcategoryData.subcategory}`);
    
    if (!subcategoryId || typeof subcategoryId !== 'number') {
      throw new Error('Subcategory ID is required and must be a number');
    }

    const validation = CreateVideoSubCategorySchema.safeParse(subcategoryData);
    if (!validation.success) {
      console.error('📹 [FETCHER] Update video subcategory validation failed:', validation.error.issues);
      throw new Error(`Invalid subcategory data: ${validation.error.issues.map(issue => issue.message).join(', ')}`);
    }

    const response = await axiosInstance.put(`${videosAPIendpoint}/update_subcategory/${subcategoryId}/`, validation.data);
    
    // Validate response
    const subcategoryValidation = VideoSubCategorySchema.safeParse(response.data);
    if (!subcategoryValidation.success) {
      console.error('📹 [FETCHER] Update video subcategory response validation failed:', subcategoryValidation.error.issues);
      throw new Error('Failed to validate updated subcategory data from server');
    }
    
    console.log(`📹 [FETCHER] ✅ Successfully updated video subcategory: ${subcategoryId}`);
    return subcategoryValidation.data;
  } catch (error) {
    console.error(`📹 [FETCHER] ❌ Failed to update video subcategory ${subcategoryId}:`, error);
    throw new Error(`Failed to update video subcategory: ${error.response?.data?.error || error.message}`);
  }
};

/**
 * DELETE /vidoesapi/delete_subcategory/{subcategory_id}/
 * Deletes a video subcategory by ID
 * 
 * @async
 * @function deleteVideoSubcategory
 * @param {number} subcategoryId - ID of the subcategory to delete
 * @returns {Promise<{message: string}>} Success confirmation message
 * @throws {Error} When API request fails or validation fails
 * 
 * @example
 * ```javascript
 * const result = await deleteVideoSubcategory(456);
 * console.log(result.message); // "Subcategory deleted successfully"
 * ```
 */
export const deleteVideoSubcategory = async (subcategoryId) => {
  try {
    console.log(`📹 [FETCHER] Deleting video subcategory with ID: ${subcategoryId}`);
    
    if (!subcategoryId || typeof subcategoryId !== 'number') {
      throw new Error('Subcategory ID is required and must be a number');
    }

    const response = await axiosInstance.delete(`${videosAPIendpoint}/delete_subcategory/${subcategoryId}/`);
    
    console.log(`📹 [FETCHER] ✅ Successfully deleted video subcategory: ${subcategoryId}`);
    return { message: 'Subcategory deleted successfully' };
  } catch (error) {
    console.error(`📹 [FETCHER] ❌ Failed to delete video subcategory ${subcategoryId}:`, error);
    throw new Error(`Failed to delete video subcategory: ${error.response?.data?.error || error.message}`);
  }
};

// =============================================================================
// VIDEO MANAGEMENT ENDPOINTS
// =============================================================================

/**
 * POST /vidoesapi/add_video/{organization_id}/
 * Creates a new video with file upload support
 * 
 * @async
 * @function addVideo
 * @param {Video} videoData - Video creation data (may include files)
 * @returns {Promise<Video>} Created video object
 * @throws {Error} When API request fails or validation fails
 * 
 * @example
 * ```javascript
 * const video = await addVideo({
 *   title: "Introduction to React",
 *   description: "Learn React fundamentals",
 *   category: 123,
 *   subcategory: 456,
 *   price: "29.99",
 *   video: videoFile,
 *   thumbnail: thumbnailFile
 * });
 * ```
 */
export const addVideo = async (videoData) => {
  try {
    console.log(`📹 [FETCHER] Creating video: ${videoData.title}`);
    
    if (!organizationId) {
      throw new Error('Organization ID is required but not found in environment variables');
    }

    // Convert to form data for file uploads
    const formData = converttoformData(videoData, [
      "category",
      "subcategory",
      "userIDs_that_bought_this_video",
    ]);

    const response = await axiosInstance.post(
      `${videosAPIendpoint}/add_video/${organizationId}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    
    // Validate response
    const validation = VideoSchema.safeParse(response.data);
    if (!validation.success) {
      console.error('📹 [FETCHER] Add video response validation failed:', validation.error.issues);
      throw new Error('Failed to validate video data from server');
    }
    
    console.log(`📹 [FETCHER] ✅ Successfully created video: ${videoData.title}`);
    return validation.data;
  } catch (error) {
    console.error(`📹 [FETCHER] ❌ Failed to create video ${videoData.title}:`, error);
    throw new Error(`Failed to create video: ${error.response?.data?.error || error.message}`);
  }
};

/**
 * GET /vidoesapi/videos/{organization_id}/
 * Retrieves all videos for an organization
 * 
 * @async
 * @function getVideos
 * @returns {Promise<PaginatedVideoResponse>} Array of video objects
 * @throws {Error} When API request fails or validation fails
 * 
 * @example
 * ```javascript
 * const videos = await getVideos();
 * console.log(`Found ${videos.length} videos`);
 * ```
 */
export const getVideos = async (params) => {
  try {
    console.log('📹 [FETCHER] Fetching organization videos');
    
    if (!organizationId) {
      throw new Error('Organization ID is required but not found in environment variables');
    }

    const response = await axiosInstance.get(`${videosAPIendpoint}/videos/${organizationId}/`, { params });
    
    // Validate response
    const validation = PaginatedVideoResponseSchema.safeParse(response.data);
    if (!validation.success) {
      console.error('📹 [FETCHER] Get videos response validation failed:', validation.error.issues);
      throw new Error('Failed to validate videos data from server');
    }

    console.log(`📹 [FETCHER] ✅ Successfully fetched ${validation.data.results.length} videos`);
    return validation.data;
  } catch (error) {
    console.error('📹 [FETCHER] ❌ Failed to fetch videos:', error);
    throw new Error(`Failed to fetch videos: ${error.response?.data?.error || error.message}`);
  }
};

/**
 * GET /vidoesapi/video/{video_id}/
 * Retrieves a specific video by ID
 * 
 * @async
 * @function getVideo
 * @param {number} videoId - ID of the video to retrieve
 * @returns {Promise<Video>} Video object
 * @throws {Error} When API request fails or validation fails
 * 
 * @example
 * ```javascript
 * const video = await getVideo(789);
 * console.log(video.title); // "Introduction to React"
 * ```
 */
export const getVideo = async (videoId) => {
  try {
    console.log(`📹 [FETCHER] Fetching video with ID: ${videoId}`);
    
    if (!videoId || typeof videoId !== 'number') {
      throw new Error('Video ID is required and must be a number');
    }

    const response = await axiosInstance.get(`${videosAPIendpoint}/video/${videoId}/`);
    
    // Validate response
    const validation = VideoSchema.safeParse(response.data);
    if (!validation.success) {
      console.error('📹 [FETCHER] Get video response validation failed:', validation.error.issues);
      throw new Error('Failed to validate video data from server');
    }
    
    console.log(`📹 [FETCHER] ✅ Successfully fetched video: ${videoId}`);
    return validation.data;
  } catch (error) {
    console.error(`📹 [FETCHER] ❌ Failed to fetch video ${videoId}:`, error);
    throw new Error(`Failed to fetch video: ${error.response?.data?.error || error.message}`);
  }
};

/**
 * GET /vidoesapi/video_by_token/{videotoken}/
 * Retrieves a video by its access token
 * 
 * @async
 * @function getVideoByToken
 * @param {string} videoToken - Token for video access
 * @returns {Promise<Video>} Video object
 * @throws {Error} When API request fails or validation fails
 * 
 * @example
 * ```javascript
 * const video = await getVideoByToken("abc123xyz");
 * console.log(video.title); // "Introduction to React"
 * ```
 */
export const getVideoByToken = async (videoToken) => {
  try {
    console.log(`📹 [FETCHER] Fetching video by token: ${videoToken.substring(0, 10)}...`);
    
    if (!videoToken || typeof videoToken !== 'string') {
      throw new Error('Video token is required and must be a string');
    }

    const response = await axiosInstance.get(`${videosAPIendpoint}/video_by_token/${videoToken}/`);
    
    // Validate response
    const validation = VideoSchema.safeParse(response.data);
    if (!validation.success) {
      console.error('📹 [FETCHER] Get video by token response validation failed:', validation.error.issues);
      throw new Error('Failed to validate video data from server');
    }
    
    console.log(`📹 [FETCHER] ✅ Successfully fetched video by token`);
    return validation.data;
  } catch (error) {
    console.error(`📹 [FETCHER] ❌ Failed to fetch video by token:`, error);
    throw new Error(`Failed to fetch video by token: ${error.response?.data?.error || error.message}`);
  }
};

/**
 * GET /vidoesapi/trendingvideos/{organization_id}/
 * Retrieves trending videos for an organization
 * 
 * @async
 * @function getTrendingVideos
 * @returns {Promise<VideoArray>} Array of trending video objects
 * @throws {Error} When API request fails or validation fails
 * 
 * @example
 * ```javascript
 * const trendingVideos = await getTrendingVideos();
 * console.log(`Found ${trendingVideos.length} trending videos`);
 * ```
 */
export const getTrendingVideos = async () => {
  try {
    console.log('📹 [FETCHER] Fetching trending videos');
    
    if (!organizationId) {
      throw new Error('Organization ID is required but not found in environment variables');
    }

    const response = await axiosInstance.get(`${videosAPIendpoint}/trendingvideos/${organizationId}/`);
    
    // Validate response
    const validation = VideosSchema.safeParse(response.data);
    if (!validation.success) {
      console.error('📹 [FETCHER] Get trending videos response validation failed:', validation.error.issues);
      throw new Error('Failed to validate trending videos data from server');
    }
    
    console.log(`📹 [FETCHER] ✅ Successfully fetched ${validation.data.length} trending videos`);
    return validation.data;
  } catch (error) {
    console.error('📹 [FETCHER] ❌ Failed to fetch trending videos:', error);
    throw new Error(`Failed to fetch trending videos: ${error.response?.data?.error || error.message}`);
  }
};

/**
 * GET /vidoesapi/userboughtvideos/{organization_id}/{user_id}/
 * Retrieves videos purchased by a specific user
 * 
 * @async
 * @function getUserBoughtVideos
 * @param {number} userId - ID of the user
 * @returns {Promise<VideoArray>} Array of videos purchased by the user
 * @throws {Error} When API request fails or validation fails
 * 
 * @example
 * ```javascript
 * const userVideos = await getUserBoughtVideos(123);
 * console.log(`User has purchased ${userVideos.length} videos`);
 * ```
 */
export const getUserBoughtVideos = async (userId) => {
  try {
    console.log(`📹 [FETCHER] Fetching videos bought by user: ${userId}`);
    
    if (!userId || typeof userId !== 'number') {
      throw new Error('User ID is required and must be a number');
    }

    if (!organizationId) {
      throw new Error('Organization ID is required but not found in environment variables');
    }

    const response = await axiosInstance.get(`${videosAPIendpoint}/userboughtvideos/${organizationId}/${userId}/`);
    
    // Validate response
    const validation = VideosSchema.safeParse(response.data);
    if (!validation.success) {
      console.error('📹 [FETCHER] Get user bought videos response validation failed:', validation.error.issues);
      throw new Error('Failed to validate user videos data from server');
    }
    
    console.log(`📹 [FETCHER] ✅ Successfully fetched ${validation.data.length} videos for user ${userId}`);
    return validation.data;
  } catch (error) {
    console.error(`📹 [FETCHER] ❌ Failed to fetch videos for user ${userId}:`, error);
    throw new Error(`Failed to fetch user videos: ${error.response?.data?.error || error.message}`);
  }
};

/**
 * PUT /vidoesapi/update_video/{video_id}/
 * Updates a video by ID with file upload support
 * 
 * @async
 * @function updateVideo
 * @param {number} videoId - ID of the video to update
 * @param {Video} videoData - Updated video data (may include files)
 * @returns {Promise<Video>} Updated video object
 * @throws {Error} When API request fails or validation fails
 * 
 * @example
 * ```javascript
 * const updated = await updateVideo(789, {
 *   title: "Advanced React Concepts",
 *   description: "Deep dive into React",
 *   price: "39.99"
 * });
 * ```
 */
export const updateVideo = async (videoId, videoData) => {
  try {
    console.log(`📹 [FETCHER] Updating video ${videoId}: ${videoData.title}`);
    
    if (!videoId || typeof videoId !== 'number') {
      throw new Error('Video ID is required and must be a number');
    }

    // Convert to form data for file uploads
    const formData = converttoformData(videoData, [
      "category",
      "subcategory",
      "userIDs_that_bought_this_video",
    ]);

    const response = await axiosInstance.put(
      `${videosAPIendpoint}/update_video/${videoId}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    
    // Validate response
    const validation = VideoSchema.safeParse(response.data);
    if (!validation.success) {
      console.error('📹 [FETCHER] Update video response validation failed:', validation.error.issues);
      throw new Error('Failed to validate updated video data from server');
    }
    
    console.log(`📹 [FETCHER] ✅ Successfully updated video: ${videoId}`);
    return validation.data;
  } catch (error) {
    console.error(`📹 [FETCHER] ❌ Failed to update video ${videoId}:`, error);
    throw new Error(`Failed to update video: ${error.response?.data?.error || error.message}`);
  }
};

/**
 * DELETE /vidoesapi/delete_video/{video_id}/
 * Deletes a video by ID
 * 
 * @async
 * @function deleteVideo
 * @param {number} videoId - ID of the video to delete
 * @returns {Promise<{message: string}>} Success confirmation message
 * @throws {Error} When API request fails or validation fails
 * 
 * @example
 * ```javascript
 * const result = await deleteVideo(789);
 * console.log(result.message); // "Video deleted successfully"
 * ```
 */
export const deleteVideo = async (videoId) => {
  try {
    console.log(`📹 [FETCHER] Deleting video with ID: ${videoId}`);
    
    if (!videoId || typeof videoId !== 'number') {
      throw new Error('Video ID is required and must be a number');
    }

    const response = await axiosInstance.delete(`${videosAPIendpoint}/delete_video/${videoId}/`);
    
    console.log(`📹 [FETCHER] ✅ Successfully deleted video: ${videoId}`);
    return { message: 'Video deleted successfully' };
  } catch (error) {
    console.error(`📹 [FETCHER] ❌ Failed to delete video ${videoId}:`, error);
    throw new Error(`Failed to delete video: ${error.response?.data?.error || error.message}`);
  }
};

// =============================================================================
// LEGACY FUNCTION ALIASES - For backward compatibility
// =============================================================================

/** @deprecated Use getVideos instead */
export const fetchVideos = getVideos;

/** @deprecated Use getVideo instead */
export const fetchVideo = getVideo;

/** @deprecated Use addVideo instead */
export const createVideo = addVideo;

/** @deprecated Use getVideoCategories instead */
export const fetchVideoCategories = getVideoCategories;

/** @deprecated Use getVideoSubcategories instead */
export const fetchVideoSubcategories = getVideoSubcategories;

/** @deprecated Use getTrendingVideos instead */
export const fetchTrendingVideos = getTrendingVideos;

/** @deprecated Use getUserBoughtVideos instead */
export const fetchUserBoughtVideos = getUserBoughtVideos;

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


