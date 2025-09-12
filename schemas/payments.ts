import { z } from "zod";
import { ServiceResponseSchema, ProductResponseSchema, VideoResponseSchema } from "./items";
import { AmountSchema } from "./custom-validation";
import { OrganizationMiniSchema } from "./organizations";
import { AuthUserSchema, UserminiSchema } from "./users";

// ---------------------------------------------------------------------
// Core Payment Schema (Based on API Payment model)
// ---------------------------------------------------------------------

export const PaymentResponseSchema = z.object({
  id: z.number().int().positive().optional(),
  organization: OrganizationMiniSchema,
  customer: AuthUserSchema,
  services: z.array(ServiceResponseSchema),
  products: z.array(ProductResponseSchema),
  videos: z.array(VideoResponseSchema),
  amount: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && isFinite(num);
  }, { message: "Amount must be a valid decimal string" }),
  status: z.enum(["Pending", "Completed", "Failed"]).optional(),
  reference: z.string().max(100, "Reference must be less than 100 characters").optional(),
  created_at: z.coerce.date().optional(),
  service_delivered: z.boolean().optional(),
  last_updated_date: z.coerce.date().optional(),
});

/**
 * Schema for creating payments (omits readonly fields)
 */
export const CreatePaymentSchema = z.object({
  organization: z.string().optional(),
  customer: z.number().int().positive(),
  amount: AmountSchema,
  services: z.array(z.number().int().positive()).optional(),
  products: z.array(z.number().int().positive()).optional(),
  videos: z.array(z.number().int().positive()).optional(),
});

/**
 * Schema for updating payments
 */
export const UpdatePaymentSchema = CreatePaymentSchema.partial();

// ---------------------------------------------------------------------
// Payment Verification Schema (Based on API VerifyPayment model)
// ---------------------------------------------------------------------
export const VerifyPaymentSchema = z.object({
  reference: z.string().min(1, "Payment reference is required"),
  customer_id: z.number().int().positive(),
});

// ---------------------------------------------------------------------
// Customer Payment Statistics Schema (Based on API CustomerPaymentStats model)
// ---------------------------------------------------------------------
export const CustomerPaymentStatsSchema = z.object({
  customer__id: z.number().int(),
  customer__username: z.string().min(1),
  customer__count: z.number().int(),
  amount__sum: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && isFinite(num);
  }, { message: "Amount sum must be a valid decimal string" }),
  amount__avg: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && isFinite(num);
  }, { message: "Amount average must be a valid decimal string" }),
});

// ---------------------------------------------------------------------
// Payment Count Statistics Schema (Based on API PaymentCountStats model)
// ---------------------------------------------------------------------
export const PaymentCountStatsSchema = z.object({
  totalorders: z.number().int(),
  totalcustomers: z.number().int(),
  customers: z.array(CustomerPaymentStatsSchema),
});

// ---------------------------------------------------------------------
// Array Schemas for bulk operations
// ---------------------------------------------------------------------

/**
 * Schema for arrays of payments
 */
export const PaymentArraySchema = z.array(PaymentResponseSchema);

/**
 * Schema for arrays of customer payment statistics
 */
export const CustomerPaymentStatsArraySchema = z.array(CustomerPaymentStatsSchema);
