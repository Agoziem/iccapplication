import axios from "axios";
import {
  Category,
  Categories,
  SubCategory,
  SubCategories,
} from "@/types/categories";
import { AxiosinstanceAuth } from "../instance";

const Organizationid = process.env.NEXT_PUBLIC_ORGANIZATION_ID;

// ------------------------------------------------------
// Category fetcher and mutation functions
// ------------------------------------------------------

/**
 * Fetch all categories
 */
export const fetchCategories = async (
  url: string
): Promise<Categories | undefined> => {
  const response = await AxiosinstanceAuth.get(url);
  return response.data;
};

// ------------------------------------------------------
// Sub Category fetcher and mutation functions
// ------------------------------------------------------

/**
 * Fetch all subcategories
 */
export const fetchSubCategories = async (
  url: string
): Promise<SubCategories | undefined> => {
  const response = await AxiosinstanceAuth.get(url);
  return response.data;
};

/**
 * Create new category
 */
export const createCategory = async (
  url: string,
  data: Partial<Category>
): Promise<Category | undefined> => {
  const response = await AxiosinstanceAuth.post(url, data);
  return response.data;
};

/**
 * Create new subcategory
 */
export const createSubCategory = async (
  url: string,
  data: Partial<SubCategory>
): Promise<SubCategory | undefined> => {
  const response = await AxiosinstanceAuth.post(url, data);
  return response.data;
};

/**
 * Update existing category
 */
export const updateCategory = async (
  url: string,
  data: Partial<Category>
): Promise<Category | undefined> => {
  const response = await AxiosinstanceAuth.put(url, data);
  return response.data;
};

/**
 * Update existing subcategory
 */
export const updateSubCategory = async (
  url: string,
  data: Partial<SubCategory>
): Promise<SubCategory | undefined> => {
  const response = await AxiosinstanceAuth.put(url, data);
  return response.data;
};

/**
 * Delete category
 */
export const deleteCategory = async (
  url: string,
  categoryid: number
): Promise<number> => {
  await AxiosinstanceAuth.delete(url);
  return categoryid;
};

/**
 * Delete subcategory
 */
export const deleteSubCategory = async (
  url: string,
  subcategoryid: number
): Promise<number> => {
  await AxiosinstanceAuth.delete(url);
  return subcategoryid;
};
