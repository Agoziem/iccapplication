import { z } from "zod";
import {
  PaymentResponseSchema,
  CreatePaymentSchema,
  UpdatePaymentSchema,
  VerifyPaymentSchema,
  CustomerPaymentStatsSchema,
  PaymentCountStatsSchema,
  PaymentArraySchema,
  CustomerPaymentStatsArraySchema
} from "../schemas/payments";

// Extract TypeScript types from Zod schemas
export type PaymentResponse = z.infer<typeof PaymentResponseSchema>;
export type CreatePayment = z.infer<typeof CreatePaymentSchema>;
export type UpdatePayment = z.infer<typeof UpdatePaymentSchema>;
export type VerifyPayment = z.infer<typeof VerifyPaymentSchema>;
export type CustomerPaymentStats = z.infer<typeof CustomerPaymentStatsSchema>;
export type PaymentCountStats = z.infer<typeof PaymentCountStatsSchema>;

// Array types
export type PaymentArray = z.infer<typeof PaymentArraySchema>;
export type CustomerPaymentStatsArray = z.infer<typeof CustomerPaymentStatsArraySchema>;

// Additional utility types
export type PaymentStatus = "Pending" | "Completed" | "Failed";
export type PaymentSummary = Pick<PaymentResponse, 'id' | 'amount' | 'status' | 'reference' | 'created_at'>;
export type PaymentPreview = Pick<PaymentResponse, 'id' | 'amount' | 'status' | 'customer' | 'created_at'>;
export type CustomerSummary = Pick<CustomerPaymentStats, 'customer__id' | 'customer__username' | 'customer__count'>;

// Computed types
export type PaymentWithItems = PaymentResponse & {
  totalItems: number;
  itemTypes: ('service' | 'product' | 'video')[];
};

export type PaymentStats = {
  totalOrders: number;
  totalCustomers: number;
  customers: CustomerPaymentStats[];
};