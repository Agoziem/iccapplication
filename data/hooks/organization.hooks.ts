import { converttoformData } from "@/utils/formutils";
import { AxiosInstance, AxiosInstancemultipart, AxiosInstanceWithToken, AxiosInstancemultipartWithToken } from "../instance";
import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from "react-query";
import {
  Organization,
  CreateOrganization,
  UpdateOrganization,
  Staff,
  CreateStaff,
  UpdateStaff,
  PaginatedStaff,
  Department,
  CreateDepartment,
  UpdateDepartment,
  PaginatedDepartment,
  Testimonial,
  CreateTestimonial,
  UpdateTestimonial,
  PaginatedTestimonial,
  Subscription,
  CreateSubscription,
  UpdateSubscription,
  PaginatedSubscription,
  OrganizationArray
} from "@/types/organizations";

export const organizationApiendpoint = "/api";

// Query Keys
export const ORGANIZATION_KEYS = {
  all: ['organizations'] as const,
  lists: () => [...ORGANIZATION_KEYS.all, 'list'] as const,
  list: () => [...ORGANIZATION_KEYS.lists()] as const,
  details: () => [...ORGANIZATION_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...ORGANIZATION_KEYS.details(), id] as const,
  staff: (orgId: number) => [...ORGANIZATION_KEYS.all, 'staff', orgId] as const,
  staffDetail: (staffId: number) => [...ORGANIZATION_KEYS.all, 'staff', 'detail', staffId] as const,
  departments: (orgId: number) => [...ORGANIZATION_KEYS.all, 'departments', orgId] as const,
  testimonials: (orgId: number) => [...ORGANIZATION_KEYS.all, 'testimonials', orgId] as const,
  subscriptions: (orgId: number) => [...ORGANIZATION_KEYS.all, 'subscriptions', orgId] as const,
} as const;

// Organization CRUD operations
export const fetchOrganizations = async (): Promise<OrganizationArray> => {
  const response = await AxiosInstance.get(`${organizationApiendpoint}/organization/`);
  return response.data;
};

export const fetchOrganization = async (organizationId: number): Promise<Organization> => {
  const response = await AxiosInstance.get(`${organizationApiendpoint}/organization/${organizationId}/`);
  return response.data;
};

export const createOrganization = async (organizationData: CreateOrganization): Promise<Organization> => {
  const formData = converttoformData(organizationData);
  const response = await AxiosInstancemultipartWithToken.post(
    `${organizationApiendpoint}/organization/add/`,
    formData
  );
  return response.data;
};

export const updateOrganization = async (organizationId: number, updateData: UpdateOrganization): Promise<Organization> => {
  const formData = converttoformData(updateData);
  const response = await AxiosInstancemultipartWithToken.put(
    `${organizationApiendpoint}/organization/update/${organizationId}/`,
    formData
  );
  return response.data;
};

export const deleteOrganization = async (organizationId: number): Promise<void> => {
  await AxiosInstanceWithToken.delete(`${organizationApiendpoint}/organization/delete/${organizationId}/`);
};

export const editPrivacyPolicy = async (organizationId: number, privacyPolicy: string): Promise<Organization> => {
  const response = await AxiosInstanceWithToken.put(
    `${organizationApiendpoint}/organization/editprivacypolicy/${organizationId}/`,
    { privacy_policy: privacyPolicy }
  );
  return response.data;
};

export const editTermsOfUse = async (organizationId: number, termsOfUse: string): Promise<Organization> => {
  const response = await AxiosInstanceWithToken.put(
    `${organizationApiendpoint}/organization/edittermsofuse/${organizationId}/`,
    { terms_of_use: termsOfUse }
  );
  return response.data;
};

// Staff CRUD operations
export const fetchStaff = async (organizationId: number, params?: Record<string, any>): Promise<PaginatedStaff> => {
  const response = await AxiosInstance.get(`${organizationApiendpoint}/staff/${organizationId}/`, { params });
  return response.data;
};

export const fetchStaffById = async (staffId: number): Promise<Staff> => {
  const response = await AxiosInstance.get(`${organizationApiendpoint}/staff/${staffId}/`);
  return response.data;
};

export const createStaff = async (organizationId: number, staffData: CreateStaff): Promise<Staff> => {
  const formData = converttoformData(staffData);
  const response = await AxiosInstancemultipartWithToken.post(
    `${organizationApiendpoint}/staff/add/${organizationId}/`,
    formData
  );
  return response.data;
};

export const updateStaff = async (staffId: number, updateData: UpdateStaff): Promise<Staff> => {
  const formData = converttoformData(updateData);
  const response = await AxiosInstancemultipartWithToken.put(
    `${organizationApiendpoint}/staff/update/${staffId}/`,
    formData
  );
  return response.data;
};

export const deleteStaff = async (staffId: number): Promise<void> => {
  await AxiosInstanceWithToken.delete(`${organizationApiendpoint}/staff/delete/${staffId}/`);
};

// Department CRUD operations
export const fetchDepartments = async (organizationId: number, params?: Record<string, any>): Promise<PaginatedDepartment> => {
  const response = await AxiosInstance.get(`${organizationApiendpoint}/department/${organizationId}/`, { params });
  return response.data;
};

export const createDepartment = async (organizationId: number, departmentData: CreateDepartment): Promise<Department> => {
  const formData = converttoformData(departmentData, ["services"]);
  const response = await AxiosInstancemultipartWithToken.post(
    `${organizationApiendpoint}/department/add/${organizationId}/`,
    formData
  );
  return response.data;
};

export const updateDepartment = async (departmentId: number, updateData: UpdateDepartment): Promise<Department> => {
  const formData = converttoformData(updateData, ["services"]);
  const response = await AxiosInstancemultipartWithToken.put(
    `${organizationApiendpoint}/department/update/${departmentId}/`,
    formData
  );
  return response.data;
};

export const deleteDepartment = async (departmentId: number): Promise<void> => {
  await AxiosInstanceWithToken.delete(`${organizationApiendpoint}/department/delete/${departmentId}/`);
};

// Testimonial CRUD operations
export const fetchTestimonials = async (organizationId: number, params?: Record<string, any>): Promise<PaginatedTestimonial> => {
  const response = await AxiosInstance.get(`${organizationApiendpoint}/testimonial/${organizationId}/`, { params });
  return response.data;
};

export const fetchTestimonialById = async (testimonialId: number): Promise<Testimonial> => {
  const response = await AxiosInstance.get(`${organizationApiendpoint}/testimonial/${testimonialId}/`);
  return response.data;
};

export const createTestimonial = async (organizationId: number, testimonialData: CreateTestimonial): Promise<Testimonial> => {
  const formData = converttoformData(testimonialData);
  const response = await AxiosInstancemultipartWithToken.post(
    `${organizationApiendpoint}/testimonial/add/${organizationId}/`,
    formData
  );
  return response.data;
};

export const updateTestimonial = async (testimonialId: number, updateData: UpdateTestimonial): Promise<Testimonial> => {
  const formData = converttoformData(updateData);
  const response = await AxiosInstancemultipartWithToken.put(
    `${organizationApiendpoint}/testimonial/update/${testimonialId}/`,
    formData
  );
  return response.data;
};

export const deleteTestimonial = async (testimonialId: number): Promise<void> => {
  await AxiosInstanceWithToken.delete(`${organizationApiendpoint}/testimonial/delete/${testimonialId}/`);
};

// Subscription CRUD operations
export const fetchSubscriptions = async (organizationId: number, params?: Record<string, any>): Promise<PaginatedSubscription> => {
  const response = await AxiosInstance.get(`${organizationApiendpoint}/subscription/${organizationId}/`, { params });
  return response.data;
};

export const fetchSubscriptionById = async (subscriptionId: number): Promise<Subscription> => {
  const response = await AxiosInstance.get(`${organizationApiendpoint}/subscription/${subscriptionId}/`);
  return response.data;
};

export const createSubscription = async (organizationId: number, subscriptionData: CreateSubscription): Promise<Subscription> => {
  const response = await AxiosInstanceWithToken.post(
    `${organizationApiendpoint}/subscription/add/${organizationId}/`,
    subscriptionData
  );
  return response.data;
};

export const updateSubscription = async (subscriptionId: number, updateData: UpdateSubscription): Promise<Subscription> => {
  const response = await AxiosInstanceWithToken.put(
    `${organizationApiendpoint}/subscription/update/${subscriptionId}/`,
    updateData
  );
  return response.data;
};

export const deleteSubscription = async (subscriptionId: number): Promise<void> => {
  await AxiosInstanceWithToken.delete(`${organizationApiendpoint}/subscription/delete/${subscriptionId}/`);
};

// React Query Hooks

// Organization Query Hooks
export const useOrganizations = (): UseQueryResult<OrganizationArray, Error> => {
  return useQuery({
    queryKey: ORGANIZATION_KEYS.list(),
    queryFn: fetchOrganizations,
    onError: (error: Error) => {
      console.error('Error fetching organizations:', error);
      throw error;
    },
  });
};

export const useOrganization = (organizationId: number): UseQueryResult<Organization, Error> => {
  return useQuery({
    queryKey: ORGANIZATION_KEYS.detail(organizationId),
    queryFn: () => fetchOrganization(organizationId),
    enabled: !!organizationId,
    onError: (error: Error) => {
      console.error('Error fetching organization:', error);
      throw error;
    },
  });
};

// Organization Management Mutations
export const useCreateOrganization = (): UseMutationResult<Organization, Error, CreateOrganization> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries(ORGANIZATION_KEYS.lists());
    },
    onError: (error: Error) => {
      console.error('Error creating organization:', error);
      throw error;
    },
  });
};

export const useUpdateOrganization = (): UseMutationResult<Organization, Error, { organizationId: number; updateData: UpdateOrganization }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ organizationId, updateData }) => updateOrganization(organizationId, updateData),
    onSuccess: (data, { organizationId }) => {
      queryClient.setQueryData(ORGANIZATION_KEYS.detail(organizationId), data);
      queryClient.invalidateQueries(ORGANIZATION_KEYS.lists());
    },
    onError: (error: Error) => {
      console.error('Error updating organization:', error);
      throw error;
    },
  });
};

export const useDeleteOrganization = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteOrganization,
    onSuccess: (_, organizationId) => {
      queryClient.removeQueries(ORGANIZATION_KEYS.detail(organizationId));
      queryClient.invalidateQueries(ORGANIZATION_KEYS.lists());
    },
    onError: (error: Error) => {
      console.error('Error deleting organization:', error);
      throw error;
    },
  });
};

export const useEditPrivacyPolicy = (): UseMutationResult<Organization, Error, { organizationId: number; privacyPolicy: string }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ organizationId, privacyPolicy }) => editPrivacyPolicy(organizationId, privacyPolicy),
    onSuccess: (data, { organizationId }) => {
      queryClient.setQueryData(ORGANIZATION_KEYS.detail(organizationId), data);
      queryClient.invalidateQueries(ORGANIZATION_KEYS.lists());
    },
    onError: (error: Error) => {
      console.error('Error editing privacy policy:', error);
      throw error;
    },
  });
};

export const useEditTermsOfUse = (): UseMutationResult<Organization, Error, { organizationId: number; termsOfUse: string }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ organizationId, termsOfUse }) => editTermsOfUse(organizationId, termsOfUse),
    onSuccess: (data, { organizationId }) => {
      queryClient.setQueryData(ORGANIZATION_KEYS.detail(organizationId), data);
      queryClient.invalidateQueries(ORGANIZATION_KEYS.lists());
    },
    onError: (error: Error) => {
      console.error('Error editing terms of use:', error);
      throw error;
    },
  });
};

// Staff Query Hooks
export const useStaffs = (organizationId: number, params?: Record<string, any>): UseQueryResult<PaginatedStaff, Error> => {
  return useQuery({
    queryKey: [...ORGANIZATION_KEYS.staff(organizationId), params],
    queryFn: () => fetchStaff(organizationId, params),
    enabled: !!organizationId,
    onError: (error: Error) => {
      console.error('Error fetching staff:', error);
      throw error;
    },
  });
};

export const useStaffById = (staffId: number): UseQueryResult<Staff, Error> => {
  return useQuery({
    queryKey: ORGANIZATION_KEYS.staffDetail(staffId),
    queryFn: () => fetchStaffById(staffId),
    enabled: !!staffId,
    onError: (error: Error) => {
      console.error('Error fetching staff by ID:', error);
      throw error;
    },
  });
};

// Staff Management Mutations
export const useCreateStaff = (): UseMutationResult<Staff, Error, { organizationId: number; staffData: CreateStaff }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ organizationId, staffData }) => createStaff(organizationId, staffData),
    onSuccess: (data, { organizationId }) => {
      queryClient.invalidateQueries(ORGANIZATION_KEYS.staff(organizationId));
    },
    onError: (error: Error) => {
      console.error('Error creating staff:', error);
      throw error;
    },
  });
};

export const useUpdateStaff = (): UseMutationResult<Staff, Error, { staffId: number; updateData: UpdateStaff }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ staffId, updateData }) => updateStaff(staffId, updateData),
    onSuccess: (data, { staffId }) => {
      queryClient.setQueryData(ORGANIZATION_KEYS.staffDetail(staffId), data);
      queryClient.invalidateQueries(ORGANIZATION_KEYS.staff(data.organization || 0));
    },
    onError: (error: Error) => {
      console.error('Error updating staff:', error);
      throw error;
    },
  });
};

export const useDeleteStaff = (): UseMutationResult<void, Error, { staffId: number; organizationId: number }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ staffId }) => deleteStaff(staffId),
    onSuccess: (_, { staffId, organizationId }) => {
      queryClient.removeQueries(ORGANIZATION_KEYS.staffDetail(staffId));
      queryClient.invalidateQueries(ORGANIZATION_KEYS.staff(organizationId));
    },
    onError: (error: Error) => {
      console.error('Error deleting staff:', error);
      throw error;
    },
  });
};

// Departments Query Hooks
export const useDepartments = (organizationId: number, params?: Record<string, any>): UseQueryResult<PaginatedDepartment, Error> => {
  return useQuery({
    queryKey: [...ORGANIZATION_KEYS.departments(organizationId), params],
    queryFn: () => fetchDepartments(organizationId, params),
    enabled: !!organizationId,
    onError: (error: Error) => {
      console.error('Error fetching departments:', error);
      throw error;
    },
  });
};

// Department Management Mutations
export const useCreateDepartment = (): UseMutationResult<Department, Error, { organizationId: number; departmentData: CreateDepartment }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ organizationId, departmentData }) => createDepartment(organizationId, departmentData),
    onSuccess: (data, { organizationId }) => {
      queryClient.invalidateQueries(ORGANIZATION_KEYS.departments(organizationId));
    },
    onError: (error: Error) => {
      console.error('Error creating department:', error);
      throw error;
    },
  });
};

export const useUpdateDepartment = (): UseMutationResult<Department, Error, { departmentId: number; updateData: UpdateDepartment; organizationId: number }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ departmentId, updateData }) => updateDepartment(departmentId, updateData),
    onSuccess: (data, { organizationId }) => {
      queryClient.invalidateQueries(ORGANIZATION_KEYS.departments(organizationId));
    },
    onError: (error: Error) => {
      console.error('Error updating department:', error);
      throw error;
    },
  });
};

export const useDeleteDepartment = (): UseMutationResult<void, Error, { departmentId: number; organizationId: number }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ departmentId }) => deleteDepartment(departmentId),
    onSuccess: (_, { organizationId }) => {
      queryClient.invalidateQueries(ORGANIZATION_KEYS.departments(organizationId));
    },
    onError: (error: Error) => {
      console.error('Error deleting department:', error);
      throw error;
    },
  });
};

// Testimonials Query Hooks
export const useTestimonials = (organizationId: number, params?: Record<string, any>): UseQueryResult<PaginatedTestimonial, Error> => {
  return useQuery({
    queryKey: [...ORGANIZATION_KEYS.testimonials(organizationId), params],
    queryFn: () => fetchTestimonials(organizationId, params),
    enabled: !!organizationId,
    onError: (error: Error) => {
      console.error('Error fetching testimonials:', error);
      throw error;
    },
  });
};

export const useTestimonialById = (testimonialId: number): UseQueryResult<Testimonial, Error> => {
  return useQuery({
    queryKey: [...ORGANIZATION_KEYS.all, 'testimonial', 'detail', testimonialId],
    queryFn: () => fetchTestimonialById(testimonialId),
    enabled: !!testimonialId,
    onError: (error: Error) => {
      console.error('Error fetching testimonial by ID:', error);
      throw error;
    },
  });
};

// Testimonial Management Mutations
export const useCreateTestimonial = (): UseMutationResult<Testimonial, Error, { organizationId: number; testimonialData: CreateTestimonial }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ organizationId, testimonialData }) => createTestimonial(organizationId, testimonialData),
    onSuccess: (data, { organizationId }) => {
      queryClient.invalidateQueries(ORGANIZATION_KEYS.testimonials(organizationId));
    },
    onError: (error: Error) => {
      console.error('Error creating testimonial:', error);
      throw error;
    },
  });
};

export const useUpdateTestimonial = (): UseMutationResult<Testimonial, Error, { testimonialId: number; updateData: UpdateTestimonial; organizationId: number }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ testimonialId, updateData }) => updateTestimonial(testimonialId, updateData),
    onSuccess: (data, { testimonialId, organizationId }) => {
      queryClient.setQueryData([...ORGANIZATION_KEYS.all, 'testimonial', 'detail', testimonialId], data);
      queryClient.invalidateQueries(ORGANIZATION_KEYS.testimonials(organizationId));
    },
    onError: (error: Error) => {
      console.error('Error updating testimonial:', error);
      throw error;
    },
  });
};

export const useDeleteTestimonial = (): UseMutationResult<void, Error, { testimonialId: number; organizationId: number }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ testimonialId }) => deleteTestimonial(testimonialId),
    onSuccess: (_, { testimonialId, organizationId }) => {
      queryClient.removeQueries([...ORGANIZATION_KEYS.all, 'testimonial', 'detail', testimonialId]);
      queryClient.invalidateQueries(ORGANIZATION_KEYS.testimonials(organizationId));
    },
    onError: (error: Error) => {
      console.error('Error deleting testimonial:', error);
      throw error;
    },
  });
};

// Subscriptions Query Hooks
export const useSubscriptions = (organizationId: number, params?: Record<string, any>): UseQueryResult<PaginatedSubscription, Error> => {
  return useQuery({
    queryKey: [...ORGANIZATION_KEYS.subscriptions(organizationId), params],
    queryFn: () => fetchSubscriptions(organizationId, params),
    enabled: !!organizationId,
    onError: (error: Error) => {
      console.error('Error fetching subscriptions:', error);
      throw error;
    },
  });
};

export const useSubscriptionById = (subscriptionId: number): UseQueryResult<Subscription, Error> => {
  return useQuery({
    queryKey: [...ORGANIZATION_KEYS.all, 'subscription', 'detail', subscriptionId],
    queryFn: () => fetchSubscriptionById(subscriptionId),
    enabled: !!subscriptionId,
    onError: (error: Error) => {
      console.error('Error fetching subscription by ID:', error);
      throw error;
    },
  });
};

// Subscription Management Mutations
export const useCreateSubscription = (): UseMutationResult<Subscription, Error, { organizationId: number; subscriptionData: CreateSubscription }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ organizationId, subscriptionData }) => createSubscription(organizationId, subscriptionData),
    onSuccess: (data, { organizationId }) => {
      queryClient.invalidateQueries(ORGANIZATION_KEYS.subscriptions(organizationId));
    },
    onError: (error: Error) => {
      console.error('Error creating subscription:', error);
      throw error;
    },
  });
};

export const useUpdateSubscription = (): UseMutationResult<Subscription, Error, { subscriptionId: number; updateData: UpdateSubscription; organizationId: number }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ subscriptionId, updateData }) => updateSubscription(subscriptionId, updateData),
    onSuccess: (data, { subscriptionId, organizationId }) => {
      queryClient.setQueryData([...ORGANIZATION_KEYS.all, 'subscription', 'detail', subscriptionId], data);
      queryClient.invalidateQueries(ORGANIZATION_KEYS.subscriptions(organizationId));
    },
    onError: (error: Error) => {
      console.error('Error updating subscription:', error);
      throw error;
    },
  });
};

export const useDeleteSubscription = (): UseMutationResult<void, Error, { subscriptionId: number; organizationId: number }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ subscriptionId }) => deleteSubscription(subscriptionId),
    onSuccess: (_, { subscriptionId, organizationId }) => {
      queryClient.removeQueries([...ORGANIZATION_KEYS.all, 'subscription', 'detail', subscriptionId]);
      queryClient.invalidateQueries(ORGANIZATION_KEYS.subscriptions(organizationId));
    },
    onError: (error: Error) => {
      console.error('Error deleting subscription:', error);
      throw error;
    },
  });
};
