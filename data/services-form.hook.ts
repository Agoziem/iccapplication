import { ORGANIZATION_ID } from "@/constants";
import { AxiosinstanceAuth, AxiosinstanceFormDataAuth } from "./instance";
const Organizationid = ORGANIZATION_ID;
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from "react-query";
import {
  FormField,
  ServiceForm,
  FormSubmission,
  PaginatedServiceFormResponse,
  PaginatedFormFieldResponse,
  PaginatedFormSubmissionResponse,
} from "@/types/services";

import {
    CreateServiceFormType,
    UpdateServiceFormType,
    CreateFormFieldType,
    UpdateFormFieldType,
    CreateFormSubmissionType,
    UpdateFormSubmissionType,
} from "@/schemas/services";

// /api/service-forms/{service_id}/form [get]
// /api/service-forms/{service_id}/form [put]
// /api/service-forms/{service_id}/form [post]
// /api/service-forms/{service_id}/form [delete]

// /api/form-fields/{form_id}/fields [get]
// /api/form-fields/{form_id}/fields [post]
// /api/form-fields/field/{field_id} [put]
// /api/form-fields/field/{field_id} [get]
// /api/form-fields/field/{field_id} [delete]
// /api/form-fields/{form_id}/fields/reorder [post]

// /api/form-submissions/{form_id}/submissions [get]
// /api/form-submissions/{form_id}/submit [post]
// /api/form-submissions/user/{service_id}/submission [get]
// /api/form-submissions/submission/{submission_id} [get]
// /api/form-submissions/submission/{submission_id} [put]
// /api/form-submissions/submission/{submission_id} [delete]

// Query Keys
export const SERVICE_FORM_QUERY_KEYS = {
  serviceForm: (serviceId: number) => ['serviceForm', serviceId],
  formFields: (formId: number) => ['formFields', formId],
  formField: (fieldId: number) => ['formField', fieldId],
  formSubmissions: (formId: number) => ['formSubmissions', formId],
  userSubmission: (serviceId: number) => ['userSubmission', serviceId],
  formSubmission: (submissionId: number) => ['formSubmission', submissionId],
};

// ------------------------ Service Form Hooks ------------------------
export const useGetServiceForm = (service_id: number) => {
  return useQuery<ServiceForm>(
    SERVICE_FORM_QUERY_KEYS.serviceForm(service_id),
    async () => {
      console.log("Fetching service form...", service_id);
      const response = await AxiosinstanceAuth.get(`/service-forms/${service_id}/form`);
      return response.data;
    },
    {
      enabled: !!service_id,
    }
  );
};

export const useCreateServiceForm = () => {
  const queryClient = useQueryClient();
  return useMutation<ServiceForm, Error, { service_id: number; formData: CreateServiceFormType }>(
    async ({ service_id, formData }) => {
      console.log("Creating service form...", service_id, formData);
      const response = await AxiosinstanceAuth.post(`/service-forms/${service_id}/form`, formData);
      return response.data;
    },
    {
      onSuccess: (_, { service_id }) => {
        queryClient.invalidateQueries(SERVICE_FORM_QUERY_KEYS.serviceForm(service_id));
      },
    }
  );
};

export const useUpdateServiceForm = () => {
  const queryClient = useQueryClient();
  return useMutation<ServiceForm, Error, { service_id: number; formData: UpdateServiceFormType }>(
    async ({ service_id, formData }) => {
      console.log("Updating service form...", service_id, formData);
      const response = await AxiosinstanceAuth.put(`/service-forms/${service_id}/form`, formData);
      return response.data;
    },
    {
      onSuccess: (_, { service_id }) => {
        queryClient.invalidateQueries(SERVICE_FORM_QUERY_KEYS.serviceForm(service_id));
      },
    }
  );
};

export const useDeleteServiceForm = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>(
    async (service_id: number) => {
      console.log("Deleting service form...", service_id);
      await AxiosinstanceAuth.delete(`/service-forms/${service_id}/form`);
    },
    {
      onSuccess: (_, service_id) => {
        queryClient.removeQueries(SERVICE_FORM_QUERY_KEYS.serviceForm(service_id));
      },
    }
  );
};

// ------------------------ Form Field Hooks ------------------------
export const useGetFormFields = (form_id: number, page?: number, limit?: number) => {
  return useQuery<PaginatedFormFieldResponse>(
    [...SERVICE_FORM_QUERY_KEYS.formFields(form_id), page, limit],
    async () => {
      console.log("Fetching form fields...", form_id, { page, limit });
      const response = await AxiosinstanceAuth.get(`/form-fields/${form_id}/fields`, {
        params: { page, limit }
      });
      return response.data;
    },
    {
      enabled: !!form_id,
    }
  );
};

export const useCreateFormField = () => {
  const queryClient = useQueryClient();
  return useMutation<FormField, Error, { form_id: number; fieldData: CreateFormFieldType }>(
    async ({ form_id, fieldData }) => {
      console.log("Creating form field...", form_id, fieldData);
      const response = await AxiosinstanceAuth.post(`/form-fields/${form_id}/fields`, fieldData);
      return response.data;
    },
    {
      onSuccess: (_, { form_id }) => {
        queryClient.invalidateQueries(SERVICE_FORM_QUERY_KEYS.formFields(form_id));
      },
    }
  );
};

export const useGetFormFieldById = (field_id: number) => {
  return useQuery<FormField>(
    SERVICE_FORM_QUERY_KEYS.formField(field_id),
    async () => {
      console.log("Fetching form field by ID...", field_id);
      const response = await AxiosinstanceAuth.get(`/form-fields/field/${field_id}`);
      return response.data;
    },
    {
      enabled: !!field_id,
    }
  );
};

export const useUpdateFormField = () => {
  const queryClient = useQueryClient();
  return useMutation<FormField, Error, { field_id: number; fieldData: UpdateFormFieldType; form_id?: number }>(
    async ({ field_id, fieldData }) => {
      console.log("Updating form field...", field_id, fieldData);
      const response = await AxiosinstanceAuth.put(`/form-fields/field/${field_id}`, fieldData);
      return response.data;
    },
    {
      onSuccess: (result, { field_id, form_id }) => {
        queryClient.invalidateQueries(SERVICE_FORM_QUERY_KEYS.formField(field_id));
        if (form_id) {
          queryClient.invalidateQueries(SERVICE_FORM_QUERY_KEYS.formFields(form_id));
        }
      },
    }
  );
};

export const useDeleteFormField = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { field_id: number; form_id?: number }>(
    async ({ field_id }) => {
      console.log("Deleting form field...", field_id);
      await AxiosinstanceAuth.delete(`/form-fields/field/${field_id}`);
    },
    {
      onSuccess: (_, { field_id, form_id }) => {
        queryClient.removeQueries(SERVICE_FORM_QUERY_KEYS.formField(field_id));
        if (form_id) {
          queryClient.invalidateQueries(SERVICE_FORM_QUERY_KEYS.formFields(form_id));
        }
      },
    }
  );
};

export const useReorderFormFields = () => {
  const queryClient = useQueryClient();
  return useMutation<FormField[], Error, { form_id: number; fieldOrder: { field_id: number; order: number }[] }>(
    async ({ form_id, fieldOrder }) => {
      console.log("Reordering form fields...", form_id, fieldOrder);
      const response = await AxiosinstanceAuth.post(`/form-fields/${form_id}/fields/reorder`, {
        field_order: fieldOrder
      });
      return response.data;
    },
    {
      onSuccess: (_, { form_id }) => {
        queryClient.invalidateQueries(SERVICE_FORM_QUERY_KEYS.formFields(form_id));
      },
    }
  );
};

// ------------------------ Form Submission Hooks ------------------------
export const useGetFormSubmissions = (form_id: number, page?: number, limit?: number) => {
  return useQuery<PaginatedFormSubmissionResponse>(
    [...SERVICE_FORM_QUERY_KEYS.formSubmissions(form_id), page, limit],
    async () => {
      console.log("Fetching form submissions...", form_id, { page, limit });
      const response = await AxiosinstanceAuth.get(`/form-submissions/${form_id}/submissions`, {
        params: { page, limit }
      });
      return response.data;
    },
    {
      enabled: !!form_id,
    }
  );
};

export const useSubmitForm = () => {
  const queryClient = useQueryClient();
  return useMutation<FormSubmission, Error, { form_id: number; submissionData: CreateFormSubmissionType }>(
    async ({ form_id, submissionData }) => {
      console.log("Submitting form...", form_id, submissionData);
      const response = await AxiosinstanceAuth.post(`/form-submissions/${form_id}/submit`, submissionData);
      return response.data;
    },
    {
      onSuccess: (_, { form_id }) => {
        queryClient.invalidateQueries(SERVICE_FORM_QUERY_KEYS.formSubmissions(form_id));
      },
    }
  );
};

export const useGetUserSubmission = (service_id: number) => {
  return useQuery<FormSubmission>(
    SERVICE_FORM_QUERY_KEYS.userSubmission(service_id),
    async () => {
      console.log("Fetching user submission...", service_id);
      const response = await AxiosinstanceAuth.get(`/form-submissions/user/${service_id}/submission`);
      return response.data;
    },
    {
      enabled: !!service_id,
    }
  );
};

export const useGetFormSubmissionById = (submission_id: number) => {
  return useQuery<FormSubmission>(
    SERVICE_FORM_QUERY_KEYS.formSubmission(submission_id),
    async () => {
      console.log("Fetching form submission by ID...", submission_id);
      const response = await AxiosinstanceAuth.get(`/form-submissions/submission/${submission_id}`);
      return response.data;
    },
    {
      enabled: !!submission_id,
    }
  );
};

export const useUpdateFormSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation<FormSubmission, Error, { submission_id: number; submissionData: UpdateFormSubmissionType; form_id?: number }>(
    async ({ submission_id, submissionData }) => {
      console.log("Updating form submission...", submission_id, submissionData);
      const response = await AxiosinstanceAuth.put(`/form-submissions/submission/${submission_id}`, submissionData);
      return response.data;
    },
    {
      onSuccess: (result, { submission_id, form_id }) => {
        queryClient.invalidateQueries(SERVICE_FORM_QUERY_KEYS.formSubmission(submission_id));
        if (form_id) {
          queryClient.invalidateQueries(SERVICE_FORM_QUERY_KEYS.formSubmissions(form_id));
        }
      },
    }
  );
};

export const useDeleteFormSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { submission_id: number; form_id?: number }>(
    async ({ submission_id }) => {
      console.log("Deleting form submission...", submission_id);
      await AxiosinstanceAuth.delete(`/form-submissions/submission/${submission_id}`);
    },
    {
      onSuccess: (_, { submission_id, form_id }) => {
        queryClient.removeQueries(SERVICE_FORM_QUERY_KEYS.formSubmission(submission_id));
        if (form_id) {
          queryClient.invalidateQueries(SERVICE_FORM_QUERY_KEYS.formSubmissions(form_id));
        }
      },
    }
  );
};
