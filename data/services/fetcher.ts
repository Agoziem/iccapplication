import { serviceSchema, servicesResponseSchema, UserPurchasedResponseSchema } from "@/schemas/items";
import { converttoformData } from "@/utils/formutils";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}`,
});

const Organizationid = process.env.NEXT_PUBLIC_ORGANIZATION_ID;

export const servicesAPIendpoint = "/servicesapi";

/**
 * fetch all the Services
 * @async
 * @param {string} url
 */
export const fetchServices = async (url) => {
  const response = await axiosInstance.get(url);
  const validation = servicesResponseSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * @async
 * @param {string} url // example ${servicesAPIendpoint}/service_by_token/${servicetoken}/
 * @returns {Promise<Service>}
 */
export const fetchService = async (url) => {
  const response = await axiosInstance.get(url);
  const validation = serviceSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * submits Responses to database and updates the Ui optimistically
 * @async
 * @returns {Promise<Service>}
 */
export const createService = async (data) => {
  const formData = converttoformData(data, [
    "category",
    "subcategory",
    "userIDs_that_bought_this_service",
    "userIDs_whose_services_is_in_progress",
    "userIDs_whose_services_have_been_completed",
  ]);
  const response = await axiosInstance.post(
    `${servicesAPIendpoint}/add_service/${Organizationid}/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  const validation = serviceSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * submits Responses to database and updates the Ui optimistically
 * @async
 * @returns {Promise<Service>}
 */
export const updateService = async (data) => {
  const formData = converttoformData(data, [
    "category",
    "subcategory",
    "userIDs_that_bought_this_service",
    "userIDs_whose_services_is_in_progress",
    "userIDs_whose_services_have_been_completed",
  ]);
  const response = await axiosInstance.put(
    `${servicesAPIendpoint}/update_service/${data.id}/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  const validation = serviceSchema.safeParse(response.data);
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
export const deleteService = async (id) => {
  await axiosInstance.delete(`${servicesAPIendpoint}/delete_service/${id}/`);
  return id;
};

/**
 * Fetch users associated with a service by category
 * @async
 * @param {number} serviceId - ID of the service.
 * @param {string} [category="all"] - Category of users ("all", "progress", "completed").
 * @returns {Promise<Object>} - Validated user data.
 */
export const fetchServiceUsers = async (serviceId, category = "all") => {
  try {
    const categoryPath = {
      all: `${servicesAPIendpoint}/servicesusers/${serviceId}/`,
      progress: `${servicesAPIendpoint}/servicesusers/${serviceId}/in-progress/`,
      completed: `${servicesAPIendpoint}/servicesusers/${serviceId}/completed/`,
    };

    const url = categoryPath[category];
    const response = await axiosInstance.get(url);

    const validation = UserPurchasedResponseSchema.safeParse(response.data);
    if (!validation.success) {
      console.error("Validation Error:", validation.error.issues);
      throw new Error("Invalid response format");
    }

    return validation.data;
  } catch (error) {
    console.error("Fetch Error:", error.message);
    throw new Error(`Failed to fetch ${category} users: ${error.message}`);
  }
};

/**
 * Update a user's service status.
 * @async
 * @param {number} userId - ID of the user.
 * @param {number} serviceId - ID of the service.
 * @param {string} action - Action to perform ("add-to-progress", "add-to-completed", "remove-from-progress", "remove-from-completed").
 * @returns {Promise<Object>} - Server response data.
 */
export const updateUserServiceStatus = async (userId, serviceId, action) => {
  try {
    const actions = {
      "add-to-progress": () =>
        axiosInstance.post(`${servicesAPIendpoint}/services/${serviceId}/${userId}/add-to-progress/`),
      "add-to-completed": () =>
        axiosInstance.post(`${servicesAPIendpoint}/services/${serviceId}/${userId}/add-to-completed/`),
      "remove-from-progress": () =>
        axiosInstance.post(
          `${servicesAPIendpoint}/services/${serviceId}/${userId}/remove-from-progress/`
        ),
      "remove-from-completed": () =>
        axiosInstance.post(
          `${servicesAPIendpoint}/services/${serviceId}/${userId}/remove-from-completed/`
        ),
    };

    if (!actions[action]) {
      throw new Error("Invalid action specified");
    }

    const response = await actions[action]();
    return response.data;
  } catch (error) {
    console.error(`Update Error (${action}):`, error.message);
    throw new Error(`Failed to ${action.replace(/-/g, " ")}: ${error.message}`);
  }
};