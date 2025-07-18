import type {
  WAContact,
  WAContacts,
  WAMessage,
  WAMessages,
  WATemplate,
  WATemplateArray,
} from "@/types/whatsapp";
import axios, { AxiosResponse } from "axios";

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}`,
});
const OrganizationID = process.env.NEXT_PUBLIC_ORGANIZATION_ID;
export const WhatsappAPIendpoint = "/whatsappAPI";
export const WATemplatescachekey = "whatsapp_templates_data";

// Fetch the Contacts and cache
export const fetchWAContacts = async (): Promise<WAContacts | undefined> => {
  try {
    const response: AxiosResponse<WAContacts> = await axiosInstance.get(`${WhatsappAPIendpoint}/contacts/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching WA contacts:", error);
    throw error;
  }
};

export const fetchWAMessages = async (contact_id: number): Promise<WAMessages | undefined> => {
  try {
    const response: AxiosResponse<WAMessages> = await axiosInstance.get(
      `${WhatsappAPIendpoint}/messages/${contact_id}/`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching WA messages:", error);
    throw error;
  }
};

export const sendWAMessage = async (wamessage: Omit<WAMessage, "id" | "timestamp">): Promise<WAMessage | undefined> => {
  try {
    const response: AxiosResponse<WAMessage> = await axiosInstance.post(
      `${WhatsappAPIendpoint}/${wamessage.contact}/send_message/`,
      wamessage
    );
    return response.data;
  } catch (error) {
    console.error("Error sending WA message:", error);
    throw error;
  }
};

// Fetch media by ID
export const getMedia = async (media_id: string): Promise<string | null> => {
  console.log("Fetching media", media_id);
  try {
    // Fetch the media binary from Django backend
    const response: AxiosResponse<ArrayBuffer> = await axios.get(
      `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/whatsappAPI/media/${media_id}/`,
      { responseType: "arraybuffer" } // Ensure binary data is handled correctly
    );
    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });
    const url = URL.createObjectURL(blob);
    return url;
  } catch (error) {
    console.error("Failed to fetch media", error);
    return null;
  }
};

export const getSentTemplates = async (): Promise<WATemplateArray | undefined> => {
  try {
    const response: AxiosResponse<WATemplateArray> = await axiosInstance.get(`${WhatsappAPIendpoint}/templates/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching WA templates:", error);
    throw error;
  }
};

export const createTemplateMessage = async (Template: Omit<WATemplate, "id" | "timestamp">): Promise<WATemplate | null> => {
  try {
    const contacts = await fetchWAContacts();

    if (!contacts?.length) return null;

    await Promise.all(
      contacts.map((contact: WAContact) =>
        sendTemplateMessage(
          contact.wa_id,
          Template.template,
          "en_US",
          Template.text,
          Template.link || ""
        )
      )
    );

    const response: AxiosResponse<WATemplate> = await axiosInstance.post(
      `${WhatsappAPIendpoint}/templates/`,
      Template
    );
    return response.data;
  } catch (error) {
    console.error("Error creating template message:", error);
    throw error;
  }
};

const sendTemplateMessage = async (
  to_phone_number: string,
  template_name: string,
  language_code: string = "en_US",
  text: string = "",
  medialink: string = ""
): Promise<number> => {
  try {
    const data = {
      to_phone_number,
      template_name,
      language_code,
      text,
      medialink,
    };
    const response: AxiosResponse<any> = await axiosInstance.post(
      `${WhatsappAPIendpoint}/send-template-message/`,
      data
    );
    return response.status;
  } catch (error) {
    console.error("Error sending template message:", error);
    throw error;
  }
};
