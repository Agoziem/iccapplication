import { ORGANIZATION_ID } from "@/constants";
import { AxiosinstanceAuth } from "./instance";
import {
  Contact,
  PaginatedResponse,
  SendMessage,
  TemplateMessage,
  WAMessage,
  WATemplateSchema,
} from "@/types/whatsapp";
import {
  CreateContactType,
  CreateWAMessageType,
  CreateWATemplateSchemaType,
  TemplateType,
  UpdateContactType,
  UpdateWAMessageType,
} from "@/schemas/whatsapp";
import { AxiosResponse } from "axios";
import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from "react-query";
const OrganizationID = ORGANIZATION_ID;

// ======================================================
// React Query Hooks - WhatsApp Contacts
// ======================================================

/**
 * Hook to fetch WhatsApp contacts
 */
export const useGetWAContacts = (): UseQueryResult<PaginatedResponse<Contact>> => {
  return useQuery("waContacts", async () => {
    try {
      const response = await AxiosinstanceAuth.get(`/whatsapp/contacts`);
      return response.data;
    } catch (error) {
      console.error("Error fetching WA contacts:", error);
      throw error;
    }
  });
};

/**
 * Hook to fetch single WhatsApp contact
 */
export const useGetWAContact = (contact_id: number): UseQueryResult<Contact> => {
  return useQuery(
    ["waContact", contact_id],
    async () => {
      try {
        const response = await AxiosinstanceAuth.get(`/whatsapp/contacts/${contact_id}`);
        return response.data;
      } catch (error) {
        console.error("Error fetching WA contact:", error);
        throw error;
      }
    },
    {
      enabled: !!contact_id,
    }
  );
};

/**
 * Hook to create WhatsApp contact
 */
export const useCreateWAContact = (): UseMutationResult<Contact, Error, CreateContactType> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (contact: CreateContactType) => {
      try {
        const response = await AxiosinstanceAuth.post(`/whatsapp/contacts`, contact);
        return response.data;
      } catch (error) {
        console.error("Error creating WA contact:", error);
        throw error;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("waContacts");
      },
      onError: (error) => {
        console.error("Failed to create WA contact:", error);
      },
    }
  );
};

/**
 * Hook to update WhatsApp contact
 */
export const useUpdateWAContact = (): UseMutationResult<
  Contact,
  Error,
  { contact_id: number; contact: UpdateContactType }
> => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ contact_id, contact }: { contact_id: number; contact: UpdateContactType }) => {
      try {
        const response: AxiosResponse<Contact> = await AxiosinstanceAuth.put(
          `/whatsapp/contacts/${contact_id}`,
          contact
        );
        return response.data;
      } catch (error) {
        console.error("Error updating WA contact:", error);
        throw error;
      }
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries("waContacts");
        queryClient.invalidateQueries(["waContact", variables.contact_id]);
      },
      onError: (error) => {
        console.error("Failed to update WA contact:", error);
      },
    }
  );
};

/**
 * Hook to delete WhatsApp contact
 */
export const useDeleteWAContact = (): UseMutationResult<number, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (contact_id: number) => {
      try {
        const response: AxiosResponse<any> = await AxiosinstanceAuth.delete(
          `/whatsapp/contacts/${contact_id}`
        );
        return response.status;
      } catch (error) {
        console.error("Error deleting WA contact:", error);
        throw error;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("waContacts");
      },
      onError: (error) => {
        console.error("Failed to delete WA contact:", error);
      },
    }
  );
};

// ======================================================
// React Query Hooks - WhatsApp Messages
// ======================================================

/**
 * Hook to fetch WhatsApp messages for a contact
 */
export const useGetWAMessages = (contact_id: number): UseQueryResult<PaginatedResponse<WAMessage>> => {
  return useQuery(
    ["waMessages", contact_id],
    async () => {
      try {
        const response = await AxiosinstanceAuth.get(`/whatsapp/messages/${contact_id}`);
        return response.data;
      } catch (error) {
        console.error("Error fetching WA messages:", error);
        throw error;
      }
    },
    {
      enabled: !!contact_id,
    }
  );
};

/**
 * Hook to fetch single WhatsApp message
 */
export const useGetWAMessage = (message_id: number): UseQueryResult<WAMessage> => {
  return useQuery(
    ["waMessage", message_id],
    async () => {
      try {
        const response = await AxiosinstanceAuth.get(`/whatsapp/messages/detail/${message_id}`);
        return response.data;
      } catch (error) {
        console.error("Error fetching WA message:", error);
        throw error;
      }
    },
    {
      enabled: !!message_id,
    }
  );
};

/**
 * Hook to create WhatsApp message
 */
export const useCreateWAMessage = (): UseMutationResult<WAMessage, Error, CreateWAMessageType> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (wamessage: CreateWAMessageType) => {
      try {
        const response = await AxiosinstanceAuth.post(`/whatsapp/messages`, wamessage);
        return response.data;
      } catch (error) {
        console.error("Error sending WA message:", error);
        throw error;
      }
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(["waMessages", variables.contact]);
      },
      onError: (error) => {
        console.error("Failed to create WA message:", error);
      },
    }
  );
};

/**
 * Hook to update WhatsApp message
 */
export const useUpdateWAMessage = (): UseMutationResult<
  WAMessage,
  Error,
  { id: number; data: UpdateWAMessageType }
> => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ id, data }: { id: number; data: UpdateWAMessageType }) => {
      try {
        const response: AxiosResponse<WAMessage> = await AxiosinstanceAuth.put(
          `/whatsapp/messages/${id}`,
          data
        );
        return response.data;
      } catch (error) {
        console.error("Error updating WA message:", error);
        throw error;
      }
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(["waMessage", variables.id]);
        queryClient.invalidateQueries("waMessages");
      },
      onError: (error) => {
        console.error("Failed to update WA message:", error);
      },
    }
  );
};

/**
 * Hook to delete WhatsApp message
 */
export const useDeleteWAMessage = (): UseMutationResult<number, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (id: number) => {
      try {
        const response: AxiosResponse<any> = await AxiosinstanceAuth.delete(`/whatsapp/messages/${id}`);
        return response.status;
      } catch (error) {
        console.error("Error deleting WA message:", error);
        throw error;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("waMessages");
      },
      onError: (error) => {
        console.error("Failed to delete WA message:", error);
      },
    }
  );
};

/**
 * Hook to mark WhatsApp message as read
 */
export const useMarkWAMessageAsRead = (): UseMutationResult<WAMessage, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (id: number) => {
      try {
        const response: AxiosResponse<WAMessage> = await AxiosinstanceAuth.post(
          `/whatsapp/messages/${id}/mark-read`
        );
        return response.data;
      } catch (error) {
        console.error("Error marking WA message as read:", error);
        throw error;
      }
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(["waMessage", variables]);
        queryClient.invalidateQueries("waMessages");
      },
      onError: (error) => {
        console.error("Failed to mark WA message as read:", error);
      },
    }
  );
};

/**
 * Hook to mark WhatsApp message as unread
 */
export const useMarkWAMessageAsUnread = (): UseMutationResult<WAMessage, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (id: number) => {
      try {
        const response: AxiosResponse<WAMessage> = await AxiosinstanceAuth.post(
          `/whatsapp/messages/${id}/mark-unread`
        );
        return response.data;
      } catch (error) {
        console.error("Error marking WA message as unread:", error);
        throw error;
      }
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(["waMessage", variables]);
        queryClient.invalidateQueries("waMessages");
      },
      onError: (error) => {
        console.error("Failed to mark WA message as unread:", error);
      },
    }
  );
};

// ======================================================
// React Query Hooks - WhatsApp Templates
// ======================================================

/**
 * Hook to fetch WhatsApp templates
 */
export const useGetWATemplates = (): UseQueryResult<PaginatedResponse<WATemplateSchema>> => {
  return useQuery("waTemplates", async () => {
    try {
      const response = await AxiosinstanceAuth.get(`/whatsapp/templates/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching WA templates:", error);
      throw error;
    }
  });
};

/**
 * Hook to create template message
 */
export const useCreateTemplateMessage = (): UseMutationResult<WATemplateSchema, Error, CreateWATemplateSchemaType> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (Template: CreateWATemplateSchemaType) => {
      try {
        const response: AxiosResponse<WATemplateSchema> = await AxiosinstanceAuth.post(
          `/whatsapp/templates/`,
          Template
        );
        return response.data;
      } catch (error) {
        console.error("Error creating template message:", error);
        throw error;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("waTemplates");
      },
      onError: (error) => {
        console.error("Failed to create template message:", error);
      },
    }
  );
};

/**
 * Hook to update WhatsApp template
 */
export const useUpdateWATemplate = (): UseMutationResult<
  WATemplateSchema,
  Error,
  { id: number; data: UpdateWAMessageType }
> => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ id, data }: { id: number; data: UpdateWAMessageType }) => {
      try {
        const response: AxiosResponse<WATemplateSchema> = await AxiosinstanceAuth.put(
          `/whatsapp/templates/${id}`,
          data
        );
        return response.data;
      } catch (error) {
        console.error("Error updating WA template:", error);
        throw error;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("waTemplates");
      },
      onError: (error) => {
        console.error("Failed to update WA template:", error);
      },
    }
  );
};

/**
 * Hook to delete WhatsApp template
 */
export const useDeleteWATemplate = (): UseMutationResult<number, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (id: number) => {
      try {
        const response: AxiosResponse<any> = await AxiosinstanceAuth.delete(`/whatsapp/templates/${id}`);
        return response.status;
      } catch (error) {
        console.error("Error deleting WA template:", error);
        throw error;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("waTemplates");
      },
      onError: (error) => {
        console.error("Failed to delete WA template:", error);
      },
    }
  );
};

// ======================================================
// React Query Hooks - WhatsApp Messaging
// ======================================================

/**
 * Hook to send template message
 */
export const useSendTemplateMessage = (): UseMutationResult<number, Error, TemplateMessage> => {
  return useMutation(
    async (data: TemplateMessage) => {
      try {
        const response: AxiosResponse<any> = await AxiosinstanceAuth.post(
          `/whatsapp/webhook/send-template`,
          data
        );
        return response.status;
      } catch (error) {
        console.error("Error sending template message:", error);
        throw error;
      }
    },
    {
      onError: (error) => {
        console.error("Failed to send template message:", error);
      },
    }
  );
};

/**
 * Hook to send multiple template messages
 */
export const useSendMultipleTemplateMessages = (): UseMutationResult<
  number,
  Error,
  { contacts: Contact[]; template: TemplateType }
> => {
  const sendTemplateMessage = async (data: TemplateMessage): Promise<number> => {
    try {
      const response: AxiosResponse<any> = await AxiosinstanceAuth.post(
        `/whatsapp/webhook/send-template`,
        data
      );
      return response.status;
    } catch (error) {
      console.error("Error sending template message:", error);
      throw error;
    }
  };

  return useMutation(
    async (data: { contacts: Contact[]; template: TemplateType }) => {
      if (!data?.contacts.length) return 400;

      await Promise.all(
        data.contacts.map((contact) =>
          sendTemplateMessage({
            to_phone_number: contact.wa_id,
            template_name: data.template,
            language_code: "en_US",
          })
        )
      );

      return 200;
    },
    {
      onError: (error) => {
        console.error("Failed to send multiple template messages:", error);
      },
    }
  );
};

/**
 * Hook to send main message
 */
export const useSendMainMessage = (): UseMutationResult<
  number,
  Error,
  { contact_id: number; data: SendMessage }
> => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ contact_id, data }: { contact_id: number; data: SendMessage }) => {
      try {
        const response: AxiosResponse<any> = await AxiosinstanceAuth.post(
          `/whatsapp/webhook/send-message/${contact_id}`,
          data
        );
        return response.status;
      } catch (error) {
        console.error("Error sending main message:", error);
        throw error;
      }
    },
    {
      onSuccess: (data, variables) => {
        // Refresh messages for the contact after sending
        queryClient.invalidateQueries(["waMessages", variables.contact_id]);
      },
      onError: (error) => {
        console.error("Failed to send main message:", error);
      },
    }
  );
};

// ======================================================
// Utility Functions - Media
// ======================================================

/**
 * Hook to fetch media by ID
 */
export const useGetMedia = (media_id: string): UseQueryResult<string | null> => {
  return useQuery(
    ["waMedia", media_id],
    async () => {
      console.log("Fetching media", media_id);
      try {
        // Fetch the media binary from Django backend
        const response = await AxiosinstanceAuth.get(`/whatsapp/media/${media_id}`, {
          responseType: "arraybuffer",
        });
        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        const url = URL.createObjectURL(blob);
        return url;
      } catch (error) {
        console.error("Failed to fetch media", error);
        return null;
      }
    },
    {
      enabled: !!media_id,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    }
  );
};
