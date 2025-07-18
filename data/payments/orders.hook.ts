import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  fetchPayments,
  fetchPayment,
  fetchPaymentsbyUser,
  verifyPayment,
  addPayment,
  updatePayment,
  deletePayment,
  getOrderReport,
} from "@/data/payments/fetcher";

// Base URL for payments API
const paymentsAPIendpoint = "/paymentsapi";

// ------------------------------------------------------
// React Query Hooks for Payment API
// ------------------------------------------------------

/**
 * Hook to fetch all payments
 * @param {string} organizationId
 */
export const useFetchPayments = (organizationId) => {
  return useQuery(
    ["payments", organizationId],
    () => fetchPayments(`${paymentsAPIendpoint}/payments/${organizationId}/`),
    {
      staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    }
  );
};



/**
 * Hook to fetch a single payment
 * @param {number} paymentId
 */
export const useFetchPayment = (paymentId) => {
  return useQuery(
    ["payment", paymentId],
    () => fetchPayment(`${paymentsAPIendpoint}/payment/${paymentId}/`),
    {
      enabled: !!paymentId, // Only fetch when paymentId is defined
    }
  );
};

/**
 * Hook to fetch payments by user
 * @param {number} userId
 */
export const useFetchPaymentsByUser = (userId) => {
  return useQuery(
    ["paymentsByUser", userId],
    () =>
      fetchPaymentsbyUser(`${paymentsAPIendpoint}/paymentsbyuser/${userId}/`),
    {
      enabled: !!userId, // Only fetch when userId is defined
    }
  );
};

/**
 * Hook to verify a payment
 */
export const useVerifyPayment = () => {
  const queryClient = useQueryClient();

  return useMutation(
    /**
     * @param {{ url: string, data: { reference: string, customer_id: number } }} params
     */
    ({ url, data }) => verifyPayment(url, data),
    {
      onSuccess: () => {
        // Optionally invalidate payments queries to refetch updated data
        queryClient.invalidateQueries("payments");
      },
    }
  );
};

/**
 * Hook to add a payment
 */
export const useAddPayment = () => {
  const queryClient = useQueryClient();

  return useMutation(
    /**
     * @param {Order} data - The payment data to be added.
     * @returns {Promise<Order>}
     */
    (data) => addPayment(data),
    {
      onSuccess: () => {
        // Invalidate payments list to refetch data after a new payment is added
        queryClient.invalidateQueries("payments");
      },
    }
  );
};

/**
 * Hook to update a payment
 */
export const useUpdatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation(
    /**
     * @param {Order} data - The payment data to be updated.
     * @returns {Promise<Order>}
     */
    (data) => updatePayment(data),
    {
      onSuccess: (_, { id }) => {
        // Invalidate the updated payment and refresh payments list
        queryClient.invalidateQueries(["payment", id]);
        queryClient.invalidateQueries("payments");
      },
    }
  );
};

/**
 * Hook to delete a payment
 */
export const useDeletePayment = () => {
  const queryClient = useQueryClient();

  return useMutation(
    /**
     * @param {number} paymentId
     */
    (paymentId) => deletePayment(paymentId),
    {
      onSuccess: (paymentId) => {
        // Invalidate payments list to reflect the deletion
        queryClient.invalidateQueries("payments");
        queryClient.invalidateQueries(["payment", paymentId]);
      },
    }
  );
};

/**
 * Hook to get the order report
 */
export const useGetOrderReport = () => {
  return useQuery(["orderReport"], () => getOrderReport(), {
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
