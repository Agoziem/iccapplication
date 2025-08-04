import { ORGANIZATION_ID } from "@/constants";
import { AxiosinstanceAuth } from "./instance";
import {
  OrderSchema,
  PaginatedOrderResponseSchema,
  PaymentStatsSchema,
} from "@/types/payments";
import { CreateOrderType, UpdateOrderType } from "@/schemas/payments";
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from "react-query";
const Organizationid = ORGANIZATION_ID;

// ======================================================
// React Query Hooks - Payments
// ======================================================

/**
 * Hook to fetch all payments
 */
export const useGetPayments =
  (): UseQueryResult<PaginatedOrderResponseSchema> => {
    return useQuery("payments", async () => {
      const response = await AxiosinstanceAuth.get(
        `/payments/${Organizationid}`
      );
      return response.data;
    });
  };

/**
 * Hook to fetch single payment
 */
export const useGetPayment = (id: number): UseQueryResult<OrderSchema> => {
  return useQuery(
    ["payment", id],
    async () => {
      const response = await AxiosinstanceAuth.get(`/payments/order/${id}`);
      return response.data;
    },
    {
      enabled: !!id,
    }
  );
};

/**
 * Hook to fetch payments by user
 */
export const useGetPaymentsByUser =
  (): UseQueryResult<PaginatedOrderResponseSchema> => {
    return useQuery("userPayments", async () => {
      const response = await AxiosinstanceAuth.get(`/payments/user`);
      return response.data;
    });
  };

/**
 * Hook to fetch pending payments
 */
export const useGetPendingPayments =
  (): UseQueryResult<PaginatedOrderResponseSchema> => {
    return useQuery("pendingPayments", async () => {
      const response = await AxiosinstanceAuth.get(
        `/payments/pending/${Organizationid}`
      );
      return response.data;
    });
  };

/**
 * Hook to fetch completed payments
 */
export const useGetCompletedPayments =
  (): UseQueryResult<PaginatedOrderResponseSchema> => {
    return useQuery("completedPayments", async () => {
      const response = await AxiosinstanceAuth.get(
        `/payments/completed/${Organizationid}`
      );
      return response.data;
    });
  };

/**
 * Hook to get order report
 */
export const useGetOrderReport = (): UseQueryResult<PaymentStatsSchema> => {
  return useQuery("orderReport", async () => {
    const response = await AxiosinstanceAuth.get(
      `/payments/getorderreport/${Organizationid}/`
    );
    return response.data;
  });
};

/**
 * Hook to verify payment
 */
export const useVerifyPayment = (): UseMutationResult<
  OrderSchema,
  Error,
  { reference: string; customer_id: number }
> => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({
      reference,
      customer_id,
    }: {
      reference: string;
      customer_id: number;
    }) => {
      const response = await AxiosinstanceAuth.post(`/payments/verify`, {
        reference,
        customer_id,
      });
      return response.data;
    },
    {
      onSuccess: () => {
        // Invalidate all payment-related queries after verification
        queryClient.invalidateQueries("payments");
        queryClient.invalidateQueries("userPayments");
        queryClient.invalidateQueries("pendingPayments");
        queryClient.invalidateQueries("completedPayments");
        queryClient.invalidateQueries("orderReport");
      },
      onError: (error) => {
        console.error("Failed to verify payment:", error);
      },
    }
  );
};

/**
 * Hook to add a new payment
 */
export const useAddPayment = (): UseMutationResult<
  OrderSchema,
  Error,
  CreateOrderType
> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: CreateOrderType) => {
      const response = await AxiosinstanceAuth.post(
        `/payments/${Organizationid}`,
        data
      );
      return response.data;
    },
    {
      onSuccess: () => {
        // Invalidate all payment-related queries
        queryClient.invalidateQueries("payments");
        queryClient.invalidateQueries("userPayments");
        queryClient.invalidateQueries("pendingPayments");
        queryClient.invalidateQueries("orderReport");
      },
      onError: (error) => {
        console.error("Failed to add payment:", error);
      },
    }
  );
};

/**
 * Hook to update an existing payment
 */
export const useUpdatePayment = (): UseMutationResult<
  OrderSchema,
  Error,
  { id: number; payment: UpdateOrderType }
> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: { id: number; payment: UpdateOrderType }) => {
      const response = await AxiosinstanceAuth.put(
        `/payments/updatepayment/${data.id}/`,
        data.payment
      );
      return response.data;
    },
    {
      onSuccess: (data, variables) => {
        // Invalidate all payment-related queries
        queryClient.invalidateQueries("payments");
        queryClient.invalidateQueries("userPayments");
        queryClient.invalidateQueries("pendingPayments");
        queryClient.invalidateQueries("completedPayments");
        queryClient.invalidateQueries("orderReport");
        queryClient.invalidateQueries(["payment", variables.id]);
      },
      onError: (error) => {
        console.error("Failed to update payment:", error);
      },
    }
  );
};

/**
 * Hook to delete a payment
 */
export const useDeletePayment = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (paymentid: number) => {
      await AxiosinstanceAuth.delete(`/payments/${paymentid}/`);
    },
    {
      onSuccess: () => {
        // Invalidate all payment-related queries
        queryClient.invalidateQueries("payments");
        queryClient.invalidateQueries("userPayments");
        queryClient.invalidateQueries("pendingPayments");
        queryClient.invalidateQueries("completedPayments");
        queryClient.invalidateQueries("orderReport");
      },
      onError: (error) => {
        console.error("Failed to delete payment:", error);
      },
    }
  );
};
