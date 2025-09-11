/**
 * @fileoverview Enhanced User Authentication API Integration
 * 
 * Comprehensive API integration for user authentication and management following strict
 * API documentation compliance. Implements all 12 documented authapi endpoints with
 * enhanced error handling, logging, and schema validation.
 * 
 * Features:
 * - Production-grade axios configuration with timeouts and interceptors
 * - Comprehensive error handling and detailed logging
 * - Strict schema validation using Zod with informative error messages
 * - Request/response interceptors for debugging and monitoring
 * - Full TypeScript support with proper JSDoc documentation
 * - Strict compliance with documented API endpoints only
 * 
 * @version 2.0.0
 * @author Innovation CyberCafe Team
 * @requires axios - HTTP client for API requests
 * @requires zod - Schema validation library
 * @requires ../schemas/users - User validation schemas
 */

/**
 * @typedef {import('zod').infer<typeof UserSchema>} User
 * @typedef {import('zod').infer<typeof UserRegistrationSchema>} UserRegistration
 * @typedef {import('zod').infer<typeof UserRegistrationResponseSchema>} UserRegistrationResponse
 * @typedef {import('zod').infer<typeof UserRegistrationOAuthSchema>} UserRegistrationOAuth
 * @typedef {import('zod').infer<typeof UserUpdateSchema>} UserUpdate
 * @typedef {import('zod').infer<typeof UserLoginSchema>} UserLogin
 * @typedef {import('zod').infer<typeof UserLoginResponseSchema>} UserLoginResponse
 * @typedef {import('zod').infer<typeof SuccessResponseSchema>} SuccessResponse
 * @typedef {import('zod').infer<typeof ErrorResponseSchema>} ErrorResponse
 */

import axios from "axios";
import { z } from "zod";
import {
  UserSchema,
  UsersSchema,
  UserRegistrationSchema,
  UserRegistrationResponseSchema,
  UserRegistrationOAuthSchema,
  UserUpdateSchema,
  UserLoginSchema,
  UserLoginResponseSchema,
  GetUserByEmailSchema,
  GetVerificationTokenSchema,
  VerifyEmailSchema,
  VerifyTokenSchema,
  ResetPasswordSchema,
  SuccessResponseSchema,
  ErrorResponseSchema,
} from "@/schemas/users";

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
    console.log(`🔐 [AUTH-API] ${config.method?.toUpperCase()} ${config.url}`, {
      data: config.data ? '***DATA***' : 'No data',
      headers: config.headers,
    });
    return config;
  },
  (error) => {
    console.error('🔐 [AUTH-API] Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for debugging and error handling
 */
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`🔐 [AUTH-API] ✅ ${response.status} ${response.config.url}`, {
      status: response.status,
      data: response.data ? 'Response received' : 'No data',
    });
    return response;
  },
  (error) => {
    console.error(`🔐 [AUTH-API] ❌ ${error.response?.status || 'Network Error'} ${error.config?.url}`, {
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
 * Authentication API endpoint base path
 * @type {string}
 */
export const authAPIendpoint = "/authapi";

// =============================================================================
// API ENDPOINT FUNCTIONS - Following exact documented endpoints
// =============================================================================

/**
 * DELETE /authapi/delete/{user_id}/
 * Deletes a user account by ID (admin only)
 * 
 * @async
 * @function deleteUser
 * @param {number} userId - ID of the user to delete
 * @returns {Promise<{message: string}>} Success confirmation message
 * @throws {Error} When API request fails or validation fails
 * 
 * @example
 * ```javascript
 * const result = await deleteUser(123);
 * console.log(result.message); // "User deleted successfully"
 * ```
 */
export const deleteUser = async (userId) => {
  try {
    console.log(`🔐 [FETCHER] Deleting user with ID: ${userId}`);
    
    if (!userId || typeof userId !== 'number') {
      throw new Error('User ID is required and must be a number');
    }

    const response = await axiosInstance.delete(`${authAPIendpoint}/delete/${userId}/`);
    
    // Validate response
    const validation = SuccessResponseSchema.safeParse(response.data);
    if (!validation.success) {
      console.error('🔐 [FETCHER] Delete user response validation failed:', validation.error.issues);
      return { message: 'User deleted successfully' }; // Fallback message
    }
    
    console.log(`🔐 [FETCHER] ✅ Successfully deleted user: ${userId}`);
    return { message: validation.data.message || 'User deleted successfully' };
  } catch (error) {
    console.error(`🔐 [FETCHER] ❌ Failed to delete user ${userId}:`, error);
    throw new Error(`Failed to delete user: ${error.response?.data?.error || error.message}`);
  }
};

/**
 * POST /authapi/getResetPasswordToken/
 * Requests a password reset token via email
 * 
 * @async
 * @function getResetPasswordToken
 * @param {string} email - Email address of the user requesting reset
 * @returns {Promise<{message: string}>} Success confirmation message
 * @throws {Error} When API request fails or validation fails
 * 
 * @example
 * ```javascript
 * const result = await getResetPasswordToken("user@example.com");
 * console.log(result.message); // "Password reset token sent to email"
 * ```
 */
export const getResetPasswordToken = async (email) => {
  try {
    console.log(`🔐 [FETCHER] Requesting password reset token for email: ${email}`);
    
    const validation = GetVerificationTokenSchema.safeParse({ email });
    if (!validation.success) {
      console.error('🔐 [FETCHER] Get reset password token validation failed:', validation.error.issues);
      throw new Error('Invalid email address format');
    }

    const response = await axiosInstance.post(`${authAPIendpoint}/getResetPasswordToken/`, validation.data);
    
    // Validate response
    const responseValidation = SuccessResponseSchema.safeParse(response.data);
    if (!responseValidation.success) {
      console.error('🔐 [FETCHER] Reset password token response validation failed:', responseValidation.error.issues);
      return { message: 'Password reset token sent successfully' }; // Fallback message
    }
    
    console.log(`🔐 [FETCHER] ✅ Successfully sent password reset token to: ${email}`);
    return { message: responseValidation.data.message || 'Password reset token sent successfully' };
  } catch (error) {
    console.error(`🔐 [FETCHER] ❌ Failed to send password reset token to ${email}:`, error);
    throw new Error(`Failed to send password reset token: ${error.response?.data?.error || error.message}`);
  }
};

/**
 * POST /authapi/getUserbyEmail/
 * Retrieves user information by email address
 * 
 * @async
 * @function getUserByEmail
 * @param {string} email - Email address of the user to retrieve
 * @returns {Promise<User>} User object matching the email
 * @throws {Error} When API request fails or validation fails
 * 
 * @example
 * ```javascript
 * const user = await getUserByEmail("user@example.com");
 * console.log(user.username); // "johndoe"
 * ```
 */
export const getUserByEmail = async (email) => {
  try {
    console.log(`🔐 [FETCHER] Fetching user by email: ${email}`);
    
    const validation = GetUserByEmailSchema.safeParse({ email });
    if (!validation.success) {
      console.error('🔐 [FETCHER] Get user by email validation failed:', validation.error.issues);
      throw new Error('Invalid email address format');
    }

    const response = await axiosInstance.post(`${authAPIendpoint}/getUserbyEmail/`, validation.data);
    
    // Validate response
    const userValidation = UserSchema.safeParse(response.data);
    if (!userValidation.success) {
      console.error('🔐 [FETCHER] Get user by email response validation failed:', userValidation.error.issues);
      throw new Error('Failed to validate user data from server');
    }
    
    console.log(`🔐 [FETCHER] ✅ Successfully fetched user by email: ${email}`);
    return userValidation.data;
  } catch (error) {
    console.error(`🔐 [FETCHER] ❌ Failed to fetch user by email ${email}:`, error);
    throw new Error(`Failed to fetch user by email: ${error.response?.data?.error || error.message}`);
  }
};

/**
 * GET /authapi/getUsers/
 * Retrieves list of all users (admin only)
 * 
 * @async
 * @function getUsers
 * @returns {Promise<User[]>} Array of user objects
 * @throws {Error} When API request fails or validation fails
 * 
 * @example
 * ```javascript
 * const users = await getUsers();
 * console.log(`Found ${users.length} users`);
 * ```
 */
export const getUsers = async () => {
  try {
    console.log('🔐 [FETCHER] Fetching all users');
    
    const response = await axiosInstance.get(`${authAPIendpoint}/getUsers/`);
    
    // Validate response
    const validation = UsersSchema.safeParse(response.data);
    if (!validation.success) {
      console.error('🔐 [FETCHER] Get users response validation failed:', validation.error.issues);
      throw new Error('Failed to validate users data from server');
    }
    
    console.log(`🔐 [FETCHER] ✅ Successfully fetched ${validation.data.length} users`);
    return validation.data;
  } catch (error) {
    console.error('🔐 [FETCHER] ❌ Failed to fetch users:', error);
    throw new Error(`Failed to fetch users: ${error.response?.data?.error || error.message}`);
  }
};

/**
 * GET /authapi/getuser/{user_id}/
 * Retrieves a specific user by ID
 * 
 * @async
 * @function getUser
 * @param {number} userId - ID of the user to retrieve
 * @returns {Promise<User>} User object
 * @throws {Error} When API request fails or validation fails
 * 
 * @example
 * ```javascript
 * const user = await getUser(123);
 * console.log(user.username); // "johndoe"
 * ```
 */
export const getUser = async (userId) => {
  try {
    console.log(`🔐 [FETCHER] Fetching user with ID: ${userId}`);
    
    if (!userId || typeof userId !== 'number') {
      throw new Error('User ID is required and must be a number');
    }

    const response = await axiosInstance.get(`${authAPIendpoint}/getuser/${userId}/`);
    
    // Validate response
    const validation = UserSchema.safeParse(response.data);
    if (!validation.success) {
      console.error('🔐 [FETCHER] Get user response validation failed:', validation.error.issues);
      throw new Error('Failed to validate user data from server');
    }
    
    console.log(`🔐 [FETCHER] ✅ Successfully fetched user: ${userId}`);
    return validation.data;
  } catch (error) {
    console.error(`🔐 [FETCHER] ❌ Failed to fetch user ${userId}:`, error);
    throw new Error(`Failed to fetch user: ${error.response?.data?.error || error.message}`);
  }
};

/**
 * POST /authapi/register/
 * Registers a new user account
 * 
 * @async
 * @function registerUser
 * @param {UserRegistration} userData - User registration data
 * @returns {Promise<UserRegistrationResponse>} Registration response with token and user
 * @throws {Error} When API request fails or validation fails
 * 
 * @example
 * ```javascript
 * const result = await registerUser({
 *   firstname: "John",
 *   lastname: "Doe",
 *   email: "john@example.com",
 *   password: "securepassword123",
 *   organization_id: 1
 * });
 * console.log(result.token); // "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
 * ```
 */
export const registerUser = async (userData) => {
  try {
    console.log(`🔐 [FETCHER] Registering new user: ${userData.email}`);
    
    const validation = UserRegistrationSchema.safeParse(userData);
    if (!validation.success) {
      console.error('🔐 [FETCHER] User registration validation failed:', validation.error.issues);
      throw new Error(`Invalid registration data: ${validation.error.issues.map(issue => issue.message).join(', ')}`);
    }

    const response = await axiosInstance.post(`${authAPIendpoint}/register/`, validation.data);
    
    // Validate response
    const responseValidation = UserRegistrationResponseSchema.safeParse(response.data);
    if (!responseValidation.success) {
      console.error('🔐 [FETCHER] User registration response validation failed:', responseValidation.error.issues);
      throw new Error('Failed to validate registration response from server');
    }
    
    console.log(`🔐 [FETCHER] ✅ Successfully registered user: ${userData.email}`);
    return responseValidation.data;
  } catch (error) {
    console.error(`🔐 [FETCHER] ❌ Failed to register user ${userData.email}:`, error);
    throw new Error(`Failed to register user: ${error.response?.data?.error || error.message}`);
  }
};

/**
 * POST /authapi/register_oauth/{provider}/
 * Registers a new user via OAuth provider
 * 
 * @async
 * @function registerUserOAuth
 * @param {string} provider - OAuth provider name (e.g., 'google', 'github')
 * @param {UserRegistrationOAuth} userData - OAuth user registration data
 * @returns {Promise<UserRegistrationResponse>} Registration response with token and user
 * @throws {Error} When API request fails or validation fails
 * 
 * @example
 * ```javascript
 * const result = await registerUserOAuth("google", {
 *   name: "John Doe",
 *   email: "john@example.com",
 *   email_verified: true,
 *   given_name: "John",
 *   family_name: "Doe"
 * });
 * console.log(result.user.username); // "johndoe"
 * ```
 */
export const registerUserOAuth = async (provider, userData) => {
  try {
    console.log(`🔐 [FETCHER] Registering OAuth user via ${provider}: ${userData.email}`);
    
    if (!provider || typeof provider !== 'string') {
      throw new Error('OAuth provider is required and must be a string');
    }

    const validation = UserRegistrationOAuthSchema.safeParse(userData);
    if (!validation.success) {
      console.error('🔐 [FETCHER] OAuth user registration validation failed:', validation.error.issues);
      throw new Error(`Invalid OAuth registration data: ${validation.error.issues.map(issue => issue.message).join(', ')}`);
    }

    const response = await axiosInstance.post(`${authAPIendpoint}/register_oauth/${provider}/`, validation.data);
    
    // Validate response
    const responseValidation = UserRegistrationResponseSchema.safeParse(response.data);
    if (!responseValidation.success) {
      console.error('🔐 [FETCHER] OAuth user registration response validation failed:', responseValidation.error.issues);
      throw new Error('Failed to validate OAuth registration response from server');
    }
    
    console.log(`🔐 [FETCHER] ✅ Successfully registered OAuth user via ${provider}: ${userData.email}`);
    return responseValidation.data;
  } catch (error) {
    console.error(`🔐 [FETCHER] ❌ Failed to register OAuth user via ${provider} for ${userData.email}:`, error);
    throw new Error(`Failed to register OAuth user: ${error.response?.data?.error || error.message}`);
  }
};

/**
 * POST /authapi/resetPassword/
 * Resets user password with token
 * 
 * @async
 * @function resetPassword
 * @param {string} token - Password reset token
 * @param {string} password - New password
 * @returns {Promise<{message: string}>} Success confirmation message
 * @throws {Error} When API request fails or validation fails
 * 
 * @example
 * ```javascript
 * const result = await resetPassword("reset-token-123", "newSecurePassword456");
 * console.log(result.message); // "Password reset successfully"
 * ```
 */
export const resetPassword = async (token, password) => {
  try {
    console.log(`🔐 [FETCHER] Resetting password with token: ${token.substring(0, 10)}...`);
    
    const validation = ResetPasswordSchema.safeParse({ token, password });
    if (!validation.success) {
      console.error('🔐 [FETCHER] Reset password validation failed:', validation.error.issues);
      throw new Error(`Invalid reset password data: ${validation.error.issues.map(issue => issue.message).join(', ')}`);
    }

    const response = await axiosInstance.post(`${authAPIendpoint}/resetPassword/`, validation.data);
    
    // Validate response
    const responseValidation = SuccessResponseSchema.safeParse(response.data);
    if (!responseValidation.success) {
      console.error('🔐 [FETCHER] Reset password response validation failed:', responseValidation.error.issues);
      return { message: 'Password reset successfully' }; // Fallback message
    }
    
    console.log('🔐 [FETCHER] ✅ Successfully reset password');
    return { message: responseValidation.data.message || 'Password reset successfully' };
  } catch (error) {
    console.error('🔐 [FETCHER] ❌ Failed to reset password:', error);
    throw new Error(`Failed to reset password: ${error.response?.data?.error || error.message}`);
  }
};

/**
 * PUT /authapi/update/{user_id}/
 * Updates user information by ID
 * 
 * @async
 * @function updateUser
 * @param {number} userId - ID of the user to update
 * @param {UserUpdate} userData - User data to update
 * @returns {Promise<User>} Updated user object
 * @throws {Error} When API request fails or validation fails
 * 
 * @example
 * ```javascript
 * const updatedUser = await updateUser(123, {
 *   first_name: "John",
 *   last_name: "Smith",
 *   email: "john.smith@example.com",
 *   phone: "+1234567890"
 * });
 * console.log(updatedUser.first_name); // "John"
 * ```
 */
export const updateUser = async (userId, userData) => {
  try {
    console.log(`🔐 [FETCHER] Updating user with ID: ${userId}`);
    
    if (!userId || typeof userId !== 'number') {
      throw new Error('User ID is required and must be a number');
    }

    const validation = UserUpdateSchema.safeParse(userData);
    if (!validation.success) {
      console.error('🔐 [FETCHER] User update validation failed:', validation.error.issues);
      throw new Error(`Invalid user update data: ${validation.error.issues.map(issue => issue.message).join(', ')}`);
    }

    const response = await axiosInstance.put(`${authAPIendpoint}/update/${userId}/`, validation.data);
    
    // Validate response
    const userValidation = UserSchema.safeParse(response.data);
    if (!userValidation.success) {
      console.error('🔐 [FETCHER] User update response validation failed:', userValidation.error.issues);
      throw new Error('Failed to validate updated user data from server');
    }
    
    console.log(`🔐 [FETCHER] ✅ Successfully updated user: ${userId}`);
    return userValidation.data;
  } catch (error) {
    console.error(`🔐 [FETCHER] ❌ Failed to update user ${userId}:`, error);
    throw new Error(`Failed to update user: ${error.response?.data?.error || error.message}`);
  }
};

/**
 * POST /authapi/verifyEmail/
 * Verifies user email with token
 * 
 * @async
 * @function verifyEmail
 * @param {string} token - Email verification token
 * @returns {Promise<{message: string}>} Success confirmation message
 * @throws {Error} When API request fails or validation fails
 * 
 * @example
 * ```javascript
 * const result = await verifyEmail("verification-token-123");
 * console.log(result.message); // "Email verified successfully"
 * ```
 */
export const verifyEmail = async (token) => {
  try {
    console.log(`🔐 [FETCHER] Verifying email with token: ${token.substring(0, 10)}...`);
    
    const validation = VerifyEmailSchema.safeParse({ token });
    if (!validation.success) {
      console.error('🔐 [FETCHER] Verify email validation failed:', validation.error.issues);
      throw new Error(`Invalid verification token: ${validation.error.issues.map(issue => issue.message).join(', ')}`);
    }

    const response = await axiosInstance.post(`${authAPIendpoint}/verifyEmail/`, validation.data);
    
    // Validate response
    const responseValidation = SuccessResponseSchema.safeParse(response.data);
    if (!responseValidation.success) {
      console.error('🔐 [FETCHER] Verify email response validation failed:', responseValidation.error.issues);
      return { message: 'Email verified successfully' }; // Fallback message
    }
    
    console.log('🔐 [FETCHER] ✅ Successfully verified email');
    return { message: responseValidation.data.message || 'Email verified successfully' };
  } catch (error) {
    console.error('🔐 [FETCHER] ❌ Failed to verify email:', error);
    throw new Error(`Failed to verify email: ${error.response?.data?.error || error.message}`);
  }
};

/**
 * POST /authapi/verifyToken/
 * Verifies authentication token validity
 * 
 * @async
 * @function verifyToken
 * @param {string} token - Authentication token to verify
 * @returns {Promise<{message: string}>} Token validity confirmation
 * @throws {Error} When API request fails or validation fails
 * 
 * @example
 * ```javascript
 * const result = await verifyToken("auth-token-123");
 * console.log(result.message); // "Token is valid"
 * ```
 */
export const verifyToken = async (token) => {
  try {
    console.log(`🔐 [FETCHER] Verifying token: ${token.substring(0, 10)}...`);
    
    const validation = VerifyTokenSchema.safeParse({ token });
    if (!validation.success) {
      console.error('🔐 [FETCHER] Verify token validation failed:', validation.error.issues);
      throw new Error(`Invalid token format: ${validation.error.issues.map(issue => issue.message).join(', ')}`);
    }

    const response = await axiosInstance.post(`${authAPIendpoint}/verifyToken/`, validation.data);
    
    // Validate response
    const responseValidation = SuccessResponseSchema.safeParse(response.data);
    if (!responseValidation.success) {
      console.error('🔐 [FETCHER] Verify token response validation failed:', responseValidation.error.issues);
      return { message: 'Token is valid' }; // Fallback message
    }
    
    console.log('🔐 [FETCHER] ✅ Successfully verified token');
    return { message: responseValidation.data.message || 'Token is valid' };
  } catch (error) {
    console.error('🔐 [FETCHER] ❌ Failed to verify token:', error);
    throw new Error(`Failed to verify token: ${error.response?.data?.error || error.message}`);
  }
};

/**
 * POST /authapi/verifyuser/
 * Verifies user credentials and authenticates
 * 
 * @async
 * @function verifyUser
 * @param {string} email - User email address
 * @param {string} password - User password
 * @returns {Promise<UserLoginResponse>} Authentication response with token and user
 * @throws {Error} When API request fails or validation fails
 * 
 * @example
 * ```javascript
 * const result = await verifyUser("user@example.com", "password123");
 * console.log(result.token); // "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
 * console.log(result.user.username); // "johndoe"
 * ```
 */
export const verifyUser = async (email, password) => {
  try {
    console.log(`🔐 [FETCHER] Verifying user credentials for: ${email}`);
    
    const validation = UserLoginSchema.safeParse({ email, password });
    if (!validation.success) {
      console.error('🔐 [FETCHER] Verify user validation failed:', validation.error.issues);
      throw new Error(`Invalid login credentials: ${validation.error.issues.map(issue => issue.message).join(', ')}`);
    }

    const response = await axiosInstance.post(`${authAPIendpoint}/verifyuser/`, validation.data);
    
    // Validate response
    const responseValidation = UserLoginResponseSchema.safeParse(response.data);
    if (!responseValidation.success) {
      console.error('🔐 [FETCHER] Verify user response validation failed:', responseValidation.error.issues);
      throw new Error('Failed to validate authentication response from server');
    }
    
    console.log(`🔐 [FETCHER] ✅ Successfully verified user: ${email}`);
    return responseValidation.data;
  } catch (error) {
    console.error(`🔐 [FETCHER] ❌ Failed to verify user ${email}:`, error);
    throw new Error(`Failed to verify user: ${error.response?.data?.error || error.message}`);
  }
};

// =============================================================================
// LEGACY FUNCTION ALIASES - For backward compatibility
// =============================================================================

/** @deprecated Use getUsers instead */
export const fetchUsers = getUsers;

/** @deprecated Use getUser instead */
export const fetchUser = getUser;

/** @deprecated Use registerUser instead */
export const createUser = registerUser;

/** @deprecated Use verifyUser instead */
export const loginUser = verifyUser;

/** @deprecated Use verifyEmail instead */
export const confirmEmail = verifyEmail;

/** @deprecated Use resetPassword instead */
export const confirmPasswordReset = resetPassword;

/** @deprecated Use getResetPasswordToken instead */
export const requestPasswordReset = getResetPasswordToken;

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
