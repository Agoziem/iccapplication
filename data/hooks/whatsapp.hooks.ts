import { converttoformData } from "@/utils/formutils";
import { AxiosInstance, AxiosInstancemultipart, AxiosInstanceWithToken } from "../instance";
import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from "react-query";
import {
  Contact,
  WAMessage,
  WATemplate,
  CreateWATemplate,
  TemplateMessage,
  SendMessage,
  ContactArray,
  WAMessageArray,
  WATemplateArray
} from "@/types/whatsapp";

const WHATSAPP_API_ENDPOINT = "/whatsappAPI";

// Query Keys
export const WHATSAPP_KEYS = {
  all: ['whatsapp'] as const,
  contacts: () => [...WHATSAPP_KEYS.all, 'contacts'] as const,
  contact: (id: number) => [...WHATSAPP_KEYS.contacts(), id] as const,
  messages: (contactId: number) => [...WHATSAPP_KEYS.all, 'messages', contactId] as const,
  templates: () => [...WHATSAPP_KEYS.all, 'templates'] as const,
  template: (id: number) => [...WHATSAPP_KEYS.templates(), id] as const,
};

// Contact Management
export const getWhatsAppContacts = async (): Promise<ContactArray> => {
  const response = await AxiosInstance.get(`${WHATSAPP_API_ENDPOINT}/contacts/`);
  return response.data;
};

// Message Management
export const getWhatsAppMessages = async (contactId: number): Promise<WAMessageArray> => {
  const response = await AxiosInstance.get(`${WHATSAPP_API_ENDPOINT}/messages/${contactId}/`);
  return response.data;
};

export const sendWhatsAppMessage = async (contactId: number, messageData: SendMessage): Promise<WAMessage> => {
  const response = await AxiosInstanceWithToken.post(`${WHATSAPP_API_ENDPOINT}/${contactId}/send_message/`, messageData);
  return response.data;
};

export const sendTemplateMessage = async (templateData: TemplateMessage): Promise<WAMessage> => {
  const response = await AxiosInstanceWithToken.post(`${WHATSAPP_API_ENDPOINT}/send-template-message/`, templateData);
  return response.data;
};

// Template Management
export const getWhatsAppTemplates = async (): Promise<WATemplateArray> => {
  const response = await AxiosInstance.get(`${WHATSAPP_API_ENDPOINT}/templates/`);
  return response.data;
};

export const createWhatsAppTemplate = async (templateData: CreateWATemplate): Promise<WATemplate> => {
  const response = await AxiosInstanceWithToken.post(`${WHATSAPP_API_ENDPOINT}/templates/`, templateData);
  return response.data;
};

// Media Management
export const getWhatsAppMedia = async (mediaId: string): Promise<{ url: string; type: string }> => {
  const response = await AxiosInstance.get(`${WHATSAPP_API_ENDPOINT}/media/${mediaId}/`);
  return response.data;
};

// Webhook Management
export const handleWhatsAppWebhook = async (webhookData: any): Promise<any> => {
  const response = await AxiosInstanceWithToken.post(`${WHATSAPP_API_ENDPOINT}/whatsapp-webhook/`, webhookData);
  return response.data;
};

// React Query Hooks

// Contact Hooks
export const useWhatsAppContacts = (): UseQueryResult<ContactArray, Error> => {
  return useQuery({
    queryKey: WHATSAPP_KEYS.contacts(),
    queryFn: getWhatsAppContacts,
    onError: (error: Error) => {
      console.error('Error fetching WhatsApp contacts:', error);
      throw error;
    },
  });
};

// Message Hooks
export const useWhatsAppMessages = (contactId: number): UseQueryResult<WAMessageArray, Error> => {
  return useQuery({
    queryKey: WHATSAPP_KEYS.messages(contactId),
    queryFn: () => getWhatsAppMessages(contactId),
    enabled: !!contactId,
    onError: (error: Error) => {
      console.error('Error fetching WhatsApp messages:', error);
      throw error;
    },
  });
};

export const useSendWhatsAppMessage = (): UseMutationResult<WAMessage, Error, { contactId: number; messageData: SendMessage }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ contactId, messageData }) => sendWhatsAppMessage(contactId, messageData),
    onSuccess: (_, { contactId }) => {
      queryClient.invalidateQueries(WHATSAPP_KEYS.messages(contactId));
    },
    onError: (error: Error) => {
      console.error('Error sending WhatsApp message:', error);
      throw error;
    },
  });
};

export const useSendTemplateMessage = (): UseMutationResult<WAMessage, Error, TemplateMessage> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: sendTemplateMessage,
    onSuccess: () => {
      // Invalidate all messages since we don't know which contact received the template
      queryClient.invalidateQueries(WHATSAPP_KEYS.all);
    },
    onError: (error: Error) => {
      console.error('Error sending template message:', error);
      throw error;
    },
  });
};

// Template Hooks
export const useWhatsAppTemplates = (): UseQueryResult<WATemplateArray, Error> => {
  return useQuery({
    queryKey: WHATSAPP_KEYS.templates(),
    queryFn: getWhatsAppTemplates,
    onError: (error: Error) => {
      console.error('Error fetching WhatsApp templates:', error);
      throw error;
    },
  });
};

export const useCreateWhatsAppTemplate = (): UseMutationResult<WATemplate, Error, CreateWATemplate> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createWhatsAppTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries(WHATSAPP_KEYS.templates());
    },
    onError: (error: Error) => {
      console.error('Error creating WhatsApp template:', error);
      throw error;
    },
  });
};

// Media Hooks
export const useWhatsAppMedia = (mediaId: string): UseQueryResult<{ url: string; type: string }, Error> => {
  return useQuery({
    queryKey: [...WHATSAPP_KEYS.all, 'media', mediaId],
    queryFn: () => getWhatsAppMedia(mediaId),
    enabled: !!mediaId,
    onError: (error: Error) => {
      console.error('Error fetching WhatsApp media:', error);
      throw error;
    },
  });
};

// Webhook Hooks
export const useHandleWhatsAppWebhook = (): UseMutationResult<any, Error, any> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: handleWhatsAppWebhook,
    onSuccess: () => {
      // Invalidate all data since webhook might affect any part of the app
      queryClient.invalidateQueries(WHATSAPP_KEYS.all);
    },
    onError: (error: Error) => {
      console.error('Error handling WhatsApp webhook:', error);
      throw error;
    },
  });
};
