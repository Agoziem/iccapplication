"use client";
import { useQuery, useMutation, QueryClient, useQueryClient } from "react-query";
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
export const useFetchOrganization = () =>
  useQuery(["organization"], () => fetchOrganization());

export const useCreateOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation(createOrganization, {
    onSuccess: () => queryClient.invalidateQueries(["organization"]),
  });
};

export const useUpdateOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation(updateOrganization, {
    onSuccess: () => queryClient.invalidateQueries(["organization"]),
  });
};

export const useDeleteOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteOrganization, {
    onSuccess: () => queryClient.invalidateQueries(["organization"]),
  });
};

// Custom Hooks for Staffs
export const useFetchStaffs = (url) =>
  useQuery(["staffs", url], () => fetchStaffs(url), {
    enabled: !!url,
    onSuccess: (data) => {
      data.results = data.results.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
  });

export const useCreateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation(createStaff, {
    onSuccess: () => queryClient.invalidateQueries(["staffs"]),
  });
};

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation(updateStaff, {
    onSuccess: () => queryClient.invalidateQueries(["staffs"]),
  });
};

export const useDeleteStaff = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteStaff, {
    onSuccess: () => queryClient.invalidateQueries(["staffs"]),
  });
};

// Custom Hooks for Departments
export const useFetchDepartments = (url) =>
  useQuery(["departments", url], () => fetchDepartments(url), {
    enabled: !!url,
    onSuccess: (data) => {
      data.results = data.results.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
  });

export const useFetchDepartment = (url) =>
  useQuery(["department", url], () => fetchDepartment(url), {
    enabled: !!url,
  });

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation(createDepartment, {
    onSuccess: () => queryClient.invalidateQueries(["departments"]),
  });
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation(updateDepartment, {
    onSuccess: () => queryClient.invalidateQueries(["departments"]),
  });
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteDepartment, {
    onSuccess: () => queryClient.invalidateQueries(["departments"]),
  });
};

// Custom Hooks for Testimonials
export const useFetchTestimonials = (url) =>
  useQuery(["testimonials", url], () => fetchTestimonials(url), {
    enabled: !!url,
    onSuccess: (data) => {
      data.results = data.results.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    },
  });

export const useCreateTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation(createTestimonial, {
    onSuccess: () => queryClient.invalidateQueries(["testimonials"]),
  });
};

export const useUpdateTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation(updateTestimonial, {
    onSuccess: () => queryClient.invalidateQueries(["testimonials"]),
  });
};

export const useDeleteTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteTestimonial, {
    onSuccess: () => queryClient.invalidateQueries(["testimonials"]),
  });
};

// Custom Hooks for Subscriptions
export const useFetchSubscriptions = (url) =>
  useQuery(["subscriptions", url], () => fetchSubscriptions(url), {
    enabled: !!url,
    onSuccess: (data) => {
      data.results = data.results.sort(
        (a, b) => new Date(b.date_added).getTime() - new Date(a.date_added).getTime()
      );
    },
  });

export const useCreateSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation(createSubscription, {
    onSuccess: () => queryClient.invalidateQueries(["subscriptions"]),
  });
};

export const useUpdateSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation(updateSubscription, {
    onSuccess: () => queryClient.invalidateQueries(["subscriptions"]),
  });
};

export const useDeleteSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteSubscription, {
    onSuccess: () => queryClient.invalidateQueries(["subscriptions"]),
  });
};
