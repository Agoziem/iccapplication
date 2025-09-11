/**
 * @fileoverview Enhanced WhatsApp API React Query Hooks for ICC Application
 * Comprehensive hooks for all 8 documented whatsappAPI endpoints with intelligent
 * caching, optimistic updates, and production-grade error handling.
 * 
 * @module data/whatsappAPI/whatsapp.hook
 * @requires react-query - For state management and caching
 * @requires react-hot-toast - For user notifications
 * @version 3.0.0
 * @since 2024
 * 
 * Hooks Overview:
 * ✅ useWhatsAppContacts - Fetch all contacts
 * ✅ useWhatsAppMessages - Fetch messages for specific contact
 * ✅ useSendWhatsAppMessage - Send message to contact
 * ✅ useWhatsAppTemplates - Fetch all templates
 * ✅ useCreateWhatsAppTemplate - Create new template
 * ✅ useSendTemplateMessage - Send template message
 * ✅ useWhatsAppMedia - Fetch media by ID
 * ✅ useCreateWhatsAppWebhook - Create/configure webhook
 * 
 * Legacy Compatibility:
 * ✅ useFetchWAContacts - Legacy contact fetching
 * ✅ useFetchWAMessages - Legacy message fetching
 * ✅ useSendWAMessage - Legacy message sending
 * ✅ useFetchMedia - Legacy media fetching
 * ✅ useGetSentTemplates - Legacy template fetching
 * ✅ useCreateTemplateMessage - Legacy template creation
 */

import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';
import {
  getWhatsAppContacts,
  getWhatsAppMessages,
  sendWhatsAppMessage,
  getWhatsAppTemplates,
  createWhatsAppTemplate,
  sendTemplateMessage,
  getWhatsAppMedia,
  createWhatsAppWebhook,
  whatsappQueryKeys,
  // Legacy imports for backward compatibility
  fetchWAContacts,
  fetchWAMessages,
  sendWAMessage,
  getMedia,
  getSentTemplates,
  createTemplateMessage,
} from './fetcher';

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Extract error message from unknown error type
 * @param {unknown} error - Error object of unknown type
 * @param {string} fallback - Fallback message if error message cannot be extracted
 * @returns {string} Error message
 */
const getErrorMessage = (error, fallback) => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  return fallback;
};

// =============================================================================
// WHATSAPP API CONFIGURATION
// =============================================================================

/**
 * Default configuration for WhatsApp API React Query hooks
 */
const defaultWhatsAppConfig = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
};

/**
 * Hook configuration factory
 * @param {Object} overrides - Configuration overrides
 * @returns {Object} Merged configuration
 */
export const useWhatsAppConfig = (overrides = {}) => ({
  ...defaultWhatsAppConfig,
  ...overrides,
});

// =============================================================================
// CONTACT MANAGEMENT HOOKS
// =============================================================================

/**
 * Hook to fetch all WhatsApp contacts
 * 
 * @function useWhatsAppContacts
 * @param {Object} [options={}] - React Query options
 * @returns {Object} React Query query object with contacts data
 * 
 * @example
 * const { data: contacts, isLoading, error } = useWhatsAppContacts();
 * 
 * // With custom options
 * const { data: contacts } = useWhatsAppContacts({
 *   refetchInterval: 30000, // Refetch every 30 seconds
 *   enabled: shouldFetchContacts,
 * });
 */
export const useWhatsAppContacts = (options = {}) => {
  return useQuery(
    whatsappQueryKeys.contacts,
    getWhatsAppContacts,
    {
      ...useWhatsAppConfig(),
      onSuccess: (data) => {
        console.log(`📞 [HOOK] Successfully fetched ${data?.length || 0} WhatsApp contacts`);
      },
      onError: (error) => {
        console.error('📞 [HOOK] Failed to fetch WhatsApp contacts:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch WhatsApp contacts';
        toast.error(errorMessage);
      },
      ...options,
    }
  );
};

// =============================================================================
// MESSAGE MANAGEMENT HOOKS
// =============================================================================

/**
 * Hook to fetch messages for a specific contact
 * 
 * @function useWhatsAppMessages
 * @param {number|string} contactId - Contact ID to fetch messages for
 * @param {Object} [options={}] - React Query options
 * @returns {Object} React Query query object with messages data
 * 
 * @example
 * const { data: messages, isLoading } = useWhatsAppMessages(contactId);
 * 
 * // With conditional fetching
 * const { data: messages } = useWhatsAppMessages(contactId, {
 *   enabled: !!contactId && isContactSelected,
 * });
 */
export const useWhatsAppMessages = (contactId, options = {}) => {
  return useQuery(
    whatsappQueryKeys.messages(contactId),
    () => getWhatsAppMessages(contactId),
    {
      ...useWhatsAppConfig(),
      enabled: !!contactId,
      onSuccess: (data) => {
        console.log(`💬 [HOOK] Successfully fetched ${data?.length || 0} messages for contact ${contactId}`);
      },
      onError: (error) => {
        console.error(`💬 [HOOK] Failed to fetch messages for contact ${contactId}:`, error);
        toast.error(getErrorMessage(error, 'Failed to fetch messages'));
      },
      ...options,
    }
  );
};

/**
 * Hook to send a WhatsApp message with optimistic updates
 * 
 * @function useSendWhatsAppMessage
 * @returns {Object} React Query mutation object for sending messages
 * 
 * @example
 * const sendMessage = useSendWhatsAppMessage();
 * 
 * const handleSendMessage = () => {
 *   sendMessage.mutate({
 *     contactId: 123,
 *     messageData: {
 *       message: "Hello from ICC!",
 *       message_type: "text"
 *     }
 *   });
 * };
 */
export const useSendWhatsAppMessage = () => {
  const queryClient = useQueryClient();

  return useMutation(
    /**
     * @param {{contactId: number|string, messageData: Object}} mutationParams
     */
    async (mutationParams) => {
      return await sendWhatsAppMessage(mutationParams.contactId, mutationParams.messageData);
    },
    {
      onMutate: async (mutationParams) => {
        const { contactId, messageData } = mutationParams;
        const cacheKey = whatsappQueryKeys.messages(contactId);

        // Cancel outgoing queries to avoid overwriting optimistic update
        await queryClient.cancelQueries(cacheKey);

        // Snapshot previous value for rollback
        const previousMessages = queryClient.getQueryData(cacheKey);

        // Optimistically update cache with new message
        const optimisticMessage = {
          id: `temp-${Date.now()}`,
          message: messageData.message,
          message_type: messageData.message_type || 'text',
          timestamp: new Date().toISOString(),
          is_from_me: true,
          status: 'sending',
          ...messageData,
        };

        queryClient.setQueryData(cacheKey, (oldMessages = []) => [
          ...oldMessages,
          optimisticMessage,
        ]);

        return { previousMessages, contactId };
      },
      onSuccess: (newMessage, mutationParams, context) => {
        const { contactId } = mutationParams;
        console.log(`💬 [HOOK] ✅ Successfully sent message to contact ${contactId}`);
        
        // Invalidate and refetch to get the actual server data
        queryClient.invalidateQueries(whatsappQueryKeys.messages(contactId));
        queryClient.invalidateQueries(whatsappQueryKeys.contacts);
        
        toast.success('Message sent successfully!');
      },
      onError: (error, mutationParams, context) => {
        const { contactId } = mutationParams;
        console.error(`💬 [HOOK] ❌ Failed to send message to contact ${contactId}:`, error);
        
        // Rollback optimistic update
        if (context?.previousMessages) {
          queryClient.setQueryData(whatsappQueryKeys.messages(contactId), context.previousMessages);
        }
        
        toast.error(getErrorMessage(error, 'Failed to send message'));
      },
    }
  );
};

// =============================================================================
// TEMPLATE MANAGEMENT HOOKS
// =============================================================================

/**
 * Hook to fetch all WhatsApp templates
 * 
 * @function useWhatsAppTemplates
 * @param {Object} [options={}] - React Query options
 * @returns {Object} React Query query object with templates data
 * 
 * @example
 * const { data: templates, isLoading } = useWhatsAppTemplates();
 */
export const useWhatsAppTemplates = (options = {}) => {
  return useQuery(
    whatsappQueryKeys.templates,
    getWhatsAppTemplates,
    {
      ...useWhatsAppConfig({
        staleTime: 10 * 60 * 1000, // Templates change less frequently
      }),
      onSuccess: (data) => {
        console.log(`📋 [HOOK] Successfully fetched ${data?.length || 0} WhatsApp templates`);
      },
      onError: (error) => {
        console.error('📋 [HOOK] Failed to fetch WhatsApp templates:', error);
        toast.error(getErrorMessage(error, 'Failed to fetch templates'));
      },
      ...options,
    }
  );
};

/**
 * Hook to create a new WhatsApp template
 * 
 * @function useCreateWhatsAppTemplate
 * @returns {Object} React Query mutation object for creating templates
 * 
 * @example
 * const createTemplate = useCreateWhatsAppTemplate();
 * 
 * const handleCreateTemplate = () => {
 *   createTemplate.mutate({
 *     template: "welcome_message",
 *     text: "Welcome to ICC!",
 *     language_code: "en_US"
 *   });
 * };
 */
export const useCreateWhatsAppTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation(createWhatsAppTemplate, {
    onSuccess: (newTemplate) => {
      console.log('📋 [HOOK] ✅ Successfully created WhatsApp template:', newTemplate.template);
      
      // Invalidate templates list to refetch
      queryClient.invalidateQueries(whatsappQueryKeys.templates);
      
      // Optimistically add to cache
      queryClient.setQueryData(whatsappQueryKeys.templates, (oldTemplates = []) => [
        ...oldTemplates,
        newTemplate,
      ]);
      
      toast.success(`Template "${newTemplate.template}" created successfully!`);
    },
    onError: (error) => {
      console.error('📋 [HOOK] ❌ Failed to create WhatsApp template:', error);
      toast.error(getErrorMessage(error, 'Failed to create template'));
    },
  });
};

/**
 * Hook to send a template message
 * 
 * @function useSendTemplateMessage
 * @returns {Object} React Query mutation object for sending template messages
 * 
 * @example
 * const sendTemplate = useSendTemplateMessage();
 * 
 * const handleSendTemplate = () => {
 *   sendTemplate.mutate({
 *     to_phone_number: "+1234567890",
 *     template_name: "welcome_message",
 *     language_code: "en_US"
 *   });
 * };
 */
export const useSendTemplateMessage = () => {
  const queryClient = useQueryClient();

  return useMutation(sendTemplateMessage, {
    onSuccess: (result, templateMessageData) => {
      console.log(`📲 [HOOK] ✅ Successfully sent template message to ${templateMessageData.to_phone_number}`);
      
      // Invalidate contacts and messages to reflect new activity
      queryClient.invalidateQueries(whatsappQueryKeys.contacts);
      queryClient.invalidateQueries(whatsappQueryKeys.all);
      
      toast.success('Template message sent successfully!');
    },
    onError: (error, templateMessageData) => {
      console.error(`📲 [HOOK] ❌ Failed to send template message to ${templateMessageData.to_phone_number}:`, error);
      toast.error(getErrorMessage(error, 'Failed to send template message'));
    },
  });
};

// =============================================================================
// MEDIA MANAGEMENT HOOKS
// =============================================================================

/**
 * Hook to fetch media by ID with caching
 * 
 * @function useWhatsAppMedia
 * @param {string|number} mediaId - Media identifier
 * @param {Object} [options={}] - React Query options
 * @returns {Object} React Query query object with media URL
 * 
 * @example
 * const { data: mediaUrl, isLoading } = useWhatsAppMedia(mediaId);
 * 
 * // Conditional fetching
 * const { data: mediaUrl } = useWhatsAppMedia(mediaId, {
 *   enabled: !!mediaId && shouldLoadMedia,
 * });
 */
export const useWhatsAppMedia = (mediaId, options = {}) => {
  return useQuery(
    whatsappQueryKeys.media(mediaId),
    () => getWhatsAppMedia(mediaId),
    {
      ...useWhatsAppConfig({
        staleTime: 15 * 60 * 1000, // Media URLs are stable for longer
        cacheTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
      }),
      enabled: !!mediaId,
      onSuccess: (url) => {
        console.log(`🖼️ [HOOK] Successfully fetched media ${mediaId}`);
      },
      onError: (error) => {
        console.error(`🖼️ [HOOK] Failed to fetch media ${mediaId}:`, error);
        toast.error(getErrorMessage(error, 'Failed to load media'));
      },
      ...options,
    }
  );
};

// =============================================================================
// WEBHOOK MANAGEMENT HOOKS
// =============================================================================

/**
 * Hook to create/configure WhatsApp webhook
 * 
 * @function useCreateWhatsAppWebhook
 * @returns {Object} React Query mutation object for webhook creation
 * 
 * @example
 * const createWebhook = useCreateWhatsAppWebhook();
 * 
 * const handleCreateWebhook = () => {
 *   createWebhook.mutate({
 *     webhook_url: "https://myapp.com/webhook",
 *     events: ["message", "delivery"],
 *     verify_token: "secret-token"
 *   });
 * };
 */
export const useCreateWhatsAppWebhook = () => {
  return useMutation(createWhatsAppWebhook, {
    onSuccess: (webhookData) => {
      console.log('🔗 [HOOK] ✅ Successfully created WhatsApp webhook');
      toast.success('Webhook configured successfully!');
    },
    onError: (error) => {
      console.error('🔗 [HOOK] ❌ Failed to create WhatsApp webhook:', error);
      toast.error(getErrorMessage(error, 'Failed to configure webhook'));
    },
  });
};

// =============================================================================
// LEGACY COMPATIBILITY HOOKS
// =============================================================================

/**
 * Legacy hook aliases for backward compatibility
 * These maintain the existing API while providing enhanced functionality
 */

/**
 * @deprecated Use useWhatsAppContacts instead
 * Legacy hook to fetch WhatsApp contacts
 */
export const useFetchWAContacts = (options = {}) => {
  return useQuery(
    ['waContacts'], // Keep legacy cache key
    fetchWAContacts,
    {
      staleTime: 5 * 60 * 1000,
      onSuccess: (data) => {
        console.log(`📞 [LEGACY HOOK] Fetched ${data?.length || 0} WhatsApp contacts`);
      },
      onError: (error) => {
        console.error('📞 [LEGACY HOOK] Failed to fetch contacts:', error);
      },
      ...options,
    }
  );
};

/**
 * @deprecated Use useWhatsAppMessages instead
 * Legacy hook to fetch messages for a specific contact
 */
export const useFetchWAMessages = (contactId, options = {}) => {
  return useQuery(
    ['waMessages', contactId], // Keep legacy cache key
    () => fetchWAMessages(contactId),
    {
      enabled: !!contactId,
      onSuccess: (data) => {
        console.log(`💬 [LEGACY HOOK] Fetched ${data?.length || 0} messages for contact ${contactId}`);
      },
      onError: (error) => {
        console.error(`💬 [LEGACY HOOK] Failed to fetch messages for contact ${contactId}:`, error);
      },
      ...options,
    }
  );
};

/**
 * @deprecated Use useSendWhatsAppMessage instead
 * Legacy hook to send WhatsApp message with optimistic updates
 */
export const useSendWAMessage = () => {
  const queryClient = useQueryClient();

  return useMutation(sendWAMessage, {
    onMutate: async (newMessage) => {
      const cacheKey = ['waMessages', newMessage.contact];
      await queryClient.cancelQueries(cacheKey);
      
      const previousMessages = queryClient.getQueryData(cacheKey);
      
      queryClient.setQueryData(cacheKey, (oldMessages = []) => [
        ...oldMessages,
        newMessage,
      ]);
      
      return { previousMessages };
    },
    onSuccess: (data, variables) => {
      console.log('💬 [LEGACY HOOK] Successfully sent message');
      const cacheKey = ['waMessages', variables.contact];
      queryClient.invalidateQueries(cacheKey);
    },
    onError: (error, variables, context) => {
      console.error('💬 [LEGACY HOOK] Failed to send message:', error);
      if (context?.previousMessages) {
        const cacheKey = ['waMessages', variables.contact];
        queryClient.setQueryData(cacheKey, context.previousMessages);
      }
    },
  });
};

/**
 * @deprecated Use useWhatsAppMedia instead
 * Legacy hook to fetch media by ID
 */
export const useFetchMedia = (mediaId, options = {}) => {
  return useQuery(
    ['media', mediaId], // Keep legacy cache key
    () => getMedia(mediaId),
    {
      enabled: !!mediaId,
      onSuccess: (url) => {
        console.log(`🖼️ [LEGACY HOOK] Fetched media ${mediaId}`);
      },
      onError: (error) => {
        console.error(`🖼️ [LEGACY HOOK] Failed to fetch media ${mediaId}:`, error);
      },
      ...options,
    }
  );
};

/**
 * @deprecated Use useWhatsAppTemplates instead
 * Legacy hook to fetch WhatsApp templates
 */
export const useGetSentTemplates = (options = {}) => {
  return useQuery(
    ['waTemplates'], // Keep legacy cache key
    getSentTemplates,
    {
      staleTime: 10 * 60 * 1000,
      onSuccess: (data) => {
        console.log(`📋 [LEGACY HOOK] Fetched ${data?.length || 0} WhatsApp templates`);
      },
      onError: (error) => {
        console.error('📋 [LEGACY HOOK] Failed to fetch templates:', error);
      },
      ...options,
    }
  );
};

/**
 * @deprecated Use useCreateWhatsAppTemplate instead
 * Legacy hook to create template message
 */
export const useCreateTemplateMessage = () => {
  const queryClient = useQueryClient();

  return useMutation(createTemplateMessage, {
    onSuccess: () => {
      console.log('📋 [LEGACY HOOK] Successfully created template message');
      queryClient.invalidateQueries(['waTemplates']);
    },
    onError: (error) => {
      console.error('📋 [LEGACY HOOK] Failed to create template message:', error);
    },
  });
};

// =============================================================================
// UTILITY HOOKS
// =============================================================================

/**
 * Hook to prefetch WhatsApp data for improved UX
 * 
 * @function usePrefetchWhatsAppData
 * @returns {Object} Prefetch functions
 * 
 * @example
 * const { prefetchContacts, prefetchMessages } = usePrefetchWhatsAppData();
 * 
 * // Prefetch on hover or route change
 * const handleContactHover = (contactId) => {
 *   prefetchMessages(contactId);
 * };
 */
export const usePrefetchWhatsAppData = () => {
  const queryClient = useQueryClient();

  return {
    prefetchContacts: () => {
      queryClient.prefetchQuery(
        whatsappQueryKeys.contacts,
        getWhatsAppContacts,
        { staleTime: 5 * 60 * 1000 }
      );
    },
    prefetchMessages: (contactId) => {
      if (contactId) {
        queryClient.prefetchQuery(
          whatsappQueryKeys.messages(contactId),
          () => getWhatsAppMessages(contactId),
          { staleTime: 2 * 60 * 1000 }
        );
      }
    },
    prefetchTemplates: () => {
      queryClient.prefetchQuery(
        whatsappQueryKeys.templates,
        getWhatsAppTemplates,
        { staleTime: 10 * 60 * 1000 }
      );
    },
  };
};

/**
 * Hook to invalidate all WhatsApp related cache
 * Useful for force refresh scenarios
 * 
 * @function useInvalidateWhatsAppCache
 * @returns {Function} Invalidate function
 * 
 * @example
 * const invalidateWhatsAppCache = useInvalidateWhatsAppCache();
 * 
 * const handleRefresh = () => {
 *   invalidateWhatsAppCache();
 * };
 */
export const useInvalidateWhatsAppCache = () => {
  const queryClient = useQueryClient();

  return () => {
    console.log('🔄 [HOOK] Invalidating all WhatsApp cache...');
    queryClient.invalidateQueries(whatsappQueryKeys.all);
  };
};
