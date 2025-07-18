import type { Product, Products } from "@/types/items";
import { converttoformData } from "@/utils/formutils";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}`,
});

const Organizationid = process.env.NEXT_PUBLIC_ORGANIZATION_ID;

export const productsAPIendpoint = "/productsapi";

// Response interface for paginated products
interface ProductsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Products;
}

/**
 * Fetch all the Products
 */
export const fetchProducts = async (url: string): Promise<ProductsResponse | undefined> => {
  const response = await axiosInstance.get(url);
  return response.data;
};

/**
 * Fetch a single product by URL
 */
export const fetchProduct = async (url: string): Promise<Product | undefined> => {
  const response = await axiosInstance.get(url);
  return response.data;
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
  return response.data;
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
  return response.data;
};

/**
 * Delete a product
 */
export const deleteProduct = async (id: number): Promise<number> => {
  await axiosInstance.delete(`${productsAPIendpoint}/delete-product/${id}/`);
  return id;
};
