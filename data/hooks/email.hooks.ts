import { AxiosInstanceWithToken } from "../instance";
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from "react-query";
import {
  Email,
  CreateEmail,
  UpdateEmail,
  PaginatedEmailResponse,
  EmailResponse,
  CreateEmailResponse,
  EmailMessage,
  CreateEmailMessage,
  PaginatedEmailResponses,
  PaginatedEmailMessageResponse,
  Emails,
  EmailPreview,
} from "@/types/emails";
import { sendMultipleEmails } from "@/utils/mail";

export const emailAPIendpoint = "/emailsapi";

// Query Keys
export const EMAIL_KEYS = {
  all: ["emails"] as const,
  emails: (organizationId: number) =>
    [...EMAIL_KEYS.all, "emails", organizationId] as const,
  email: (id: number) => [...EMAIL_KEYS.all, "email", id] as const,
  responses: (messageId: number) =>
    [...EMAIL_KEYS.all, "responses", messageId] as const,
  sent: () => [...EMAIL_KEYS.all, "sent"] as const,
  subscriptions: (organizationId: number) =>
    [...EMAIL_KEYS.all, "subscriptions", organizationId] as const,
};

export const fetchEmails = async (
  organizationId: number,
  params?: Record<string, any>
): Promise<PaginatedEmailResponse> => {
  const response = await AxiosInstanceWithToken.get(
    `${emailAPIendpoint}/emails/${organizationId}/`,
    { params }
  );
  return response.data;
};

export const fetchEmail = async (emailId: number): Promise<Email> => {
  const response = await AxiosInstanceWithToken.get(
    `${emailAPIendpoint}/email/${emailId}/`
  );
  return response.data;
};

export const createEmail = async (
  organizationId: number,
  messageData: CreateEmail
): Promise<Email> => {
  const response = await AxiosInstanceWithToken.post(
    `${emailAPIendpoint}/add_email/${organizationId}/`,
    messageData
  );
  return response.data;
};

export const updateEmail = async (
  emailId: number,
  updateData: UpdateEmail
): Promise<Email> => {
  const response = await AxiosInstanceWithToken.put(
    `${emailAPIendpoint}/update_email/${emailId}/`,
    updateData
  );
  return response.data;
};

export const deleteEmail = async (emailId: number): Promise<void> => {
  await AxiosInstanceWithToken.delete(`${emailAPIendpoint}/delete_email/${emailId}/`);
};

export const fetchEmailResponses = async (
  messageId: number,
  params?: Record<string, any>
): Promise<PaginatedEmailResponses> => {
  const response = await AxiosInstanceWithToken.get(
    `${emailAPIendpoint}/emails/${messageId}/responses/`,
    { params }
  );
  return response.data;
};

export const createResponse = async (
  responseData: CreateEmailResponse
): Promise<EmailResponse> => {
  const response = await AxiosInstanceWithToken.post(
    `${emailAPIendpoint}/emails/createresponse/`,
    responseData
  );
  return response.data;
};

export const getSentEmails = async (params?: Record<string, any>): Promise<Emails> => {
  const response = await AxiosInstanceWithToken.get(
    `${emailAPIendpoint}/emails/getsentemails/`,
    { params }
  );
  return response.data;
};

export const createEmailMessage = async (
  emailData: CreateEmailMessage
): Promise<EmailMessage> => {
  const response = await AxiosInstanceWithToken.post(
    `${emailAPIendpoint}/emails/createsendemails/`,
    emailData
  );
  return response.data;
};

export const sendBulkEmails = async (
  emailData: CreateEmailMessage,
  emails: { email: string }[]
): Promise<void> => {
  // use promise.all to send emails to multiple recipients
  try {
    await Promise.all(
      emails.map(({ email }) =>
        sendMultipleEmails(email, emailData.body, emailData.subject)
      )
    );
  } catch (error) {
    console.error("Error sending bulk emails:", error);
    throw error;
  }
};

// React Query Hooks

// Email Hooks
export const useEmails = (
  organizationId: number,
  params?: Record<string, any>
): UseQueryResult<PaginatedEmailResponse, Error> => {
  return useQuery({
    queryKey: [...EMAIL_KEYS.emails(organizationId), params],
    queryFn: () => fetchEmails(organizationId, params),
    enabled: !!organizationId,
    onError: (error: Error) => {
      console.error("Error fetching emails:", error);
      throw error;
    },
  });
};

export const useEmail = (emailId: number): UseQueryResult<Email, Error> => {
  return useQuery({
    queryKey: EMAIL_KEYS.email(emailId),
    queryFn: () => fetchEmail(emailId),
    enabled: !!emailId,
    onError: (error: Error) => {
      console.error("Error fetching email:", error);
      throw error;
    },
  });
};

export const useCreateEmail = (): UseMutationResult<
  Email,
  Error,
  { organizationId: number; messageData: CreateEmail }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ organizationId, messageData }) =>
      createEmail(organizationId, messageData),
    onSuccess: (_, { organizationId }) => {
      queryClient.invalidateQueries(EMAIL_KEYS.emails(organizationId));
    },
    onError: (error: Error) => {
      console.error("Error creating email:", error);
      throw error;
    },
  });
};

export const useUpdateEmail = (): UseMutationResult<
  Email,
  Error,
  { emailId: number; updateData: UpdateEmail }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ emailId, updateData }) => updateEmail(emailId, updateData),
    onSuccess: (data) => {
      if (data.id) {
        queryClient.invalidateQueries(EMAIL_KEYS.email(data.id));
      }
      queryClient.invalidateQueries(EMAIL_KEYS.all);
    },
    onError: (error: Error) => {
      console.error("Error updating email:", error);
      throw error;
    },
  });
};

export const useDeleteEmail = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEmail,
    onSuccess: () => {
      queryClient.invalidateQueries(EMAIL_KEYS.all);
    },
    onError: (error: Error) => {
      console.error("Error deleting email:", error);
      throw error;
    },
  });
};

// Email Responses Hooks
export const useEmailResponses = (
  messageId: number,
  params?: Record<string, any>
): UseQueryResult<PaginatedEmailResponses, Error> => {
  return useQuery({
    queryKey: [...EMAIL_KEYS.responses(messageId), params],
    queryFn: () => fetchEmailResponses(messageId, params),
    enabled: !!messageId,
    onError: (error: Error) => {
      console.error("Error fetching email responses:", error);
      throw error;
    },
  });
};

export const useCreateResponse = (): UseMutationResult<
  EmailResponse,
  Error,
  CreateEmailResponse
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createResponse,
    onSuccess: () => {
      queryClient.invalidateQueries(EMAIL_KEYS.all);
    },
    onError: (error: Error) => {
      console.error("Error creating response:", error);
      throw error;
    },
  });
};

// Sent Emails Hooks
export const useSentEmails = (
  params?: Record<string, any>
): UseQueryResult<Emails, Error> => {
  return useQuery({
    queryKey: [...EMAIL_KEYS.sent(), params],
    queryFn: () => getSentEmails(params),
    onError: (error: Error) => {
      console.error("Error fetching sent emails:", error);
      throw error;
    },
  });
};

export const useCreateEmailMessage = (): UseMutationResult<
  EmailMessage,
  Error,
  CreateEmailMessage
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEmailMessage,
    onSuccess: () => {
      queryClient.invalidateQueries(EMAIL_KEYS.sent());
      queryClient.invalidateQueries(EMAIL_KEYS.all);
    },
    onError: (error: Error) => {
      console.error("Error creating/sending emails:", error);
      throw error;
    },
  });
};


// Bulk Email Operations
export const useBulkDeleteEmails = (): UseMutationResult<
  void,
  Error,
  number[]
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (emailIds: number[]) => {
      await Promise.all(emailIds.map((id) => deleteEmail(id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries(EMAIL_KEYS.all);
    },
    onError: (error: Error) => {
      console.error("Error deleting emails in bulk:", error);
      throw error;
    },
  });
};

// Email Search and Filtering
export const useFilterEmails = (
  organizationId: number,
  filters?: { read?: boolean; subject?: string }
) => {
  return useQuery({
    queryKey: [...EMAIL_KEYS.emails(organizationId), "filtered", filters],
    queryFn: async () => {
      const emails = await fetchEmails(organizationId);
      if (!filters) return emails;

      // Apply client-side filtering
      let filteredEmails = emails.results || [];

      if (filters.read !== undefined) {
        filteredEmails = filteredEmails.filter(
          (email) => email.read === filters.read
        );
      }

      if (filters.subject) {
        filteredEmails = filteredEmails.filter((email) =>
          email.subject.toLowerCase().includes(filters.subject!.toLowerCase())
        );
      }

      return {
        ...emails,
        results: filteredEmails,
        count: filteredEmails.length,
      };
    },
    enabled: !!organizationId,
    onError: (error: Error) => {
      console.error("Error filtering emails:", error);
      throw error;
    },
  });
};

// Email Previews Hook - for listing emails with minimal data
export const useEmailPreviews = (
  organizationId: number,
  params?: Record<string, any>
): UseQueryResult<EmailPreview[], Error> => {
  return useQuery({
    queryKey: [...EMAIL_KEYS.emails(organizationId), "previews", params],
    queryFn: async () => {
      const emails = await fetchEmails(organizationId, params);
      // Transform to preview format with only essential fields
      return (
        emails.results?.map((email) => ({
          id: email.id,
          name: email.name,
          email: email.email,
          subject: email.subject,
          created_at: email.created_at,
          read: email.read,
        })) || []
      );
    },
    enabled: !!organizationId,
    onError: (error: Error) => {
      console.error("Error fetching email previews:", error);
      throw error;
    },
  });
};

// Email Statistics Hook
export const useEmailStats = (organizationId: number) => {
  return useQuery({
    queryKey: [...EMAIL_KEYS.emails(organizationId), "stats"],
    queryFn: async () => {
      const emails = await fetchEmails(organizationId);
      const results = emails.results || [];

      return {
        total: results.length,
        unread: results.filter((email) => !email.read).length,
        read: results.filter((email) => email.read).length,
        today: results.filter((email) => {
          const today = new Date().toDateString();
          return new Date(email.created_at || "").toDateString() === today;
        }).length,
      };
    },
    enabled: !!organizationId,
    onError: (error: Error) => {
      console.error("Error fetching email statistics:", error);
      throw error;
    },
  });
};
