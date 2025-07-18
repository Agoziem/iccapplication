import { orderSchema, ordersReportSchema, ordersSchema } from "@/schemas/payments";
import type { Order, Orders, OrderReport } from "@/types/payments";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}`,
});

const Organizationid = process.env.NEXT_PUBLIC_ORGANIZATION_ID;

export const paymentsAPIendpoint = "/paymentsapi";

/**
 * Fetch all payments
 */
export const fetchPayments = async (url: string): Promise<Orders | undefined> => {
  const response = await axiosInstance.get(url);
  const validation = ordersSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * Fetch a single payment
 */
export const fetchPayment = async (url: string): Promise<Order | undefined> => {
  const response = await axiosInstance.get(url);
  const validation = orderSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * Verify payment
 */
export const verifyPayment = async (url: string, data: { reference: string; customer_id: number }): Promise<Order | undefined> => {
  const response = await axiosInstance.post(url, data);
  const validation = orderSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * Fetch payments by user
 */
export const fetchPaymentsbyUser = async (url: string): Promise<Orders | undefined> => {
  const response = await axiosInstance.get(url);
  const validation = ordersSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * Add a new payment
 */
export const addPayment = async (data: Omit<Order, "id" | "created_at" | "updated_at">): Promise<Order | undefined> => {
  const response = await axiosInstance.post(
    `${paymentsAPIendpoint}/addpayment/${Organizationid}/`,
    data
  );
  const validation = orderSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * Update an existing payment
 */
export const updatePayment = async (data: Partial<Order> & { id: number }): Promise<Order | undefined> => {
  const response = await axiosInstance.put(
    `${paymentsAPIendpoint}/updatepayment/${data.id}/`,
    data
  );
  const validation = orderSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * Delete a payment
 */
export const deletePayment = async (paymentid: number): Promise<number> => {
  await axiosInstance.delete(`${paymentsAPIendpoint}/deletepayment/${paymentid}/`);
  return paymentid;
};

/**
 * Get order report
 */
export const getOrderReport = async (): Promise<OrderReport | undefined> => {
  const response = await axiosInstance.get(`${paymentsAPIendpoint}/getorderreport/${Organizationid}/`);
  const validation = ordersReportSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};
