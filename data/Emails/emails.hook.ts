"use client";

import { createContext, useContext, ReactNode } from "react";
import {
  useQuery,
  useMutation,
  QueryClient,
  QueryClientProvider,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from "react-query";
import { z } from "zod";
import { emailsResponseSchema } from "@/schemas/emails";
import type {
  Email,
  EmailArrays,
  EmailResponse,
  EmailResponseArray,
  EmailMessage,
  EmailMessageArray,
  Message,
} from "@/types/emails";
import {
  fetchEmails,
  deleteEmail,
  getResponses,
  submitResponse,
  getSentEmail,
  createEmail,
  sendMessage,
} from "@/data/Emails/fetcher";

// Initialize the Query Client
const queryClient = new QueryClient();

type EmailsResponse = z.infer<typeof emailsResponseSchema>;

// Create a Context for shared states (optional for hooks)
const EmailContext = createContext<null>(null);

// Custom Hook: Fetch Emails
export const useFetchEmails = (): UseQueryResult<EmailsResponse | undefined, Error> => {
  return useQuery("emails", fetchEmails, {
    onSuccess: (data) => {
      if (data?.results) {
        data.results = data.results.sort(
          (a, b) =>
            new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        );
      }
    },
  });
};

// Custom Hook: Fetch Sent Emails
export const useFetchSentEmails = (): UseQueryResult<EmailMessageArray | undefined, Error> => {
  return useQuery("sentEmails", getSentEmail, {
    onSuccess: (data) => {
      if (data) {
        data.sort(
          (a, b) =>
            new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        );
      }
    },
  });
};

// Custom Hook: Create Email
export const useCreateEmail = (): UseMutationResult<EmailMessage | undefined, Error, Omit<EmailMessage, "id" | "created_at">> => {
  const queryClient = useQueryClient();
  return useMutation(createEmail, {
    onSuccess: () => queryClient.invalidateQueries("emails"), // Refresh the email list
  });
};

// Custom Hook: Delete Email
export const useDeleteEmail = (): UseMutationResult<number, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation(deleteEmail, {
    onSuccess: () => queryClient.invalidateQueries("emails"), // Refresh the email list
  });
};

// Custom Hook: Fetch Responses for a specific email
export const useFetchResponses = (emailId: number): UseQueryResult<EmailResponseArray | undefined, Error> => {
  return useQuery(["responses", emailId], () => getResponses({ id: emailId } as Email), {
    enabled: !!emailId, // Only fetch if emailId exists
  });
};

// Custom Hook: Submit Response for an email
export const useSubmitResponse = (): UseMutationResult<EmailResponse | undefined, Error, Omit<EmailResponse, "id" | "created_at">> => {
  const queryClient = useQueryClient();
  return useMutation(submitResponse, {
    onSuccess: (_, variables) => {
      if ('message' in variables) {
        queryClient.invalidateQueries(["responses", variables.message]); // Refresh the responses for the email
      }
    },
  });
};

// Custom Hook: send a message
export const useSendMessage = (): UseMutationResult<any, Error, Message> => {
  const queryClient = useQueryClient();
  return useMutation(sendMessage, {
    onSuccess: () => queryClient.invalidateQueries("emails"), // Refresh the email list
  });
};
