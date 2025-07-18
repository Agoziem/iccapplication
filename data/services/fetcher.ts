import type { Service, Services, PaginatedServiceUser } from "@/types/items";
import { converttoformData } from "@/utils/formutils";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}`,
});

const Organizationid = process.env.NEXT_PUBLIC_ORGANIZATION_ID;

export const servicesAPIendpoint = "/servicesapi";

// Response interface for paginated services
interface ServicesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Services;
}

/**
 * Fetch all the Services
 */
export const fetchServices = async (url: string): Promise<ServicesResponse | undefined> => {
  const response = await axiosInstance.get(url);
  return response.data;
};

/**
 * Fetch a single service by URL
 */
export const fetchService = async (url: string): Promise<Service | undefined> => {
  const response = await axiosInstance.get(url);
  return response.data;
};

/**
 * Create a new service
 */
export const createService = async (data: Omit<Service, "id" | "created_at" | "updated_at">): Promise<Service | undefined> => {
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
  return response.data;
};

/**
 * Update an existing service
 */
export const updateService = async (data: Partial<Service> & { id: number }): Promise<Service | undefined> => {
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
  return response.data;
};

/**
 * Delete a service
 */
export const deleteService = async (id: number): Promise<number> => {
  await axiosInstance.delete(`${servicesAPIendpoint}/delete_service/${id}/`);
  return id;
};

/**
 * Fetch users associated with a service by category
 */
export const fetchServiceUsers = async (
  serviceId: number, 
  category: "all" | "progress" | "completed" = "all"
): Promise<PaginatedServiceUser> => {
  try {
    const categoryPath = {
      all: `${servicesAPIendpoint}/servicesusers/${serviceId}/`,
      progress: `${servicesAPIendpoint}/servicesusers/${serviceId}/in-progress/`,
      completed: `${servicesAPIendpoint}/servicesusers/${serviceId}/completed/`,
    };

    const url = categoryPath[category];
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error("Fetch Error:", (error as Error).message);
    throw new Error(`Failed to fetch ${category} users: ${(error as Error).message}`);
  }
};

/**
 * Update a user's service status
 */
export const updateUserServiceStatus = async (
  userId: number, 
  serviceId: number, 
  action: "add-to-progress" | "add-to-completed" | "remove-from-progress" | "remove-from-completed"
): Promise<any> => {
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
    console.error(`Update Error (${action}):`, (error as Error).message);
    throw new Error(`Failed to ${action.replace(/-/g, " ")}: ${(error as Error).message}`);
  }
};