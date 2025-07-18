"use client";

import React, { createContext, useContext } from "react";
import {
  useQuery,
  useMutation,
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "react-query";
import {
  fetchEmails,
  deleteEmail,
  getResponses,
  submitResponse,
  getSentEmail,
  createEmail,
  sendMessage,
} from "@/data/Emails/fetcher"; // Adjust the path based on your structure

// Initialize the Query Client
const queryClient = new QueryClient();

// Create a Context for shared states (optional for hooks)
const EmailContext = createContext(null);

// Custom Hook: Fetch Emails
export const useFetchEmails = () => {
  return useQuery("emails", fetchEmails, {
    onSuccess: (data) => {
      data.results = data.results.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    },
  });
};

// Custom Hook: Fetch Sent Emails
export const useFetchSentEmails = () => {
  return useQuery("sentEmails", getSentEmail,{
    onSuccess: (data) => {
      data = data.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    },
  });
};

// Custom Hook: Create Email
export const useCreateEmail = () => {
  const queryClient = useQueryClient();
  return useMutation(createEmail, {
    onSuccess: () => queryClient.invalidateQueries("emails"), // Refresh the email list
  });
};

// Custom Hook: Delete Email
export const useDeleteEmail = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteEmail, {
    onSuccess: () => queryClient.invalidateQueries("emails"), // Refresh the email list
  });
};

// Custom Hook: Fetch Responses for a specific email
export const useFetchResponses = (emailId) => {
  return useQuery(["responses", emailId], () => getResponses({ id: emailId }), {
    enabled: !!emailId, // Only fetch if emailId exists
  });
};

// Custom Hook: Submit Response for an email
export const useSubmitResponse = () => {
  const queryClient = useQueryClient();
  return useMutation(submitResponse, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["responses", variables.message]); // Refresh the responses for the email
    },
  });
};

// Custom Hook: send a message
export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation(sendMessage, {
    onSuccess: () => queryClient.invalidateQueries("emails"), // Refresh the email list
  });
};

// Provider Component for optional shared state
export const EmailProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <EmailContext.Provider value={null}>{children}</EmailContext.Provider>
    </QueryClientProvider>
  );
};

// Optional: Context-based hook to enforce usage within the provider
export const useEmail = () => {
  const context = useContext(EmailContext);
  if (!context) {
    throw new Error("useEmail must be used within an EmailProvider");
  }
  return context;
};
