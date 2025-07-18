import { productSchema, productsResponseSchema } from "@/schemas/items";
import { converttoformData } from "@/utils/formutils";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}`,
});

const Organizationid = process.env.NEXT_PUBLIC_ORGANIZATION_ID;

export const productsAPIendpoint = "/productsapi";

/**
 * fetch all the Products
 * @async
 * @param {string} url
 */
export const fetchProducts = async (url) => {
  const response = await axiosInstance.get(url);
  const validation = productsResponseSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * @async
 * @param {string} url // example `${productsAPIendpoint}/product/${id}/`
 * @returns {Promise<Product>}
 */
export const fetchProduct = async (url) => {
  const response = await axiosInstance.get(url);
  const validation = productSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * submits Responses to database and updates the Ui optimistically
 * @async
 * @returns {Promise<Product>}
 */
export const createProduct = async (data) => {
  const formData = converttoformData(data,["category","subcategory","userIDs_that_bought_this_product"]);
  const response = await axiosInstance.post(
    `${productsAPIendpoint}/add-product/${Organizationid}/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  const validation = productSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * submits Responses to database and updates the Ui optimistically
 * @async
 * @returns {Promise<Product>}
 */
export const updateProduct = async (data) => {
  const formData = converttoformData(data,["category","subcategory","userIDs_that_bought_this_product"]);
  const response = await axiosInstance.put(
    `${productsAPIendpoint}/update-product/${data.id}/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  const validation = productSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * submits Responses to database and updates the Ui optimistically
 * @async
 * @param {number} id
 * @returns {Promise<number>}
 */
export const deleteProduct = async (id) => {
  await axiosInstance.delete(`${productsAPIendpoint}/delete-product/${id}/`);
  return id;
};
