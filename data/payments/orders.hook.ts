import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from "react-query";
import type { Order, Orders, OrderReport } from "@/types/payments";
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

/**
 * Hook to fetch all payments
 */
export const useFetchPayments = (organizationId: number): UseQueryResult<Orders | undefined, Error> => {
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
 */
export const useFetchPayment = (paymentId: number): UseQueryResult<Order | undefined, Error> => {
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
 */
export const useFetchPaymentsByUser = (userId: number): UseQueryResult<Orders | undefined, Error> => {
  return useQuery(
    ["paymentsByUser", userId],
    () =>
      fetchPaymentsbyUser(`${paymentsAPIendpoint}/paymentsbyuser/${userId}/`),
    {
      enabled: !!userId, // Only fetch when userId is defined
    }
  );
};

interface VerifyPaymentParams {
  url: string;
  data: { reference: string; customer_id: number };
}

/**
 * Hook to verify a payment
 */
export const useVerifyPayment = (): UseMutationResult<Order | undefined, Error, VerifyPaymentParams> => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ url, data }: VerifyPaymentParams) => verifyPayment(url, data),
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
export const useAddPayment = (): UseMutationResult<Order | undefined, Error, Omit<Order, "id" | "created_at" | "updated_at">> => {
  const queryClient = useQueryClient();

  return useMutation(addPayment, {
    onSuccess: () => {
      // Invalidate payments list to refetch data after a new payment is added
      queryClient.invalidateQueries("payments");
    },
  });
};

/**
 * Hook to update a payment
 */
export const useUpdatePayment = (): UseMutationResult<Order | undefined, Error, Partial<Order> & { id: number }> => {
  const queryClient = useQueryClient();

  return useMutation(updatePayment, {
    onSuccess: (_, { id }) => {
      // Invalidate the updated payment and refresh payments list
      queryClient.invalidateQueries(["payment", id]);
      queryClient.invalidateQueries("payments");
    },
  });
};

/**
 * Hook to delete a payment
 */
export const useDeletePayment = (): UseMutationResult<number, Error, number> => {
  const queryClient = useQueryClient();

  return useMutation(deletePayment, {
    onSuccess: (paymentId) => {
      // Invalidate payments list to reflect the deletion
      queryClient.invalidateQueries("payments");
      queryClient.invalidateQueries(["payment", paymentId]);
    },
  });
};

/**
 * Hook to get the order report
 */
export const useGetOrderReport = (): UseQueryResult<OrderReport | undefined, Error> => {
  return useQuery(["orderReport"], () => getOrderReport(), {
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
