import { converttoformData } from "@/utils/formutils";
import { AxiosInstance, AxiosInstancemultipart, AxiosInstanceWithToken, AxiosInstancemultipartWithToken } from "../instance";
import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from "react-query";
import {
  Service,
  ServiceCategory,
  ServiceSubCategory,
  CreateServiceCategory,
  CreateServiceSubCategory,
  PaginatedServiceResponse,
  ServiceCategories,
  DeleteResponse,
  PaginatedServiceUsers,
  SuccessResponse,
  CreateService,
  UpdateService
} from "@/types/items";

export const servicesAPIendpoint = "/servicesapi";

// Query Keys
export const SERVICE_KEYS = {
  all: ['services'] as const,
  lists: () => [...SERVICE_KEYS.all, 'list'] as const,
  list: (organizationId: number) => [...SERVICE_KEYS.lists(), organizationId] as const,
  trending: (organizationId: number) => [...SERVICE_KEYS.all, 'trending', organizationId] as const,
  userBought: (organizationId: number, userId: number) => [...SERVICE_KEYS.all, 'userBought', organizationId, userId] as const,
  details: () => [...SERVICE_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...SERVICE_KEYS.details(), id] as const,
  detailByToken: (token: string) => [...SERVICE_KEYS.details(), 'token', token] as const,
  users: (serviceId: number) => [...SERVICE_KEYS.all, 'users', serviceId] as const,
  usersCompleted: (serviceId: number) => [...SERVICE_KEYS.users(serviceId), 'completed'] as const,
  usersInProgress: (serviceId: number) => [...SERVICE_KEYS.users(serviceId), 'inProgress'] as const,
  categories: () => [...SERVICE_KEYS.all, 'categories'] as const,
  subcategories: (categoryId: number | null) => [...SERVICE_KEYS.categories(), 'subcategories', categoryId] as const,
  subcategory: (subcategoryId: number) => [...SERVICE_KEYS.categories(), 'subcategory', subcategoryId] as const
} as const;


// Service Management
export const fetchServices = async (organizationId: number, params?: Record<string, any>): Promise<PaginatedServiceResponse> => {
  const response = await AxiosInstance.get(`${servicesAPIendpoint}/services/${organizationId}/`, { params });
  return response.data;
};

export const fetchService = async (serviceId: number): Promise<Service> => {
  const response = await AxiosInstance.get(`${servicesAPIendpoint}/service/${serviceId}/`);
  return response.data;
};

export const fetchServiceByToken = async (serviceToken: string): Promise<Service> => {
  const response = await AxiosInstance.get(`${servicesAPIendpoint}/service_by_token/${serviceToken}/`);
  return response.data;
};

export const createService = async (organizationId: number, serviceData: CreateService): Promise<Service> => {
  const formData = converttoformData(serviceData);
  const response = await AxiosInstancemultipartWithToken.post(`${servicesAPIendpoint}/add_service/${organizationId}/`, formData);
  return response.data;
};

export const updateService = async (serviceId: number, serviceData: UpdateService): Promise<Service> => {
  const formData = converttoformData(serviceData);
  const response = await AxiosInstancemultipartWithToken.put(`${servicesAPIendpoint}/update_service/${serviceId}/`, formData);
  return response.data;
};

export const deleteService = async (serviceId: number): Promise<DeleteResponse> => {
  const response = await AxiosInstanceWithToken.delete(`${servicesAPIendpoint}/delete_service/${serviceId}/`);
  return response.data;
};

export const fetchTrendingServices = async (organizationId: number, params?: Record<string, any>): Promise<PaginatedServiceResponse> => {
  const response = await AxiosInstance.get(`${servicesAPIendpoint}/trendingservices/${organizationId}/`, { params });
  return response.data;
};

export const fetchUserBoughtServices = async (organizationId: number, userId: number, params?: Record<string, any>): Promise<PaginatedServiceResponse> => {
  const response = await AxiosInstance.get(`${servicesAPIendpoint}/userboughtservices/${organizationId}/${userId}/`, { params });
  return response.data;
};

// Service User Progress Management
export const addServiceToCompleted = async (serviceId: number, userId: number): Promise<SuccessResponse> => {
  const response = await AxiosInstanceWithToken.post(`${servicesAPIendpoint}/services/${serviceId}/${userId}/add-to-completed/`);
  return response.data;
};

export const addServiceToProgress = async (serviceId: number, userId: number): Promise<SuccessResponse> => {
  const response = await AxiosInstanceWithToken.post(`${servicesAPIendpoint}/services/${serviceId}/${userId}/add-to-progress/`);
  return response.data;
};

export const removeServiceFromCompleted = async (serviceId: number, userId: number): Promise<SuccessResponse> => {
  const response = await AxiosInstanceWithToken.post(`${servicesAPIendpoint}/services/${serviceId}/${userId}/remove-from-completed/`);
  return response.data;
};

export const removeServiceFromProgress = async (serviceId: number, userId: number): Promise<SuccessResponse> => {
  const response = await AxiosInstanceWithToken.post(`${servicesAPIendpoint}/services/${serviceId}/${userId}/remove-from-progress/`);
  return response.data;
};

export const fetchServiceUsers = async (serviceId: number, params?: Record<string, any>): Promise<PaginatedServiceUsers> => {
  const response = await AxiosInstance.get(`${servicesAPIendpoint}/servicesusers/${serviceId}/`, { params });
  return response.data;
};

export const fetchServiceUsersCompleted = async (serviceId: number, params?: Record<string, any>): Promise<PaginatedServiceUsers> => {
  const response = await AxiosInstance.get(`${servicesAPIendpoint}/servicesusers/${serviceId}/completed/`, { params });
  return response.data;
};

export const fetchServiceUsersInProgress = async (serviceId: number, params?: Record<string, any>): Promise<PaginatedServiceUsers> => {
  const response = await AxiosInstance.get(`${servicesAPIendpoint}/servicesusers/${serviceId}/in-progress/`, { params });
  return response.data;
};

// Service Category Management
export const fetchServiceCategories = async (): Promise<ServiceCategories> => {
  const response = await AxiosInstance.get(`${servicesAPIendpoint}/categories/`);
  return response.data;
};

export const createServiceCategory = async (categoryData: CreateServiceCategory): Promise<ServiceCategory> => {
  const response = await AxiosInstanceWithToken.post(`${servicesAPIendpoint}/add_category/`, categoryData);
  return response.data;
};

export const updateServiceCategory = async (categoryId: number, updateData: Partial<CreateServiceCategory>): Promise<ServiceCategory> => {
  const response = await AxiosInstanceWithToken.put(`${servicesAPIendpoint}/update_category/${categoryId}/`, updateData);
  return response.data;
};

export const deleteServiceCategory = async (categoryId: number): Promise<DeleteResponse> => {
  const response = await AxiosInstanceWithToken.delete(`${servicesAPIendpoint}/delete_category/${categoryId}/`);
  return response.data;
};

// Service SubCategory Management
export const fetchServiceSubCategories = async (categoryId: number): Promise<ServiceSubCategory[]> => {
  const response = await AxiosInstance.get(`${servicesAPIendpoint}/subcategories/${categoryId}/`);
  return response.data;
};

export const fetchServiceSubCategory = async (subcategoryId: number): Promise<ServiceSubCategory> => {
  const response = await AxiosInstance.get(`${servicesAPIendpoint}/subcategory/${subcategoryId}/`);
  return response.data;
};

export const createServiceSubCategory = async (subCategoryData: CreateServiceSubCategory): Promise<ServiceSubCategory> => {
  const response = await AxiosInstanceWithToken.post(`${servicesAPIendpoint}/create_subcategory/`, subCategoryData);
  return response.data;
};

export const updateServiceSubCategory = async (subCategoryId: number, updateData: Partial<CreateServiceSubCategory>): Promise<ServiceSubCategory> => {
  const response = await AxiosInstanceWithToken.put(`${servicesAPIendpoint}/update_subcategory/${subCategoryId}/`, updateData);
  return response.data;
};

export const deleteServiceSubCategory = async (subCategoryId: number): Promise<DeleteResponse> => {
  const response = await AxiosInstanceWithToken.delete(`${servicesAPIendpoint}/delete_subcategory/${subCategoryId}/`);
  return response.data;
};

// React Query Hooks

// Services Hooks
export const useServices = (organizationId: number, params?: Record<string, any>): UseQueryResult<PaginatedServiceResponse, Error> => {
  return useQuery({
    queryKey: [...SERVICE_KEYS.list(organizationId), params],
    queryFn: () => fetchServices(organizationId, params),
    onError: (error: Error) => {
      console.error('Error fetching services:', error);
      throw error;
    },
  });
};

export const useService = (serviceId: number): UseQueryResult<Service, Error> => {
  return useQuery({
    queryKey: SERVICE_KEYS.detail(serviceId),
    queryFn: () => fetchService(serviceId),
    enabled: !!serviceId,
    onError: (error: Error) => {
      console.error('Error fetching service:', error);
      throw error;
    },
  });
};

export const useServiceByToken = (serviceToken: string): UseQueryResult<Service, Error> => {
  return useQuery({
    queryKey: SERVICE_KEYS.detailByToken(serviceToken),
    queryFn: () => fetchServiceByToken(serviceToken),
    enabled: !!serviceToken,
    onError: (error: Error) => {
      console.error('Error fetching service by token:', error);
      throw error;
    },
  });
};

export const useTrendingServices = (organizationId: number, params?: Record<string, any>): UseQueryResult<PaginatedServiceResponse, Error> => {
  return useQuery({
    queryKey: [...SERVICE_KEYS.trending(organizationId), params],
    queryFn: () => fetchTrendingServices(organizationId, params),
    onError: (error: Error) => {
      console.error('Error fetching trending services:', error);
      throw error;
    },
  });
};

export const useUserBoughtServices = (organizationId: number, userId: number, params?: Record<string, any>): UseQueryResult<PaginatedServiceResponse, Error> => {
  return useQuery({
    queryKey: [...SERVICE_KEYS.userBought(organizationId, userId), params],
    queryFn: () => fetchUserBoughtServices(organizationId, userId, params),
    enabled: !!organizationId && !!userId,
    onError: (error: Error) => {
      console.error('Error fetching user bought services:', error);
      throw error;
    },
  });
};

// Service Management Mutations
export const useCreateService = (): UseMutationResult<Service, Error, { organizationId: number; serviceData: CreateService }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ organizationId, serviceData }) => createService(organizationId, serviceData),
    onSuccess: (data, { organizationId }) => {
      queryClient.invalidateQueries(SERVICE_KEYS.list(organizationId));
      queryClient.invalidateQueries(SERVICE_KEYS.lists());
      queryClient.invalidateQueries(SERVICE_KEYS.trending(organizationId));
    },
    onError: (error: Error) => {
      console.error('Error creating service:', error);
      throw error;
    },
  });
};

export const useUpdateService = (): UseMutationResult<Service, Error, { serviceId: number; serviceData: UpdateService }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ serviceId, serviceData }) => updateService(serviceId, serviceData),
    onSuccess: (data, { serviceId }) => {
      queryClient.setQueryData(SERVICE_KEYS.detail(serviceId), data);
      queryClient.invalidateQueries(SERVICE_KEYS.lists());
    },
    onError: (error: Error) => {
      console.error('Error updating service:', error);
      throw error;
    },
  });
};

export const useDeleteService = (): UseMutationResult<DeleteResponse, Error, number> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteService,
    onSuccess: (_, serviceId) => {
      queryClient.removeQueries(SERVICE_KEYS.detail(serviceId));
      queryClient.invalidateQueries(SERVICE_KEYS.lists());
    },
    onError: (error: Error) => {
      console.error('Error deleting service:', error);
      throw error;
    },
  });
};

// Service Progress Mutations
export const useAddServiceToCompleted = (): UseMutationResult<SuccessResponse, Error, { serviceId: number; userId: number }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ serviceId, userId }) => addServiceToCompleted(serviceId, userId),
    onSuccess: (_, { serviceId, userId }) => {
      queryClient.invalidateQueries(SERVICE_KEYS.usersCompleted(serviceId));
      queryClient.invalidateQueries(SERVICE_KEYS.usersInProgress(serviceId));
      queryClient.invalidateQueries(SERVICE_KEYS.users(serviceId));
      queryClient.invalidateQueries(["services", "detail", serviceId]);
    },
    onError: (error: Error) => {
      console.error('Error adding service to completed:', error);
      throw error;
    },
  });
};

export const useAddServiceToProgress = (): UseMutationResult<SuccessResponse, Error, { serviceId: number; userId: number }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ serviceId, userId }) => addServiceToProgress(serviceId, userId),
    onSuccess: (_, { serviceId, userId }) => {
      queryClient.invalidateQueries(SERVICE_KEYS.usersCompleted(serviceId));
      queryClient.invalidateQueries(SERVICE_KEYS.usersInProgress(serviceId));
      queryClient.invalidateQueries(SERVICE_KEYS.users(serviceId));
      queryClient.invalidateQueries(["services", "detail", serviceId]);
    },
    onError: (error: Error) => {
      console.error('Error adding service to progress:', error);
      throw error;
    },
  });
};

export const useRemoveServiceFromCompleted = (): UseMutationResult<SuccessResponse, Error, { serviceId: number; userId: number }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ serviceId, userId }) => removeServiceFromCompleted(serviceId, userId),
    onSuccess: (_, { serviceId, userId }) => {
      queryClient.invalidateQueries(SERVICE_KEYS.usersCompleted(serviceId));
      queryClient.invalidateQueries(SERVICE_KEYS.usersInProgress(serviceId));
      queryClient.invalidateQueries(SERVICE_KEYS.users(serviceId));
      queryClient.invalidateQueries(["services", "detail", serviceId]);
    },
    onError: (error: Error) => {
      console.error('Error removing service from completed:', error);
      throw error;
    },
  });
};

export const useRemoveServiceFromProgress = (): UseMutationResult<SuccessResponse, Error, { serviceId: number; userId: number }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ serviceId, userId }) => removeServiceFromProgress(serviceId, userId),
    onSuccess: (_, { serviceId, userId }) => {
      queryClient.invalidateQueries(SERVICE_KEYS.usersCompleted(serviceId));
      queryClient.invalidateQueries(SERVICE_KEYS.usersInProgress(serviceId));
      queryClient.invalidateQueries(SERVICE_KEYS.users(serviceId));
      queryClient.invalidateQueries(["services", "detail", serviceId]);
    },
    onError: (error: Error) => {
      console.error('Error removing service from progress:', error);
      throw error;
    },
  });
};

// Service Users Hooks
export const useServiceUsers = (serviceId: number, params?: Record<string, any>): UseQueryResult<PaginatedServiceUsers, Error> => {
  return useQuery({
    queryKey: [...SERVICE_KEYS.users(serviceId), params],
    queryFn: () => fetchServiceUsers(serviceId, params),
    enabled: !!serviceId,
    onError: (error: Error) => {
      console.error('Error fetching service users:', error);
      throw error;
    },
  });
};

export const useServiceUsersCompleted = (serviceId: number, params?: Record<string, any>): UseQueryResult<PaginatedServiceUsers, Error> => {
  return useQuery({
    queryKey: [...SERVICE_KEYS.usersCompleted(serviceId), params],
    queryFn: () => fetchServiceUsersCompleted(serviceId, params),
    enabled: !!serviceId,
    onError: (error: Error) => {
      console.error('Error fetching service users completed:', error);
      throw error;
    },
  });
};

export const useServiceUsersInProgress = (serviceId: number, params?: Record<string, any>): UseQueryResult<PaginatedServiceUsers, Error> => {
  return useQuery({
    queryKey: [...SERVICE_KEYS.usersInProgress(serviceId), params],
    queryFn: () => fetchServiceUsersInProgress(serviceId, params),
    enabled: !!serviceId,
    onError: (error: Error) => {
      console.error('Error fetching service users in progress:', error);
      throw error;
    },
  });
};

// Service Categories Hooks
export const useServiceCategories = (): UseQueryResult<ServiceCategories, Error> => {
  return useQuery({
    queryKey: SERVICE_KEYS.categories(),
    queryFn: fetchServiceCategories,
    onError: (error: Error) => {
      console.error('Error fetching service categories:', error);
      throw error;
    },
  });
};

export const useCreateServiceCategory = (): UseMutationResult<ServiceCategory, Error, CreateServiceCategory> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createServiceCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(SERVICE_KEYS.categories());
    },
    onError: (error: Error) => {
      console.error('Error creating service category:', error);
      throw error;
    },
  });
};

export const useUpdateServiceCategory = (): UseMutationResult<ServiceCategory, Error, { categoryId: number; updateData: Partial<CreateServiceCategory> }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ categoryId, updateData }) => updateServiceCategory(categoryId, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries(SERVICE_KEYS.categories());
    },
    onError: (error: Error) => {
      console.error('Error updating service category:', error);
      throw error;
    },
  });
};

export const useDeleteServiceCategory = (): UseMutationResult<DeleteResponse, Error, number> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteServiceCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(SERVICE_KEYS.categories());
    },
    onError: (error: Error) => {
      console.error('Error deleting service category:', error);
      throw error;
    },
  });
};

export const useServiceSubCategories = (categoryId: number): UseQueryResult<ServiceSubCategory[], Error> => {
  return useQuery({
    queryKey: [...SERVICE_KEYS.categories(), 'subcategories', categoryId],
    queryFn: () => fetchServiceSubCategories(categoryId),
    enabled: !!categoryId,
    onError: (error: Error) => {
      console.error('Error fetching service subcategories:', error);
      throw error;
    }
  });
}

export const useServiceSubCategory = (subcategoryId: number): UseQueryResult<ServiceSubCategory, Error> => {
  return useQuery({
    queryKey: [...SERVICE_KEYS.categories(), 'subcategory', subcategoryId],
    queryFn: () => fetchServiceSubCategory(subcategoryId),
    enabled: !!subcategoryId,
    onError: (error: Error) => {
      console.error('Error fetching service subcategory:', error);
      throw error;
    }
  });
}

export const useCreateServiceSubCategory = (): UseMutationResult<ServiceSubCategory, Error, CreateServiceSubCategory> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createServiceSubCategory,
    onSuccess: (data) => {
      queryClient.invalidateQueries(SERVICE_KEYS.categories());
      queryClient.invalidateQueries(SERVICE_KEYS.subcategories(data.category && data.category.id ? data.category.id : null));

    },
    onError: (error: Error) => {
      console.error('Error creating service subcategory:', error);
      throw error;
    },
  });
};

export const useUpdateServiceSubCategory = (): UseMutationResult<ServiceSubCategory, Error, { subcategoryId: number; updateData: Partial<CreateServiceSubCategory> }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ subcategoryId, updateData }) => updateServiceSubCategory(subcategoryId, updateData),
    onSuccess: (data) => {
      // Invalidate all subcategories queries
      queryClient.invalidateQueries(SERVICE_KEYS.categories());
      queryClient.invalidateQueries(SERVICE_KEYS.subcategories(data.category && data.category.id ? data.category.id : null));
    },
    onError: (error: Error) => {
      console.error('Error updating service subcategory:', error);
      throw error;
    },
  });
};

export const useDeleteServiceSubCategory = (): UseMutationResult<DeleteResponse, Error, number> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteServiceSubCategory,
    onSuccess: (_, subcategoryId) => {
      queryClient.removeQueries(SERVICE_KEYS.subcategory(subcategoryId));
      queryClient.invalidateQueries(SERVICE_KEYS.subcategories(null));
    },
    onError: (error: Error) => {
      console.error('Error deleting service subcategory:', error);
      throw error;
    },
  });
};


