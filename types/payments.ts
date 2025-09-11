import { z } from "zod";
import {
  PaymentSchema,
  CreatePaymentSchema,
  UpdatePaymentSchema,
  VerifyPaymentSchema,
  CustomerPaymentStatsSchema,
  PaymentCountStatsSchema,
  PaymentArraySchema,
  CustomerPaymentStatsArraySchema
} from "../schemas/payments";

// Extract TypeScript types from Zod schemas
export type Payment = z.infer<typeof PaymentSchema>;
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
export type PaymentSummary = Pick<Payment, 'id' | 'amount' | 'status' | 'reference' | 'created_at'>;
export type PaymentPreview = Pick<Payment, 'id' | 'amount' | 'status' | 'customer' | 'created_at'>;
export type CustomerSummary = Pick<CustomerPaymentStats, 'customer__id' | 'customer__username' | 'customer__count'>;

// Computed types
export type PaymentWithItems = Payment & {
  totalItems: number;
  itemTypes: ('service' | 'product' | 'video')[];
};