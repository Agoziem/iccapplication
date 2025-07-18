import {
  productSchema,
  serviceSchema,
  UserPurchasedResponseSchema,
  UserPurchaseSchema,
  videoSchema,
} from "@/schemas/items";
import { z } from "zod";

export type Service = z.infer<typeof serviceSchema>;

export type Services = Service[];

export type Product = z.infer<typeof productSchema>;

export type Products = Product[];

export type Video = z.infer<typeof videoSchema>;

export type Videos = Video[];

export type ServiceUser = z.infer<typeof UserPurchaseSchema>;

export type PaginatedServiceUser = z.infer<typeof UserPurchasedResponseSchema>;
