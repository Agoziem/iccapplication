import { converttoformData } from "@/utils/formutils";
import { ORGANIZATION_ID } from "@/constants";
import {
  OrganizationSchema,
  PaginatedStaffResponseSchema,
  PaginatedTestimonialResponseSchema,
  StaffSchema,
  TestimonialSchema,
} from "@/types/organizations";
import {
  CreateDepartmentServiceType,
  CreateDepartmentType,
  CreateOrganizationType,
  CreateStaffType,
  CreateSubscriptionType,
  CreateTestimonialType,
  UpdateDepartmentServiceType,
  UpdateDepartmentType,
  UpdateStaffType,
  UpdateTestimonialType,
} from "@/schemas/organizations";
import { AxiosinstanceAuth, AxiosinstanceFormDataAuth } from "./instance";
import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from "react-query";

const Organizationid = ORGANIZATION_ID;

// ======================================================
// React Query Hooks - Organization
// ======================================================

/**
 * Hook to fetch organization
 */
export const useGetOrganization = (): UseQueryResult<OrganizationSchema> => {
  return useQuery("organization", async () => {
    const response = await AxiosinstanceAuth.get(`/organizations/${Organizationid}/`);
    return response.data;
  });
};

/**
 * Hook to create organization
 */
export const useCreateOrganization = (): UseMutationResult<
  OrganizationSchema,
  Error,
  { organization: CreateOrganizationType; logo?: File | null }
> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: { organization: CreateOrganizationType; logo?: File | null }) => {
      const response = await AxiosinstanceFormDataAuth.post(`/organizations/`, data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("organization");
      },
      onError: (error) => {
        console.error("Failed to create organization:", error);
      },
    }
  );
};

/**
 * Hook to update organization
 */
export const useUpdateOrganization = (): UseMutationResult<
  OrganizationSchema,
  Error,
  { id: number; organization: CreateOrganizationType; logo?: File | null }
> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: { id: number; organization: CreateOrganizationType; logo?: File | null }) => {
      try {
        const response = await AxiosinstanceFormDataAuth.put(`/organizations/${data.id}`, data);
        return response.data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        throw new Error(errorMessage);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("organization");
      },
      onError: (error) => {
        console.error("Failed to update organization:", error);
      },
    }
  );
};

/**
 * Hook to delete organization
 */
export const useDeleteOrganization = (): UseMutationResult<number, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (organizationid: number) => {
      await AxiosinstanceAuth.delete(`/organizations/${organizationid}/`);
      return organizationid;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("organization");
      },
      onError: (error) => {
        console.error("Failed to delete organization:", error);
      },
    }
  );
};

// ======================================================
// React Query Hooks - Staff
// ======================================================

/**
 * Hook to fetch all staff
 */
export const useGetStaffs = (): UseQueryResult<PaginatedStaffResponseSchema> => {
  return useQuery("staffs", async () => {
    const response = await AxiosinstanceAuth.get(`/staff/${Organizationid}`);
    return response.data;
  });
};

/**
 * Hook to fetch single staff
 */
export const useGetStaff = (staffid: number): UseQueryResult<StaffSchema> => {
  return useQuery(
    ["staff", staffid],
    async () => {
      const response = await AxiosinstanceAuth.get(`/staff/member/${staffid}`);
      return response.data;
    },
    {
      enabled: !!staffid,
    }
  );
};

/**
 * Hook to create staff
 */
export const useCreateStaff = (): UseMutationResult<
  StaffSchema,
  Error,
  { staff: CreateStaffType; img?: File | null }
> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: { staff: CreateStaffType; img?: File | null }) => {
      const response = await AxiosinstanceFormDataAuth.post(`/staff/${Organizationid}`, data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("staffs");
      },
      onError: (error) => {
        console.error("Failed to create staff:", error);
      },
    }
  );
};

/**
 * Hook to update staff
 */
export const useUpdateStaff = (): UseMutationResult<
  StaffSchema,
  Error,
  { id: number; staff: UpdateStaffType; img?: File | null }
> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: { id: number; staff: UpdateStaffType; img?: File | null }) => {
      const response = await AxiosinstanceFormDataAuth.put(`/staff/${Organizationid}`, data);
      return response.data;
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries("staffs");
        queryClient.invalidateQueries(["staff", variables.id]);
      },
      onError: (error) => {
        console.error("Failed to update staff:", error);
      },
    }
  );
};

/**
 * Hook to delete staff
 */
export const useDeleteStaff = (): UseMutationResult<number, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (staffid: number) => {
      await AxiosinstanceAuth.delete(`/staff/${staffid}`);
      return staffid;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("staffs");
      },
      onError: (error) => {
        console.error("Failed to delete staff:", error);
      },
    }
  );
};

// ======================================================
// React Query Hooks - Testimonials
// ======================================================

/**
 * Hook to fetch all testimonials
 */
export const useGetTestimonials = (): UseQueryResult<PaginatedTestimonialResponseSchema> => {
  return useQuery("testimonials", async () => {
    const response = await AxiosinstanceAuth.get(`/testimonials/${Organizationid}/`);
    return response.data;
  });
};

/**
 * Hook to fetch single testimonial
 */
export const useGetTestimonial = (testimonialid: number): UseQueryResult<TestimonialSchema> => {
  return useQuery(
    ["testimonial", testimonialid],
    async () => {
      const response = await AxiosinstanceAuth.get(`/testimonials/testimonial/${testimonialid}/`);
      return response.data;
    },
    {
      enabled: !!testimonialid,
    }
  );
};

/**
 * Hook to create testimonial
 */
export const useCreateTestimonial = (): UseMutationResult<
  TestimonialSchema,
  Error,
  { testimonial: CreateTestimonialType; img?: File | null }
> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: { testimonial: CreateTestimonialType; img?: File | null }) => {
      try {
        const response = await AxiosinstanceFormDataAuth.post(`/testimonials/${Organizationid}/`, data);
        return response.data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        console.log(errorMessage);
        throw new Error(errorMessage);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("testimonials");
      },
      onError: (error) => {
        console.error("Failed to create testimonial:", error);
      },
    }
  );
};

/**
 * Hook to update testimonial
 */
export const useUpdateTestimonial = (): UseMutationResult<
  TestimonialSchema,
  Error,
  { id: number; testimonial: UpdateTestimonialType; img?: File | null }
> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: { id: number; testimonial: UpdateTestimonialType; img?: File | null }) => {
      try {
        const response = await AxiosinstanceFormDataAuth.put(`/testimonials/${data.id}/`, data);
        return response.data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        console.log(errorMessage);
        throw new Error(errorMessage);
      }
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries("testimonials");
        queryClient.invalidateQueries(["testimonial", variables.id]);
      },
      onError: (error) => {
        console.error("Failed to update testimonial:", error);
      },
    }
  );
};

/**
 * Hook to delete testimonial
 */
export const useDeleteTestimonial = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (testimonialid: number) => {
      await AxiosinstanceAuth.delete(`/testimonials/${testimonialid}/`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("testimonials");
      },
      onError: (error) => {
        console.error("Failed to delete testimonial:", error);
      },
    }
  );
};

// ======================================================
// React Query Hooks - Departments
// ======================================================

/**
 * Hook to fetch all departments
 */
export const useGetDepartments = (): UseQueryResult<any> => {
  return useQuery("departments", async () => {
    const response = await AxiosinstanceAuth.get(`/departments/${Organizationid}`);
    return response.data;
  });
};

/**
 * Hook to fetch single department
 */
export const useGetDepartment = (departmentid: number): UseQueryResult<any> => {
  return useQuery(
    ["department", departmentid],
    async () => {
      const response = await AxiosinstanceAuth.get(`/departments/department/${departmentid}`);
      return response.data;
    },
    {
      enabled: !!departmentid,
    }
  );
};

/**
 * Hook to create department
 */
export const useCreateDepartment = (): UseMutationResult<
  any,
  Error,
  { department: CreateDepartmentType; img?: File | null }
> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: { department: CreateDepartmentType; img?: File | null }) => {
      const response = await AxiosinstanceFormDataAuth.post(`/departments/${Organizationid}/`, data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("departments");
      },
      onError: (error) => {
        console.error("Failed to create department:", error);
      },
    }
  );
};

/**
 * Hook to update department
 */
export const useUpdateDepartment = (): UseMutationResult<
  any,
  Error,
  { id: number; department: UpdateDepartmentType; img?: File | null }
> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: { id: number; department: UpdateDepartmentType; img?: File | null }) => {
      const response = await AxiosinstanceFormDataAuth.put(`/departments/${data.id}/`, data);
      return response.data;
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries("departments");
        queryClient.invalidateQueries(["department", variables.id]);
      },
      onError: (error) => {
        console.error("Failed to update department:", error);
      },
    }
  );
};

/**
 * Hook to delete department
 */
export const useDeleteDepartment = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (departmentid: number) => {
      await AxiosinstanceFormDataAuth.delete(`/departments/${departmentid}/`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("departments");
      },
      onError: (error) => {
        console.error("Failed to delete department:", error);
      },
    }
  );
};

// ======================================================
// React Query Hooks - Department Services
// ======================================================

/**
 * Hook to fetch all department services
 */
export const useGetDepartmentServices = (): UseQueryResult<any> => {
  return useQuery("departmentServices", async () => {
    const response = await AxiosinstanceAuth.get(`/department-services/`);
    return response.data;
  });
};

/**
 * Hook to fetch single department service
 */
export const useGetDepartmentService = (serviceid: number): UseQueryResult<any> => {
  return useQuery(
    ["departmentService", serviceid],
    async () => {
      const response = await AxiosinstanceAuth.get(`/department-services/${serviceid}/`);
      return response.data;
    },
    {
      enabled: !!serviceid,
    }
  );
};

/**
 * Hook to create department service
 */
export const useCreateDepartmentService = (): UseMutationResult<any, Error, CreateDepartmentServiceType> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: CreateDepartmentServiceType) => {
      const response = await AxiosinstanceAuth.post(`/department-services/`, data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("departmentServices");
      },
      onError: (error) => {
        console.error("Failed to create department service:", error);
      },
    }
  );
};

/**
 * Hook to update department service
 */
export const useUpdateDepartmentService = (): UseMutationResult<
  any,
  Error,
  { id: number; service: UpdateDepartmentServiceType }
> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: { id: number; service: UpdateDepartmentServiceType }) => {
      const response = await AxiosinstanceAuth.put(`/department-services/${data.id}/`, data.service);
      return response.data;
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries("departmentServices");
        queryClient.invalidateQueries(["departmentService", variables.id]);
      },
      onError: (error) => {
        console.error("Failed to update department service:", error);
      },
    }
  );
};

/**
 * Hook to delete department service
 */
export const useDeleteDepartmentService = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (serviceid: number) => {
      await AxiosinstanceAuth.delete(`/department-services/${serviceid}/`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("departmentServices");
      },
      onError: (error) => {
        console.error("Failed to delete department service:", error);
      },
    }
  );
};

// ======================================================
// React Query Hooks - Subscriptions
// ======================================================

/**
 * Hook to fetch all subscriptions
 */
export const useGetSubscriptions = (): UseQueryResult<any> => {
  return useQuery("subscriptions", async () => {
    const response = await AxiosinstanceAuth.get(`/subscriptions/${Organizationid}/`);
    return response.data;
  });
};

/**
 * Hook to fetch single subscription
 */
export const useGetSubscription = (subscriptionid: number): UseQueryResult<any> => {
  return useQuery(
    ["subscription", subscriptionid],
    async () => {
      const response = await AxiosinstanceAuth.get(`/subscriptions/subscription/${subscriptionid}/`);
      return response.data;
    },
    {
      enabled: !!subscriptionid,
    }
  );
};

/**
 * Hook to create subscription
 */
export const useCreateSubscription = (): UseMutationResult<any, Error, CreateSubscriptionType> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: CreateSubscriptionType) => {
      const response = await AxiosinstanceAuth.post(`/subscriptions/${Organizationid}/`, data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("subscriptions");
      },
      onError: (error) => {
        console.error("Failed to create subscription:", error);
      },
    }
  );
};

/**
 * Hook to update subscription
 */
export const useUpdateSubscription = (): UseMutationResult<
  any,
  Error,
  { id: number; subscription: CreateSubscriptionType }
> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: { id: number; subscription: CreateSubscriptionType }) => {
      const response = await AxiosinstanceAuth.put(`/subscriptions/${data.id}/`, data.subscription);
      return response.data;
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries("subscriptions");
        queryClient.invalidateQueries(["subscription", variables.id]);
      },
      onError: (error) => {
        console.error("Failed to update subscription:", error);
      },
    }
  );
};

/**
 * Hook to delete subscription
 */
export const useDeleteSubscription = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (subscriptionid: number) => {
      await AxiosinstanceAuth.delete(`/subscriptions/${subscriptionid}/`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("subscriptions");
      },
      onError: (error) => {
        console.error("Failed to delete subscription:", error);
      },
    }
  );
};
