import { AxiosInstanceWithToken } from "../instance";
import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from "react-query";
import {
  PaymentResponse,
  CreatePayment,
  UpdatePayment,
  VerifyPayment,
  PaymentArray,
  CustomerPaymentStatsArray,
  PaymentStats
} from "@/types/payments";

export const paymentsAPIendpoint = "/paymentsapi";

// Query Keys
export const PAYMENT_KEYS = {
  all: ['payments'] as const,
  lists: () => [...PAYMENT_KEYS.all, 'list'] as const,
  listsbyUser: (userId: number) => [...PAYMENT_KEYS.all, 'listbyUser', userId] as const,
  list: (organizationId: number) => [...PAYMENT_KEYS.lists(), organizationId] as const,
  details: () => [...PAYMENT_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...PAYMENT_KEYS.details(), id] as const,
} as const;

// Base API functions
export const fetchPayments = async (organizationId: number): Promise<PaymentArray> => {
  const response = await AxiosInstanceWithToken.get(`${paymentsAPIendpoint}/payments/${organizationId}/`);
  return response.data;
};

export const fetchPayment = async (paymentId: number): Promise<PaymentResponse> => {
  const response = await AxiosInstanceWithToken.get(`${paymentsAPIendpoint}/payment/${paymentId}/`);
  return response.data;
};

export const createPayment = async (organizationId: number, paymentData: CreatePayment): Promise<PaymentResponse> => {
  const response = await AxiosInstanceWithToken.post(
    `${paymentsAPIendpoint}/addpayment/${organizationId}/`,
    paymentData
  );
  return response.data;
};

export const updatePayment = async (paymentId: number, updateData: UpdatePayment): Promise<PaymentResponse> => {
  const response = await AxiosInstanceWithToken.put(
    `${paymentsAPIendpoint}/updatepayment/${paymentId}/`,
    updateData
  );
  return response.data;
};

export const deletePayment = async (paymentId: number): Promise<void> => {
  await AxiosInstanceWithToken.delete(`${paymentsAPIendpoint}/deletepayment/${paymentId}/`);
};

export const verifyPayment = async (paymentData: VerifyPayment): Promise<{ verified: boolean; message: string }> => {
  const response = await AxiosInstanceWithToken.post(
    `${paymentsAPIendpoint}/verifypayment/`,
    paymentData
  );
  return response.data;
};

export const getOrderReport = async (organizationId: number): Promise<PaymentStats> => {
  const response = await AxiosInstanceWithToken.get(`${paymentsAPIendpoint}/getorderreport/${organizationId}/`);
  return response.data;
};

export const getPaymentsByUser = async (userId: number): Promise<PaymentArray> => {
  const response = await AxiosInstanceWithToken.get(`${paymentsAPIendpoint}/paymentsbyuser/${userId}/`);
  return response.data;
};


// React Query Hooks
export const usePayments = (organizationId: number): UseQueryResult<PaymentArray, Error> => {
  return useQuery({
    queryKey: PAYMENT_KEYS.list(organizationId),
    queryFn: () => fetchPayments(organizationId),
    onError: (error: Error) => {
      console.error('Error fetching payments:', error);
      throw error;
    },
  });
};

export const useOrderReport = (organizationId: number): UseQueryResult<PaymentStats, Error> => {
  return useQuery({
    queryKey: ['payments', 'orderReport', organizationId],
    queryFn: () => getOrderReport(organizationId),
    onError: (error: Error) => {
      console.error('Error fetching order report:', error);
      throw error;
    },
  });
};

export const usePaymentsByUser = (userId: number): UseQueryResult<PaymentArray, Error> => {
  return useQuery({
    queryKey: PAYMENT_KEYS.listsbyUser(userId),
    queryFn: () => getPaymentsByUser(userId),
    enabled: !!userId,
    onError: (error: Error) => {
      console.error('Error fetching payments by user:', error);
      throw error;
    },
  });
};

export const usePayment = (paymentId: number): UseQueryResult<PaymentResponse, Error> => {
  return useQuery({
    queryKey: PAYMENT_KEYS.detail(paymentId),
    queryFn: () => fetchPayment(paymentId),
    enabled: !!paymentId,
    onError: (error: Error) => {
      console.error('Error fetching payment:', error);
      throw error;
    },
  });
};

export const useCreatePayment = (): UseMutationResult<PaymentResponse, Error, { organizationId: number; paymentData: CreatePayment }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ organizationId, paymentData }) => createPayment(organizationId, paymentData),
    onSuccess: (data, { organizationId }) => {
      // Invalidate and refetch payments list
      queryClient.invalidateQueries(PAYMENT_KEYS.list(organizationId));
      queryClient.invalidateQueries(PAYMENT_KEYS.lists());
    },
    onError: (error: Error) => {
      console.error('Error creating payment:', error);
      throw error;
    },
  });
};

export const useUpdatePayment = (): UseMutationResult<PaymentResponse, Error, { paymentId: number; updateData: UpdatePayment }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ paymentId, updateData }) => updatePayment(paymentId, updateData),
    onSuccess: (data, { paymentId }) => {
      // Update the specific payment in cache
      queryClient.setQueryData(PAYMENT_KEYS.detail(paymentId), data);
      // Invalidate payments lists to refresh any lists containing this payment
      queryClient.invalidateQueries(PAYMENT_KEYS.lists());
    },
    onError: (error: Error) => {
      console.error('Error updating payment:', error);
      throw error;
    },
  });
};

export const useDeletePayment = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deletePayment,
    onSuccess: (_, paymentId) => {
      // Remove the specific payment from cache
      queryClient.removeQueries(PAYMENT_KEYS.detail(paymentId));
      // Invalidate payments lists to refresh
      queryClient.invalidateQueries(PAYMENT_KEYS.lists());
    },
    onError: (error: Error) => {
      console.error('Error deleting payment:', error);
      throw error;
    },
  });
};

export const useVerifyPayment = (): UseMutationResult<{ verified: boolean; message: string }, Error, VerifyPayment> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: verifyPayment,
    onSuccess: () => {
      // Invalidate payments lists to refresh after verification
      queryClient.invalidateQueries(PAYMENT_KEYS.lists());
    },
    onError: (error: Error) => {
      console.error('Error verifying payment:', error);
      throw error;
    },
  });
};

// Alias for backward compatibility with CartContext
export const addPayment = createPayment;
export const useAddPayment = useCreatePayment;

