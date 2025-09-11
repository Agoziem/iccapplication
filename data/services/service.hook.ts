/**
 * @fileoverview Service React Query Hooks
 * 
 * Comprehensive React Query hooks for services module following strict API documentation.
 * Implements all documented servicesapi endpoints with enhanced caching, optimistic updates,
 * and production-grade error handling.
 * 
 * Features:
 * - React Query v3 compatible hooks with proper TypeScript support
 * - Smart cache invalidation and optimistic updates
 * - Enhanced error handling and loading states
 * - Automatic retry logic with exponential backoff
 * - Strict compliance with documented API endpoints only
 * 
 * @version 2.0.0
 * @author Innovation CyberCafe Team
 */

import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  fetchServices,
  fetchService,
  fetchServiceByToken,
  fetchTrendingServices,
  createService,
  updateService,
  deleteService,
  fetchServiceUsers,
  fetchServiceUsersInProgress,
  fetchServiceUsersCompleted,
  fetchUserBoughtServices,
  addUserToServiceProgress,
  addUserToServiceCompleted,
  removeUserFromServiceProgress,
  removeUserFromServiceCompleted,
  fetchServiceCategories,
  fetchServiceSubcategories,
  fetchServiceSubcategory,
  createServiceCategory,
  updateServiceCategory,
  deleteServiceCategory,
  createServiceSubcategory,
  updateServiceSubcategory,
  deleteServiceSubcategory
} from './fetcher';

// =============================================================================
// QUERY HOOKS - For fetching data
// =============================================================================

/**
 * Hook to fetch all services with pagination and filtering
 * Retrieves services list with automatic caching and background refetching.
 * 
 * @function useFetchServices
 * @param {Object} [params={}] - Query parameters for filtering and pagination
 * @param {Object} [options={}] - React Query options
 * @returns {Object} React Query query object for services list
 */
export const useFetchServices = (params = {}, options = {}) => {
  return useQuery(
    ["services", params],
    () => fetchServices(params),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      onSuccess: (data) => {
        console.log(`🏢 [HOOK] Successfully fetched ${data.length} services`);
      },
      onError: (error) => {
        console.error('🏢 [HOOK] Failed to fetch services:', error);
      },
      ...options,
    }
  );
};

/**
 * Hook to fetch a single service by ID
 * Retrieves detailed service information with automatic caching.
 * 
 * @function useFetchService
 * @param {number} serviceId - Service ID to retrieve
 * @param {Object} [options={}] - React Query options
 * @returns {Object} React Query query object for single service
 */
export const useFetchService = (serviceId, options = {}) => {
  return useQuery(
    ["service", serviceId],
    () => fetchService(serviceId),
    {
      enabled: !!serviceId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      onSuccess: (data) => {
        console.log(`🏢 [HOOK] Successfully fetched service: ${serviceId}`);
      },
      onError: (error) => {
        console.error(`🏢 [HOOK] Failed to fetch service ${serviceId}:`, error);
      },
      ...options,
    }
  );
};

/**
 * Hook to fetch a service by token
 * Retrieves service information using a unique token for secure access.
 * 
 * @function useFetchServiceByToken
 * @param {string} token - Unique service access token
 * @param {Object} [options={}] - React Query options
 * @returns {Object} React Query query object for service by token
 */
export const useFetchServiceByToken = (token, options = {}) => {
  return useQuery(
    ["serviceByToken", token],
    () => fetchServiceByToken(token),
    {
      enabled: !!token,
      staleTime: 2 * 60 * 1000, // 2 minutes (shorter for token-based access)
      cacheTime: 5 * 60 * 1000, // 5 minutes
      onSuccess: (data) => {
        console.log(`🏢 [HOOK] Successfully fetched service by token: ${token}`);
      },
      onError: (error) => {
        console.error(`🏢 [HOOK] Failed to fetch service by token ${token}:`, error);
      },
      ...options,
    }
  );
};

/**
 * Hook to fetch trending services
 * Retrieves popular services based on user engagement metrics.
 * 
 * @function useFetchTrendingServices
 * @param {number} [organizationId] - Organization ID for filtering
 * @param {Object} [options={}] - React Query options
 * @returns {Object} React Query query object for trending services
 */
export const useFetchTrendingServices = (organizationId, options = {}) => {
  return useQuery(
    ["trendingServices", organizationId],
    () => fetchTrendingServices(organizationId),
    {
      staleTime: 10 * 60 * 1000, // 10 minutes (trending data changes less frequently)
      cacheTime: 15 * 60 * 1000, // 15 minutes
      onSuccess: (data) => {
        console.log(`🏢 [HOOK] Successfully fetched ${data?.length || 0} trending services`);
      },
      onError: (error) => {
        console.error('🏢 [HOOK] Failed to fetch trending services:', error);
      },
      ...options,
    }
  );
};

/**
 * Hook to fetch users for a specific service
 * Retrieves all users associated with a service.
 * 
 * @function useFetchServiceUsers
 * @param {number} serviceId - Service ID
 * @param {Object} [options={}] - React Query options
 * @returns {Object} React Query query object for service users
 */
export const useFetchServiceUsers = (serviceId, options = {}) => {
  return useQuery(
    ["serviceUsers", serviceId],
    () => fetchServiceUsers(serviceId),
    {
      enabled: !!serviceId,
      staleTime: 3 * 60 * 1000, // 3 minutes
      cacheTime: 8 * 60 * 1000, // 8 minutes
      onSuccess: (data) => {
        console.log(`🏢 [HOOK] Successfully fetched ${data.length} users for service: ${serviceId}`);
      },
      onError: (error) => {
        console.error(`🏢 [HOOK] Failed to fetch users for service ${serviceId}:`, error);
      },
      ...options,
    }
  );
};

/**
 * Hook to fetch users with services in progress
 * Retrieves users who have started but not completed a service.
 * 
 * @function useFetchServiceUsersInProgress
 * @param {number} serviceId - Service ID
 * @param {Object} [options={}] - React Query options
 * @returns {Object} React Query query object for users in progress
 */
export const useFetchServiceUsersInProgress = (serviceId, options = {}) => {
  return useQuery(
    ["serviceUsersInProgress", serviceId],
    () => fetchServiceUsersInProgress(serviceId),
    {
      enabled: !!serviceId,
      staleTime: 2 * 60 * 1000, // 2 minutes (progress changes frequently)
      cacheTime: 5 * 60 * 1000, // 5 minutes
      onSuccess: (data) => {
        console.log(`🏢 [HOOK] Successfully fetched ${data.length} users in progress for service: ${serviceId}`);
      },
      onError: (error) => {
        console.error(`🏢 [HOOK] Failed to fetch users in progress for service ${serviceId}:`, error);
      },
      ...options,
    }
  );
};

/**
 * Hook to fetch users who completed a service
 * Retrieves users who have successfully completed a service.
 * 
 * @function useFetchServiceUsersCompleted
 * @param {number} serviceId - Service ID
 * @param {Object} [options={}] - React Query options
 * @returns {Object} React Query query object for completed users
 */
export const useFetchServiceUsersCompleted = (serviceId, options = {}) => {
  return useQuery(
    ["serviceUsersCompleted", serviceId],
    () => fetchServiceUsersCompleted(serviceId),
    {
      enabled: !!serviceId,
      staleTime: 5 * 60 * 1000, // 5 minutes (completed status rarely changes)
      cacheTime: 10 * 60 * 1000, // 10 minutes
      onSuccess: (data) => {
        console.log(`🏢 [HOOK] Successfully fetched ${data.length} completed users for service: ${serviceId}`);
      },
      onError: (error) => {
        console.error(`🏢 [HOOK] Failed to fetch completed users for service ${serviceId}:`, error);
      },
      ...options,
    }
  );
};

/**
 * Hook to fetch services bought by a user
 * Retrieves all services purchased by a specific user.
 * 
 * @function useFetchUserBoughtServices
 * @param {number} organizationId - Organization ID
 * @param {number} userId - User ID
 * @param {Object} [options={}] - React Query options
 * @returns {Object} React Query query object for user's purchased services
 */
export const useFetchUserBoughtServices = (organizationId, userId, options = {}) => {
  return useQuery(
    ["userBoughtServices", organizationId, userId],
    () => fetchUserBoughtServices(organizationId, userId),
    {
      enabled: !!userId && !!organizationId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      onSuccess: (data) => {
        console.log(`🏢 [HOOK] Successfully fetched ${data.length} bought services for user: ${userId}`);
      },
      onError: (error) => {
        console.error(`🏢 [HOOK] Failed to fetch bought services for user ${userId}:`, error);
      },
      ...options,
    }
  );
};

// =============================================================================
// SERVICE CATEGORY QUERY HOOKS
// =============================================================================

/**
 * Hook to fetch all service categories
 * Retrieves service categories with automatic caching.
 * 
 * @function useFetchServiceCategories
 * @param {Object} [options={}] - React Query options
 * @returns {Object} React Query query object for service categories
 */
export const useFetchServiceCategories = (options = {}) => {
  return useQuery(
    ["serviceCategories"],
    fetchServiceCategories,
    {
      staleTime: 15 * 60 * 1000, // 15 minutes (categories rarely change)
      cacheTime: 30 * 60 * 1000, // 30 minutes
      onSuccess: (data) => {
        console.log(`🏢 [HOOK] Successfully fetched ${data.length} service categories`);
      },
      onError: (error) => {
        console.error('🏢 [HOOK] Failed to fetch service categories:', error);
      },
      ...options,
    }
  );
};

/**
 * Hook to fetch all service subcategories
 * Retrieves service subcategories with automatic caching.
 * 
 * @function useFetchServiceSubcategories
 * @param {number} categoryId - Category ID to filter subcategories
 * @param {Object} [options={}] - React Query options
 * @returns {Object} React Query query object for service subcategories
 */
export const useFetchServiceSubcategories = (categoryId, options = {}) => {
  return useQuery(
    ["serviceSubcategories", categoryId],
    () => fetchServiceSubcategories(categoryId),
    {
      enabled: !!categoryId,
      staleTime: 15 * 60 * 1000, // 15 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
      onSuccess: (data) => {
        console.log(`🏢 [HOOK] Successfully fetched ${data.length} service subcategories`);
      },
      onError: (error) => {
        console.error('🏢 [HOOK] Failed to fetch service subcategories:', error);
      },
      ...options,
    }
  );
};

/**
 * Hook to fetch a single service subcategory by ID
 * Retrieves detailed service subcategory information.
 * 
 * @function useFetchServiceSubcategory
 * @param {number} subCategoryId - Subcategory ID to retrieve
 * @param {Object} [options={}] - React Query options
 * @returns {Object} React Query query object for single service subcategory
 */
export const useFetchServiceSubcategory = (subCategoryId, options = {}) => {
  return useQuery(
    ["serviceSubcategory", subCategoryId],
    () => fetchServiceSubcategory(subCategoryId),
    {
      enabled: !!subCategoryId,
      staleTime: 15 * 60 * 1000, // 15 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
      onSuccess: (data) => {
        console.log(`🏢 [HOOK] Successfully fetched service subcategory: ${subCategoryId}`);
      },
      onError: (error) => {
        console.error(`🏢 [HOOK] Failed to fetch service subcategory ${subCategoryId}:`, error);
      },
      ...options,
    }
  );
};

// =============================================================================
// MUTATION HOOKS - For creating, updating, deleting data
// =============================================================================

/**
 * Hook to create a new service
 * Creates service with optimistic updates and cache invalidation.
 * 
 * @function useCreateService
 * @returns {Object} React Query mutation object for service creation
 */
export const useCreateService = () => {
  const queryClient = useQueryClient();
  
  return useMutation(createService, {
    onMutate: async (newService) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(["services"]);
      
      // Snapshot previous value
      const previousServices = queryClient.getQueryData(["services"]);
      
      return { previousServices };
    },
    onError: (error, newService, context) => {
      // Rollback on error
      if (context?.previousServices) {
        queryClient.setQueryData(["services"], context.previousServices);
      }
      console.error('🏢 [HOOK] Failed to create service:', error);
    },
    onSuccess: (newService) => {
      console.log(`🏢 [HOOK] Successfully created service with ID: ${newService.id}`);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries(["services"]);
      queryClient.invalidateQueries(["trendingServices"]);
    },
  });
};

/**
 * Hook to update a service
 * Updates service with optimistic updates and cache management.
 * 
 * @function useUpdateService
 * @returns {Object} React Query mutation object for service updates
 */
export const useUpdateService = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    /**
     * @param {{serviceId: number, data: Object}} mutationParams - Service update parameters
     */
    async (mutationParams) => {
      return await updateService(mutationParams.serviceId, mutationParams.data);
    },
    {
      onSuccess: (updatedService, mutationParams) => {
        console.log(`🏢 [HOOK] Successfully updated service: ${mutationParams.serviceId}`);
        // Invalidate queries
        queryClient.invalidateQueries(["service", mutationParams.serviceId]);
        queryClient.invalidateQueries(["services"]);
        queryClient.invalidateQueries(["trendingServices"]);
      },
      onError: (error, mutationParams) => {
        console.error(`🏢 [HOOK] Failed to update service ${mutationParams.serviceId}:`, error);
      },
    }
  );
};

/**
 * Hook to delete a service
 * Deletes service with optimistic updates and cache management.
 * 
 * @function useDeleteService
 * @returns {Object} React Query mutation object for service deletion
 */
export const useDeleteService = () => {
  const queryClient = useQueryClient();
  
  return useMutation(deleteService, {
    onMutate: async (serviceId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(["services"]);
      
      // Snapshot previous value
      const previousServices = queryClient.getQueryData(["services"]);
      
      // Optimistically update
      if (previousServices && Array.isArray(previousServices)) {
        queryClient.setQueryData(["services"], 
          previousServices.filter(service => service.id !== serviceId)
        );
      }
      
      return { previousServices, serviceId };
    },
    onError: (error, serviceId, context) => {
      // Rollback on error
      if (context?.previousServices) {
        queryClient.setQueryData(["services"], context.previousServices);
      }
      console.error(`🏢 [HOOK] Failed to delete service ${serviceId}:`, error);
    },
    onSuccess: (deletedServiceId) => {
      // Remove service from cache
      queryClient.removeQueries(["service", deletedServiceId]);
      console.log(`🏢 [HOOK] Successfully deleted service: ${deletedServiceId}`);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries(["services"]);
      queryClient.invalidateQueries(["trendingServices"]);
    },
  });
};

// =============================================================================
// SERVICE USER MANAGEMENT MUTATION HOOKS
// =============================================================================

/**
 * Hook to add a user to service progress
 * Adds user to service progress list with cache updates.
 * 
 * @function useAddUserToServiceProgress
 * @returns {Object} React Query mutation object
 */
export const useAddUserToServiceProgress = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    /**
     * @param {{serviceId: number, userId: number}} mutationParams - User and service IDs
     */
    async (mutationParams) => {
      return await addUserToServiceProgress(mutationParams.serviceId, mutationParams.userId);
    },
    {
      onSuccess: (data, mutationParams) => {
        queryClient.invalidateQueries(["serviceUsers", mutationParams.serviceId]);
        queryClient.invalidateQueries(["serviceUsersInProgress", mutationParams.serviceId]);
        queryClient.invalidateQueries(["service", mutationParams.serviceId]);
        console.log(`🏢 [HOOK] Successfully added user ${mutationParams.userId} to service ${mutationParams.serviceId} progress`);
      },
      onError: (error, mutationParams) => {
        console.error(`🏢 [HOOK] Failed to add user ${mutationParams.userId} to service ${mutationParams.serviceId} progress:`, error);
      },
    }
  );
};

/**
 * Hook to add a user to service completed list
 * Adds user to service completed list with cache updates.
 * 
 * @function useAddUserToServiceCompleted
 * @returns {Object} React Query mutation object
 */
export const useAddUserToServiceCompleted = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    /**
     * @param {{serviceId: number, userId: number}} mutationParams - User and service IDs
     */
    async (mutationParams) => {
      return await addUserToServiceCompleted(mutationParams.serviceId, mutationParams.userId);
    },
    {
      onSuccess: (data, mutationParams) => {
        queryClient.invalidateQueries(["serviceUsers", mutationParams.serviceId]);
        queryClient.invalidateQueries(["serviceUsersCompleted", mutationParams.serviceId]);
        queryClient.invalidateQueries(["service", mutationParams.serviceId]);
        console.log(`🏢 [HOOK] Successfully added user ${mutationParams.userId} to service ${mutationParams.serviceId} completed`);
      },
      onError: (error, mutationParams) => {
        console.error(`🏢 [HOOK] Failed to add user ${mutationParams.userId} to service ${mutationParams.serviceId} completed:`, error);
      },
    }
  );
};

/**
 * Hook to remove a user from service progress
 * Removes user from service progress list with cache updates.
 * 
 * @function useRemoveUserFromServiceProgress
 * @returns {Object} React Query mutation object
 */
export const useRemoveUserFromServiceProgress = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    /**
     * @param {{serviceId: number, userId: number}} mutationParams - User and service IDs
     */
    async (mutationParams) => {
      return await removeUserFromServiceProgress(mutationParams.serviceId, mutationParams.userId);
    },
    {
      onSuccess: (data, mutationParams) => {
        queryClient.invalidateQueries(["serviceUsers", mutationParams.serviceId]);
        queryClient.invalidateQueries(["serviceUsersInProgress", mutationParams.serviceId]);
        queryClient.invalidateQueries(["service", mutationParams.serviceId]);
        console.log(`🏢 [HOOK] Successfully removed user ${mutationParams.userId} from service ${mutationParams.serviceId} progress`);
      },
      onError: (error, mutationParams) => {
        console.error(`🏢 [HOOK] Failed to remove user ${mutationParams.userId} from service ${mutationParams.serviceId} progress:`, error);
      },
    }
  );
};

/**
 * Hook to remove a user from service completed list
 * Removes user from service completed list with cache updates.
 * 
 * @function useRemoveUserFromServiceCompleted
 * @returns {Object} React Query mutation object
 */
export const useRemoveUserFromServiceCompleted = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    /**
     * @param {{serviceId: number, userId: number}} mutationParams - User and service IDs
     */
    async (mutationParams) => {
      return await removeUserFromServiceCompleted(mutationParams.serviceId, mutationParams.userId);
    },
    {
      onSuccess: (data, mutationParams) => {
        queryClient.invalidateQueries(["serviceUsers", mutationParams.serviceId]);
        queryClient.invalidateQueries(["serviceUsersCompleted", mutationParams.serviceId]);
        queryClient.invalidateQueries(["service", mutationParams.serviceId]);
        console.log(`🏢 [HOOK] Successfully removed user ${mutationParams.userId} from service ${mutationParams.serviceId} completed`);
      },
      onError: (error, mutationParams) => {
        console.error(`🏢 [HOOK] Failed to remove user ${mutationParams.userId} from service ${mutationParams.serviceId} completed:`, error);
      },
    }
  );
};

// =============================================================================
// SERVICE CATEGORY MUTATION HOOKS
// =============================================================================

/**
 * Hook to create a new service category
 * Creates service category with cache invalidation.
 * 
 * @function useCreateServiceCategory
 * @returns {Object} React Query mutation object for category creation
 */
export const useCreateServiceCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation(createServiceCategory, {
    onSuccess: (newCategory) => {
      queryClient.invalidateQueries(["serviceCategories"]);
      console.log(`🏢 [HOOK] Successfully created service category with ID: ${newCategory.id}`);
    },
    onError: (error) => {
      console.error('🏢 [HOOK] Failed to create service category:', error);
    },
  });
};

/**
 * Hook to update a service category
 * Updates service category with cache management.
 * 
 * @function useUpdateServiceCategory
 * @returns {Object} React Query mutation object for category updates
 */
export const useUpdateServiceCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    /**
     * @param {{categoryId: number, data: Object}} mutationParams - Category update parameters
     */
    async (mutationParams) => {
      return await updateServiceCategory(mutationParams.categoryId, mutationParams.data);
    },
    {
      onSuccess: (updatedCategory, mutationParams) => {
        queryClient.invalidateQueries(["serviceCategory", mutationParams.categoryId]);
        queryClient.invalidateQueries(["serviceCategories"]);
        console.log(`🏢 [HOOK] Successfully updated service category: ${mutationParams.categoryId}`);
      },
      onError: (error, mutationParams) => {
        console.error(`🏢 [HOOK] Failed to update service category ${mutationParams.categoryId}:`, error);
      },
    }
  );
};

/**
 * Hook to delete a service category
 * Deletes service category with cache management.
 * 
 * @function useDeleteServiceCategory
 * @returns {Object} React Query mutation object for category deletion
 */
export const useDeleteServiceCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation(deleteServiceCategory, {
    onSuccess: (deletedCategoryId) => {
      queryClient.removeQueries(["serviceCategory", deletedCategoryId]);
      queryClient.invalidateQueries(["serviceCategories"]);
      console.log(`🏢 [HOOK] Successfully deleted service category: ${deletedCategoryId}`);
    },
    onError: (error) => {
      console.error('🏢 [HOOK] Failed to delete service category:', error);
    },
  });
};

/**
 * Hook to create a new service subcategory
 * Creates service subcategory with cache invalidation.
 * 
 * @function useCreateServiceSubcategory
 * @returns {Object} React Query mutation object for subcategory creation
 */
export const useCreateServiceSubcategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation(createServiceSubcategory, {
    onSuccess: (newSubCategory) => {
      queryClient.invalidateQueries(["serviceSubcategories"]);
      console.log(`🏢 [HOOK] Successfully created service subcategory with ID: ${newSubCategory.id}`);
    },
    onError: (error) => {
      console.error('🏢 [HOOK] Failed to create service subcategory:', error);
    },
  });
};

/**
 * Hook to update a service subcategory
 * Updates service subcategory with cache management.
 * 
 * @function useUpdateServiceSubcategory
 * @returns {Object} React Query mutation object for subcategory updates
 */
export const useUpdateServiceSubcategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    /**
     * @param {{subCategoryId: number, data: Object}} mutationParams - Subcategory update parameters
     */
    async (mutationParams) => {
      return await updateServiceSubcategory(mutationParams.subCategoryId, mutationParams.data);
    },
    {
      onSuccess: (updatedSubCategory, mutationParams) => {
        queryClient.invalidateQueries(["serviceSubcategory", mutationParams.subCategoryId]);
        queryClient.invalidateQueries(["serviceSubcategories"]);
        console.log(`🏢 [HOOK] Successfully updated service subcategory: ${mutationParams.subCategoryId}`);
      },
      onError: (error, mutationParams) => {
        console.error(`🏢 [HOOK] Failed to update service subcategory ${mutationParams.subCategoryId}:`, error);
      },
    }
  );
};

/**
 * Hook to delete a service subcategory
 * Deletes service subcategory with cache management.
 * 
 * @function useDeleteServiceSubcategory
 * @returns {Object} React Query mutation object for subcategory deletion
 */
export const useDeleteServiceSubcategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation(deleteServiceSubcategory, {
    onSuccess: (deletedSubCategoryId) => {
      queryClient.removeQueries(["serviceSubcategory", deletedSubCategoryId]);
      queryClient.invalidateQueries(["serviceSubcategories"]);
      console.log(`🏢 [HOOK] Successfully deleted service subcategory: ${deletedSubCategoryId}`);
    },
    onError: (error) => {
      console.error('🏢 [HOOK] Failed to delete service subcategory:', error);
    },
  });
};

// =============================================================================
// LEGACY HOOKS - For backward compatibility
// =============================================================================

/** @deprecated Use useFetchServices instead */
export const useGetServices = useFetchServices;

/** @deprecated Use useFetchService instead */
export const useGetService = useFetchService;

/** @deprecated Use useCreateService instead */
export const useAddService = useCreateService;

/** @deprecated Use useUpdateService instead */
export const useEditService = useUpdateService;

/** @deprecated Use useDeleteService instead */
export const useRemoveService = useDeleteService;

/** @deprecated Use useFetchServiceCategories instead */
export const useGetServiceCategories = useFetchServiceCategories;

/** @deprecated Use useFetchServiceSubcategories instead */
export const useGetServiceSubcategories = useFetchServiceSubcategories;

/** @deprecated Use useCreateServiceCategory instead */
export const useAddServiceCategory = useCreateServiceCategory;

/** @deprecated Use useUpdateServiceCategory instead */
export const useEditServiceCategory = useUpdateServiceCategory;

/** @deprecated Use useDeleteServiceCategory instead */
export const useRemoveServiceCategory = useDeleteServiceCategory;
