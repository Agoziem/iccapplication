import { converttoformData } from "@/utils/formutils";
import {
  AxiosInstance,
  AxiosInstancemultipart,
  AxiosInstanceWithToken,
} from "../instance";
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from "react-query";
import { useState, useEffect, useRef } from "react";
import {
  Contact,
  WAMessage,
  WATemplate,
  CreateWATemplate,
  TemplateMessage,
  SendMessage,
  ContactArray,
  WAMessageArray,
  WATemplateArray,
} from "@/types/whatsapp";

const WHATSAPP_API_ENDPOINT = "/whatsappAPI";

// Query Keys
export const WHATSAPP_KEYS = {
  all: ["whatsapp"] as const,
  contacts: () => [...WHATSAPP_KEYS.all, "contacts"] as const,
  contact: (id: number) => [...WHATSAPP_KEYS.contacts(), id] as const,
  messages: (contactId: number) =>
    [...WHATSAPP_KEYS.all, "messages", contactId] as const,
  templates: () => [...WHATSAPP_KEYS.all, "templates"] as const,
  template: (id: number) => [...WHATSAPP_KEYS.templates(), id] as const,
};

// Contact Management
export const getWhatsAppContacts = async (): Promise<ContactArray> => {
  const response = await AxiosInstance.get(
    `${WHATSAPP_API_ENDPOINT}/contacts/`
  );
  return response.data;
};

// Message Management
export const getWhatsAppMessages = async (
  contactId: number
): Promise<WAMessageArray> => {
  const response = await AxiosInstance.get(
    `${WHATSAPP_API_ENDPOINT}/messages/${contactId}/`
  );
  return response.data;
};

export const sendWhatsAppMessage = async (
  contactId: number,
  messageData: SendMessage
): Promise<WAMessage> => {
  const response = await AxiosInstanceWithToken.post(
    `${WHATSAPP_API_ENDPOINT}/${contactId}/send_message/`,
    messageData
  );
  return response.data;
};

export const sendTemplateMessage = async (
  templateData: TemplateMessage
): Promise<WAMessage> => {
  const response = await AxiosInstanceWithToken.post(
    `${WHATSAPP_API_ENDPOINT}/send-template-message/`,
    templateData
  );
  return response.data;
};

// Template Management
export const getWhatsAppTemplates = async (): Promise<WATemplateArray> => {
  const response = await AxiosInstanceWithToken.get(
    `${WHATSAPP_API_ENDPOINT}/templates/`
  );
  return response.data;
};

export const createWhatsAppTemplate = async (
  templateData: CreateWATemplate
): Promise<WATemplate> => {
  const response = await AxiosInstanceWithToken.post(
    `${WHATSAPP_API_ENDPOINT}/templates/`,
    templateData
  );
  return response.data;
};

// Streamed Media Management (for real-time media processing)
export const getWhatsAppMediaStream = (
  mediaId: string,
  onData: (data: {
    url?: string;
    type?: string;
    progress?: number;
    status?: string;
  }) => void
): EventSource => {
  const eventSource = new EventSource(
    `${WHATSAPP_API_ENDPOINT}/media/${mediaId}/`
  );

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onData(data);
    } catch (error) {
      console.error("Error parsing streamed data:", error);
    }
  };

  eventSource.onerror = (error) => {
    console.error("EventSource error:", error);
    eventSource.close();
  };

  return eventSource;
};

// Alternative: Fetch API with ReadableStream (for file downloads with progress)
export const getWhatsAppMediaStreamDownload = async (
  mediaId: string,
  onProgress: (progress: number) => void
): Promise<{ url: string; type: string; blob: Blob }> => {
  const response = await fetch(
    `${WHATSAPP_API_ENDPOINT}/media/${mediaId}/download/`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const contentLength = response.headers.get("content-length");
  const total = contentLength ? parseInt(contentLength, 10) : 0;
  const contentType =
    response.headers.get("content-type") || "application/octet-stream";

  let loaded = 0;
  const reader = response.body?.getReader();
  const chunks: Uint8Array[] = [];

  if (!reader) {
    throw new Error("ReadableStream not supported");
  }

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    chunks.push(value);
    loaded += value.length;

    if (total > 0) {
      onProgress((loaded / total) * 100);
    }
  }

  const blob = new Blob(chunks as BlobPart[], { type: contentType });
  const url = URL.createObjectURL(blob);

  return {
    url,
    type: contentType,
    blob,
  };
};

// Webhook Management
export const handleWhatsAppWebhook = async (webhookData: any): Promise<any> => {
  const response = await AxiosInstanceWithToken.post(
    `${WHATSAPP_API_ENDPOINT}/whatsapp-webhook/`,
    webhookData
  );
  return response.data;
};

// React Query Hooks

// Contact Hooks
export const useWhatsAppContacts = (): UseQueryResult<ContactArray, Error> => {
  return useQuery({
    queryKey: WHATSAPP_KEYS.contacts(),
    queryFn: getWhatsAppContacts,
    onError: (error: Error) => {
      console.error("Error fetching WhatsApp contacts:", error);
      throw error;
    },
  });
};

// Message Hooks
export const useWhatsAppMessages = (
  contactId: number
): UseQueryResult<WAMessageArray, Error> => {
  return useQuery({
    queryKey: WHATSAPP_KEYS.messages(contactId),
    queryFn: () => getWhatsAppMessages(contactId),
    enabled: !!contactId,
    onError: (error: Error) => {
      console.error("Error fetching WhatsApp messages:", error);
      throw error;
    },
  });
};

export const useSendWhatsAppMessage = (): UseMutationResult<
  WAMessage,
  Error,
  { contactId: number; messageData: SendMessage }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contactId, messageData }) =>
      sendWhatsAppMessage(contactId, messageData),
    onSuccess: (_, { contactId }) => {
      queryClient.invalidateQueries(WHATSAPP_KEYS.messages(contactId));
    },
    onError: (error: Error) => {
      console.error("Error sending WhatsApp message:", error);
      throw error;
    },
  });
};

export const useSendTemplateMessage = (): UseMutationResult<
  WAMessage,
  Error,
  TemplateMessage
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendTemplateMessage,
    onSuccess: () => {
      // Invalidate all messages since we don't know which contact received the template
      queryClient.invalidateQueries(WHATSAPP_KEYS.all);
    },
    onError: (error: Error) => {
      console.error("Error sending template message:", error);
      throw error;
    },
  });
};

// Template Hooks
export const useWhatsAppTemplates = (): UseQueryResult<
  WATemplateArray,
  Error
> => {
  return useQuery({
    queryKey: WHATSAPP_KEYS.templates(),
    queryFn: getWhatsAppTemplates,
    onError: (error: Error) => {
      console.error("Error fetching WhatsApp templates:", error);
      throw error;
    },
  });
};

export const useCreateWhatsAppTemplate = (): UseMutationResult<
  WATemplate,
  Error,
  CreateWATemplate
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWhatsAppTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries(WHATSAPP_KEYS.templates());
    },
    onError: (error: Error) => {
      console.error("Error creating WhatsApp template:", error);
      throw error;
    },
  });
};

// =================================================================================
// Streamed Media Hook (for real-time media processing with Server-Sent Events)
// =================================================================================
export const useWhatsAppMediaStream = (mediaId: string) => {
  const [mediaData, setMediaData] = useState<{
    url?: string;
    type?: string;
    progress?: number;
    status?: "processing" | "completed" | "error";
    error?: string;
  }>({});

  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!mediaId) return;

    setIsConnected(true);
    setMediaData({ status: "processing", progress: 0 });

    const eventSource = getWhatsAppMediaStream(mediaId, (data) => {
      setMediaData((prev) => ({
        ...prev,
        ...data,
        status:
          (data.status as "processing" | "completed" | "error") || prev.status,
      }));

      if (data.status === "completed" || data.status === "error") {
        setIsConnected(false);
      }
    });

    eventSourceRef.current = eventSource;

    eventSource.onerror = () => {
      setIsConnected(false);
      setMediaData((prev) => ({
        ...prev,
        status: "error",
        error: "Connection lost",
      }));
    };

    return () => {
      eventSource.close();
      setIsConnected(false);
    };
  }, [mediaId]);

  const disconnect = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      setIsConnected(false);
    }
  };

  return {
    data: mediaData,
    isConnected,
    disconnect,
    isLoading: mediaData.status === "processing",
    isError: mediaData.status === "error",
    error: mediaData.error,
  };
};

// Streamed Download Hook (for file downloads with progress tracking)
export const useWhatsAppMediaDownload = () => {
  const [downloadState, setDownloadState] = useState<{
    progress: number;
    isDownloading: boolean;
    error?: string;
    data?: { url: string; type: string; blob: Blob };
  }>({
    progress: 0,
    isDownloading: false,
  });

  const download = async (mediaId: string) => {
    if (!mediaId) return;

    setDownloadState({ progress: 0, isDownloading: true });

    try {
      const data = await getWhatsAppMediaStreamDownload(mediaId, (progress) => {
        setDownloadState((prev) => ({ ...prev, progress }));
      });

      setDownloadState({
        progress: 100,
        isDownloading: false,
        data,
      });

      return data;
    } catch (error: any) {
      setDownloadState({
        progress: 0,
        isDownloading: false,
        error: error.message || "Download failed",
      });
      throw error;
    }
  };

  const reset = () => {
    setDownloadState({ progress: 0, isDownloading: false });
  };

  return {
    ...downloadState,
    download,
    reset,
  };
};

// Webhook Hooks
export const useHandleWhatsAppWebhook = (): UseMutationResult<
  any,
  Error,
  any
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: handleWhatsAppWebhook,
    onSuccess: () => {
      // Invalidate all data since webhook might affect any part of the app
      queryClient.invalidateQueries(WHATSAPP_KEYS.all);
    },
    onError: (error: Error) => {
      console.error("Error handling WhatsApp webhook:", error);
      throw error;
    },
  });
};
