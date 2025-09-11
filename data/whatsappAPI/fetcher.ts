/**
 * @fileoverview Enhanced WhatsApp API Integration for ICC Application
 * Comprehensive implementation of all 8 documented whatsappAPI endpoints
 * with production-grade error handling, validation, and performance optimization.
 * 
 * @module data/whatsappAPI/fetcher
 * @requires axios - For HTTP requests
 * @requires schemas/whatsapp - For data validation
 * @version 3.0.0
 * @since 2024
 * 
 * API Documentation Compliance:
 * ✅ GET  /whatsappAPI/contacts/ - whatsappAPI_contacts_list
 * ✅ GET  /whatsappAPI/media/{media_id}/ - whatsappAPI_media_read  
 * ✅ GET  /whatsappAPI/messages/{contact_id}/ - whatsappAPI_messages_read
 * ✅ POST /whatsappAPI/send-template-message/ - whatsappAPI_send-template-message_create
 * ✅ GET  /whatsappAPI/templates/ - whatsappAPI_templates_list
 * ✅ POST /whatsappAPI/templates/ - whatsappAPI_templates_create
 * ✅ POST /whatsappAPI/whatsapp-webhook/ - whatsappAPI_whatsapp-webhook_create
 * ✅ POST /whatsappAPI/{contact_id}/send_message/ - whatsappAPI_send_message_create
 */

import axios from "axios";
import {
  ContactSchema,
  CreateContactSchema,
  UpdateContactSchema,
  ContactArraySchema,
  WAMessageSchema,
  WAMessageArraySchema,
  WATemplateSchema,
  WATemplateArraySchema,
  CreateWATemplateSchema,
  SendMessageSchema,
  TemplateMessageSchema,
} from "@/schemas/whatsapp";

// =============================================================================
// AXIOS CONFIGURATION
// =============================================================================

/**
 * Enhanced axios instance with production-grade configuration
 * - 15-second timeout for reliable performance
 * - Request/response interceptors for comprehensive logging
 * - Centralized error handling and response validation
 */
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL,
  timeout: 15000, // 15 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging and authentication
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`🟦 [WHATSAPP API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('🟥 [WHATSAPP API] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for centralized response handling
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`🟩 [WHATSAPP API] ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    const errorMsg = error.response?.data?.error || error.message || 'Unknown error occurred';
    console.error(`🟥 [WHATSAPP API] ${error.response?.status || 'Network'} Error:`, errorMsg);
    
    // Enhanced error object with more context
    const enhancedError = new Error(errorMsg);
    // Add custom properties to error object
    Object.assign(enhancedError, {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
    });
    
    return Promise.reject(enhancedError);
  }
);

// =============================================================================
// CONSTANTS AND CONFIGURATION
// =============================================================================

const WHATSAPP_API_ENDPOINT = "/whatsappAPI";
const ORGANIZATION_ID = process.env.NEXT_PUBLIC_ORGANIZATION_ID;

/**
 * WhatsApp API Query Keys for React Query cache management
 */
export const whatsappQueryKeys = {
  all: ['whatsapp'],
  contacts: ['whatsapp', 'contacts'],
  contact: (id) => ['whatsapp', 'contact', id],
  messages: (contactId) => ['whatsapp', 'messages', contactId],
  templates: ['whatsapp', 'templates'],
  template: (id) => ['whatsapp', 'template', id],
  media: (mediaId) => ['whatsapp', 'media', mediaId],
};

// =============================================================================
// CONTACT MANAGEMENT FUNCTIONS
// =============================================================================

/**
 * Fetch all WhatsApp contacts
 * 
 * Endpoint: GET /whatsappAPI/contacts/
 * API Name: whatsappAPI_contacts_list
 * 
 * @async
 * @function getWhatsAppContacts
 * @returns {Promise<Object[]>} Array of WhatsApp contacts
 * @throws {Error} If request fails or validation fails
 * 
 * @example
 * const contacts = await getWhatsAppContacts();
 * console.log(`Found ${contacts.length} contacts`);
 */
export const getWhatsAppContacts = async () => {
  try {
    console.log('📞 [WHATSAPP API] Fetching WhatsApp contacts...');
    
    const response = await axiosInstance.get(`${WHATSAPP_API_ENDPOINT}/contacts/`);
    
    // Validate response with Zod schema
    const validation = ContactArraySchema.safeParse(response.data);
    if (!validation.success) {
      console.error('📞 [WHATSAPP API] ❌ Contact validation failed:', validation.error.issues);
      throw new Error('Invalid contact data received from server');
    }
    
    console.log(`📞 [WHATSAPP API] ✅ Successfully fetched ${validation.data.length} contacts`);
    return validation.data;
    
  } catch (error) {
    console.error('📞 [WHATSAPP API] ❌ Failed to fetch contacts:', error);
    throw error;
  }
};

// =============================================================================
// MESSAGE MANAGEMENT FUNCTIONS
// =============================================================================

/**
 * Fetch messages for a specific contact
 * 
 * Endpoint: GET /whatsappAPI/messages/{contact_id}/
 * API Name: whatsappAPI_messages_read
 * 
 * @async
 * @function getWhatsAppMessages
 * @param {number|string} contactId - Contact ID to fetch messages for
 * @returns {Promise<Object[]>} Array of messages for the contact
 * @throws {Error} If contactId is invalid or request fails
 * 
 * @example
 * const messages = await getWhatsAppMessages(123);
 * console.log(`Found ${messages.length} messages for contact`);
 */
export const getWhatsAppMessages = async (contactId) => {
  try {
    if (!contactId) {
      throw new Error('Contact ID is required');
    }
    
    console.log(`💬 [WHATSAPP API] Fetching messages for contact ${contactId}...`);
    
    const response = await axiosInstance.get(`${WHATSAPP_API_ENDPOINT}/messages/${contactId}/`);
    
    // Validate response with Zod schema
    const validation = WAMessageArraySchema.safeParse(response.data);
    if (!validation.success) {
      console.error('💬 [WHATSAPP API] ❌ Message validation failed:', validation.error.issues);
      throw new Error('Invalid message data received from server');
    }
    
    console.log(`💬 [WHATSAPP API] ✅ Successfully fetched ${validation.data.length} messages for contact ${contactId}`);
    return validation.data;
    
  } catch (error) {
    console.error(`💬 [WHATSAPP API] ❌ Failed to fetch messages for contact ${contactId}:`, error);
    throw error;
  }
};

/**
 * Send a message to a specific contact
 * 
 * Endpoint: POST /whatsappAPI/{contact_id}/send_message/
 * API Name: whatsappAPI_send_message_create
 * 
 * @async
 * @function sendWhatsAppMessage
 * @param {number|string} contactId - Contact ID to send message to
 * @param {Object} messageData - Message content and metadata
 * @param {string} messageData.message - Message text content
 * @param {string} [messageData.message_type] - Type of message (text, image, etc.)
 * @param {string} [messageData.media_url] - URL for media messages
 * @returns {Promise<Object>} Created message object
 * @throws {Error} If validation fails or send fails
 * 
 * @example
 * const message = await sendWhatsAppMessage(123, {
 *   message: "Hello from ICC!",
 *   message_type: "text"
 * });
 */
export const sendWhatsAppMessage = async (contactId, messageData) => {
  try {
    if (!contactId) {
      throw new Error('Contact ID is required');
    }
    if (!messageData || !messageData.message) {
      throw new Error('Message data and content are required');
    }
    
    console.log(`💬 [WHATSAPP API] Sending message to contact ${contactId}...`);
    
    // Validate input data
    const validation = SendMessageSchema.safeParse(messageData);
    if (!validation.success) {
      console.error('💬 [WHATSAPP API] ❌ Message validation failed:', validation.error.issues);
      throw new Error('Invalid message data provided');
    }
    
    const response = await axiosInstance.post(
      `${WHATSAPP_API_ENDPOINT}/${contactId}/send_message/`,
      validation.data
    );
    
    // Validate response
    const responseValidation = WAMessageSchema.safeParse(response.data);
    if (!responseValidation.success) {
      console.error('💬 [WHATSAPP API] ❌ Response validation failed:', responseValidation.error.issues);
      throw new Error('Invalid response data from server');
    }
    
    console.log(`💬 [WHATSAPP API] ✅ Successfully sent message to contact ${contactId}`);
    return responseValidation.data;
    
  } catch (error) {
    console.error(`💬 [WHATSAPP API] ❌ Failed to send message to contact ${contactId}:`, error);
    throw error;
  }
};

// =============================================================================
// TEMPLATE MANAGEMENT FUNCTIONS
// =============================================================================

/**
 * Fetch all WhatsApp templates
 * 
 * Endpoint: GET /whatsappAPI/templates/
 * API Name: whatsappAPI_templates_list
 * 
 * @async
 * @function getWhatsAppTemplates
 * @returns {Promise<Object[]>} Array of WhatsApp templates
 * @throws {Error} If request fails or validation fails
 * 
 * @example
 * const templates = await getWhatsAppTemplates();
 * console.log(`Found ${templates.length} templates`);
 */
export const getWhatsAppTemplates = async () => {
  try {
    console.log('📋 [WHATSAPP API] Fetching WhatsApp templates...');
    
    const response = await axiosInstance.get(`${WHATSAPP_API_ENDPOINT}/templates/`);
    
    // Validate response with Zod schema
    const validation = WATemplateArraySchema.safeParse(response.data);
    if (!validation.success) {
      console.error('📋 [WHATSAPP API] ❌ Template validation failed:', validation.error.issues);
      throw new Error('Invalid template data received from server');
    }
    
    console.log(`📋 [WHATSAPP API] ✅ Successfully fetched ${validation.data.length} templates`);
    return validation.data;
    
  } catch (error) {
    console.error('📋 [WHATSAPP API] ❌ Failed to fetch templates:', error);
    throw error;
  }
};

/**
 * Create a new WhatsApp template
 * 
 * Endpoint: POST /whatsappAPI/templates/
 * API Name: whatsappAPI_templates_create
 * 
 * @async
 * @function createWhatsAppTemplate
 * @param {Object} templateData - Template configuration
 * @param {string} templateData.template - Template name/identifier
 * @param {string} templateData.text - Template text content
 * @param {string} [templateData.link] - Optional link/media URL
 * @param {string} [templateData.language_code] - Template language (default: en_US)
 * @returns {Promise<Object>} Created template object
 * @throws {Error} If validation fails or creation fails
 * 
 * @example
 * const template = await createWhatsAppTemplate({
 *   template: "welcome_message",
 *   text: "Welcome to ICC! How can we help you today?",
 *   language_code: "en_US"
 * });
 */
export const createWhatsAppTemplate = async (templateData) => {
  try {
    if (!templateData || !templateData.template || !templateData.text) {
      throw new Error('Template name and text content are required');
    }
    
    console.log('📋 [WHATSAPP API] Creating WhatsApp template...');
    
    // Validate input data
    const validation = CreateWATemplateSchema.safeParse(templateData);
    if (!validation.success) {
      console.error('📋 [WHATSAPP API] ❌ Template validation failed:', validation.error.issues);
      throw new Error('Invalid template data provided');
    }
    
    // Send to all contacts if specified in the business logic
    if (templateData && typeof templateData === 'object' && 'sendToAllContacts' in templateData && templateData.sendToAllContacts) {
      const contacts = await getWhatsAppContacts();
      if (contacts?.length) {
        console.log(`📋 [WHATSAPP API] Sending template to ${contacts.length} contacts...`);
        await Promise.all(
          contacts.map((contact) =>
            sendTemplateMessage({
              to_phone_number: contact.wa_id,
              template_name: templateData.template,
              language_code: templateData.language_code || 'en_US',
            })
          )
        );
      }
    }
    
    const response = await axiosInstance.post(
      `${WHATSAPP_API_ENDPOINT}/templates/`,
      validation.data
    );
    
    // Validate response
    const responseValidation = WATemplateSchema.safeParse(response.data);
    if (!responseValidation.success) {
      console.error('📋 [WHATSAPP API] ❌ Response validation failed:', responseValidation.error.issues);
      throw new Error('Invalid response data from server');
    }
    
    console.log('📋 [WHATSAPP API] ✅ Successfully created WhatsApp template');
    return responseValidation.data;
    
  } catch (error) {
    console.error('📋 [WHATSAPP API] ❌ Failed to create template:', error);
    throw error;
  }
};

/**
 * Send a template message
 * 
 * Endpoint: POST /whatsappAPI/send-template-message/
 * API Name: whatsappAPI_send-template-message_create
 * 
 * @async
 * @function sendTemplateMessage
 * @param {Object} templateMessageData - Template message configuration
 * @param {string} templateMessageData.to_phone_number - Recipient phone number
 * @param {string} templateMessageData.template_name - Template identifier
 * @param {string} [templateMessageData.language_code='en_US'] - Message language
 * @param {string} [templateMessageData.text] - Additional text content
 * @param {string} [templateMessageData.medialink] - Media URL
 * @returns {Promise<Object>} Send status response
 * @throws {Error} If validation fails or send fails
 * 
 * @example
 * const result = await sendTemplateMessage({
 *   to_phone_number: "+1234567890",
 *   template_name: "welcome_message",
 *   language_code: "en_US",
 *   text: "Additional context",
 *   medialink: "https://example.com/image.jpg"
 * });
 */
export const sendTemplateMessage = async (templateMessageData) => {
  try {
    if (!templateMessageData || !templateMessageData.to_phone_number || !templateMessageData.template_name) {
      throw new Error('Phone number and template name are required');
    }
    
    console.log(`📲 [WHATSAPP API] Sending template message to ${templateMessageData.to_phone_number}...`);
    
    // Set defaults and validate input data
    const dataWithDefaults = {
      language_code: 'en_US',
      text: '',
      medialink: '',
      ...templateMessageData,
    };
    
    const validation = TemplateMessageSchema.safeParse(dataWithDefaults);
    if (!validation.success) {
      console.error('📲 [WHATSAPP API] ❌ Template message validation failed:', validation.error.issues);
      throw new Error('Invalid template message data provided');
    }
    
    const response = await axiosInstance.post(
      `${WHATSAPP_API_ENDPOINT}/send-template-message/`,
      validation.data
    );
    
    console.log(`📲 [WHATSAPP API] ✅ Successfully sent template message to ${templateMessageData.to_phone_number}`);
    return {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
    
  } catch (error) {
    console.error(`📲 [WHATSAPP API] ❌ Failed to send template message to ${templateMessageData.to_phone_number}:`, error);
    throw error;
  }
};

// =============================================================================
// MEDIA MANAGEMENT FUNCTIONS
// =============================================================================

/**
 * Fetch media by ID with optimized binary handling
 * 
 * Endpoint: GET /whatsappAPI/media/{media_id}/
 * API Name: whatsappAPI_media_read
 * 
 * @async
 * @function getWhatsAppMedia
 * @param {string|number} mediaId - Media identifier
 * @returns {Promise<string>} Blob URL for the media file
 * @throws {Error} If mediaId is invalid or fetch fails
 * 
 * @example
 * const mediaUrl = await getWhatsAppMedia("media123");
 * // Use mediaUrl in img src or video src
 */
export const getWhatsAppMedia = async (mediaId) => {
  try {
    if (!mediaId) {
      throw new Error('Media ID is required');
    }
    
    console.log(`🖼️ [WHATSAPP API] Fetching media ${mediaId}...`);
    
    const response = await axiosInstance.get(
      `${WHATSAPP_API_ENDPOINT}/media/${mediaId}/`,
      { 
        responseType: 'arraybuffer', // Handle binary data correctly
        timeout: 30000, // Extended timeout for media files
      }
    );
    
    // Create blob from binary data
    const blob = new Blob([response.data], {
      type: response.headers['content-type'] || 'application/octet-stream',
    });
    
    // Create object URL for use in UI
    const url = URL.createObjectURL(blob);
    
    console.log(`🖼️ [WHATSAPP API] ✅ Successfully fetched media ${mediaId}`);
    return url;
    
  } catch (error) {
    console.error(`🖼️ [WHATSAPP API] ❌ Failed to fetch media ${mediaId}:`, error);
    throw error;
  }
};

// =============================================================================
// WEBHOOK MANAGEMENT FUNCTIONS
// =============================================================================

/**
 * Create/configure WhatsApp webhook
 * 
 * Endpoint: POST /whatsappAPI/whatsapp-webhook/
 * API Name: whatsappAPI_whatsapp-webhook_create
 * 
 * @async
 * @function createWhatsAppWebhook
 * @param {Object} webhookData - Webhook configuration
 * @param {string} webhookData.webhook_url - URL to receive webhook events
 * @param {string[]} [webhookData.events] - Event types to subscribe to
 * @param {string} [webhookData.verify_token] - Verification token
 * @returns {Promise<Object>} Webhook configuration response
 * @throws {Error} If validation fails or creation fails
 * 
 * @example
 * const webhook = await createWhatsAppWebhook({
 *   webhook_url: "https://myapp.com/webhook",
 *   events: ["message", "delivery", "read"],
 *   verify_token: "my-secret-token"
 * });
 */
export const createWhatsAppWebhook = async (webhookData) => {
  try {
    if (!webhookData || !webhookData.webhook_url) {
      throw new Error('Webhook URL is required');
    }
    
    console.log('🔗 [WHATSAPP API] Creating WhatsApp webhook...');
    
    const response = await axiosInstance.post(
      `${WHATSAPP_API_ENDPOINT}/whatsapp-webhook/`,
      webhookData
    );
    
    console.log('🔗 [WHATSAPP API] ✅ Successfully created WhatsApp webhook');
    return response.data;
    
  } catch (error) {
    console.error('🔗 [WHATSAPP API] ❌ Failed to create webhook:', error);
    throw error;
  }
};

// =============================================================================
// LEGACY COMPATIBILITY FUNCTIONS
// =============================================================================

/**
 * Legacy function aliases for backward compatibility
 * These maintain the existing API while providing enhanced functionality
 */

// Legacy: fetchWAContacts -> getWhatsAppContacts
export const fetchWAContacts = getWhatsAppContacts;

// Legacy: fetchWAMessages -> getWhatsAppMessages  
export const fetchWAMessages = getWhatsAppMessages;

// Legacy: sendWAMessage -> sendWhatsAppMessage (with parameter adaptation)
export const sendWAMessage = async (messageData) => {
  if (!messageData || !messageData.contact) {
    throw new Error('Message data with contact ID is required');
  }
  return sendWhatsAppMessage(messageData.contact, messageData);
};

// Legacy: getMedia -> getWhatsAppMedia
export const getMedia = getWhatsAppMedia;

// Legacy: getSentTemplates -> getWhatsAppTemplates
export const getSentTemplates = getWhatsAppTemplates;

// Legacy: createTemplateMessage -> createWhatsAppTemplate (with parameter adaptation)
export const createTemplateMessage = async (templateData) => {
  const adaptedData = {
    ...templateData,
    sendToAllContacts: true, // Maintain legacy behavior
  };
  return createWhatsAppTemplate(adaptedData);
};

// =============================================================================
// EXPORTED CONSTANTS
// =============================================================================

export { 
  WHATSAPP_API_ENDPOINT as WhatsappAPIendpoint,
  whatsappQueryKeys as WATemplatescachekey,
  axiosInstance,
  ORGANIZATION_ID as OrganizationID,
};
