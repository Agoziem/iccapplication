import { productSchema, productsResponseSchema } from "@/schemas/items";
import type { Product, Products } from "@/types/items";
import { converttoformData } from "@/utils/formutils";
import axios from "axios";
import { z } from "zod";

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}`,
});

const Organizationid = process.env.NEXT_PUBLIC_ORGANIZATION_ID;

export const productsAPIendpoint = "/productsapi";

type ProductsResponse = z.infer<typeof productsResponseSchema>;

/**
 * Fetch all the Products
 */
export const fetchProducts = async (url: string): Promise<ProductsResponse | undefined> => {
  const response = await axiosInstance.get(url);
  const validation = productsResponseSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * Fetch a single product by URL
 */
export const fetchProduct = async (url: string): Promise<Product | undefined> => {
  const response = await axiosInstance.get(url);
  const validation = productSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * Create a new product
 */
export const createProduct = async (data: Omit<Product, "id" | "created_at" | "updated_at">): Promise<Product | undefined> => {
  const formData = converttoformData(data, ["category", "subcategory", "userIDs_that_bought_this_product"]);
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
 * Update an existing product
 */
export const updateProduct = async (data: Partial<Product> & { id: number }): Promise<Product | undefined> => {
  const formData = converttoformData(data, ["category", "subcategory", "userIDs_that_bought_this_product"]);
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
 * Delete a product
 */
export const deleteProduct = async (id: number): Promise<number> => {
  await axiosInstance.delete(`${productsAPIendpoint}/delete-product/${id}/`);
  return id;
};
