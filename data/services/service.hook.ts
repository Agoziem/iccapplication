"use client";
import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from "react-query";
import type { Service, Services, PaginatedServiceUser } from "@/types/items";
import { z } from "zod";
import { servicesResponseSchema } from "@/schemas/items";
import {
  fetchServices,
  fetchService,
  createService,
  updateService,
  deleteService,
  fetchServiceUsers,
  updateUserServiceStatus,
} from "@/data/services/fetcher";

type ServicesResponse = z.infer<typeof servicesResponseSchema>;

// Hook to fetch all services
export const useFetchServices = (url: string): UseQueryResult<ServicesResponse | undefined, Error> => {
  return useQuery(
    ["services", url], // Dynamic cache key
    () => fetchServices(url),
    {
      enabled: !!url, // Ensure query only runs if URL is provided
    }
  );
};

// Hook to fetch a single service
export const useFetchService = (url: string, serviceid: number): UseQueryResult<Service | undefined, Error> => {
  return useQuery(
    ["service", serviceid, url], // Dynamic cache key for a specific service
    () => fetchService(url),
    {
      enabled: !!serviceid, // Ensure query only runs if URL is provided
    }
  );
};

export const useFetchServiceByToken = (url: string, token: string): UseQueryResult<Service | undefined, Error> => {
  return useQuery(
    ["service", token, url], // Dynamic cache key for a specific service
    () => fetchService(url),
    {
      enabled: !!token,
    }
  );
};

// Hook to create a new service
export const useCreateService = (): UseMutationResult<Service | undefined, Error, Omit<Service, "id" | "created_at" | "updated_at">> => {
  const queryClient = useQueryClient();
  return useMutation(createService, {
    onSuccess: () => {
      queryClient.invalidateQueries(["services"]); // Invalidate the services list
    },
  });
};

// Hook to update a service
export const useUpdateService = (): UseMutationResult<Service | undefined, Error, Partial<Service> & { id: number }> => {
  const queryClient = useQueryClient();
  return useMutation(updateService, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["service", variables.id]); // Invalidate the specific service
      queryClient.invalidateQueries(["services"]); // Invalidate the services list
    },
  });
};

// Hook to delete a service
export const useDeleteService = (): UseMutationResult<number, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation(deleteService, {
    onSuccess: () => {
      queryClient.invalidateQueries(["services"]); // Invalidate the services list
    },
  });
};

// Hook to fetch service users
export const useFetchServiceUsers = (serviceId: number, category: "all" | "progress" | "completed"): UseQueryResult<PaginatedServiceUser, Error> => {
  return useQuery(
    ["serviceUsers", serviceId, category], // Dynamic cache key for service users
    () => fetchServiceUsers(serviceId, category),
    {
      enabled: !!serviceId, // Ensure query only runs if serviceId is provided
    }
  );
};

interface UpdateServiceUserParams {
  userId: number;
  serviceId: number;
  action: "add-to-progress" | "add-to-completed" | "remove-from-progress" | "remove-from-completed";
  category: "all" | "progress" | "completed";
}

export const useUpdateServiceUser = (): UseMutationResult<any, Error, UpdateServiceUserParams> => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ userId, serviceId, action, category }: UpdateServiceUserParams) => {
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
