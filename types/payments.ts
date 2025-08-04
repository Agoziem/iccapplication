// Minimal types – expand as needed
import { OrganizationMiniSchema } from "./organizations";
import { ProductMini } from "./products";
import { ServiceMini } from "./services";
import { UserMini } from "./users";
import { VideoMini } from "./videos";



export type OrderSchema = {
  id: number;
  organization?: OrganizationMiniSchema | null;
  customer?: UserMini | null;
  services: ServiceMini[];
  products: ProductMini[];
  videos: VideoMini[];
  amount: number;
  status: string;
  reference?: string | null;
  created_at: string;
  last_updated_date: string;
  service_delivered: boolean;
};

export type OrderListResponseSchema = {
  orders: OrderSchema[];
};

export type CustomerStatsSchema = {
  customer__id: number;
  customer__username: string;
  customer__count: number;
  amount__sum?: number | null;
  amount__avg?: number | null;
};

export type PaymentStatsSchema = {
  totalorders: number;
  totalcustomers: number;
  customers: CustomerStatsSchema[]; 
};

export type SuccessResponseSchema = {
  message: string;
};

export type ErrorResponseSchema = {
  error: string;
};

export type PaymentVerificationResponseSchema = {
  status: string;
  message: string;
  order?: OrderSchema;
};

export type PaginatedOrderResponseSchema = {
  count: number;
  items: OrderSchema[];
};
