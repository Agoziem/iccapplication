/**
 * @fileoverview Payment Management API Functions
 * 
 * Strictly follows paymentsapi endpoints from Django REST API documentation.
 * Only implements the documented endpoints without additional features.
 * 
 * API Endpoints Implemented:
 * - GET /paymentsapi/payments/{organization_id}/ - Get payments for organization
 * - GET /paymentsapi/payment/{payment_id}/ - Get single payment
 * - GET /paymentsapi/paymentsbyuser/{user_id}/ - Get payments by user
 * - POST /paymentsapi/verifypayment/ - Verify payment
 * - POST /paymentsapi/addpayment/{organization_id}/ - Add new payment
 * - PUT /paymentsapi/updatepayment/{payment_id}/ - Update payment
 * - DELETE /paymentsapi/deletepayment/{payment_id}/ - Delete payment
 * - GET /paymentsapi/getorderreport/{organization_id}/ - Get order report
 * 
 * @version 2.0.0
 * @author Innovation CyberCafe Team
 */

import { 
  PaymentSchema, 
  CreatePaymentSchema, 
  UpdatePaymentSchema,
  VerifyPaymentSchema,
  PaymentCountStatsSchema,
  PaymentArraySchema
} from "@/schemas/payments";
import axios from "axios";

// =================== AXIOS CONFIGURATION =================== //

/**
 * Enhanced axios instance with production-ready configuration
 * Features 15-second timeout, request/response interceptors, and automatic error handling
 */
export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}`,
  timeout: 15000, // 15-second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for authentication and logging
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`💳 [FETCHER] ${config.method?.toUpperCase()} ${config.url}`);
    
    // Add authentication token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('💳 [FETCHER] Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and logging
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`💳 [FETCHER] Response ${response.status} from ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('💳 [FETCHER] Response error:', error.message);
    
    // Handle common HTTP errors
    if (error.response?.status === 401) {
      console.warn('💳 [FETCHER] Unauthorized access - redirecting to login');
    } else if (error.response?.status === 404) {
      console.warn('💳 [FETCHER] Resource not found:', error.config?.url);
    } else if (error.response?.status >= 500) {
      console.error('💳 [FETCHER] Server error detected');
    }
    
    return Promise.reject(error);
  }
);

const Organizationid = process.env.NEXT_PUBLIC_ORGANIZATION_ID;
export const paymentsAPIendpoint = "/paymentsapi";

// =================== DOCUMENTED API ENDPOINTS =================== //

/**
 * GET /paymentsapi/payments/{organization_id}/
 * Fetch all payments for an organization
 * 
 * @async
 * @function fetchPayments
 * @param {number} organizationId - Organization ID
 * @returns {Promise<PaymentArray>} Array of payment objects with validation
 * @throws {Error} When API request fails or validation errors occur
 */
export const fetchPayments = async (organizationId = parseInt(Organizationid)) => {
  try {
    const response = await axiosInstance.get(`${paymentsAPIendpoint}/payments/${organizationId}/`);
    
    const validation = PaymentArraySchema.safeParse(response.data);
    if (!validation.success) {
      console.error('💳 [FETCHER] Payment validation error:', validation.error.issues);
      throw new Error('Invalid payment data structure received from server');
    }
    
    console.log(`💳 [FETCHER] Successfully fetched ${validation.data.length} payments`);
    return validation.data;
  } catch (error) {
    console.error('💳 [FETCHER] Error fetching payments:', error);
    throw error;
  }
};

/**
 * GET /paymentsapi/payment/{payment_id}/
 * Fetch a single payment by ID
 * 
 * @async
 * @function fetchPayment
 * @param {number} paymentId - Payment ID to retrieve
 * @returns {Promise<Payment>} Payment object with validation
 * @throws {Error} When payment not found or validation fails
 */
export const fetchPayment = async (paymentId) => {
  try {
    if (!paymentId) {
      throw new Error('Payment ID is required');
    }
    
    const response = await axiosInstance.get(`${paymentsAPIendpoint}/payment/${paymentId}/`);
    
    const validation = PaymentSchema.safeParse(response.data);
    if (!validation.success) {
      console.error('💳 [FETCHER] Single payment validation error:', validation.error.issues);
      throw new Error('Invalid payment data structure received from server');
    }
    
    console.log(`💳 [FETCHER] Successfully fetched payment: ${paymentId}`);
    return validation.data;
  } catch (error) {
    console.error(`💳 [FETCHER] Error fetching payment ${paymentId}:`, error);
    throw error;
  }
};

/**
 * GET /paymentsapi/paymentsbyuser/{user_id}/
 * Fetch payments by user/customer
 * 
 * @async
 * @function fetchPaymentsByUser
 * @param {number} userId - Customer/user ID
 * @returns {Promise<PaymentArray>} Array of user's payments with validation
 * @throws {Error} When user ID is invalid or API request fails
 */
export const fetchPaymentsByUser = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    const response = await axiosInstance.get(`${paymentsAPIendpoint}/paymentsbyuser/${userId}/`);
    
    const validation = PaymentArraySchema.safeParse(response.data);
    if (!validation.success) {
      console.error('💳 [FETCHER] User payments validation error:', validation.error.issues);
      throw new Error('Invalid payments data structure received from server');
    }
    
    console.log(`💳 [FETCHER] Successfully fetched ${validation.data.length} payments for user: ${userId}`);
    return validation.data;
  } catch (error) {
    console.error(`💳 [FETCHER] Error fetching payments for user ${userId}:`, error);
    throw error;
  }
};

/**
 * POST /paymentsapi/verifypayment/
 * Verify a payment transaction
 * 
 * @async
 * @function verifyPayment
 * @param {VerifyPayment} data - Payment verification data
 * @returns {Promise<Payment>} Verified payment object
 * @throws {Error} When verification fails or payment not found
 */
export const verifyPayment = async (data) => {
  try {
    // Validate input data
    const inputValidation = VerifyPaymentSchema.safeParse(data);
    if (!inputValidation.success) {
      console.error('💳 [FETCHER] Verify payment input validation error:', inputValidation.error.issues);
      throw new Error('Invalid payment verification data');
    }
    
    const response = await axiosInstance.post(`${paymentsAPIendpoint}/verifypayment/`, inputValidation.data);
    
    const validation = PaymentSchema.safeParse(response.data);
    if (!validation.success) {
      console.error('💳 [FETCHER] Verify payment response validation error:', validation.error.issues);
      throw new Error('Invalid payment data received from verification');
    }
    
    console.log(`💳 [FETCHER] Successfully verified payment: ${data.reference}`);
    return validation.data;
  } catch (error) {
    console.error('💳 [FETCHER] Error verifying payment:', error);
    throw error;
  }
};

/**
 * POST /paymentsapi/addpayment/{organization_id}/
 * Create a new payment
 * 
 * @async
 * @function createPayment
 * @param {CreatePayment} data - Payment creation data
 * @returns {Promise<Payment>} Created payment object with validation
 * @throws {Error} When validation fails or creation unsuccessful
 */
export const createPayment = async (data) => {
  try {
    // Validate input data
    const inputValidation = CreatePaymentSchema.safeParse(data);
    if (!inputValidation.success) {
      console.error('💳 [FETCHER] Create payment input validation error:', inputValidation.error.issues);
      throw new Error('Invalid payment creation data');
    }
    
    const response = await axiosInstance.post(
      `${paymentsAPIendpoint}/addpayment/${Organizationid}/`,
      inputValidation.data
    );
    
    const validation = PaymentSchema.safeParse(response.data);
    if (!validation.success) {
      console.error('💳 [FETCHER] Create payment response validation error:', validation.error.issues);
      throw new Error('Invalid payment data received from server');
    }
    
    console.log(`💳 [FETCHER] Successfully created payment with ID: ${validation.data.id}`);
    return validation.data;
  } catch (error) {
    console.error('💳 [FETCHER] Error creating payment:', error);
    throw error;
  }
};

/**
 * PUT /paymentsapi/updatepayment/{payment_id}/
 * Update an existing payment
 * 
 * @async
 * @function updatePayment
 * @param {number} paymentId - Payment ID to update
 * @param {UpdatePayment} data - Payment update data (partial)
 * @returns {Promise<Payment>} Updated payment object with validation
 * @throws {Error} When payment not found or validation fails
 */
export const updatePayment = async (paymentId, data) => {
  try {
    if (!paymentId) {
      throw new Error('Payment ID is required for update');
    }
    
    // Validate input data
    const inputValidation = UpdatePaymentSchema.safeParse(data);
    if (!inputValidation.success) {
      console.error('💳 [FETCHER] Update payment input validation error:', inputValidation.error.issues);
      throw new Error('Invalid payment update data');
    }
    
    const response = await axiosInstance.put(
      `${paymentsAPIendpoint}/updatepayment/${paymentId}/`,
      inputValidation.data
    );
    
    const validation = PaymentSchema.safeParse(response.data);
    if (!validation.success) {
      console.error('💳 [FETCHER] Update payment response validation error:', validation.error.issues);
      throw new Error('Invalid payment data received from server');
    }
    
    console.log(`💳 [FETCHER] Successfully updated payment: ${paymentId}`);
    return validation.data;
  } catch (error) {
    console.error(`💳 [FETCHER] Error updating payment ${paymentId}:`, error);
    throw error;
  }
};

/**
 * DELETE /paymentsapi/deletepayment/{payment_id}/
 * Delete a payment
 * 
 * @async
 * @function deletePayment
 * @param {number} paymentId - Payment ID to delete
 * @returns {Promise<number>} Deleted payment ID for confirmation
 * @throws {Error} When payment not found or deletion fails
 */
export const deletePayment = async (paymentId) => {
  try {
    if (!paymentId) {
      throw new Error('Payment ID is required for deletion');
    }
    
    await axiosInstance.delete(`${paymentsAPIendpoint}/deletepayment/${paymentId}/`);
    
    console.log(`💳 [FETCHER] Successfully deleted payment: ${paymentId}`);
    return paymentId;
  } catch (error) {
    console.error(`💳 [FETCHER] Error deleting payment ${paymentId}:`, error);
    throw error;
  }
};

/**
 * GET /paymentsapi/getorderreport/{organization_id}/
 * Get order report with payment statistics
 * 
 * @async
 * @function getOrderReport
 * @param {number} [organizationId] - Organization ID (defaults to env variable)
 * @returns {Promise<PaymentCountStats>} Payment statistics report
 * @throws {Error} When API request fails or validation errors occur
 */
export const getOrderReport = async (organizationId = parseInt(Organizationid)) => {
  try {
    const response = await axiosInstance.get(`${paymentsAPIendpoint}/getorderreport/${organizationId}/`);
    
    const validation = PaymentCountStatsSchema.safeParse(response.data);
    if (!validation.success) {
      console.error('💳 [FETCHER] Order report validation error:', validation.error.issues);
      throw new Error('Invalid order report data received from server');
    }
    
    console.log(`💳 [FETCHER] Successfully fetched order report: ${validation.data.totalorders} orders, ${validation.data.totalcustomers} customers`);
    return validation.data;
  } catch (error) {
    console.error('💳 [FETCHER] Error fetching order report:', error);
    throw error;
  }
};

// =================== LEGACY FUNCTION ALIASES =================== //

/** @deprecated Use createPayment instead */
export const addPayment = createPayment;
