import { z } from "zod";

// CreateOrderSchema
export const CreateOrderSchema = z.object({
  customerid: z.number(),
  total: z.number().nonnegative(), // or z.string().regex(...) if you use string
  services: z.array(z.number()),
  products: z.array(z.number()),
  videos: z.array(z.number()),
});
export type CreateOrderType = z.infer<typeof CreateOrderSchema>;

// UpdateOrderSchema
export const UpdateOrderSchema = z.object({
  organizationid: z.number().optional(),
  customerid: z.number().optional(),
  amount: z.number().optional(),
  services: z.array(z.number()).optional(),
  products: z.array(z.number()).optional(),
  videos: z.array(z.number()).optional(),
  status: z.string().optional(),
  service_delivered: z.boolean().optional(),
});
export type UpdateOrderType = z.infer<typeof UpdateOrderSchema>;
