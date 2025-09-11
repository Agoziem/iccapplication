/**
 * @fileoverview Organization Management React Query Hooks
 * 
 * Comprehensive React Query hooks for organization system operations including
 * organizations, staff, departments, testimonials, subscriptions with enhanced
 * error handling, optimistic updates, and performance optimizations.
 * 
 * Features:
 * - Real-time organization data with automatic polling
 * - CRUD operations with optimistic updates and cache management
 * - Bulk operations for efficient data management
 * - Statistics and analytics with smart caching
 * - Comprehensive error handling and loading states
 * - Smart caching with automatic invalidation strategies
 * 
 * @version 3.0.0
 * @author Innovation CyberCafe Team
 */

"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "react-query";
import {
  // Core Organization
  fetchOrganization,
  fetchOrganizations,
  fetchOrganizationById,
  createOrganization,
  updateOrganization,
  updateOrganizationPrivacyPolicy,
  updateOrganizationTermsOfUse,
  deleteOrganization,
  
  // Staff Management
  fetchOrganizationStaff,
  fetchStaff,
  fetchStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
  
  // Department Management
  fetchOrganizationDepartments,
  fetchDepartments,
  fetchDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  
  // Testimonial Management
  fetchOrganizationTestimonials,
  fetchTestimonials,
  fetchTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  
  // Subscription Management
  fetchOrganizationSubscriptions,
  fetchSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  
  // Bulk Operations
  bulkDeleteStaff,
  bulkDeleteDepartments,
  
  // Statistics
  fetchOrganizationStats,
} from "./fetcher";

// =================== CORE ORGANIZATION HOOKS =================== //

/**
 * Hook to fetch the main organization data
 * Retrieves comprehensive organization information with automatic caching.
 * 
 * @function useFetchOrganization
 * @param {Object} [options={}] - React Query options
 * @returns {Object} React Query query object for organization
 */
export const useFetchOrganization = (options = {}) => {
  return useQuery(
    ["organization"],
    fetchOrganization,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      onSuccess: (data) => {
        console.log('🏢 [HOOK] Successfully fetched organization:', data.name);
      },
      onError: (error) => {
        console.error('🏢 [HOOK] Failed to fetch organization:', error);
      },
      ...options,
    }
  );
};

/**
 * Hook to fetch multiple organizations with filtering
 * Supports filtering and pagination for organization lists.
 * 
 * @function useFetchOrganizations
 * @param {Object} [filters={}] - Filtering parameters
 * @param {Object} [options={}] - React Query options
 * @returns {Object} React Query query object for organizations
 */
export const useFetchOrganizations = (filters = {}, options = {}) => {
  return useQuery(
    ["organizations", filters],
    () => fetchOrganizations(filters),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      cacheTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      onSuccess: (data) => {
        console.log(`🏢 [HOOK] Successfully fetched ${data.length} organizations`);
      },
      onError: (error) => {
        console.error('🏢 [HOOK] Failed to fetch organizations:', error);
      },
      ...options,
    }
  );
};

/**
 * Hook to fetch a single organization by ID
 * Retrieves detailed organization information.
 * 
 * @function useFetchOrganizationById
 * @param {number} id - Organization ID
 * @param {Object} [options={}] - React Query options
 * @returns {Object} React Query query object for single organization
 */
export const useFetchOrganizationById = (id, options = {}) => {
  return useQuery(
    ["organization", id],
    () => fetchOrganizationById(id),
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      onSuccess: (data) => {
        console.log('🏢 [HOOK] Successfully fetched organization by ID:', data.name);
      },
      onError: (error) => {
        console.error('🏢 [HOOK] Failed to fetch organization by ID:', error);
      },
      ...options,
    }
  );
};

/**
 * Hook to create a new organization
 * Creates organizations with automatic cache invalidation.
 * 
 * @function useCreateOrganization
 * @returns {Object} React Query mutation object for organization creation
 */
export const useCreateOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation(createOrganization, {
    onSuccess: (newOrganization) => {
      // Invalidate organizations list
      queryClient.invalidateQueries(["organizations"]);
      // Add to cache
      queryClient.setQueryData(["organization", newOrganization.id], newOrganization);
      console.log('🏢 [HOOK] Successfully created organization:', newOrganization.name);
    },
    onError: (error) => {
      console.error('🏢 [HOOK] Failed to create organization:', error);
    },
  });
};

/**
 * Hook to update an organization
 * Updates organizations with optimistic updates and cache management.
 * 
 * @function useUpdateOrganization
 * @returns {Object} React Query mutation object for organization updates
 */
export const useUpdateOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (/** @type {{id: number, data: Partial<OrganizationData>}} */ variables) => updateOrganization(variables.id, variables.data),
    {
      onMutate: async (/** @type {{id: number, data: Partial<OrganizationData>}} */ variables) => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries(["organization", variables.id]);
        await queryClient.cancelQueries(["organizations"]);
        
        // Snapshot previous values
        const previousOrganization = queryClient.getQueryData(["organization", variables.id]);
        const previousOrganizations = queryClient.getQueryData(["organizations"]);
        
        // Optimistically update single organization
        if (previousOrganization && typeof previousOrganization === 'object') {
          queryClient.setQueryData(["organization", variables.id], {
            ...(/** @type {OrganizationData} */ previousOrganization),
            ...variables.data,
          });
        }
        
        // Optimistically update organizations list
        if (previousOrganizations) {
          queryClient.setQueryData(["organizations"], (/** @type {OrganizationData[]} */ old) => {
            return old.map((/** @type {OrganizationData} */ org) =>
              org.id === variables.id ? { ...org, ...variables.data } : org
            );
          });
        }
        
        return { previousOrganization, previousOrganizations };
      },
      onError: (error, variables, context) => {
        // Rollback on error
        if (context?.previousOrganization) {
          queryClient.setQueryData(["organization", variables.id], context.previousOrganization);
        }
        if (context?.previousOrganizations) {
          queryClient.setQueryData(["organizations"], context.previousOrganizations);
        }
        console.error('🏢 [HOOK] Failed to update organization:', error);
      },
      onSuccess: (updatedOrganization, variables) => {
        // Update specific organization in cache
        queryClient.setQueryData(["organization", variables.id], updatedOrganization);
        console.log('🏢 [HOOK] Successfully updated organization:', variables.id);
      },
      onSettled: () => {
        // Always refetch after error or success
        queryClient.invalidateQueries(["organizations"]);
        queryClient.invalidateQueries(["organization"]);
      },
    }
  );
};

/**
 * Hook to delete an organization
 * Deletes organizations with optimistic updates and cache cleanup.
 * 
 * @function useDeleteOrganization
 * @returns {Object} React Query mutation object for organization deletion
 */
export const useDeleteOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteOrganization, {
    onMutate: async (organizationId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(["organizations"]);
      
      // Snapshot previous value
      const previousOrganizations = queryClient.getQueryData(["organizations"]);
      
      // Optimistically update
      if (previousOrganizations) {
        queryClient.setQueryData(["organizations"], (/** @type {OrganizationData[]} */ old) => {
          return old.filter((/** @type {OrganizationData} */ org) => org.id !== organizationId);
        });
      }
      
      return { previousOrganizations };
    },
    onError: (error, organizationId, context) => {
      // Rollback on error
      if (context?.previousOrganizations) {
        queryClient.setQueryData(["organizations"], context.previousOrganizations);
      }
      console.error('🏢 [HOOK] Failed to delete organization:', error);
    },
    onSuccess: (deletedId) => {
      // Remove specific organization from cache
      queryClient.removeQueries(["organization", deletedId]);
      console.log('🏢 [HOOK] Successfully deleted organization:', deletedId);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries(["organizations"]);
    },
  });
};

// =================== STAFF MANAGEMENT HOOKS =================== //

/**
 * Hook to fetch staff members with filtering
 * Supports pagination and advanced filtering.
 * 
 * @function useFetchStaff
 * @param {Object} [filters={}] - Filtering parameters
 * @param {Object} [options={}] - React Query options
 * @returns {Object} React Query query object for staff
 */
export const useFetchStaff = (filters = {}, options = {}) => {
  return useQuery(
    ["staff", filters],
    () => fetchStaff(filters),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      cacheTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      onSuccess: (data) => {
        console.log(`🏢 [HOOK] Successfully fetched ${data.results?.length || 0} staff members`);
      },
      onError: (error) => {
        console.error('🏢 [HOOK] Failed to fetch staff:', error);
      },
      ...options,
    }
  );
};

/**
 * Hook to fetch all staff members for a specific organization
 * Retrieves complete staff listing using the new API endpoint.
 * 
 * @function useFetchOrganizationStaff
 * @param {number} organizationId - Organization ID
 * @param {Object} [options={}] - React Query options
 * @returns {Object} React Query query object for organization staff
 */
export const useFetchOrganizationStaff = (organizationId, options = {}) => {
  return useQuery(
    ["organization-staff", organizationId],
    () => fetchOrganizationStaff(organizationId),
    {
      enabled: !!organizationId,
      staleTime: 2 * 60 * 1000, // 2 minutes
      cacheTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      onSuccess: (data) => {
        console.log(`👥 [HOOK] Successfully fetched ${data.length} staff members for organization ${organizationId}`);
      },
      onError: (error) => {
        console.error('👥 [HOOK] Failed to fetch organization staff:', error);
      },
      ...options,
    }
  );
};

/**
 * Hook to fetch staff with infinite scroll
 * Enables infinite loading for large staff lists.
 * 
 * @function useFetchStaffInfinite
 * @param {Object} [filters={}] - Filtering parameters
 * @param {Object} [options={}] - React Query options
 * @returns {Object} React Query infinite query object
 */
export const useFetchStaffInfinite = (filters = {}, options = {}) => {
  return useInfiniteQuery(
    ["staff-infinite", filters],
    ({ pageParam = 1 }) => fetchStaff({ ...filters, page: pageParam }),
    {
      getNextPageParam: (lastPage) => {
        return lastPage.next ? lastPage.next.split('page=')[1]?.split('&')[0] : undefined;
      },
      staleTime: 2 * 60 * 1000,
      cacheTime: 5 * 60 * 1000,
      onError: (error) => {
        console.error('🏢 [HOOK] Failed to fetch infinite staff:', error);
      },
      ...options,
    }
  );
};

/**
 * Hook to fetch a single staff member by ID
 * Retrieves detailed staff information.
 * 
 * @function useFetchStaffById
 * @param {number} id - Staff ID
 * @param {Object} [options={}] - React Query options
 * @returns {Object} React Query query object for single staff member
 */
export const useFetchStaffById = (id, options = {}) => {
  return useQuery(
    ["staff", id],
    () => fetchStaffById(id),
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      onSuccess: (data) => {
        console.log('🏢 [HOOK] Successfully fetched staff member:', `${data.first_name} ${data.last_name}`);
      },
      onError: (error) => {
        console.error('🏢 [HOOK] Failed to fetch staff member:', error);
      },
      ...options,
    }
  );
};

/**
 * Hook to create a new staff member
 * Creates staff with automatic cache invalidation.
 * 
 * @function useCreateStaff
 * @returns {Object} React Query mutation object for staff creation
 */
export const useCreateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (/** @type {{organizationId: number, staffData: CreateStaffData}} */ variables) => 
      createStaff(variables.organizationId, variables.staffData),
    {
      onSuccess: (newStaff) => {
        // Invalidate staff list
        queryClient.invalidateQueries(["staff"]);
        queryClient.invalidateQueries(["staff-infinite"]);
        // Add to cache
        queryClient.setQueryData(["staff", newStaff.id], newStaff);
        console.log('👥 [HOOK] Successfully created staff member:', `${newStaff.first_name} ${newStaff.last_name}`);
      },
      onError: (error) => {
        console.error('👥 [HOOK] Failed to create staff member:', error);
      },
    }
  );
};

/**
 * Hook to update a staff member
 * Updates staff with optimistic updates and cache management.
 * 
 * @function useUpdateStaff
 * @returns {Object} React Query mutation object for staff updates
 */
export const useUpdateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (/** @type {{id: number, data: Partial<StaffData>}} */ variables) => updateStaff(variables.id, variables.data),
    {
      onMutate: async (/** @type {{id: number, data: Partial<StaffData>}} */ variables) => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries(["staff", variables.id]);
        await queryClient.cancelQueries(["staff"]);
        
        // Snapshot previous values
        const previousStaff = queryClient.getQueryData(["staff", variables.id]);
        const previousStaffList = queryClient.getQueryData(["staff"]);
        
        // Optimistically update single staff member
        if (previousStaff && typeof previousStaff === 'object') {
          queryClient.setQueryData(["staff", variables.id], {
            ...(/** @type {StaffData} */ previousStaff),
            ...variables.data,
          });
        }
        
        // Optimistically update staff list
        if (previousStaffList) {
          queryClient.setQueryData(["staff"], (/** @type {PaginatedStaffResponse} */ old) => {
            if (old.results) {
              return {
                ...old,
                results: old.results.map((/** @type {StaffData} */ staff) =>
                  staff.id === variables.id ? { ...staff, ...variables.data } : staff
                ),
              };
            }
            return old;
          });
        }
        
        return { previousStaff, previousStaffList };
      },
      onError: (error, variables, context) => {
        // Rollback on error
        if (context?.previousStaff) {
          queryClient.setQueryData(["staff", variables.id], context.previousStaff);
        }
        if (context?.previousStaffList) {
          queryClient.setQueryData(["staff"], context.previousStaffList);
        }
        console.error('🏢 [HOOK] Failed to update staff member:', error);
      },
      onSuccess: (updatedStaff, variables) => {
        // Update specific staff member in cache
        queryClient.setQueryData(["staff", variables.id], updatedStaff);
        console.log('🏢 [HOOK] Successfully updated staff member:', variables.id);
      },
      onSettled: () => {
        // Always refetch after error or success
        queryClient.invalidateQueries(["staff"]);
        queryClient.invalidateQueries(["staff-infinite"]);
      },
    }
  );
};

/**
 * Hook to delete a staff member
 * Deletes staff with optimistic updates and cache cleanup.
 * 
 * @function useDeleteStaff
 * @returns {Object} React Query mutation object for staff deletion
 */
export const useDeleteStaff = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteStaff, {
    onMutate: async (staffId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(["staff"]);
      
      // Snapshot previous value
      const previousStaffList = queryClient.getQueryData(["staff"]);
      
      // Optimistically update
      if (previousStaffList) {
        queryClient.setQueryData(["staff"], (/** @type {PaginatedStaffResponse} */ old) => {
          if (old.results) {
            return {
              ...old,
              results: old.results.filter((/** @type {StaffData} */ staff) => staff.id !== staffId),
            };
          }
          return old;
        });
      }
      
      return { previousStaffList };
    },
    onError: (error, staffId, context) => {
      // Rollback on error
      if (context?.previousStaffList) {
        queryClient.setQueryData(["staff"], context.previousStaffList);
      }
      console.error('🏢 [HOOK] Failed to delete staff member:', error);
    },
    onSuccess: (deletedId) => {
      // Remove specific staff member from cache
      queryClient.removeQueries(["staff", deletedId]);
      console.log('🏢 [HOOK] Successfully deleted staff member:', deletedId);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries(["staff"]);
      queryClient.invalidateQueries(["staff-infinite"]);
    },
  });
};

// =================== DEPARTMENT MANAGEMENT HOOKS =================== //

/**
 * Hook to fetch departments with filtering
 * Supports pagination and advanced filtering.
 * 
 * @function useFetchDepartments
 * @param {Object} [filters={}] - Filtering parameters
 * @param {Object} [options={}] - React Query options
 * @returns {Object} React Query query object for departments
 */
export const useFetchDepartments = (filters = {}, options = {}) => {
  return useQuery(
    ["departments", filters],
    () => fetchDepartments(filters),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      cacheTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      onSuccess: (data) => {
        console.log(`🏢 [HOOK] Successfully fetched ${data.results?.length || 0} departments`);
      },
      onError: (error) => {
        console.error('🏢 [HOOK] Failed to fetch departments:', error);
      },
      ...options,
    }
  );
};

/**
 * Hook to fetch a single department by ID
 * Retrieves detailed department information.
 * 
 * @function useFetchDepartmentById
 * @param {number} id - Department ID
 * @param {Object} [options={}] - React Query options
 * @returns {Object} React Query query object for single department
 */
export const useFetchDepartmentById = (id, options = {}) => {
  return useQuery(
    ["department", id],
    () => fetchDepartmentById(id),
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      onSuccess: (data) => {
        console.log('🏢 [HOOK] Successfully fetched department:', data.name);
      },
      onError: (error) => {
        console.error('🏢 [HOOK] Failed to fetch department:', error);
      },
      ...options,
    }
  );
};

/**
 * Hook to create a new department
 * Creates departments with automatic cache invalidation.
 * 
 * @function useCreateDepartment
 * @returns {Object} React Query mutation object for department creation
 */
export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (/** @type {{organizationId: number, departmentData: CreateDepartmentData}} */ variables) => 
      createDepartment(variables.organizationId, variables.departmentData),
    {
      onSuccess: (newDepartment) => {
        // Invalidate departments list
        queryClient.invalidateQueries(["departments"]);
        // Add to cache
        queryClient.setQueryData(["department", newDepartment.id], newDepartment);
        console.log('�️ [HOOK] Successfully created department:', newDepartment.name);
      },
      onError: (error) => {
        console.error('�️ [HOOK] Failed to create department:', error);
      },
    }
  );
};

/**
 * Hook to update a department
 * Updates departments with optimistic updates and cache management.
 * 
 * @function useUpdateDepartment
 * @returns {Object} React Query mutation object for department updates
 */
export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (/** @type {{id: number, data: Partial<DepartmentData>}} */ variables) => updateDepartment(variables.id, variables.data),
    {
      onMutate: async (/** @type {{id: number, data: Partial<DepartmentData>}} */ variables) => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries(["department", variables.id]);
        await queryClient.cancelQueries(["departments"]);
        
        // Snapshot previous values
        const previousDepartment = queryClient.getQueryData(["department", variables.id]);
        const previousDepartments = queryClient.getQueryData(["departments"]);
        
        // Optimistically update single department
        if (previousDepartment && typeof previousDepartment === 'object') {
          queryClient.setQueryData(["department", variables.id], {
            ...(/** @type {DepartmentData} */ previousDepartment),
            ...variables.data,
          });
        }
        
        // Optimistically update departments list
        if (previousDepartments) {
          queryClient.setQueryData(["departments"], (/** @type {DepartmentResponse} */ old) => {
            if (old.results) {
              return {
                ...old,
                results: old.results.map((/** @type {DepartmentData} */ dept) =>
                  dept.id === variables.id ? { ...dept, ...variables.data } : dept
                ),
              };
            }
            return old;
          });
        }
        
        return { previousDepartment, previousDepartments };
      },
      onError: (error, variables, context) => {
        // Rollback on error
        if (context?.previousDepartment) {
          queryClient.setQueryData(["department", variables.id], context.previousDepartment);
        }
        if (context?.previousDepartments) {
          queryClient.setQueryData(["departments"], context.previousDepartments);
        }
        console.error('🏢 [HOOK] Failed to update department:', error);
      },
      onSuccess: (updatedDepartment, variables) => {
        // Update specific department in cache
        queryClient.setQueryData(["department", variables.id], updatedDepartment);
        console.log('🏢 [HOOK] Successfully updated department:', variables.id);
      },
      onSettled: () => {
        // Always refetch after error or success
        queryClient.invalidateQueries(["departments"]);
      },
    }
  );
};

/**
 * Hook to delete a department
 * Deletes departments with optimistic updates and cache cleanup.
 * 
 * @function useDeleteDepartment
 * @returns {Object} React Query mutation object for department deletion
 */
export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteDepartment, {
    onMutate: async (departmentId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(["departments"]);
      
      // Snapshot previous value
      const previousDepartments = queryClient.getQueryData(["departments"]);
      
      // Optimistically update
      if (previousDepartments) {
        queryClient.setQueryData(["departments"], (/** @type {DepartmentResponse} */ old) => {
          if (old.results) {
            return {
              ...old,
              results: old.results.filter((/** @type {DepartmentData} */ dept) => dept.id !== departmentId),
            };
          }
          return old;
        });
      }
      
      return { previousDepartments };
    },
    onError: (error, departmentId, context) => {
      // Rollback on error
      if (context?.previousDepartments) {
        queryClient.setQueryData(["departments"], context.previousDepartments);
      }
      console.error('🏢 [HOOK] Failed to delete department:', error);
    },
    onSuccess: (deletedId) => {
      // Remove specific department from cache
      queryClient.removeQueries(["department", deletedId]);
      console.log('🏢 [HOOK] Successfully deleted department:', deletedId);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries(["departments"]);
    },
  });
};

// =================== TESTIMONIAL MANAGEMENT HOOKS =================== //

/**
 * Hook to fetch testimonials with filtering
 * Supports pagination and advanced filtering.
 * 
 * @function useFetchTestimonials
 * @param {Object} [filters={}] - Filtering parameters
 * @param {Object} [options={}] - React Query options
 * @returns {Object} React Query query object for testimonials
 */
export const useFetchTestimonials = (filters = {}, options = {}) => {
  return useQuery(
    ["testimonials", filters],
    () => fetchTestimonials(filters),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      cacheTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      onSuccess: (data) => {
        console.log(`🏢 [HOOK] Successfully fetched ${data.results?.length || 0} testimonials`);
      },
      onError: (error) => {
        console.error('🏢 [HOOK] Failed to fetch testimonials:', error);
      },
      ...options,
    }
  );
};

/**
 * Hook to fetch a single testimonial by ID
 * Retrieves detailed testimonial information.
 * 
 * @function useFetchTestimonialById
 * @param {number} id - Testimonial ID
 * @param {Object} [options={}] - React Query options
 * @returns {Object} React Query query object for single testimonial
 */
export const useFetchTestimonialById = (id, options = {}) => {
  return useQuery(
    ["testimonial", id],
    () => fetchTestimonialById(id),
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      onSuccess: (data) => {
        console.log('🏢 [HOOK] Successfully fetched testimonial:', data.name || data.id);
      },
      onError: (error) => {
        console.error('🏢 [HOOK] Failed to fetch testimonial:', error);
      },
      ...options,
    }
  );
};

/**
 * Hook to create a new testimonial
 * Creates testimonials with automatic cache invalidation.
 * 
 * @function useCreateTestimonial
 * @returns {Object} React Query mutation object for testimonial creation
 */
export const useCreateTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (/** @type {{organizationId: number, testimonialData: CreateTestimonialData}} */ variables) => 
      createTestimonial(variables.organizationId, variables.testimonialData),
    {
      onSuccess: (newTestimonial) => {
        // Invalidate testimonials list
        queryClient.invalidateQueries(["testimonials"]);
        // Add to cache
        queryClient.setQueryData(["testimonial", newTestimonial.id], newTestimonial);
        console.log('💬 [HOOK] Successfully created testimonial:', newTestimonial.name || newTestimonial.id);
      },
      onError: (error) => {
        console.error('💬 [HOOK] Failed to create testimonial:', error);
      },
    }
  );
};

/**
 * Hook to update a testimonial
 * Updates testimonials with optimistic updates and cache management.
 * 
 * @function useUpdateTestimonial
 * @returns {Object} React Query mutation object for testimonial updates
 */
export const useUpdateTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (/** @type {{id: number, data: Partial<TestimonialData>}} */ variables) => updateTestimonial(variables.id, variables.data),
    {
      onMutate: async (/** @type {{id: number, data: Partial<TestimonialData>}} */ variables) => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries(["testimonial", variables.id]);
        await queryClient.cancelQueries(["testimonials"]);
        
        // Snapshot previous values
        const previousTestimonial = queryClient.getQueryData(["testimonial", variables.id]);
        const previousTestimonials = queryClient.getQueryData(["testimonials"]);
        
        // Optimistically update single testimonial
        if (previousTestimonial && typeof previousTestimonial === 'object') {
          queryClient.setQueryData(["testimonial", variables.id], {
            ...(/** @type {TestimonialData} */ previousTestimonial),
            ...variables.data,
          });
        }
        
        // Optimistically update testimonials list
        if (previousTestimonials) {
          queryClient.setQueryData(["testimonials"], (/** @type {TestimonialsResponse} */ old) => {
            if (old.results) {
              return {
                ...old,
                results: old.results.map((/** @type {TestimonialData} */ testimonial) =>
                  testimonial.id === variables.id ? { ...testimonial, ...variables.data } : testimonial
                ),
              };
            }
            return old;
          });
        }
        
        return { previousTestimonial, previousTestimonials };
      },
      onError: (error, variables, context) => {
        // Rollback on error
        if (context?.previousTestimonial) {
          queryClient.setQueryData(["testimonial", variables.id], context.previousTestimonial);
        }
        if (context?.previousTestimonials) {
          queryClient.setQueryData(["testimonials"], context.previousTestimonials);
        }
        console.error('🏢 [HOOK] Failed to update testimonial:', error);
      },
      onSuccess: (updatedTestimonial, variables) => {
        // Update specific testimonial in cache
        queryClient.setQueryData(["testimonial", variables.id], updatedTestimonial);
        console.log('🏢 [HOOK] Successfully updated testimonial:', variables.id);
      },
      onSettled: () => {
        // Always refetch after error or success
        queryClient.invalidateQueries(["testimonials"]);
      },
    }
  );
};

/**
 * Hook to delete a testimonial
 * Deletes testimonials with optimistic updates and cache cleanup.
 * 
 * @function useDeleteTestimonial
 * @returns {Object} React Query mutation object for testimonial deletion
 */
export const useDeleteTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteTestimonial, {
    onMutate: async (testimonialId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(["testimonials"]);
      
      // Snapshot previous value
      const previousTestimonials = queryClient.getQueryData(["testimonials"]);
      
      // Optimistically update
      if (previousTestimonials) {
        queryClient.setQueryData(["testimonials"], (/** @type {TestimonialsResponse} */ old) => {
          if (old.results) {
            return {
              ...old,
              results: old.results.filter((/** @type {TestimonialData} */ testimonial) => testimonial.id !== testimonialId),
            };
          }
          return old;
        });
      }
      
      return { previousTestimonials };
    },
    onError: (error, testimonialId, context) => {
      // Rollback on error
      if (context?.previousTestimonials) {
        queryClient.setQueryData(["testimonials"], context.previousTestimonials);
      }
      console.error('🏢 [HOOK] Failed to delete testimonial:', error);
    },
    onSuccess: (deletedId) => {
      // Remove specific testimonial from cache
      queryClient.removeQueries(["testimonial", deletedId]);
      console.log('🏢 [HOOK] Successfully deleted testimonial:', deletedId);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries(["testimonials"]);
    },
  });
};

// =================== SUBSCRIPTION MANAGEMENT HOOKS =================== //

/**
 * Hook to fetch subscriptions with filtering
 * Supports pagination and advanced filtering.
 * 
 * @function useFetchSubscriptions
 * @param {Object} [filters={}] - Filtering parameters
 * @param {Object} [options={}] - React Query options
 * @returns {Object} React Query query object for subscriptions
 */
export const useFetchSubscriptions = (filters = {}, options = {}) => {
  return useQuery(
    ["subscriptions", filters],
    () => fetchSubscriptions(filters),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      cacheTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      onSuccess: (data) => {
        console.log(`🏢 [HOOK] Successfully fetched ${data.results?.length || 0} subscriptions`);
      },
      onError: (error) => {
        console.error('🏢 [HOOK] Failed to fetch subscriptions:', error);
      },
      ...options,
    }
  );
};

/**
 * Hook to create a new subscription
 * Creates subscriptions with automatic cache invalidation.
 * 
 * @function useCreateSubscription
 * @returns {Object} React Query mutation object for subscription creation
 */
export const useCreateSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (/** @type {{organizationId: number, subscriptionData: CreateSubscriptionData}} */ variables) => 
      createSubscription(variables.organizationId, variables.subscriptionData),
    {
      onSuccess: (newSubscription) => {
        // Invalidate subscriptions list
        queryClient.invalidateQueries(["subscriptions"]);
        console.log('📧 [HOOK] Successfully created subscription:', newSubscription.email);
      },
      onError: (error) => {
        console.error('📧 [HOOK] Failed to create subscription:', error);
      },
    }
  );
};

/**
 * Hook to update a subscription
 * Updates subscriptions with optimistic updates and cache management.
 * 
 * @function useUpdateSubscription
 * @returns {Object} React Query mutation object for subscription updates
 */
export const useUpdateSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (/** @type {{id: number, data: Partial<SubscriptionData>}} */ variables) => updateSubscription(variables.id, variables.data),
    {
      onMutate: async (/** @type {{id: number, data: Partial<SubscriptionData>}} */ variables) => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries(["subscriptions"]);
        
        // Snapshot previous values
        const previousSubscriptions = queryClient.getQueryData(["subscriptions"]);
        
        // Optimistically update subscriptions list
        if (previousSubscriptions) {
          queryClient.setQueryData(["subscriptions"], (/** @type {SubscriptionsResponse} */ old) => {
            if (old.results) {
              return {
                ...old,
                results: old.results.map((/** @type {SubscriptionData} */ sub) =>
                  sub.id === variables.id ? { ...sub, ...variables.data } : sub
                ),
              };
            }
            return old;
          });
        }
        
        return { previousSubscriptions };
      },
      onError: (error, variables, context) => {
        // Rollback on error
        if (context?.previousSubscriptions) {
          queryClient.setQueryData(["subscriptions"], context.previousSubscriptions);
        }
        console.error('🏢 [HOOK] Failed to update subscription:', error);
      },
      onSuccess: (updatedSubscription, variables) => {
        console.log('🏢 [HOOK] Successfully updated subscription:', variables.id);
      },
      onSettled: () => {
        // Always refetch after error or success
        queryClient.invalidateQueries(["subscriptions"]);
      },
    }
  );
};

/**
 * Hook to delete a subscription
 * Deletes subscriptions with optimistic updates and cache cleanup.
 * 
 * @function useDeleteSubscription
 * @returns {Object} React Query mutation object for subscription deletion
 */
export const useDeleteSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteSubscription, {
    onMutate: async (subscriptionId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(["subscriptions"]);
      
      // Snapshot previous value
      const previousSubscriptions = queryClient.getQueryData(["subscriptions"]);
      
      // Optimistically update
      if (previousSubscriptions) {
        queryClient.setQueryData(["subscriptions"], (/** @type {SubscriptionsResponse} */ old) => {
          if (old.results) {
            return {
              ...old,
              results: old.results.filter((/** @type {SubscriptionData} */ sub) => sub.id !== subscriptionId),
            };
          }
          return old;
        });
      }
      
      return { previousSubscriptions };
    },
    onError: (error, subscriptionId, context) => {
      // Rollback on error
      if (context?.previousSubscriptions) {
        queryClient.setQueryData(["subscriptions"], context.previousSubscriptions);
      }
      console.error('🏢 [HOOK] Failed to delete subscription:', error);
    },
    onSuccess: (deletedId) => {
      console.log('🏢 [HOOK] Successfully deleted subscription:', deletedId);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries(["subscriptions"]);
    },
  });
};

// =================== BULK OPERATIONS HOOKS =================== //

/**
 * Hook for bulk staff deletion
 * Efficiently deletes multiple staff members.
 * 
 * @function useBulkDeleteStaff
 * @returns {Object} React Query mutation object for bulk staff deletion
 */
export const useBulkDeleteStaff = () => {
  const queryClient = useQueryClient();
  return useMutation(bulkDeleteStaff, {
    onMutate: async (staffIds) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(["staff"]);
      
      // Snapshot previous value
      const previousStaffList = queryClient.getQueryData(["staff"]);
      
      // Optimistically update
      if (previousStaffList) {
        queryClient.setQueryData(["staff"], (/** @type {PaginatedStaffResponse} */ old) => {
          if (old.results) {
            return {
              ...old,
              results: old.results.filter((/** @type {StaffData} */ staff) => !staffIds.includes(staff.id)),
            };
          }
          return old;
        });
      }
      
      return { previousStaffList };
    },
    onError: (error, staffIds, context) => {
      // Rollback on error
      if (context?.previousStaffList) {
        queryClient.setQueryData(["staff"], context.previousStaffList);
      }
      console.error('🏢 [HOOK] Failed to bulk delete staff:', error);
    },
    onSuccess: (result, staffIds) => {
      // Remove specific staff members from cache
      staffIds.forEach(id => {
        queryClient.removeQueries(["staff", id]);
      });
      console.log('🏢 [HOOK] Successfully bulk deleted staff:', staffIds.length);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries(["staff"]);
      queryClient.invalidateQueries(["staff-infinite"]);
    },
  });
};

/**
 * Hook for bulk department deletion
 * Efficiently deletes multiple departments.
 * 
 * @function useBulkDeleteDepartments
 * @returns {Object} React Query mutation object for bulk department deletion
 */
export const useBulkDeleteDepartments = () => {
  const queryClient = useQueryClient();
  return useMutation(bulkDeleteDepartments, {
    onMutate: async (departmentIds) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(["departments"]);
      
      // Snapshot previous value
      const previousDepartments = queryClient.getQueryData(["departments"]);
      
      // Optimistically update
      if (previousDepartments) {
        queryClient.setQueryData(["departments"], (/** @type {DepartmentResponse} */ old) => {
          if (old.results) {
            return {
              ...old,
              results: old.results.filter((/** @type {DepartmentData} */ dept) => !departmentIds.includes(dept.id)),
            };
          }
          return old;
        });
      }
      
      return { previousDepartments };
    },
    onError: (error, departmentIds, context) => {
      // Rollback on error
      if (context?.previousDepartments) {
        queryClient.setQueryData(["departments"], context.previousDepartments);
      }
      console.error('🏢 [HOOK] Failed to bulk delete departments:', error);
    },
    onSuccess: (result, departmentIds) => {
      // Remove specific departments from cache
      departmentIds.forEach(id => {
        queryClient.removeQueries(["department", id]);
      });
      console.log('🏢 [HOOK] Successfully bulk deleted departments:', departmentIds.length);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries(["departments"]);
    },
  });
};

// =================== STATISTICS AND ANALYTICS HOOKS =================== //

/**
 * Hook to fetch organization statistics
 * Retrieves comprehensive organization analytics data.
 * 
 * @function useFetchOrganizationStats
 * @param {Object} [options={}] - Statistics options
 * @param {Object} [queryOptions={}] - React Query options
 * @returns {Object} React Query query object for statistics
 */
export const useFetchOrganizationStats = (options = {}, queryOptions = {}) => {
  return useQuery(
    ["organization-stats", options],
    () => fetchOrganizationStats(options),
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
      cacheTime: 15 * 60 * 1000, // 15 minutes
      onSuccess: (data) => {
        console.log('🏢 [HOOK] Successfully fetched organization statistics');
      },
      onError: (error) => {
        console.error('🏢 [HOOK] Failed to fetch organization stats:', error);
      },
      ...queryOptions,
    }
  );
};

// =================== COMPOUND HOOKS FOR COMPLEX OPERATIONS =================== //

/**
 * Hook for organization dashboard data
 * Combines multiple organization-related queries for dashboard views.
 * 
 * @function useOrganizationDashboard
 * @returns {Object} Combined query results for organization dashboard
 */
export const useOrganizationDashboard = () => {
  const organizationQuery = useFetchOrganization();
  const staffQuery = useFetchStaff({ limit: 10 });
  const departmentsQuery = useFetchDepartments({ limit: 10 });
  const testimonialsQuery = useFetchTestimonials({ limit: 5 });
  const statsQuery = useFetchOrganizationStats();

  return {
    organization: organizationQuery,
    staff: staffQuery,
    departments: departmentsQuery,
    testimonials: testimonialsQuery,
    stats: statsQuery,
    isLoading: 
      organizationQuery.isLoading || 
      staffQuery.isLoading || 
      departmentsQuery.isLoading || 
      testimonialsQuery.isLoading || 
      statsQuery.isLoading,
    hasError: 
      organizationQuery.isError || 
      staffQuery.isError || 
      departmentsQuery.isError || 
      testimonialsQuery.isError || 
      statsQuery.isError,
    refetchAll: () => {
      organizationQuery.refetch();
      staffQuery.refetch();
      departmentsQuery.refetch();
      testimonialsQuery.refetch();
      statsQuery.refetch();
    },
  };
};

/**
 * Hook for organization management operations
 * Provides all organization management mutations in one place.
 * 
 * @function useOrganizationManagement
 * @returns {Object} Combined mutation objects for organization management
 */
export const useOrganizationManagement = () => {
  const createOrganizationMutation = useCreateOrganization();
  const updateOrganizationMutation = useUpdateOrganization();
  const deleteOrganizationMutation = useDeleteOrganization();
  const createStaffMutation = useCreateStaff();
  const updateStaffMutation = useUpdateStaff();
  const deleteStaffMutation = useDeleteStaff();
  const createDepartmentMutation = useCreateDepartment();
  const updateDepartmentMutation = useUpdateDepartment();
  const deleteDepartmentMutation = useDeleteDepartment();
  const bulkDeleteStaffMutation = useBulkDeleteStaff();
  const bulkDeleteDepartmentsMutation = useBulkDeleteDepartments();

  return {
    organization: {
      create: createOrganizationMutation,
      update: updateOrganizationMutation,
      delete: deleteOrganizationMutation,
    },
    staff: {
      create: createStaffMutation,
      update: updateStaffMutation,
      delete: deleteStaffMutation,
      bulkDelete: bulkDeleteStaffMutation,
    },
    departments: {
      create: createDepartmentMutation,
      update: updateDepartmentMutation,
      delete: deleteDepartmentMutation,
      bulkDelete: bulkDeleteDepartmentsMutation,
    },
    isLoading: 
      createOrganizationMutation.isLoading ||
      updateOrganizationMutation.isLoading ||
      deleteOrganizationMutation.isLoading ||
      createStaffMutation.isLoading ||
      updateStaffMutation.isLoading ||
      deleteStaffMutation.isLoading ||
      createDepartmentMutation.isLoading ||
      updateDepartmentMutation.isLoading ||
      deleteDepartmentMutation.isLoading ||
      bulkDeleteStaffMutation.isLoading ||
      bulkDeleteDepartmentsMutation.isLoading,
  };
};
