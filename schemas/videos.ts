import { z } from "zod";

export const createVideoSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.coerce.number().nonnegative().default(0),
  free: z.boolean().default(false),
  category: z.number().optional().nullable(),       // ID only
  subcategory: z.number().optional().nullable(),    // ID only
  organization: z.number().min(1),                  // Required
});
export type CreateVideoType = z.infer<typeof createVideoSchema>;

// Zod Schema: UpdateVideo
export const updateVideoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  price: z.coerce.number().optional(),
  free: z.boolean().optional(),
  category: z.number().optional(),
  subcategory: z.number().optional(),
  organization: z.number().optional(),
});
export type UpdateVideoType = z.infer<typeof updateVideoSchema>;

