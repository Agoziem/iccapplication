// import { sendMultipleEmails } from "@/utils/mail";
import { ORGANIZATION_ID } from "@/constants";
import { AxiosinstanceAuth } from "./instance";
import { EmailSchema, PaginatedEmailMessageResponseSchema, PaginatedEmailResponseSchema, PaginatedEmailSchema } from "@/types/emails";
import { CreateEmailMessageType, CreateEmailResponseType, CreateEmailType } from "@/schemas/emails";
import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from "react-query";
import { SubscriptionSchema } from "@/types/organizations";

const OrganizationID = ORGANIZATION_ID;

// ======================================================
// React Query Hooks
// ======================================================

/**
 * Hook to fetch all contact emails
 */
export const useGetContactEmails = (): UseQueryResult<PaginatedEmailSchema> => {
  return useQuery("contactEmails", async () => {
    const response = await AxiosinstanceAuth.get(
      `/emails/${OrganizationID}`
    );
    return response.data;
  });
};

/**
 * Hook to delete a contact email
 */
export const useDeleteContactEmail = (): UseMutationResult<number, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (emailid: number) => {
      await AxiosinstanceAuth.delete(`/emails/${emailid}`);
      return emailid;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("contactEmails");
      },
      onError: (error) => {
        console.error("Failed to delete contact email:", error);
      },
    }
  );
};

/**
 * Hook to send a contact email
 */
export const useSendContactEmail = (): UseMutationResult<EmailSchema, Error, CreateEmailType> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: CreateEmailType) => {
      const response = await AxiosinstanceAuth.post(`/email-messages/`, data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("contactEmails");
      },
      onError: (error) => {
        console.error("Failed to send contact email:", error);
      },
    }
  );
};

/**
 * Hook to get responses to a message
 */
export const useGetResponses = (message_id: number): UseQueryResult<PaginatedEmailResponseSchema> => {
  return useQuery(
    ["emailResponses", message_id],
    async () => {
      const response = await AxiosinstanceAuth.get(`/email-responses/${message_id}`);
      return response.data;
    },
    {
      enabled: !!message_id,
    }
  );
};

/**
 * Hook to submit a response
 */
export const useSubmitResponse = (): UseMutationResult<any, Error, CreateEmailResponseType> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: CreateEmailResponseType) => {
      const response = await AxiosinstanceAuth.post(`/email-responses/`, data);
      return response.data;
    },
    {
      onSuccess: (data, variables) => {
        // Invalidate responses for the specific message
        queryClient.invalidateQueries(["emailResponses", variables.message]);
      },
      onError: (error) => {
        console.error("Failed to submit response:", error);
      },
    }
  );
};

/**
 * Hook to get sent email messages
 */
export const useGetSentEmailMessages = (): UseQueryResult<PaginatedEmailMessageResponseSchema> => {
  return useQuery("sentEmailMessages", async () => {
    const response = await AxiosinstanceAuth.get(`/email-messages/`);
    return response.data;
  });
};


/**
 * Hook to create and send emails to customers
 */
export const useCreateEmailMessage = (): UseMutationResult<any, Error, CreateEmailMessageType> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: CreateEmailMessageType) => {
      // Get all subscriptions
      const subscriptionsResponse = await AxiosinstanceAuth.get(`/subscriptions/${OrganizationID}`);
      const allsubscriptions: SubscriptionSchema[] = subscriptionsResponse.data;

      if (!allsubscriptions?.length) return;

      // Send emails to all subscribers
      // await Promise.all(
      //   allsubscriptions.map((subscription) =>
      //     sendMultipleEmails(subscription.email, data.body, data.subject)
      //   )
      // );

      // Save to database
      const response = await AxiosinstanceAuth.post(`/email-messages/`, data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("sentEmailMessages");
      },
      onError: (error) => {
        console.error("Failed to create and send email message:", error);
      },
    }
  );
};


