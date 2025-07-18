import { orderSchema, ordersReportSchema, ordersSchema } from "@/schemas/payments";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}`,
});

const Organizationid = process.env.NEXT_PUBLIC_ORGANIZATION_ID

export const paymentsAPIendpoint = "/paymentsapi";

// urlpatterns = [
//   path('payments/<int:organization_id>/', get_payments),
//   path('payment/<int:payment_id>/', get_payment),
//   path('paymentsbyuser/<int:user_id>/', get_payments_by_user), # new
//   path('verifypayment/', verify_payment),
// ]

// ------------------------------------------------------
// Payment fetcher and mutation functions
// ------------------------------------------------------
/**
 * @async
 * @param {string} url
 */
export const fetchPayments = async (url) => {
  const response = await axiosInstance.get(url);
  const validation = ordersSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * @async
 * @param {string} url
 */
export const fetchPayment = async (url) => {
  const response = await axiosInstance.get(url);
  const validation = orderSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * @async
 * @param {{reference:string,customer_id:number}} data
 * @param {string} url
 */
export const verifyPayment = async (url,data) => {
  const response = await axiosInstance.post(url,data);
  const validation = orderSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};


/**
 * @async
 * @param {string} url
 */
export const fetchPaymentsbyUser = async (url) => {
  const response = await axiosInstance.get(url);
  const validation = ordersSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * @async
 * @param {Order} data
 * @returns {Promise<Order>}
 */
export const addPayment = async (data) => {
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
 * @async
 * @param {Order} data
 * @returns {Promise<Order>}
 */
export const updatePayment = async (data) => {
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
 * @async
 * @param {number} paymentid
 * @returns {Promise<number>}
 */
export const deletePayment = async (paymentid) => {
  await axiosInstance.delete(`${paymentsAPIendpoint}/deletepayment/${paymentid}/`);
  return paymentid;
};


/**
 * @async
 * @returns {Promise<OrderReport>}
 */
export const getOrderReport = async () => {
  const response = await axiosInstance.get(`${paymentsAPIendpoint}/getorderreport/${Organizationid}/`);
  const validation = ordersReportSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
}
