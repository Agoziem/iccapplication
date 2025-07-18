"use client";
import { useQuery, useMutation, QueryClient, useQueryClient, UseQueryResult, UseMutationResult } from "react-query";
import {
  Organization,
  Department,
  DepartmentResponse,
  Staff,
  Staffpaginated,
  Testimony,
  Testimonypaginated,
  Subscription,
  Subscriptionpaginated
} from "@/types/organizations";
import {
  fetchOrganization,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  
  fetchStaffs,
  createStaff,
  updateStaff,
  deleteStaff,

  fetchDepartments,
  fetchDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,

  fetchTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,

  fetchSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
} from "@/data/organization/fetcher";

// Initialize Query Client
const queryClient = new QueryClient();

// Custom Hooks for Organization
export const useFetchOrganization = (): UseQueryResult<Organization, Error> =>
  useQuery(["organization"], () => fetchOrganization());

export const useCreateOrganization = (): UseMutationResult<Organization | undefined, Error, Partial<Organization>> => {
  const queryClient = useQueryClient();
  return useMutation(createOrganization, {
    onSuccess: () => queryClient.invalidateQueries(["organization"]),
  });
};

export const useUpdateOrganization = (): UseMutationResult<Organization | undefined, Error, Partial<Organization>> => {
  const queryClient = useQueryClient();
  return useMutation(updateOrganization, {
    onSuccess: () => queryClient.invalidateQueries(["organization"]),
  });
};

export const useDeleteOrganization = (): UseMutationResult<number, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation(deleteOrganization, {
    onSuccess: () => queryClient.invalidateQueries(["organization"]),
  });
};

// Custom Hooks for Staffs
export const useFetchStaffs = (url: string): UseQueryResult<Staffpaginated, Error> =>
  useQuery(["staffs", url], () => fetchStaffs(url), {
    enabled: !!url,
    onSuccess: (data) => {
      if (data?.results) {
        data.results = data.results.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }
    }
  });

export const useCreateStaff = (): UseMutationResult<Staff | undefined, Error, Partial<Staff>> => {
  const queryClient = useQueryClient();
  return useMutation(createStaff, {
    onSuccess: () => queryClient.invalidateQueries(["staffs"]),
  });
};

export const useUpdateStaff = (): UseMutationResult<Staff | undefined, Error, Partial<Staff>> => {
  const queryClient = useQueryClient();
  return useMutation(updateStaff, {
    onSuccess: () => queryClient.invalidateQueries(["staffs"]),
  });
};

export const useDeleteStaff = (): UseMutationResult<number, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation(deleteStaff, {
    onSuccess: () => queryClient.invalidateQueries(["staffs"]),
  });
};

// Custom Hooks for Departments
export const useFetchDepartments = (url: string): UseQueryResult<DepartmentResponse, Error> =>
  useQuery(["departments", url], () => fetchDepartments(url), {
    enabled: !!url,
    onSuccess: (data) => {
      if (data?.results) {
        data.results = data.results.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }
    }
  });

export const useFetchDepartment = (url: string): UseQueryResult<Department, Error> =>
  useQuery(["department", url], () => fetchDepartment(url), {
    enabled: !!url,
  });

export const useCreateDepartment = (): UseMutationResult<Department | undefined, Error, Partial<Department>> => {
  const queryClient = useQueryClient();
  return useMutation(createDepartment, {
    onSuccess: () => queryClient.invalidateQueries(["departments"]),
  });
};

export const useUpdateDepartment = (): UseMutationResult<Department | undefined, Error, Partial<Department>> => {
  const queryClient = useQueryClient();
  return useMutation(updateDepartment, {
    onSuccess: () => queryClient.invalidateQueries(["departments"]),
  });
};

export const useDeleteDepartment = (): UseMutationResult<number, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation(deleteDepartment, {
    onSuccess: () => queryClient.invalidateQueries(["departments"]),
  });
};

// Custom Hooks for Testimonials
export const useFetchTestimonials = (url: string): UseQueryResult<Testimonypaginated, Error> =>
  useQuery(["testimonials", url], () => fetchTestimonials(url), {
    enabled: !!url,
    onSuccess: (data) => {
      if (data?.results) {
        data.results = data.results.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }
    }
  });

export const useCreateTestimonial = (): UseMutationResult<Testimony | undefined, Error, Partial<Testimony>> => {
  const queryClient = useQueryClient();
  return useMutation(createTestimonial, {
    onSuccess: () => queryClient.invalidateQueries(["testimonials"]),
  });
};

export const useUpdateTestimonial = (): UseMutationResult<Testimony | undefined, Error, Partial<Testimony>> => {
  const queryClient = useQueryClient();
  return useMutation(updateTestimonial, {
    onSuccess: () => queryClient.invalidateQueries(["testimonials"]),
  });
};

export const useDeleteTestimonial = (): UseMutationResult<number, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation(deleteTestimonial, {
    onSuccess: () => queryClient.invalidateQueries(["testimonials"]),
  });
};

// Custom Hooks for Subscriptions
export const useFetchSubscriptions = (url: string): UseQueryResult<Subscriptionpaginated, Error> =>
  useQuery(["subscriptions", url], () => fetchSubscriptions(url), {
    enabled: !!url,
    onSuccess: (data) => {
      if (data?.results) {
        data.results = data.results.sort(
          (a, b) => new Date(b.date_added).getTime() - new Date(a.date_added).getTime()
        );
      }
    }
  });

export const useCreateSubscription = (): UseMutationResult<Subscription | undefined, Error, Partial<Subscription>> => {
  const queryClient = useQueryClient();
  return useMutation(createSubscription, {
    onSuccess: () => queryClient.invalidateQueries(["subscriptions"]),
  });
};

export const useUpdateSubscription = (): UseMutationResult<Subscription | undefined, Error, Partial<Subscription>> => {
  const queryClient = useQueryClient();
  return useMutation(updateSubscription, {
    onSuccess: () => queryClient.invalidateQueries(["subscriptions"]),
  });
};

export const useDeleteSubscription = (): UseMutationResult<number, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation(deleteSubscription, {
    onSuccess: () => queryClient.invalidateQueries(["subscriptions"]),
  });
};
