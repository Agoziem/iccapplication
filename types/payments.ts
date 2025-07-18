import { Product, Service, Video } from "./items";

export type PaymentStatus = "Pending" | "Completed" | "Failed";

export interface Organization {
  id?: number | null;
  name?: string | null;
}

export interface CustomerInfo {
  id?: number | null;
  name?: string | null;
  email?: string | null;
}

export interface Order {
  id?: number;
  organization?: Organization | null;
  customer?: CustomerInfo | null;
  services?: Service[];
  products?: Product[];
  videos?: Video[];
  amount: string;
  status: PaymentStatus;
  reference?: string | null;
  service_delivered: boolean;
  created_at?: Date;
  last_updated_date?: Date;
}

export type Orders = Order[];

export interface Customer {
  customer__id: number;
  customer__username: string;
  customer__count: number;
  amount__sum: number;
  amount__avg: number;
}

export type Customers = Customer[];

export interface OrderReport {
  totalorders: number;
  totalcustomers: number;
  customers: Customer[];
}
