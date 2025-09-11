/**
 * @fileoverview Email Management React Query Hooks
 * 
 * Comprehensive React Query hooks for email system operations including
 * contact message management, email responses, newsletter sending, and
 * subscription management with optimized caching strategies.
 * 
 * Features:
 * - Contact message CRUD operations with real-time updates
 * - Email response and reply system for customer support
 * - Newsletter and marketing email management
 * - Subscription list management with cache invalidation
 * - Optimistic updates for better user experience
 * - Comprehensive error handling and loading states
 * 
 * @version 2.0.0
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
  // Contact Messages
  fetchEmails,
  createContactMessage,
  updateContactMessage,
  deleteEmail,
  
  // Email Responses
  getResponses,
  submitResponse,
  
  // Email Messages/Newsletters
  getSentEmails,
  createEmail,
  updateEmailMessage,
  deleteEmailMessage,
  
  // Subscriptions
  getAllSubscriptions,
  createSubscription,
  deleteSubscription,
  
  // Legacy functions
  sendMessage,
  getSentEmail,
  getallemails,
} from "./fetcher";

// =================== CONTACT MESSAGES HOOKS =================== //

/**
 * Hook to fetch all contact messages
 * Retrieves paginated contact messages with automatic sorting by date.
 * 
 * @function useFetchEmails
 * @returns {Object} React Query query object for contact messages
 */
export const useFetchEmails = () => {
  return useQuery(
    ["emails"],
    fetchEmails,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: true,
      onSuccess: (data) => {
        // Sort by creation date descending
        if (data?.results) {
          data.results = data.results.sort(
            (a, b) =>
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        }
        console.log(`📧 [HOOK] Successfully fetched ${data?.results?.length || 0} emails`);
      },
      onError: (error) => {
        console.error('📧 [HOOK] Failed to fetch emails:', error);
      },
    }
  );
};

/**
 * Hook to create a new contact message
 * Creates contact messages with automatic cache invalidation.
 * 
 * @function useCreateContactMessage
 * @returns {Object} React Query mutation object for contact message creation
 */
export const useCreateContactMessage = () => {
  const queryClient = useQueryClient();
  return useMutation(createContactMessage, {
    onSuccess: (newMessage) => {
      // Invalidate and refetch emails list
      queryClient.invalidateQueries(["emails"]);
    },
    onError: (error) => {
      console.error('📧 [HOOK] Failed to create contact message:', error);
    },
  });
};

/**
 * Hook to update a contact message
 * Updates messages with optimistic updates and cache management.
 * 
 * @function useUpdateContactMessage
 * @returns {Object} React Query mutation object for message updates
 */
export const useUpdateContactMessage = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (/** @type {any} */ variables) => updateContactMessage(variables.id, variables.data),
    {
      onMutate: async (/** @type {any} */ variables) => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries(["emails"]);
        
        // Snapshot previous value
        const previousEmails = queryClient.getQueryData(["emails"]);
        
        // Optimistically update
        if (previousEmails) {
          queryClient.setQueryData(["emails"], (/** @type {any} */ old) => {
            if (old?.results) {
              return {
                ...old,
                results: old.results.map((/** @type {any} */ email) =>
                  email.id === variables.id
                    ? { ...email, ...variables.data }
                    : email
                ),
              };
            }
            return old;
          });
        }
        
        return { previousEmails };
      },
      onError: (error, variables, context) => {
        // Rollback on error
        if (context?.previousEmails) {
          queryClient.setQueryData(["emails"], context.previousEmails);
        }
        console.error('📧 [HOOK] Failed to update contact message:', error);
      },
      onSettled: () => {
        // Always refetch after error or success
        queryClient.invalidateQueries(["emails"]);
      },
    }
  );
};

/**
 * Hook to delete a contact message
 * Deletes messages with optimistic updates and cache cleanup.
 * 
 * @function useDeleteEmail
 * @returns {Object} React Query mutation object for email deletion
 */
export const useDeleteEmail = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteEmail, {
    onMutate: async (emailId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(["emails"]);
      
      // Snapshot previous value
      const previousEmails = queryClient.getQueryData(["emails"]);
      
      // Optimistically update
      if (previousEmails) {
        queryClient.setQueryData(["emails"], (/** @type {any} */ old) => {
          if (old?.results) {
            return {
              ...old,
              results: old.results.filter((/** @type {any} */ email) => email.id !== emailId),
            };
          }
          return old;
        });
      }
      
      return { previousEmails };
    },
    onError: (error, emailId, context) => {
      // Rollback on error
      if (context?.previousEmails) {
        queryClient.setQueryData(["emails"], context.previousEmails);
      }
    },
    onSuccess: (deletedId) => {
      // Remove related responses from cache
      queryClient.removeQueries(["responses", deletedId]);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries(["emails"]);
    },
  });
};

// =================== EMAIL RESPONSES HOOKS =================== //

/**
 * Hook to fetch responses for a specific email
 * Retrieves all responses/replies for a contact message.
 * 
 * @function useFetchResponses
 * @param {number} emailId - Email ID to fetch responses for
 * @returns {Object} React Query query object for email responses
 */
export const useFetchResponses = (emailId) => {
  return useQuery(
    ["responses", emailId],
    () => getResponses({ id: emailId }),
    {
      enabled: !!emailId, // Only fetch if emailId exists
      staleTime: 2 * 60 * 1000, // 2 minutes
      cacheTime: 5 * 60 * 1000, // 5 minutes
      onSuccess: (data) => {
        console.log(`📧 [HOOK] Successfully fetched ${data?.length || 0} responses for email ${emailId}`);
      },
      onError: (error) => {
        console.error(`📧 [HOOK] Failed to fetch responses for email ${emailId}:`, error);
      },
    }
  );
};

/**
 * Hook to submit a response to an email
 * Creates email responses with automatic cache invalidation.
 * 
 * @function useSubmitResponse
 * @returns {Object} React Query mutation object for response submission
 */
export const useSubmitResponse = () => {
  const queryClient = useQueryClient();
  return useMutation(submitResponse, {
    onSuccess: (newResponse, variables) => {
      // Invalidate responses for the specific email
      if (variables.message) {
        queryClient.invalidateQueries(["responses", variables.message]);
      }
      console.log('📧 [HOOK] Successfully submitted response:', newResponse.id);
    },
    onError: (error) => {
      console.error('📧 [HOOK] Failed to submit response:', error);
    },
  });
};

// =================== EMAIL MESSAGES/NEWSLETTERS HOOKS =================== //

/**
 * Hook to fetch sent emails/newsletters
 * Retrieves all marketing emails and newsletters sent by organization.
 * 
 * @function useFetchSentEmails
 * @returns {Object} React Query query object for sent emails
 */
export const useFetchSentEmails = () => {
  return useQuery(
    ["sentEmails"],
    getSentEmails,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      onSuccess: (data) => {
        // Sort by creation date descending
        const sortedData = data.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        console.log(`📧 [HOOK] Successfully fetched ${sortedData.length} sent emails`);
        return sortedData;
      },
      onError: (error) => {
        console.error('📧 [HOOK] Failed to fetch sent emails:', error);
      },
    }
  );
};

/**
 * Hook to create and send email to all subscribers
 * Creates newsletter/marketing emails with automatic delivery.
 * 
 * @function useCreateEmail
 * @returns {Object} React Query mutation object for email creation
 */
export const useCreateEmail = () => {
  const queryClient = useQueryClient();
  return useMutation(createEmail, {
    onSuccess: (newEmail) => {
      // Invalidate sent emails to include new email
      queryClient.invalidateQueries(["sentEmails"]);
      console.log('📧 [HOOK] Successfully created and sent email:', newEmail.id);
    },
    onError: (error) => {
      console.error('📧 [HOOK] Failed to create/send email:', error);
    },
  });
};

/**
 * Hook to update an email message
 * Updates email messages with cache management.
 * 
 * @function useUpdateEmailMessage
 * @returns {Object} React Query mutation object for email message updates
 */
export const useUpdateEmailMessage = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (/** @type {any} */ variables) => updateEmailMessage(variables.id, variables.data),
    {
      onSuccess: (updatedMessage, variables) => {
        // Update specific email in cache
        queryClient.setQueryData(["emailMessage", variables.id], updatedMessage);
        // Invalidate sent emails list
        queryClient.invalidateQueries(["sentEmails"]);
        console.log('📧 [HOOK] Successfully updated email message:', variables.id);
      },
      onError: (error) => {
        console.error('📧 [HOOK] Failed to update email message:', error);
      },
    }
  );
};

/**
 * Hook to delete an email message
 * Deletes email messages with cache cleanup.
 * 
 * @function useDeleteEmailMessage
 * @returns {Object} React Query mutation object for email message deletion
 */
export const useDeleteEmailMessage = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteEmailMessage, {
    onSuccess: (deletedId) => {
      // Invalidate sent emails list
      queryClient.invalidateQueries(["sentEmails"]);
      // Remove specific email from cache
      queryClient.removeQueries(["emailMessage", deletedId]);
      console.log('📧 [HOOK] Successfully deleted email message:', deletedId);
    },
    onError: (error) => {
      console.error('📧 [HOOK] Failed to delete email message:', error);
    },
  });
};

// =================== SUBSCRIPTION MANAGEMENT HOOKS =================== //

/**
 * Hook to fetch all email subscriptions
 * Retrieves all users subscribed to the organization's email list.
 * 
 * @function useFetchSubscriptions
 * @returns {Object} React Query query object for subscriptions
 */
export const useFetchSubscriptions = () => {
  return useQuery(
    ["subscriptions"],
    getAllSubscriptions,
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
      cacheTime: 15 * 60 * 1000, // 15 minutes
      onSuccess: (data) => {
        console.log(`📧 [HOOK] Successfully fetched ${data?.length || 0} subscriptions`);
      },
      onError: (error) => {
        console.error('📧 [HOOK] Failed to fetch subscriptions:', error);
      },
    }
  );
};

/**
 * Hook to create a new subscription
 * Adds users to the email subscription list with cache management.
 * 
 * @function useCreateSubscription
 * @returns {Object} React Query mutation object for subscription creation
 */
export const useCreateSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation(createSubscription, {
    onSuccess: (newSubscription) => {
      // Invalidate subscriptions list
      queryClient.invalidateQueries(["subscriptions"]);
      console.log('📧 [HOOK] Successfully created subscription:', newSubscription.id);
    },
    onError: (error) => {
      console.error('📧 [HOOK] Failed to create subscription:', error);
    },
  });
};

/**
 * Hook to delete a subscription
 * Removes users from the email subscription list with cache cleanup.
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
        queryClient.setQueryData(["subscriptions"], (/** @type {any} */ old) => {
          return old.filter((/** @type {any} */ subscription) => subscription.id !== subscriptionId);
        });
      }
      
      return { previousSubscriptions };
    },
    onError: (error, subscriptionId, context) => {
      // Rollback on error
      if (context?.previousSubscriptions) {
        queryClient.setQueryData(["subscriptions"], context.previousSubscriptions);
      }
      console.error('📧 [HOOK] Failed to delete subscription:', error);
    },
    onSuccess: (deletedId) => {
      console.log('📧 [HOOK] Successfully deleted subscription:', deletedId);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries(["subscriptions"]);
    },
  });
};

// =================== LEGACY HOOKS FOR BACKWARD COMPATIBILITY =================== //

/**
 * @deprecated Use useCreateContactMessage instead
 * Legacy hook for backward compatibility
 */
export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation(sendMessage, {
    onSuccess: () => {
      queryClient.invalidateQueries(["emails"]);
    },
    onError: (error) => {
      console.error('📧 [HOOK] Failed to send message:', error);
    },
  });
};

/**
 * @deprecated Use useFetchSubscriptions instead
 * Legacy hook for backward compatibility
 */
export const useFetchAllEmails = () => {
  return useQuery(
    ["allEmails"],
    getallemails,
    {
      staleTime: 10 * 60 * 1000,
      cacheTime: 15 * 60 * 1000,
      onError: (error) => {
        console.error('📧 [HOOK] Failed to fetch all emails:', error);
      },
    }
  );
};

// =================== COMPOUND HOOKS FOR COMPLEX OPERATIONS =================== //

/**
 * Hook for email dashboard data
 * Combines multiple email-related queries for dashboard views.
 * 
 * @function useEmailDashboard
 * @returns {Object} Combined query results for email dashboard
 */
export const useEmailDashboard = () => {
  const emailsQuery = useFetchEmails();
  const sentEmailsQuery = useFetchSentEmails();
  const subscriptionsQuery = useFetchSubscriptions();

  return {
    emails: emailsQuery,
    sentEmails: sentEmailsQuery,
    subscriptions: subscriptionsQuery,
    isLoading: emailsQuery.isLoading || sentEmailsQuery.isLoading || subscriptionsQuery.isLoading,
    hasError: emailsQuery.isError || sentEmailsQuery.isError || subscriptionsQuery.isError,
    refetchAll: () => {
      emailsQuery.refetch();
      sentEmailsQuery.refetch();
      subscriptionsQuery.refetch();
    },
  };
};

/**
 * Hook for email conversation management
 * Manages email and its responses together for conversation views.
 * 
 * @function useEmailConversation
 * @param {number} emailId - Email ID for the conversation
 * @returns {Object} Combined email and responses data
 */
export const useEmailConversation = (emailId) => {
  const responsesQuery = useFetchResponses(emailId);
  const submitResponseMutation = useSubmitResponse();

  return {
    responses: responsesQuery,
    submitResponse: submitResponseMutation,
    isLoading: responsesQuery.isLoading,
    hasError: responsesQuery.isError,
    refetch: responsesQuery.refetch,
  };
};
