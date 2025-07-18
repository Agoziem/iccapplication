import {
  CustomerSchema,
  orderSchema,
  ordersReportSchema,
} from "@/schemas/payments";
import { z } from "zod";

export type Order = z.infer<typeof orderSchema>;

export type Orders = Order[];

export type Customer = z.infer<typeof CustomerSchema>;

export type Customers = z.infer<typeof CustomerSchema>[];

export type OrderReport = z.infer<typeof ordersReportSchema>;
