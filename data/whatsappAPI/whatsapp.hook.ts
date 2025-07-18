import { 
  useQuery, 
  useMutation, 
  useQueryClient,
  UseQueryResult,
  UseMutationResult
} from "react-query";
import type {
  WAContact,
  WAContacts,
  WAMessage,
  WAMessages,
  WATemplate,
  WATemplateArray,
} from "@/types/whatsapp";
import {
  fetchWAContacts,
  fetchWAMessages,
  sendWAMessage,
  getMedia,
  getSentTemplates,
  createTemplateMessage,
} from "./fetcher"; // Adjust the path accordingly

// Fetch WhatsApp Contacts
export const useFetchWAContacts = (): UseQueryResult<WAContacts | undefined, Error> => {
  return useQuery({
    queryKey: ["waContacts"],
    queryFn: fetchWAContacts,
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
  });
};

// Fetch Messages for a Specific Contact
export const useFetchWAMessages = (contact_id: number): UseQueryResult<WAMessages | undefined, Error> => {
  return useQuery({
    queryKey: ["waMessages", contact_id],
    queryFn: () => fetchWAMessages(contact_id),
    enabled: !!contact_id, // Fetch only if contact is provided
  });
};

// Send a WhatsApp Message with Optimistic Updates
export const useSendWAMessage = (): UseMutationResult<WAMessage | undefined, Error, Omit<WAMessage, "id" | "timestamp">> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendWAMessage, // API call to send the message

    // Optimistic update before the mutation starts
    onMutate: async (newMessage) => {
      const cacheKey = ["waMessages", newMessage.contact];

      // Cancel outgoing queries to avoid overwriting the cache
      await queryClient.cancelQueries(cacheKey);

      // Snapshot of the previous value in the cache
      const previousMessages = queryClient.getQueryData<WAMessages>(cacheKey);

      // Optimistically update the cache with the new message
      queryClient.setQueryData<WAMessages>(cacheKey, (oldMessages = []) => [
        ...oldMessages,
        newMessage as WAMessage,
      ]);

      // Return the snapshot for rollback in case of an error
      return { previousMessages };
    },

    // On success, update the cache with the server's response
    onSuccess: (data, variables) => {
      const cacheKey = ["waMessages", variables.contact];
      queryClient.invalidateQueries(cacheKey);
    },
  });
};

// Fetch Media by ID
export const useFetchMedia = (mediaId: string): UseQueryResult<string | null, Error> => {
  return useQuery({
    queryKey: ["media", mediaId],
    queryFn: () => getMedia(mediaId),
    enabled: !!mediaId, // Fetch only if mediaId is provided
  });
};

// Fetch WhatsApp Templates
export const useGetSentTemplates = (): UseQueryResult<WATemplateArray | undefined, Error> => {
  return useQuery({
    queryKey: ["waTemplates"],
    queryFn: getSentTemplates,
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });
};

// Create a Template Message
export const useCreateTemplateMessage = (): UseMutationResult<WATemplate | null, Error, Omit<WATemplate, "id" | "timestamp">> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTemplateMessage,
    onSuccess: () => {
      queryClient.invalidateQueries(["waTemplates"]); // Invalidate templates query to refresh
    },
  });
};
