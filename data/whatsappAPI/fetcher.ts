import {
  WAContactArraySchema,
  WAMessageArraySchema,
  WAMessageSchema,
  WATemplateArraySchema,
  WATemplateSchema,
} from "@/schemas/whatsapp";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}`,
});
const OrganizationID = process.env.NEXT_PUBLIC_ORGANIZATION_ID;
export const WhatsappAPIendpoint = "/whatsappAPI";
export const WATemplatescachekey = "whatsapp_templates_data";

// Fetch the Contacts and cache
export const fetchWAContacts = async () => {
  const response = await axiosInstance.get(`${WhatsappAPIendpoint}/contacts/`);
  const validation = WAContactArraySchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * function to fetchWAMessages for a specific contact
 * @async
 * @param {number} contact_id
 */
export const fetchWAMessages = async (contact_id) => {
  const response = await axiosInstance.get(
    `${WhatsappAPIendpoint}/messages/${contact_id}/`
  );
  const validation = WAMessageArraySchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * function to fetchWAMessages for a specific contact
 * @async
 * @param {WAMessage} wamessage
 */
export const sendWAMessage = async (wamessage) => {
  const response = await axiosInstance.post(
    `${WhatsappAPIendpoint}/${wamessage.contact}/send_message/`,
    wamessage
  );
  const validation = WAMessageSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

// ------------------------------------------------------
// Fetch media by ID
// ------------------------------------------------------
export const getMedia = async (media_id) => {
  console.log("Fetching media", media_id);
  try {
    // Fetch the media binary from Django backend
    const response = await axios.get(
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

export const getSentTemplates = async () => {
  const response = await axiosInstance.get(`${WhatsappAPIendpoint}/templates/`);
  const validation = WATemplateArraySchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * function to fetchWAMessages for a specific contact
 * @async
 * @param {WATemplate} Template
 */
export const createTemplateMessage = async (Template) => {
  const contacts = await fetchWAContacts();

  if (!contacts?.length) return;

  await Promise.all(
    contacts.map((contact) =>
      sendTemplateMessage(
        contact.wa_id,
        Template.template,
        "en_US",
        Template.text,
        Template.link
      )
    )
  );

  const response = await axiosInstance.post(
    `${WhatsappAPIendpoint}/templates/`,
    Template
  );
  // Validate the response with Zod schema
  const validation = WATemplateSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
    return null;
  }
  return validation.data;
};

// -----------------------------------------
// get all the WA contacts
// -----------------------------------------
const sendTemplateMessage = async (
  to_phone_number,
  template_name,
  language_code = "en_US",
  text = "",
  medialink = ""
) => {
  const data = {
    to_phone_number,
    template_name,
    language_code,
    text,
    medialink,
  };
  const response = await axiosInstance.post(
    `${WhatsappAPIendpoint}/send-template-message/`,
    data
  );
  return response.status;
};
