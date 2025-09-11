import axios from "axios";
import {
  ArticleResponseSchema,
  ArticleSchema,
  categoryArraySchema,
  commentResponseSchema,
  commentSchema,
  createCommentSchema,
  updateCommentSchema,
  createCategorySchema,
} from "@/schemas/articles";
import { converttoformData } from "@/utils/formutils";

/**
 * Axios instance configured with base URL for ICC API
 * Provides HTTP client functionality with pre-configured base URL and error handling
 * @type {import('axios').AxiosInstance}
 * @see {@link https://axios-http.com/docs/instance} - Axios Instance Documentation
 * @example
 * ```javascript
 * const response = await axiosInstance.get('/blogsapi/getCategories/');
 * ```
 */
export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}`,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Organization ID from environment variables
 * Used for organization-specific API calls
 * @type {string}
 * @throws {Error} Throws error if NEXT_PUBLIC_ORGANIZATION_ID is not defined
 */
const Organizationid = (() => {
  const orgId = process.env.NEXT_PUBLIC_ORGANIZATION_ID;
  if (!orgId) {
    throw new Error('NEXT_PUBLIC_ORGANIZATION_ID environment variable is required');
  }
  return orgId;
})();

/**
 * Base API endpoint for blog/article operations
 * All blog-related API calls are prefixed with this endpoint
 * @type {string}
 * @readonly
 * @see {@link http://127.0.0.1:8000/swagger/} - API Documentation
 */
export const articleAPIendpoint = "/blogsapi";

// ====================================================================
// BLOG CATEGORY FETCHER AND MUTATION FUNCTIONS
// ====================================================================
// Handles all CRUD operations for blog categories including:
// - Fetching all categories
// - Creating new categories
// - Updating existing categories
// - Deleting categories
// All functions include comprehensive validation and error handling

/**
 * Fetches all blog categories from the API
 * Retrieves the complete list of blog categories available in the system
 * 
 * @async
 * @function fetchArticlesCategories
 * @param {string} [url="/blogsapi/getCategories/"] - API endpoint URL for categories
 * @returns {Promise<BlogCategories>} Promise resolving to array of blog categories
 * @throws {Error} Throws error when API request fails or validation fails
 * 
 * @see {@link http://127.0.0.1:8000/swagger/#!/blogsapi/blogsapi_getCategories_list} - API Documentation
 * 
 * @example
 * ```javascript
 * // Fetch all categories
 * const categories = await fetchArticlesCategories();
 * console.log(categories); 
 * // Output: [{ id: 1, category: "Technology", description: "Tech articles" }]
 * 
 * // Fetch with custom URL
 * const categories = await fetchArticlesCategories('/blogsapi/getCategories/');
 * ```
 * 
 * @example
 * ```javascript
 * // Error handling
 * try {
 *   const categories = await fetchArticlesCategories();
 *   setCategories(categories);
 * } catch (error) {
 *   console.error('Failed to fetch categories:', error.message);
 *   setError('Unable to load categories');
 * }
 * ```
 */
export const fetchArticlesCategories = async (url = `${articleAPIendpoint}/getCategories/`) => {
  try {
    const response = await axiosInstance.get(url);
    const validation = categoryArraySchema.safeParse(response.data);
    
    if (!validation.success) {
      console.error("Categories validation failed:", validation.error.issues);
      throw new Error("Failed to validate categories data: " + validation.error.issues.map(issue => issue.message).join(', '));
    }
    
    return validation.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error("Categories not found - endpoint may not exist");
    }
    if (error.response?.status >= 500) {
      throw new Error("Server error while fetching categories");
    }
    throw error;
  }
};

/**
 * Creates a new blog category
 * Validates input data and sends a POST request to create a new blog category.
 * The category will be available for use in blog posts after creation.
 * 
 * @async
 * @function createArticleCategory
 * @param {Object} categoryData - Category data to create
 * @param {string|null} [categoryData.category] - Category name (max 100 characters)
 * @returns {Promise<BlogCategory>} Promise resolving to the created category object
 * @throws {Error} Throws error when validation fails or API request fails
 * 
 * @see {@link http://127.0.0.1:8000/swagger/#!/blogsapi/blogsapi_addCategory_create} - API Documentation
 * 
 * @example
 * ```javascript
 * // Create a new category
 * const newCategory = await createArticleCategory({ 
 *   category: "Technology" 
 * });
 * console.log(newCategory);
 * // Output: { id: 1, category: "Technology", description: "" }
 * ```
 * 
 * @example
 * ```javascript
 * // Error handling for category creation
 * try {
 *   const category = await createArticleCategory({ category: "Science" });
 *   toast.success(`Category '${category.category}' created successfully`);
 * } catch (error) {
 *   console.error('Category creation failed:', error.message);
 *   toast.error('Failed to create category');
 * }
 * ```
 */
export const createArticleCategory = async (categoryData) => {
  try {
    const validation = createCategorySchema.safeParse(categoryData);
    if (!validation.success) {
      console.error("Category creation validation failed:", validation.error.issues);
      throw new Error("Invalid category data: " + validation.error.issues.map(issue => issue.message).join(', '));
    }

    const response = await axiosInstance.post(
      `${articleAPIendpoint}/addCategory/`,
      validation.data
    );
    
    const categoryValidation = categoryArraySchema.element.safeParse(response.data);
    if (!categoryValidation.success) {
      console.error("Category response validation failed:", categoryValidation.error.issues);
      throw new Error("Failed to validate created category: " + categoryValidation.error.issues.map(issue => issue.message).join(', '));
    }
    
    return categoryValidation.data;
  } catch (error) {
    if (error.response?.status === 400) {
      throw new Error("Bad request - invalid category data provided");
    }
    if (error.response?.status >= 500) {
      throw new Error("Server error while creating category");
    }
    throw error;
  }
};

/**
 * Updates an existing blog category
 * Modifies an existing blog category with new data. All fields are optional except the category ID.
 * 
 * @async
 * @function updateArticleCategory
 * @param {number} categoryId - ID of the category to update (required)
 * @param {Object} categoryData - Updated category data
 * @param {string|null} [categoryData.category] - Updated category name (max 100 characters)
 * @returns {Promise<BlogCategory>} Promise resolving to the updated category object
 * @throws {Error} Throws error when validation fails, category not found, or API request fails
 * 
 * @see {@link http://127.0.0.1:8000/swagger/#!/blogsapi/blogsapi_updateCategory_update} - API Documentation
 * 
 * @example
 * ```javascript
 * // Update category name
 * const updatedCategory = await updateArticleCategory(1, { 
 *   category: "Updated Technology" 
 * });
 * console.log(updatedCategory);
 * // Output: { id: 1, category: "Updated Technology", description: "..." }
 * ```
 * 
 * @example
 * ```javascript
 * // Error handling for category update
 * try {
 *   const category = await updateArticleCategory(categoryId, { category: newName });
 *   toast.success('Category updated successfully');
 * } catch (error) {
 *   if (error.message.includes('not found')) {
 *     toast.error('Category not found');
 *   } else {
 *     toast.error('Failed to update category');
 *   }
 * }
 * ```
 */
export const updateArticleCategory = async (categoryId, categoryData) => {
  try {
    if (!categoryId || typeof categoryId !== 'number') {
      throw new Error("Valid category ID is required for updates");
    }

    const validation = createCategorySchema.safeParse(categoryData);
    if (!validation.success) {
      console.error("Category update validation failed:", validation.error.issues);
      throw new Error("Invalid category data: " + validation.error.issues.map(issue => issue.message).join(', '));
    }

    const response = await axiosInstance.put(
      `${articleAPIendpoint}/updateCategory/${categoryId}/`,
      validation.data
    );
    
    const categoryValidation = categoryArraySchema.element.safeParse(response.data);
    if (!categoryValidation.success) {
      console.error("Category response validation failed:", categoryValidation.error.issues);
      throw new Error("Failed to validate updated category: " + categoryValidation.error.issues.map(issue => issue.message).join(', '));
    }
    
    return categoryValidation.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error("Category not found");
    }
    if (error.response?.status === 400) {
      throw new Error("Bad request - invalid category data provided");
    }
    if (error.response?.status >= 500) {
      throw new Error("Server error while updating category");
    }
    throw error;
  }
};

/**
 * Deletes a blog category
 * Permanently removes a blog category from the system. This action cannot be undone.
 * Note: Categories that are in use by existing blog posts may not be deletable.
 * 
 * @async
 * @function deleteArticleCategory
 * @param {number} categoryId - ID of the category to delete (required)
 * @returns {Promise<number>} Promise resolving to the ID of the deleted category
 * @throws {Error} Throws error when category not found, still in use, or API request fails
 * 
 * @see {@link http://127.0.0.1:8000/swagger/#!/blogsapi/blogsapi_deleteCategory_delete} - API Documentation
 * 
 * @example
 * ```javascript
 * // Delete a category
 * const deletedId = await deleteArticleCategory(123);
 * console.log(`Category ${deletedId} was deleted successfully`);
 * ```
 * 
 * @example
 * ```javascript
 * // Error handling for category deletion
 * try {
 *   await deleteArticleCategory(categoryId);
 *   toast.success('Category deleted successfully');
 *   // Remove from local state
 *   setCategories(prev => prev.filter(cat => cat.id !== categoryId));
 * } catch (error) {
 *   if (error.message.includes('not found')) {
 *     toast.error('Category not found');
 *   } else if (error.message.includes('in use')) {
 *     toast.error('Cannot delete category - it is still being used');
 *   } else {
 *     toast.error('Failed to delete category');
 *   }
 * }
 * ```
 */
export const deleteArticleCategory = async (categoryId) => {
  try {
    if (!categoryId || typeof categoryId !== 'number') {
      throw new Error("Valid category ID is required for deletion");
    }

    await axiosInstance.delete(`${articleAPIendpoint}/deleteCategory/${categoryId}/`);
    return categoryId;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error("Category not found");
    }
    if (error.response?.status === 400) {
      throw new Error("Bad request - category may be in use by existing posts");
    }
    if (error.response?.status >= 500) {
      throw new Error("Server error while deleting category");
    }
    throw error;
  }
};

// ====================================================================
// BLOG ARTICLE FETCHER AND MUTATION FUNCTIONS
// ====================================================================
// Handles all CRUD operations for blog articles including:
// - Fetching paginated articles (by organization, user, slug, ID)
// - Creating new articles with validation and file upload
// - Updating existing articles
// - Deleting articles
// All functions include comprehensive validation and error handling

/**
 * Fetches paginated blog articles for an organization
 * Retrieves blog articles with pagination support and optional category filtering.
 * This is the primary function for loading articles in list views.
 * 
 * @async
 * @function fetchArticles
 * @param {string} [url] - API endpoint URL for articles (optional, uses default if not provided)
 * @returns {Promise<PaginatedBlogResponse>} Promise resolving to paginated blog response with articles
 * @throws {Error} Throws error when API request fails or validation fails
 * 
 * @see {@link http://127.0.0.1:8000/swagger/#!/blogsapi/blogsapi_orgblogs_read} - API Documentation
 * 
 * @example
 * ```javascript
 * // Fetch articles with default URL
 * const articlesResponse = await fetchArticles();
 * console.log(articlesResponse.count); // Total number of articles
 * console.log(articlesResponse.results); // Array of articles
 * 
 * // Fetch articles with custom URL and pagination
 * const articlesResponse = await fetchArticles('/blogsapi/orgblogs/1/?page=2&page_size=10');
 * ```
 * 
 * @example
 * ```javascript
 * // Error handling for article fetching
 * try {
 *   const response = await fetchArticles();
 *   setArticles(response.results);
 *   setTotalCount(response.count);
 * } catch (error) {
 *   console.error('Failed to fetch articles:', error.message);
 *   setError('Unable to load articles');
 * }
 * ```
 */
export const fetchArticles = async (url) => {
  try {
    // Use default URL if none provided
    const apiUrl = url || `${articleAPIendpoint}/orgblogs/${Organizationid}/`;
    
    const response = await axiosInstance.get(apiUrl);
    const validation = ArticleResponseSchema.safeParse(response.data);
    
    if (!validation.success) {
      console.error("Articles validation failed:", validation.error.issues);
      throw new Error("Failed to validate articles data: " + validation.error.issues.map(issue => issue.message).join(', '));
    }
    
    return validation.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error("Articles not found - organization may not exist");
    }
    if (error.response?.status === 400) {
      throw new Error("Bad request - invalid parameters provided");
    }
    if (error.response?.status >= 500) {
      throw new Error("Server error while fetching articles");
    }
    throw error;
  }
};

/**
 * Fetches articles by specific user with pagination
 * Retrieves all blog articles authored by a specific user with optional pagination parameters.
 * Useful for user profile pages or author-specific article listings.
 * 
 * @async
 * @function fetchArticlesByUser
 * @param {number} userId - ID of the user whose articles to fetch (required)
 * @param {Object} [params={}] - Query parameters for pagination and filtering
 * @param {number} [params.page] - Page number for pagination (default: 1)
 * @param {number} [params.page_size] - Number of items per page (default: API default)
 * @returns {Promise<PaginatedBlogResponse>} Promise resolving to paginated blog response with user's articles
 * @throws {Error} Throws error when user not found, API request fails, or validation fails
 * 
 * @see {@link http://127.0.0.1:8000/swagger/#!/blogsapi/blogsapi_blogs_read} - API Documentation
 * 
 * @example
 * ```javascript
 * // Fetch first page of user's articles
 * const userArticles = await fetchArticlesByUser(123);
 * console.log(userArticles.results); // Array of user's articles
 * 
 * // Fetch specific page with custom page size
 * const userArticles = await fetchArticlesByUser(123, { page: 2, page_size: 5 });
 * ```
 * 
 * @example
 * ```javascript
 * // Error handling for user articles
 * try {
 *   const response = await fetchArticlesByUser(currentUser.id, { page: currentPage });
 *   setUserArticles(response.results);
 *   setHasMore(!!response.next);
 * } catch (error) {
 *   if (error.message.includes('not found')) {
 *     setError('User not found');
 *   } else {
 *     setError('Failed to load user articles');
 *   }
 * }
 * ```
 */
export const fetchArticlesByUser = async (userId, params = {}) => {
  try {
    if (!userId || typeof userId !== 'number') {
      throw new Error("Valid user ID is required");
    }

    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.page_size) queryParams.append('page_size', params.page_size.toString());
    
    const url = `${articleAPIendpoint}/blogs/${userId}/?${queryParams.toString()}`;
    
    const response = await axiosInstance.get(url);
    const validation = ArticleResponseSchema.safeParse(response.data);
    
    if (!validation.success) {
      console.error("User articles validation failed:", validation.error.issues);
      throw new Error("Failed to validate user articles data: " + validation.error.issues.map(issue => issue.message).join(', '));
    }
    
    return validation.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error("User not found or user has no articles");
    }
    if (error.response?.status === 400) {
      throw new Error("Bad request - invalid user ID or parameters");
    }
    if (error.response?.status >= 500) {
      throw new Error("Server error while fetching user articles");
    }
    throw error;
  }
};

/**
 * Fetches articles by organization with optional category filtering and pagination
 * Retrieves blog articles for a specific organization with support for category filtering
 * and pagination. This is the main function for organization-specific article listings.
 * 
 * @async
 * @function fetchArticlesByOrganization
 * @param {number} organizationId - ID of the organization whose articles to fetch (required)
 * @param {Object} [params={}] - Query parameters for filtering and pagination
 * @param {string} [params.category] - Category name filter to show only articles from specific category
 * @param {number} [params.page] - Page number for pagination (default: 1)
 * @param {number} [params.page_size] - Number of items per page (default: API default)
 * @returns {Promise<PaginatedBlogResponse>} Promise resolving to paginated blog response with organization's articles
 * @throws {Error} Throws error when organization/category not found, API request fails, or validation fails
 * 
 * @see {@link http://127.0.0.1:8000/swagger/#!/blogsapi/blogsapi_orgblogs_read} - API Documentation
 * 
 * @example
 * ```javascript
 * // Fetch all articles for organization
 * const orgArticles = await fetchArticlesByOrganization(1);
 * 
 * // Fetch technology articles with pagination
 * const techArticles = await fetchArticlesByOrganization(1, { 
 *   category: "Technology", 
 *   page: 1, 
 *   page_size: 10 
 * });
 * ```
 * 
 * @example
 * ```javascript
 * // Error handling for organization articles
 * try {
 *   const response = await fetchArticlesByOrganization(orgId, { 
 *     category: selectedCategory,
 *     page: currentPage 
 *   });
 *   setArticles(response.results);
 *   setPagination(response);
 * } catch (error) {
 *   if (error.message.includes('Organization') && error.message.includes('not found')) {
 *     setError('Organization not found');
 *   } else if (error.message.includes('Category') && error.message.includes('not found')) {
 *     setError('Category not found');
 *   } else {
 *     setError('Failed to load articles');
 *   }
 * }
 * ```
 */
export const fetchArticlesByOrganization = async (organizationId, params = {}) => {
  try {
    if (!organizationId || typeof organizationId !== 'number') {
      throw new Error("Valid organization ID is required");
    }

    const queryParams = new URLSearchParams();
    if (params.category) queryParams.append('category', params.category);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.page_size) queryParams.append('page_size', params.page_size.toString());
    
    const url = `${articleAPIendpoint}/orgblogs/${organizationId}/?${queryParams.toString()}`;
    
    const response = await axiosInstance.get(url);
    const validation = ArticleResponseSchema.safeParse(response.data);
    
    if (!validation.success) {
      console.error("Organization articles validation failed:", validation.error.issues);
      throw new Error("Failed to validate organization articles data: " + validation.error.issues.map(issue => issue.message).join(', '));
    }
    
    return validation.data;
  } catch (error) {
    if (error.response?.status === 404) {
      if (error.response.data?.detail?.includes('Organization')) {
        throw new Error("Organization not found");
      } else if (error.response.data?.detail?.includes('Category')) {
        throw new Error("Category not found");
      } else {
        throw new Error("Organization or category not found");
      }
    }
    if (error.response?.status === 400) {
      throw new Error("Bad request - invalid organization ID or parameters");
    }
    if (error.response?.status >= 500) {
      throw new Error("Server error while fetching organization articles");
    }
    throw error;
  }
};

/**
 * Fetches a single article by its slug
 * Retrieves a complete blog article using its URL-friendly slug identifier.
 * This is the primary function for loading individual article pages.
 * 
 * @async
 * @function fetchArticleBySlug
 * @param {string} slug - URL slug of the article (required, URL-safe string)
 * @returns {Promise<BlogSerializer>} Promise resolving to single article object with complete data
 * @throws {Error} Throws error when article not found, invalid slug, or API request fails
 * 
 * @see {@link http://127.0.0.1:8000/swagger/#!/blogsapi/blogsapi_blogbyslug_read} - API Documentation
 * 
 * @example
 * ```javascript
 * // Fetch article by slug
 * const article = await fetchArticleBySlug('my-blog-post');
 * console.log(article.title); // Article title
 * console.log(article.body); // Article content
 * console.log(article.author); // Author information
 * ```
 * 
 * @example
 * ```javascript
 * // Error handling for article by slug
 * try {
 *   const article = await fetchArticleBySlug(router.query.slug);
 *   setArticle(article);
 *   // Increment view count
 *   await incrementView(article);
 * } catch (error) {
 *   if (error.message.includes('not found')) {
 *     setError('Article not found');
 *     router.push('/404');
 *   } else {
 *     setError('Failed to load article');
 *   }
 * }
 * ```
 */
export const fetchArticleBySlug = async (slug) => {
  try {
    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      throw new Error("Valid article slug is required");
    }

    const response = await axiosInstance.get(`${articleAPIendpoint}/blogbyslug/${slug}/`);
    const validation = ArticleSchema.safeParse(response.data);
    
    if (!validation.success) {
      console.error("Article by slug validation failed:", validation.error.issues);
      throw new Error("Failed to validate article data: " + validation.error.issues.map(issue => issue.message).join(', '));
    }
    
    return validation.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error("Article not found - invalid slug or article does not exist");
    }
    if (error.response?.status === 400) {
      throw new Error("Bad request - invalid slug format");
    }
    if (error.response?.status >= 500) {
      throw new Error("Server error while fetching article");
    }
    throw error;
  }
};

/**
 * Fetches a single article by its ID
 * Retrieves a complete blog article using its unique numeric identifier.
 * This function is useful for administrative functions or when you have the article ID.
 * 
 * @async
 * @function fetchArticleById
 * @param {number} blogId - ID of the article (required, positive integer)
 * @returns {Promise<BlogSerializer>} Promise resolving to single article object with complete data
 * @throws {Error} Throws error when article not found, invalid ID, or API request fails
 * 
 * @see {@link http://127.0.0.1:8000/swagger/#!/blogsapi/blogsapi_blog_read} - API Documentation
 * 
 * @example
 * ```javascript
 * // Fetch article by ID
 * const article = await fetchArticleById(123);
 * console.log(article.title); // Article title
 * console.log(article.views); // View count
 * ```
 * 
 * @example
 * ```javascript
 * // Error handling for article by ID
 * try {
 *   const article = await fetchArticleById(articleId);
 *   setArticle(article);
 *   setIsLoading(false);
 * } catch (error) {
 *   if (error.message.includes('not found')) {
 *     setError('Article not found');
 *   } else {
 *     setError('Failed to load article');
 *   }
 *   setIsLoading(false);
 * }
 * ```
 */
export const fetchArticleById = async (blogId) => {
  try {
    if (!blogId || typeof blogId !== 'number' || blogId <= 0) {
      throw new Error("Valid article ID (positive number) is required");
    }

    const response = await axiosInstance.get(`${articleAPIendpoint}/blog/${blogId}/`);
    const validation = ArticleSchema.safeParse(response.data);
    
    if (!validation.success) {
      console.error("Article by ID validation failed:", validation.error.issues);
      throw new Error("Failed to validate article data: " + validation.error.issues.map(issue => issue.message).join(', '));
    }
    
    return validation.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error("Article not found - invalid ID or article does not exist");
    }
    if (error.response?.status === 400) {
      throw new Error("Bad request - invalid article ID format");
    }
    if (error.response?.status >= 500) {
      throw new Error("Server error while fetching article");
    }
    throw error;
  }
};

/**
 * Creates a new blog article
 * Creates a comprehensive blog article with support for file uploads, tags, and rich content.
 * Automatically handles form data conversion for multipart uploads and validates all input data.
 * 
 * @async
 * @function createArticle
 * @param {Object} articleData - Complete article data object for creation
 * @param {string} articleData.title - Article title (required, max 100 characters)
 * @param {string} [articleData.subtitle] - Article subtitle (optional, max 100 characters)
 * @param {string} [articleData.body] - Article content body (optional, supports HTML/Markdown)
 * @param {number} articleData.category - Category ID (required, must be valid existing category)
 * @param {string[]} [articleData.tags] - Array of tag names (optional, creates tags if they don't exist)
 * @param {number} articleData.author - Author user ID (required, must be valid user)
 * @param {number} [articleData.organization] - Organization ID (optional, defaults to current org)
 * @param {File} [articleData.img] - Article cover image file (optional, supports JPEG/PNG, max 5MB)
 * @param {number} [articleData.readTime] - Estimated reading time in minutes (optional)
 * @returns {Promise<BlogSerializer>} Promise resolving to the created article object with all metadata
 * @throws {Error} Throws error when validation fails, user/category not found, or API request fails
 * 
 * @see {@link http://127.0.0.1:8000/swagger/#!/blogsapi/blogsapi_addblog_create} - API Documentation
 * 
 * @example
 * ```javascript
 * // Create a basic article
 * const newArticle = await createArticle({
 *   title: "Introduction to React Hooks",
 *   subtitle: "A comprehensive guide",
 *   body: "React Hooks revolutionized how we write React components...",
 *   category: 1, // Technology category ID
 *   tags: ["react", "javascript", "hooks"],
 *   author: currentUser.id,
 *   readTime: 8
 * });
 * console.log(`Article created with ID: ${newArticle.id}`);
 * ```
 * 
 * @example
 * ```javascript
 * // Create article with image upload
 * const fileInput = document.querySelector('#article-image');
 * const imageFile = fileInput.files[0];
 * 
 * const articleWithImage = await createArticle({
 *   title: "My Visual Guide",
 *   body: "This article includes a cover image...",
 *   category: categoryId,
 *   author: userId,
 *   img: imageFile,
 *   tags: ["tutorial", "visual"]
 * });
 * ```
 * 
 * @example
 * ```javascript
 * // Error handling for article creation
 * try {
 *   const article = await createArticle(formData);
 *   toast.success('Article created successfully!');
 *   router.push(`/articles/${article.slug}`);
 * } catch (error) {
 *   if (error.message.includes('User') && error.message.includes('not found')) {
 *     toast.error('Invalid author - user not found');
 *   } else if (error.message.includes('Category') && error.message.includes('not found')) {
 *     toast.error('Invalid category selected');
 *   } else if (error.message.includes('validation')) {
 *     toast.error('Please check your input data');
 *   } else {
 *     toast.error('Failed to create article');
 *   }
 * }
 * ```
 */
export const createArticle = async (articleData) => {
  try {
    // Validate required fields
    if (!articleData.title || !articleData.author || !articleData.category) {
      throw new Error("Title, author, and category are required fields");
    }

    // Convert to FormData for multipart upload support
    const formData = converttoformData(articleData, ["tags"]);
    
    const response = await axiosInstance.post(
      `${articleAPIendpoint}/addblog/${Organizationid}/${articleData.author}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    
    const validation = ArticleSchema.safeParse(response.data);
    if (!validation.success) {
      console.error("Article creation validation failed:", validation.error.issues);
      throw new Error("Failed to validate created article: " + validation.error.issues.map(issue => issue.message).join(', '));
    }
    
    return validation.data;
  } catch (error) {
    if (error.response?.status === 404) {
      if (error.response.data?.detail?.includes('User')) {
        throw new Error("User not found - invalid author ID");
      } else if (error.response.data?.detail?.includes('Category')) {
        throw new Error("Category not found - invalid category ID");
      } else if (error.response.data?.detail?.includes('Organization')) {
        throw new Error("Organization not found");
      } else {
        throw new Error("User, Category, or Organization not found");
      }
    }
    if (error.response?.status === 400) {
      throw new Error("Bad request - please check your input data");
    }
    if (error.response?.status >= 500) {
      throw new Error("Server error while creating article");
    }
    throw error;
  }
};

/**
 * Updates an existing blog article
 * Modifies an existing blog article with new data including support for file uploads and tags.
 * 
 * @async
 * @function updateArticle
 * @param {Object} articleData - Article data to update (must include id)
 * @param {number} articleData.id - Article ID to update (required)
 * @param {string} articleData.title - Article title (required, max 100 chars)
 * @param {string} [articleData.subtitle] - Article subtitle (max 100 chars)
 * @param {string} [articleData.body] - Article content body
 * @param {number} articleData.category - Category ID (required)
 * @param {string[]} [articleData.tags] - Array of tag names
 * @param {number} articleData.author - Author user ID (required)
 * @param {File} [articleData.img] - Article image file
 * @param {number} [articleData.readTime] - Estimated reading time in minutes
 * @returns {Promise<BlogSerializer>} Promise resolving to updated article object
 * @throws {Error} Throws error when validation fails, article not found, or API request fails
 * 
 * @see {@link http://127.0.0.1:8000/swagger/#!/blogsapi/blogsapi_updateblog_update} - API Documentation
 */
export const updateArticle = async (articleData) => {
  try {
    if (!articleData.id) {
      throw new Error("Article ID is required for updates");
    }
    
    const formData = converttoformData(articleData, ["tags"]);
    
    const response = await axiosInstance.put(
      `${articleAPIendpoint}/updateblog/${articleData.id}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    
    const validation = ArticleSchema.safeParse(response.data);
    if (!validation.success) {
      console.error("Article update validation failed:", validation.error.issues);
      throw new Error("Failed to validate updated article: " + validation.error.issues.map(issue => issue.message).join(', '));
    }
    
    return validation.data;
  } catch (error) {
    if (error.response?.status === 404) {
      if (error.response.data?.detail?.includes('Blog')) {
        throw new Error("Article not found");
      } else if (error.response.data?.detail?.includes('User')) {
        throw new Error("User not found - invalid author ID");
      } else if (error.response.data?.detail?.includes('Category')) {
        throw new Error("Category not found - invalid category ID");
      } else {
        throw new Error("Article, User, or Category not found");
      }
    }
    if (error.response?.status === 400) {
      throw new Error("Bad request - please check your input data");
    }
    if (error.response?.status >= 500) {
      throw new Error("Server error while updating article");
    }
    throw error;
  }
};

/**
 * Deletes a blog article
 * Permanently removes a blog article from the system. This action cannot be undone.
 * 
 * @async
 * @function deleteArticle
 * @param {number} blogId - ID of the article to delete (required)
 * @returns {Promise<{message: string}>} Promise resolving to success message
 * @throws {Error} Throws error when article not found or API request fails
 * 
 * @see {@link http://127.0.0.1:8000/swagger/#!/blogsapi/blogsapi_deleteblog_delete} - API Documentation
 */
export const deleteArticle = async (blogId) => {
  try {
    if (!blogId || typeof blogId !== 'number' || blogId <= 0) {
      throw new Error("Valid article ID (positive number) is required");
    }

    await axiosInstance.delete(`${articleAPIendpoint}/deleteblog/${blogId}/`);
    return { message: "Article deleted successfully" };
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error("Article not found");
    }
    if (error.response?.status === 400) {
      throw new Error("Bad request - invalid article ID");
    }
    if (error.response?.status >= 500) {
      throw new Error("Server error while deleting article");
    }
    throw error;
  }
};

// ====================================================================
// BLOG COMMENT FETCHER AND MUTATION FUNCTIONS
// ====================================================================
// Handles all CRUD operations for blog comments including:
// - Fetching paginated comments for articles
// - Creating new comments
// - Updating existing comments
// - Deleting comments
// All functions include comprehensive validation and error handling

/**
 * Fetches paginated comments for a specific blog article
 * Retrieves all comments associated with a blog article in paginated format.
 * 
 * @async
 * @function fetchComments
 * @param {number} blogId - ID of the blog article (required)
 * @returns {Promise<PaginatedCommentResponse>} Promise resolving to paginated comment response
 * @throws {Error} Throws error when article not found or API request fails
 * 
 * @see {@link http://127.0.0.1:8000/swagger/#!/blogsapi/blogsapi_getcomments_read} - API Documentation
 */
export const fetchComments = async (blogId) => {
  try {
    if (!blogId || typeof blogId !== 'number' || blogId <= 0) {
      throw new Error("Valid blog ID (positive number) is required");
    }

    const response = await axiosInstance.get(`${articleAPIendpoint}/getcomments/${blogId}/`);
    const validation = commentResponseSchema.safeParse(response.data);
    
    if (!validation.success) {
      console.error("Comments validation failed:", validation.error.issues);
      throw new Error("Failed to validate comments data: " + validation.error.issues.map(issue => issue.message).join(', '));
    }
    
    return validation.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error("Comments not found - article may not exist");
    }
    if (error.response?.status >= 500) {
      throw new Error("Server error while fetching comments");
    }
    throw error;
  }
};

/**
 * Creates a new comment on a blog article
 * Adds a new comment to a specific blog article with validation.
 * 
 * @async
 * @function createComment
 * @param {Object} commentData - Comment data to create
 * @param {number} commentData.blog - Blog ID to comment on (required)
 * @param {number} commentData.userId - User ID making the comment (required)
 * @param {string} commentData.comment - Comment text content (required)
 * @returns {Promise<BlogComment>} Promise resolving to created comment object
 * @throws {Error} Throws error when validation fails, blog/user not found, or API request fails
 * 
 * @see {@link http://127.0.0.1:8000/swagger/#!/blogsapi/blogsapi_addcomment_create} - API Documentation
 */
export const createComment = async (commentData) => {
  try {
    const { blog, userId, ...data } = commentData;
    
    if (!blog || !userId || !data.comment) {
      throw new Error("Blog ID, user ID, and comment text are required");
    }

    const validation = createCommentSchema.safeParse(data);
    if (!validation.success) {
      console.error("Comment creation validation failed:", validation.error.issues);
      throw new Error("Invalid comment data: " + validation.error.issues.map(issue => issue.message).join(', '));
    }

    const response = await axiosInstance.post(
      `${articleAPIendpoint}/addcomment/${blog}/${userId}/`,
      validation.data
    );
    
    const commentValidation = commentSchema.safeParse(response.data);
    if (!commentValidation.success) {
      console.error("Comment response validation failed:", commentValidation.error.issues);
      throw new Error("Failed to validate created comment: " + commentValidation.error.issues.map(issue => issue.message).join(', '));
    }
    
    return commentValidation.data;
  } catch (error) {
    if (error.response?.status === 404) {
      if (error.response.data?.detail?.includes('Blog')) {
        throw new Error("Blog not found");
      } else if (error.response.data?.detail?.includes('User')) {
        throw new Error("User not found");
      } else {
        throw new Error("Blog or User not found");
      }
    }
    if (error.response?.status === 400) {
      throw new Error("Bad request - invalid comment data");
    }
    if (error.response?.status >= 500) {
      throw new Error("Server error while creating comment");
    }
    throw error;
  }
};

/**
 * Updates an existing comment
 * Modifies the text content of an existing comment.
 * 
 * @async
 * @function updateComment
 * @param {Object} commentData - Comment data to update
 * @param {number} commentData.id - Comment ID to update (required)
 * @param {string} commentData.comment - Updated comment text (required)
 * @returns {Promise<BlogComment>} Promise resolving to updated comment object
 * @throws {Error} Throws error when validation fails, comment not found, or API request fails
 * 
 * @see {@link http://127.0.0.1:8000/swagger/#!/blogsapi/blogsapi_updatecomment_update} - API Documentation
 */
export const updateComment = async (commentData) => {
  try {
    if (!commentData.id) {
      throw new Error("Comment ID is required for updates");
    }

    const { id, ...data } = commentData;
    const validation = updateCommentSchema.safeParse(data);
    if (!validation.success) {
      console.error("Comment update validation failed:", validation.error.issues);
      throw new Error("Invalid comment data: " + validation.error.issues.map(issue => issue.message).join(', '));
    }

    const response = await axiosInstance.put(
      `${articleAPIendpoint}/updatecomment/${id}/`,
      validation.data
    );
    
    const commentValidation = commentSchema.safeParse(response.data);
    if (!commentValidation.success) {
      console.error("Comment response validation failed:", commentValidation.error.issues);
      throw new Error("Failed to validate updated comment: " + commentValidation.error.issues.map(issue => issue.message).join(', '));
    }
    
    return commentValidation.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error("Comment not found");
    }
    if (error.response?.status === 400) {
      throw new Error("Bad request - invalid comment data");
    }
    if (error.response?.status >= 500) {
      throw new Error("Server error while updating comment");
    }
    throw error;
  }
};

/**
 * Deletes a comment
 * Permanently removes a comment from the system. This action cannot be undone.
 * 
 * @async
 * @function deleteComment
 * @param {number} commentId - ID of the comment to delete (required)
 * @returns {Promise<{message: string}>} Promise resolving to success message
 * @throws {Error} Throws error when comment not found or API request fails
 * 
 */
export const deleteComment = async (commentId) => {
  try {
    if (!commentId || typeof commentId !== 'number' || commentId <= 0) {
      throw new Error("Valid comment ID (positive number) is required");
    }

    await axiosInstance.delete(`${articleAPIendpoint}/deletecomment/${commentId}/`);
    return { message: "Comment deleted successfully" };
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error("Comment not found");
    }
    if (error.response?.status >= 500) {
      throw new Error("Server error while deleting comment");
    }
    throw error;
  }
};

// =================== Article Views & Interactions =================== //

/**
 * Increments the view count for a blog article
 * Tracks article engagement by incrementing view counter. This is used for analytics
 * and content popularity tracking. Returns updated article with incremented view count.
 * 
 * @async
 * @function incrementView
 * @param {BlogSerializer} article - Article object to increment views for (required)
 * @returns {Promise<BlogSerializer>} Promise resolving to updated article object with incremented view count
 * @throws {Error} Throws error when article is invalid or API request fails
 * 
 * @see {@link http://127.0.0.1:8000/swagger/#!/blogsapi/blogsapi_addviews} - API Documentation
 */
export const incrementView = async (article) => {
  try {
    if (!article || !article.id || typeof article.id !== 'number') {
      throw new Error("Valid article object with ID is required");
    }

    await axiosInstance.get(`${articleAPIendpoint}/addviews/${article.id}/`);
    
    // Return updated article with incremented view count
    const updatedArticle = { ...article, views: (article.views || 0) + 1 };
    return updatedArticle;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error("Article not found for view increment");
    }
    if (error.response?.status >= 500) {
      throw new Error("Server error while incrementing view count");
    }
    console.error("Failed to increment view:", error);
    throw new Error("Failed to increment view count");
  }
};

// =================== Blog Like/Unlike Functions =================== //

/**
 * Adds a like to a blog article
 * Creates a like record associating the user with the article. This action is tracked
 * for engagement analytics and user interaction history.
 * 
 * @async
 * @function addLike
 * @param {Object} params - Parameters for adding like
 * @param {BlogSerializer} params.article - Article to like (required)
 * @param {number} params.userId - ID of the user adding the like (required)
 * @returns {Promise<void>} Promise resolving when like is successfully added
 * @throws {Error} Throws error when parameters are invalid, user already liked, or API request fails
 * 
 * @see {@link http://127.0.0.1:8000/swagger/#!/blogsapi/blogsapi_addlike} - API Documentation
 */
export const addLike = async (params) => {
  try {
    const { article, userId } = params;
    
    if (!article || !article.id || typeof article.id !== 'number') {
      throw new Error("Valid article object with ID is required");
    }
    if (!userId || typeof userId !== 'number' || userId <= 0) {
      throw new Error("Valid user ID (positive number) is required");
    }

    await axiosInstance.get(`${articleAPIendpoint}/addlike/${article.id}/${userId}/`);
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error("Article not found for like action");
    }
    if (error.response?.status === 400) {
      throw new Error("Bad request - invalid like parameters");
    }
    if (error.response?.status === 409) {
      throw new Error("You have already liked this article");
    }
    if (error.response?.status >= 500) {
      throw new Error("Server error while adding like");
    }
    console.error("Failed to add like:", error);
    throw new Error("Failed to add like");
  }
};

/**
 * Removes a like from a blog article
 * Deletes an existing like record for the specified article and user. This action
 * removes the user's like from engagement tracking and interaction history.
 * 
 * @async
 * @function deleteLike
 * @param {Object} params - Parameters for removing like
 * @param {BlogSerializer} params.article - Article to unlike (required)
 * @param {number} params.userId - ID of the user removing the like (required)
 * @returns {Promise<void>} Promise resolving when like is successfully removed
 * @throws {Error} Throws error when parameters are invalid, like not found, or API request fails
 * 
 * @see {@link http://127.0.0.1:8000/swagger/#!/blogsapi/blogsapi_deletelike} - API Documentation
 */
export const deleteLike = async (params) => {
  try {
    const { article, userId } = params;
    
    if (!article || !article.id || typeof article.id !== 'number') {
      throw new Error("Valid article object with ID is required");
    }
    if (!userId || typeof userId !== 'number' || userId <= 0) {
      throw new Error("Valid user ID (positive number) is required");
    }

    await axiosInstance.delete(`${articleAPIendpoint}/deletelike/${article.id}/${userId}/`);
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error("Like not found or already removed");
    }
    if (error.response?.status === 400) {
      throw new Error("Bad request - invalid unlike parameters");
    }
    if (error.response?.status >= 500) {
      throw new Error("Server error while removing like");
    }
    console.error("Failed to remove like:", error);
    throw new Error("Failed to remove like");
  }
};
