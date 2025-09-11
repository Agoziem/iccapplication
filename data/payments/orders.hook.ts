/**
 * @fileoverview Payment Management React Query Hooks
 * 
 * Comprehensive React Query hooks for payment system operations including
 * payments, verification, statistics, and customer management with enhanced
 * error handling, optimistic updates, and performance optimizations.
 * 
 * Features:
 * - Real-time payment data with automatic polling
 * - CRUD operations with optimistic updates and cache management
 * - Payment verification and status tracking
 * - Statistics and analytics with smart caching
 * - Bulk operations for efficient data management
 * - Comprehensive error handling and loading states
 * - Smart caching with automatic invalidation strategies
 * 
 * @version 3.0.0
 * @author Innovation CyberCafe Team
 */

"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "react-query";
import {
  // Core Payment Operations (Documented API Endpoints)
  fetchPayments,
  fetchPayment,
  fetchPaymentsByUser,
  createPayment,
  updatePayment,
  deletePayment,
  
  // Verification
  verifyPayment,
  
  // Statistics & Reports
  getOrderReport,
  
  // Legacy aliases
  addPayment,
} from "./fetcher";

const paymentsAPIendpoint = "/paymentsapi";

// =================== CORE PAYMENT HOOKS =================== //

/**
 * Hook to fetch payments for an organization
 * Retrieves all payments for the specified organization.
 * 
 * @function useFetchPayments
 * @param {number} [organizationId] - Organization ID (optional)
 * @param {Object} [options={}] - React Query options
 * @returns {Object} React Query query object for payments
 */
export const useFetchPayments = (organizationId, options = {}) => {
  return useQuery(
    ["payments", organizationId],
    () => fetchPayments(organizationId),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      cacheTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      onSuccess: (data) => {
        console.log(`💳 [HOOK] Successfully fetched ${data.length} payments`);
      },
      onError: (error) => {
        console.error('💳 [HOOK] Failed to fetch payments:', error);
      },
      ...options,
    }
  );
};

/**
 * Hook to fetch payments with infinite scroll (Note: API doesn't support pagination)
 * This hook is provided for compatibility but loads all payments at once.
 * 
 * @function useFetchPaymentsInfinite
 * @param {number} [organizationId] - Organization ID
 * @param {Object} [options={}] - React Query options
 * @returns {Object} React Query infinite query object
 */
export const useFetchPaymentsInfinite = (organizationId, options = {}) => {
  return useInfiniteQuery(
    ["payments-infinite", organizationId],
    ({ pageParam = 1 }) => {
      // Since API doesn't support pagination, we return all payments on first page
      if (pageParam === 1) {
        return fetchPayments(organizationId);
      }
      return []; // No more pages
    },
    {
      getNextPageParam: (lastPage, pages) => {
        // Since API returns all payments, there's no next page
        return undefined;
      },
      staleTime: 2 * 60 * 1000,
      cacheTime: 5 * 60 * 1000,
      onError: (error) => {
        console.error('💳 [HOOK] Failed to fetch infinite payments:', error);
      },
      ...options,
    }
  );
};

/**
 * Hook to fetch a single payment by ID
 * Retrieves detailed payment information with automatic caching.
 * 
 * @function useFetchPayment
 * @param {number} paymentId - Payment ID to retrieve
 * @param {Object} [options={}] - React Query options
 * @returns {Object} React Query query object for single payment
 */
export const useFetchPayment = (paymentId, options = {}) => {
  return useQuery(
    ["payment", paymentId],
    () => fetchPayment(paymentId),
    {
      enabled: !!paymentId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      onSuccess: (data) => {
        console.log(`💳 [HOOK] Successfully fetched payment: ${paymentId}`);
      },
      onError: (error) => {
        console.error(`💳 [HOOK] Failed to fetch payment ${paymentId}:`, error);
      },
      ...options,
    }
  );
};

/**
 * Hook to fetch payments by user/customer
 * Retrieves all payments made by a specific customer.
 * 
 * @function useFetchPaymentsByUser
 * @param {number} userId - Customer/user ID
 * @param {Object} [options={}] - React Query options
 * @returns {Object} React Query query object for user payments
 */
export const useFetchPaymentsByUser = (userId, options = {}) => {
  return useQuery(
    ["paymentsByUser", userId],
    () => fetchPaymentsByUser(userId),
    {
      enabled: !!userId,
      staleTime: 2 * 60 * 1000, // 2 minutes
      cacheTime: 5 * 60 * 1000, // 5 minutes
      onSuccess: (data) => {
        console.log(`💳 [HOOK] Successfully fetched ${data.length} payments for user: ${userId}`);
      },
      onError: (error) => {
        console.error(`💳 [HOOK] Failed to fetch payments for user ${userId}:`, error);
      },
      ...options,
    }
  );
};

// =================== PAYMENT CRUD OPERATIONS =================== //

/**
 * Hook to create a new payment
 * Creates payment with automatic cache invalidation and optimistic updates.
 * 
 * @function useCreatePayment
 * @returns {Object} React Query mutation object for payment creation
 */
export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  return useMutation(createPayment, {
    onSuccess: (newPayment) => {
      // Invalidate payments list
      queryClient.invalidateQueries(["payments"]);
      queryClient.invalidateQueries(["payments-infinite"]);
      // Add to cache
      queryClient.setQueryData(["payment", newPayment.id], newPayment);
      console.log(`💳 [HOOK] Successfully created payment: ${newPayment.id}`);
    },
    onError: (error) => {
      console.error('💳 [HOOK] Failed to create payment:', error);
    },
  });
};

/**
 * Hook to update a payment
 * Updates payment with optimistic updates and cache management.
 * 
 * @function useUpdatePayment
 * @returns {Object} React Query mutation object for payment updates
 */
export const useUpdatePayment = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (/** @type {{id: number, data: Partial<Payment>}} */ variables) => updatePayment(variables.id, variables.data),
    {
      onMutate: async (/** @type {{id: number, data: Partial<Payment>}} */ variables) => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries(["payment", variables.id]);
        await queryClient.cancelQueries(["payments"]);
        
        // Snapshot previous values
        const previousPayment = queryClient.getQueryData(["payment", variables.id]);
        const previousPayments = queryClient.getQueryData(["payments"]);
        
        // Optimistically update single payment
        if (previousPayment && typeof previousPayment === 'object') {
          queryClient.setQueryData(["payment", variables.id], {
            ...(/** @type {Payment} */ previousPayment),
            ...variables.data,
          });
        }
        
        // Optimistically update payments list
        if (previousPayments && Array.isArray(previousPayments)) {
          queryClient.setQueryData(["payments"], (/** @type {Payment[]} */ old) => {
            return old.map((/** @type {Payment} */ payment) =>
              payment.id === variables.id ? { ...payment, ...variables.data } : payment
            );
          });
        }
        
        return { previousPayment, previousPayments };
      },
      onError: (error, variables, context) => {
        // Rollback on error
        if (context?.previousPayment) {
          queryClient.setQueryData(["payment", variables.id], context.previousPayment);
        }
        if (context?.previousPayments) {
          queryClient.setQueryData(["payments"], context.previousPayments);
        }
        console.error('💳 [HOOK] Failed to update payment:', error);
      },
      onSuccess: (updatedPayment, variables) => {
        // Update specific payment in cache
        queryClient.setQueryData(["payment", variables.id], updatedPayment);
        console.log(`💳 [HOOK] Successfully updated payment: ${variables.id}`);
      },
      onSettled: () => {
        // Always refetch after error or success
        queryClient.invalidateQueries(["payments"]);
        queryClient.invalidateQueries(["payments-infinite"]);
      },
    }
  );
};

/**
 * Hook to delete a payment
 * Deletes payment with optimistic updates and cache cleanup.
 * 
 * @function useDeletePayment
 * @returns {Object} React Query mutation object for payment deletion
 */
export const useDeletePayment = () => {
  const queryClient = useQueryClient();
  return useMutation(deletePayment, {
    onMutate: async (paymentId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(["payments"]);
      
      // Snapshot previous value
      const previousPayments = queryClient.getQueryData(["payments"]);
      
      // Optimistically update
      if (previousPayments && Array.isArray(previousPayments)) {
        queryClient.setQueryData(["payments"], (/** @type {Payment[]} */ old) => {
          return old.filter((/** @type {Payment} */ payment) => payment.id !== paymentId);
        });
      }
      
      return { previousPayments };
    },
    onError: (error, paymentId, context) => {
      // Rollback on error
      if (context?.previousPayments) {
        queryClient.setQueryData(["payments"], context.previousPayments);
      }
      console.error('💳 [HOOK] Failed to delete payment:', error);
    },
    onSuccess: (deletedId) => {
      // Remove specific payment from cache
      queryClient.removeQueries(["payment", deletedId]);
      console.log(`💳 [HOOK] Successfully deleted payment: ${deletedId}`);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries(["payments"]);
      queryClient.invalidateQueries(["payments-infinite"]);
    },
  });
};

// =================== PAYMENT VERIFICATION =================== //

/**
 * Hook to verify a payment
 * Verifies payment transaction using reference and customer ID.
 * 
 * @function useVerifyPayment
 * @returns {Object} React Query mutation object for payment verification
 */
export const useVerifyPayment = () => {
  const queryClient = useQueryClient();
  return useMutation(verifyPayment, {
    onSuccess: (verifiedPayment) => {
      // Update specific payment in cache if it exists
      if (verifiedPayment.id) {
        queryClient.setQueryData(["payment", verifiedPayment.id], verifiedPayment);
      }
      // Invalidate payments to refetch updated data
      queryClient.invalidateQueries(["payments"]);
      queryClient.invalidateQueries(["paymentsByUser"]);
      console.log(`💳 [HOOK] Successfully verified payment: ${verifiedPayment.reference}`);
    },
    onError: (error) => {
      console.error('💳 [HOOK] Failed to verify payment:', error);
    },
  });
};

// =================== STATISTICS AND ANALYTICS HOOKS =================== //

/**
 * Hook to fetch payment statistics
 * Retrieves order report with payment statistics and customer analytics.
 * 
 * @function useFetchPaymentStats
 * @param {number} [organizationId] - Organization ID (optional)
 * @param {Object} [queryOptions={}] - React Query options
 * @returns {Object} React Query query object for payment statistics
 */
export const useFetchPaymentStats = (organizationId, queryOptions = {}) => {
  return useQuery(
    ["paymentStats", organizationId],
    () => getOrderReport(organizationId),
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
      cacheTime: 15 * 60 * 1000, // 15 minutes
      onSuccess: (data) => {
        console.log(`💳 [HOOK] Successfully fetched payment statistics: ${data.totalorders} orders, ${data.totalcustomers} customers`);
      },
      onError: (error) => {
        console.error('💳 [HOOK] Failed to fetch payment statistics:', error);
      },
      ...queryOptions,
    }
  );
};

// =================== COMPOUND HOOKS FOR COMPLEX OPERATIONS =================== //

/**
 * Hook for payment dashboard data
 * Combines multiple payment-related queries for dashboard views.
 * 
 * @function usePaymentDashboard
 * @param {Object} [filters={}] - Dashboard data filters
 * @returns {Object} Combined query results for payment dashboard
 */
export const usePaymentDashboard = (filters = {}) => {
  const paymentsQuery = useFetchPayments(filters.organization_id);
  const statsQuery = useFetchPaymentStats(filters.organization_id);

  return {
    payments: paymentsQuery,
    stats: statsQuery,
    isLoading: paymentsQuery.isLoading || statsQuery.isLoading,
    hasError: paymentsQuery.isError || statsQuery.isError,
    refetchAll: () => {
      paymentsQuery.refetch();
      statsQuery.refetch();
    },
  };
};

/**
 * Hook for payment management operations
 * Provides all payment management mutations in one place.
 * 
 * @function usePaymentManagement
 * @returns {Object} Combined mutation objects for payment management
 */
export const usePaymentManagement = () => {
  const createPaymentMutation = useCreatePayment();
  const updatePaymentMutation = useUpdatePayment();
  const deletePaymentMutation = useDeletePayment();
  const verifyPaymentMutation = useVerifyPayment();

  return {
    create: createPaymentMutation,
    update: updatePaymentMutation,
    delete: deletePaymentMutation,
    verify: verifyPaymentMutation,
    isLoading: 
      createPaymentMutation.isLoading ||
      updatePaymentMutation.isLoading ||
      deletePaymentMutation.isLoading ||
      verifyPaymentMutation.isLoading,
  };
};

// =================== LEGACY HOOKS FOR BACKWARD COMPATIBILITY =================== //

/** @deprecated Use useCreatePayment instead */
export const useAddPayment = useCreatePayment;

/** @deprecated Use useFetchPaymentStats instead */
export const useGetOrderReport = () => {
  return useQuery(["orderReport"], () => getOrderReport(), {
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
