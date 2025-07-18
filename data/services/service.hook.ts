"use client";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  fetchServices,
  fetchService,
  createService,
  updateService,
  deleteService,
  fetchServiceUsers,
  updateUserServiceStatus,
} from "@/data/services/fetcher";

// Hook to fetch all services
export const useFetchServices = (url) => {
  return useQuery(
    ["services", url], // Dynamic cache key
    () => fetchServices(url),
    {
      enabled: !!url, // Ensure query only runs if URL is provided
    }
  );
};

// Hook to fetch a single service
export const useFetchService = (url, serviceid) => {
  return useQuery(
    ["service", serviceid, url], // Dynamic cache key for a specific service
    () => fetchService(url),
    {
      enabled: !!serviceid, // Ensure query only runs if URL is provided
    }
  );
};

export const useFetchServiceByToken = (url,token) => {
  return useQuery(
    ["service", token, url], // Dynamic cache key for a specific service
    () => fetchService(url),
    {
      enabled: !!token,
    }
  );
}

// Hook to create a new service
export const useCreateService = () => {
  const queryClient = useQueryClient();
  return useMutation(createService, {
    onSuccess: () => {
      queryClient.invalidateQueries(["services"]); // Invalidate the services list
    },
  });
};

// Hook to update a service
export const useUpdateService = () => {
  const queryClient = useQueryClient();
  return useMutation(updateService, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["service", variables.id]); // Invalidate the specific service
      queryClient.invalidateQueries(["services"]); // Invalidate the services list
    },
  });
};

// Hook to delete a service
export const useDeleteService = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteService, {
    onSuccess: () => {
      queryClient.invalidateQueries(["services"]); // Invalidate the services list
    },
  });
};

// Hook to fetch service users
/**
 *
 * @param {number} serviceId
 * @param {string} category
 */
export const useFetchServiceUsers = (serviceId, category) => {
  return useQuery(
    ["serviceUsers", serviceId, category], // Dynamic cache key for service users
    () => fetchServiceUsers(serviceId, category),
    {
      enabled: !!serviceId, // Ensure query only runs if URL is provided
    }
  );
};

export const useUpdateServiceUser = () => {
  const queryClient = useQueryClient();

  return useMutation(
    /**
     * @param {{userId:number, serviceId:number, action: "add-to-progress" | "add-to-completed" | "remove-from-progress" | "remove-from-completed";category:string}} param0
     */
    async ({ userId, serviceId, action, category }) => {
      if (!userId || !serviceId || !action || !category) {
        throw new Error(
          "Missing required parameters: userId, serviceId, or action."
        );
      }
      return await updateUserServiceStatus(userId, serviceId, action);
    },
    {
      onSuccess: (_, variables) => {
        const { serviceId, action, category } = variables;

        // Dynamically invalidate based on the action
        if (
          [
            "add-to-progress",
            "add-to-completed",
            "remove-from-progress",
            "remove-from-completed",
          ].includes(action)
        ) {
          queryClient.invalidateQueries(["serviceUsers", serviceId, category]);
          queryClient.invalidateQueries(["service", serviceId]);
        }
      },
      onError: (error) => {
        console.error("Failed to update user service status:", error);
      },
    }
  );
};
