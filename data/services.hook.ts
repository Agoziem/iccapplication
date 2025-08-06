import { ORGANIZATION_ID } from "@/constants";
import {
  PaginatedServiceResponse,
  PaginatedServiceUserResponse,
  Service,
} from "@/types/services";
import { AxiosinstanceAuth, AxiosinstanceFormDataAuth } from "./instance";
import { CreateServiceType, UpdateServiceType } from "@/schemas/services";
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from "react-query";

const Organizationid = ORGANIZATION_ID;

// ======================================================
// React Query Hooks - Services
// ======================================================

/**
 * Hook to fetch all services
 */
export const useGetServices = (): UseQueryResult<PaginatedServiceResponse> => {
  return useQuery("services", async () => {
    const response = await AxiosinstanceAuth.get(`/services/${Organizationid}`);
    return response.data;
  });
};

/**
 * Hook to fetch trending services
 */
export const useGetTrendingServices =
  (): UseQueryResult<PaginatedServiceResponse> => {
    return useQuery("trendingServices", async () => {
      const response = await AxiosinstanceAuth.get(
        `/services/trending/${Organizationid}`
      );
      return response.data;
    });
  };

/**
 * Hook to fetch user services
 */
export const useGetUserServices =
  (): UseQueryResult<PaginatedServiceResponse> => {
    return useQuery("userServices", async () => {
      const response = await AxiosinstanceAuth.get(
        `/services/user/${Organizationid}`
      );
      return response.data;
    });
  };

/**
 * Hook to fetch single service by ID
 */
export const useGetService = (id: number): UseQueryResult<Service> => {
  return useQuery(
    ["service", id],
    async () => {
      const response = await AxiosinstanceAuth.get(`/services/service/${id}`);
      return response.data;
    },
    {
      enabled: !!id,
    }
  );
};

/**
 * Hook to fetch service by token
 */
export const useGetServiceByToken = (
  token: string
): UseQueryResult<Service> => {
  return useQuery(
    ["serviceByToken", token],
    async () => {
      const response = await AxiosinstanceAuth.get(`/services/token/${token}`);
      return response.data;
    },
    {
      enabled: !!token,
    }
  );
};

/**
 * Hook to create a new service
 */
export const useCreateService = (): UseMutationResult<
  Service,
  Error,
  { service: CreateServiceType; preview: File | null }
> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: { service: CreateServiceType; preview: File | null }) => {
      const response = await AxiosinstanceFormDataAuth.post(
        `/services/${Organizationid}/`,
        data
      );
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("services");
        queryClient.invalidateQueries("userServices");
        queryClient.invalidateQueries("trendingServices");
      },
      onError: (error) => {
        console.error("Failed to create service:", error);
      },
    }
  );
};

/**
 * Hook to update an existing service
 */
export const useUpdateService = (): UseMutationResult<
  Service,
  Error,
  { id: number; service: UpdateServiceType; preview?: File | null }
> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: {
      id: number;
      service: UpdateServiceType;
      preview?: File | null;
    }) => {
      const response = await AxiosinstanceFormDataAuth.put(
        `/services/service/${data.id}`,
        {
          service: data.service,
          preview: data.preview,
        }
      );
      return response.data;
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries("services");
        queryClient.invalidateQueries("userServices");
        queryClient.invalidateQueries("trendingServices");
        queryClient.invalidateQueries(["service", variables.id]);
      },
      onError: (error) => {
        console.error("Failed to update service:", error);
      },
    }
  );
};

/**
 * Hook to delete a service
 */
export const useDeleteService = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (id: number) => {
      await AxiosinstanceAuth.delete(`/services/service/${id}/`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("services");
        queryClient.invalidateQueries("userServices");
        queryClient.invalidateQueries("trendingServices");
      },
      onError: (error) => {
        console.error("Failed to delete service:", error);
      },
    }
  );
};

/**
 * Hook to fetch service users by category
 */
export const useGetServiceUsers = (
  serviceId: number,
  category: "all" | "progress" | "completed" = "all"
): UseQueryResult<PaginatedServiceUserResponse> => {
  return useQuery(
    ["serviceUsers", serviceId, category],
    async () => {
      try {
        const categoryPath = {
          all: `/service-users/buyers/${serviceId}/`,
          progress: `/service-users/in-progress/${serviceId}/`,
          completed: `/service-users/completed/${serviceId}/`,
        };

        const url = categoryPath[category];
        const response = await AxiosinstanceAuth.get(url);
        return response.data;
      } catch (error) {
        console.error("Fetch Error:", (error as Error).message);
        throw new Error(
          `Failed to fetch ${category} users: ${(error as Error).message}`
        );
      }
    },
    {
      enabled: !!serviceId,
    }
  );
};

/**
 * Hook to update user service status
 */
export const useUpdateUserServiceStatus = (): UseMutationResult<
  any,
  Error,
  {
    userId: number;
    serviceId: number;
    action:
      | "add-to-progress"
      | "add-to-completed"
      | "remove-from-progress"
      | "remove-from-completed";
  }
> => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ userId, serviceId, action }) => {
      try {
        const actions = {
          "add-to-progress": () =>
            AxiosinstanceAuth.post(
              `/services/${serviceId}/${userId}/add-to-progress/`
            ),
          "add-to-completed": () =>
            AxiosinstanceAuth.post(
              `/services/${serviceId}/${userId}/add-to-completed/`
            ),
          "remove-from-progress": () =>
            AxiosinstanceAuth.post(
              `/services/${serviceId}/${userId}/remove-from-progress/`
            ),
          "remove-from-completed": () =>
            AxiosinstanceAuth.post(
              `/services/${serviceId}/${userId}/remove-from-completed/`
            ),
        };

        if (!actions[action]) {
          throw new Error("Invalid action specified");
        }

        const response = await actions[action]();
        return response.data;
      } catch (error) {
        console.error(`Update Error (${action}):`, (error as Error).message);
        throw new Error(
          `Failed to ${action.replace(/-/g, " ")}: ${(error as Error).message}`
        );
      }
    },
    {
      onSuccess: (data, variables) => {
        // Invalidate service users queries for all categories
        queryClient.invalidateQueries(["serviceUsers", variables.serviceId]);
      },
      onError: (error) => {
        console.error("Failed to update user service status:", error);
      },
    }
  );
};
