import axios from "axios";
import { categoryArraySchema, categorySchema, subcategoryArraySchema, subcategorySchema } from "@/schemas/categories";

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}`,
});

const Organizationid = process.env.NEXT_PUBLIC_ORGANIZATION_ID;



// ------------------------------------------------------
// Category fetcher and mutation functions
// ------------------------------------------------------
/**
 * @async
 * @param {string} url
 */
export const fetchCategories = async (url) => {
  const response = await axiosInstance.get(url);
  const validation = categoryArraySchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};


// ------------------------------------------------------
// Sub Category fetcher and mutation functions
// ------------------------------------------------------
/**
 * @async
 * @param {string} url
 */
export const fetchSubCategories = async (url) => {
  const response = await axiosInstance.get(url);
  const validation = subcategoryArraySchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * @async
 * @param {string} url
 * @param {Category} data
 * @returns {Promise<Category>}
 */
export const createCategory = async (url,data) => {
  const response = await axiosInstance.post(
    url,
    data
  );
  const validation = categorySchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};


/**
 * @async
 * @param {string} url
 * @param {SubCategory} data
 * @returns {Promise<SubCategory>}
 */
export const createSubCategory = async (url,data) => {
  const response = await axiosInstance.post(
    url,
    data
  );
  const validation = subcategorySchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * @async
 * @param {string} url
 * @param {Category} data
 * @returns {Promise<Category>}
 */
export const updateCategory = async (url,data) => {
  const response = await axiosInstance.put(
    url,
    data
  );
  const validation = categorySchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * @async
 * @param {string} url
 * @param {SubCategory} data
 * @returns {Promise<SubCategory>}
 */
export const updateSubCategory = async (url,data) => {
  const response = await axiosInstance.put(
    url,
    data
  );
  const validation = subcategorySchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};



/**
 * @async
 * @param {string} url
 * @param {number} categoryid
 * @returns {Promise<number>}
 */
export const deleteCategory = async (url,categoryid) => {
  await axiosInstance.delete(url);
  return categoryid;
};


/**
 * @async
 * @param {string} url
 * @param {number} subcategoryid
 * @returns {Promise<number>}
 */
export const deleteSubCategory = async (url,subcategoryid) => {
  await axiosInstance.delete(url);
  return subcategoryid;
};
