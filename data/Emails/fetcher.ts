/**
 * @fileoverview Email Management API Integration Module
 * 
 * Comprehensive API integration for email system managing contact messages,
 * email responses, email newsletters, and subscription management with enhanced
 * error handling, validation, and timeout support.
 * 
 * Features:
 * - Contact message management (inbox messages)
 * - Email response/reply system for customer support
 * - Email newsletter and marketing message sending
 * - Subscription management for email lists
 * - Comprehensive error handling with retry logic
 * - Enhanced axios configuration with timeouts
 * 
 * @see https://docs.innovationcybercafe.com/api/emails
 * @version 2.0.0
 * @author Innovation CyberCafe Team
 */

import axios from "axios";
import { z } from "zod";
import {
  EmailSchema,
  CreateEmailSchema,
  UpdateEmailSchema,
  EmailsSchema,
  PaginatedEmailResponseSchema,
  EmailResponseSchema,
  CreateEmailResponseSchema,
  EmailResponsesSchema,
  PaginatedEmailResponsesSchema,
  EmailMessageSchema,
  CreateEmailMessageSchema,
  EmailMessagesSchema,
  PaginatedEmailMessageResponseSchema,
} from "@/schemas/emails";
import { SubscriptionArraySchema, SubscriptionSchema } from "@/schemas/organizations";
import { sendMultipleEmails } from "@/utils/mail";

// Enhanced axios instance with timeout and interceptors
export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}`,
  timeout: 15000, // 15 second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for logging and error handling
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error('📧 [EMAIL-API] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging and error handling
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const errorContext = {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    };
    console.error('📧 [EMAIL-API] Response error:', errorContext);
    
    // Enhanced error handling with user-friendly messages
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout - Please check your internet connection and try again';
    } else if (error.response?.status === 404) {
      error.message = 'Email resource not found';
    } else if (error.response?.status === 403) {
      error.message = 'Access denied - Please check your permissions';
    } else if (error.response?.status >= 500) {
      error.message = 'Server error - Please try again later';
    }
    
    return Promise.reject(error);
  }
);

export const emailAPIendpoint = "/emailsapi";

const OrganizationID = process.env.NEXT_PUBLIC_ORGANIZATION_ID;

// ======================== CONTACT MESSAGES MANAGEMENT ======================== //

/**
 * Fetches all contact messages for the organization
 * Retrieves all emails/messages sent through contact forms.
 * 
 * @function fetchEmails
 * @returns {Promise<EmailsResponse>} Promise resolving to paginated emails response
 * @throws {Error} When email retrieval fails or validation errors occur
 */
export const fetchEmails = async () => {
  try {
    const response = await axiosInstance.get(
      `${emailAPIendpoint}/emails/${OrganizationID}/`
    );
    
    const validation = PaginatedEmailResponseSchema.safeParse(response.data);
    if (!validation.success) {
      throw new Error('Email data validation failed');
    }
    
    return validation.data;
  } catch (error) {
    throw new Error(`Failed to fetch emails: ${error.message}`);
  }
};

/**
 * Creates a new contact message
 * Adds a new message to the organization's inbox.
 * 
 * @function createContactMessage
 * @param {CreateContactMessage} messageData - Contact message data
 * @returns {Promise<EmailData>} Promise resolving to created email
 * @throws {Error} When message creation fails or validation errors occur
 */
export const createContactMessage = async (messageData) => {
  try {
    // Validate input data
    const inputValidation = CreateEmailSchema.safeParse(messageData);
    if (!inputValidation.success) {
      console.error('📧 [CREATE-CONTACT] Input validation errors:', inputValidation.error.issues);
      throw new Error('Invalid contact message data');
    }

    const response = await axiosInstance.post(
      `${emailAPIendpoint}/add_email/${OrganizationID}/`,
      inputValidation.data
    );
    
    const validation = EmailSchema.safeParse(response.data);
    if (!validation.success) {
      throw new Error('Contact message response validation failed');
    }
        return validation.data;
  } catch (error) {
    throw new Error(`Failed to create contact message: ${error.message}`);
  }
};

/**
 * Updates an existing contact message
 * Modifies contact message details, typically used for marking as read.
 * 
 * @function updateContactMessage
 * @param {number} emailId - Email ID to update
 * @param {UpdateEmailData} updateData - Update data
 * @returns {Promise<EmailData>} Promise resolving to updated email
 * @throws {Error} When email update fails or validation errors occur
 */
export const updateContactMessage = async (emailId, updateData) => {
  try {
    if (!emailId) {
      throw new Error('Email ID is required');
    }

    // Validate input data
    const inputValidation = UpdateEmailSchema.safeParse(updateData);
    if (!inputValidation.success) {
      throw new Error('Invalid update data');
    }

    const response = await axiosInstance.patch(
      `${emailAPIendpoint}/email/update/${emailId}/`,
      inputValidation.data
    );
    
    const validation = EmailSchema.safeParse(response.data);
    if (!validation.success) {
      throw new Error('Email update response validation failed');
    }
    return validation.data;
  } catch (error) {
    console.error('📧 [UPDATE-CONTACT] Failed to update email:', error);
    throw new Error(`Failed to update email: ${error.message}`);
  }
};

/**
 * Deletes a contact message
 * Removes a contact message from the organization's inbox.
 * 
 * @function deleteEmail
 * @param {number} emailId - Email ID to delete
 * @returns {Promise<{message: string}>} Promise resolving to deleted email ID
 * @throws {Error} When email deletion fails
 */
export const deleteEmail = async (emailId) => {
  try {
    if (!emailId) {
      throw new Error('Email ID is required');
    }

    await axiosInstance.delete(`${emailAPIendpoint}/subscription/delete/${emailId}/`);
    return { message: 'Email deleted successfully' };
  } catch (error) {
    throw new Error(`Failed to delete email: ${error.message}`);
  }
};

// ======================== EMAIL RESPONSES MANAGEMENT ======================== //

/**
 * Fetches all responses to a specific contact message
 * Retrieves all replies/responses sent to a particular email inquiry.
 * 
 * @function getResponses
 * @param {EmailData} emailData - Email data containing the email ID
 * @returns {Promise<EmailResponseArray>} Promise resolving to email responses array
 * @throws {Error} When response retrieval fails or validation errors occur
 */
export const getResponses = async (emailData) => {
  try {
    if (!emailData?.id) {
      throw new Error('Email ID is required');
    }

    const response = await axiosInstance.get(
      `${emailAPIendpoint}/emails/${emailData.id}/responses/`
    );
    
    const validation = EmailResponsesSchema.safeParse(response.data);
    if (!validation.success) {
      throw new Error('Email responses validation failed');
    }
    return validation.data;
  } catch (error) {
    throw new Error(`Failed to fetch email responses: ${error.message}`);
  }
};

/**
 * Submits a response to a contact message
 * Creates and sends a reply to a customer inquiry with automatic email delivery.
 * 
 * @function submitResponse
 * @param {CreateEmailResponse} responseData - Response data to submit
 * @returns {Promise<EmailResponseData>} Promise resolving to created response
 * @throws {Error} When response submission fails or validation errors occur
 */
export const submitResponse = async (responseData) => {
  try {
    // Validate input data
    const inputValidation = CreateEmailResponseSchema.safeParse(responseData);
    if (!inputValidation.success) {
      throw new Error('Invalid response data');
    }

    const response = await axiosInstance.post(
      `${emailAPIendpoint}/emails/createresponse/`,
      inputValidation.data
    );
    
    const validation = EmailResponseSchema.safeParse(response.data);
    if (!validation.success) {
      throw new Error('Response submission validation failed');
    }
    return validation.data;
  } catch (error) {
    throw new Error(`Failed to submit response: ${error.message}`);
  }
};

// ======================== EMAIL MESSAGES MANAGEMENT ======================== //

/**
 * Fetches all sent email messages/newsletters
 * Retrieves all marketing emails and newsletters sent by the organization.
 * 
 * @function getSentEmails
 * @returns {Promise<EmailMessageArray>} Promise resolving to sent email messages array
 * @throws {Error} When sent emails retrieval fails or validation errors occur
 */
export const getSentEmails = async () => {
  try {
    const response = await axiosInstance.get(
      `${emailAPIendpoint}/emails/getsentemails/`
    );
    
    const validation = EmailMessagesSchema.safeParse(response.data);
    if (!validation.success) {
      throw new Error('Sent emails validation failed');
    }
    return validation.data;
  } catch (error) {
    throw new Error(`Failed to fetch sent emails: ${error.message}`);
  }
};

/**
 * Creates and sends email to all subscribers
 * Sends marketing emails/newsletters to all subscribers with automated delivery.
 * 
 * @function createEmail
 * @param {CreateEmailMessage} messageData - Email message data to send
 * @returns {Promise<EmailMessageData>} Promise resolving to created email message
 * @throws {Error} When email creation/sending fails or validation errors occur
 */
export const createEmail = async (messageData) => {
  try {
    // Validate input data
    const inputValidation = CreateEmailMessageSchema.safeParse(messageData);
    if (!inputValidation.success) {
      throw new Error('Invalid email message data');
    }

    // Get all subscribers first
    const allsubscriptions = await getAllSubscriptions();
    if (!allsubscriptions?.length) {
      throw new Error('No subscribers found to send email to');
    }
        
    // Send emails to all subscribers
    await Promise.all(
      allsubscriptions.map((subscription) =>
        sendMultipleEmails(subscription.email, inputValidation.data.body, inputValidation.data.subject)
      )
    );

    const response = await axiosInstance.post(
      `${emailAPIendpoint}/emails/createsendemails/`,
      inputValidation.data
    );
    
    const validation = EmailMessageSchema.safeParse(response.data);
    if (!validation.success) {
      throw new Error('Email creation response validation failed');
    }
    return validation.data;
  } catch (error) {
    throw new Error(`Failed to create/send email: ${error.message}`);
  }
};

/**
 * Updates an existing email message
 * Modifies email message details, typically for draft management.
 * 
 * @function updateEmailMessage
 * @param {number} messageId - Email message ID to update
 * @param {CreateEmailMessage} updateData - Update data
 * @returns {Promise<EmailMessageData>} Promise resolving to updated email message
 * @throws {Error} When email message update fails or validation errors occur
 */
export const updateEmailMessage = async (messageId, updateData) => {
  try {
    if (!messageId) {
      throw new Error('Email message ID is required');
    }

    // Validate input data
    const inputValidation = CreateEmailMessageSchema.safeParse(updateData);
    if (!inputValidation.success) {
      throw new Error('Invalid update data');
    }

    const response = await axiosInstance.patch(
      `${emailAPIendpoint}/emails/message/update/${messageId}/`,
      inputValidation.data
    );
    
    const validation = EmailMessageSchema.safeParse(response.data);
    if (!validation.success) {
      throw new Error('Email message update response validation failed');
    }
    return validation.data;
  } catch (error) {
    throw new Error(`Failed to update email message: ${error.message}`);
  }
};

/**
 * Deletes an email message
 * Removes an email message from the system.
 * 
 * @function deleteEmailMessage
 * @param {number} messageId - Email message ID to delete
 * @returns {Promise<number>} Promise resolving to deleted message ID
 * @throws {Error} When email message deletion fails
 */
export const deleteEmailMessage = async (messageId) => {
  try {
    if (!messageId) {
      throw new Error('Email message ID is required');
    }

    await axiosInstance.delete(`${emailAPIendpoint}/emails/message/delete/${messageId}/`);
    return messageId;
  } catch (error) {
    throw new Error(`Failed to delete email message: ${error.message}`);
  }
};


// ======================== SUBSCRIPTION MANAGEMENT ======================== //

/**
 * Fetches all email subscriptions for the organization
 * Retrieves all users subscribed to the organization's email list.
 * 
 * @function getAllSubscriptions
 * @returns {Promise<Array>} Promise resolving to subscriptions array
 * @throws {Error} When subscription retrieval fails or validation errors occur
 */
export const getAllSubscriptions = async () => {
  try {
    const response = await axiosInstance.get(
      `${emailAPIendpoint}/subscriptions/${OrganizationID}/`
    );
    
    const validation = SubscriptionArraySchema.safeParse(response.data);
    if (!validation.success) {
      throw new Error('Subscriptions validation failed');
    }
    return validation.data;
  } catch (error) {
    throw new Error(`Failed to fetch subscriptions: ${error.message}`);
  }
};

/**
 * Creates a new email subscription
 * Adds a user to the organization's email subscription list.
 * 
 * @function createSubscription
 * @param {Object} subscriptionData - Subscription data
 * @returns {Promise<Object>} Promise resolving to created subscription
 * @throws {Error} When subscription creation fails or validation errors occur
 */
export const createSubscription = async (subscriptionData) => {
  try {
    // Note: Validation schema will be implemented based on API requirements
    const response = await axiosInstance.post(
      `${emailAPIendpoint}/subscriptions/create/${OrganizationID}/`,
      subscriptionData
    );
    
    const validation = SubscriptionSchema.safeParse(response.data);
    if (!validation.success) {
      throw new Error('Subscription creation response validation failed');
    }
    return validation.data;
  } catch (error) {
    throw new Error(`Failed to create subscription: ${error.message}`);
  }
};

/**
 * Deletes an email subscription
 * Removes a user from the organization's email subscription list.
 * 
 * @function deleteSubscription
 * @param {number} subscriptionId - Subscription ID to delete
 * @returns {Promise<{message: string}>} Promise resolving to deleted subscription ID
 * @throws {Error} When subscription deletion fails
 */
export const deleteSubscription = async (subscriptionId) => {
  try {
    if (!subscriptionId) {
      throw new Error('Subscription ID is required');
    }

    await axiosInstance.delete(`${emailAPIendpoint}/subscriptions/delete/${subscriptionId}/`);
    return { message: `Subscription ${subscriptionId} deleted successfully` };
  } catch (error) {
    throw new Error(`Failed to delete subscription: ${error.message}`);
  }
};

// ======================== LEGACY FUNCTION ALIASES ======================== //

/**
 * @deprecated Use getAllSubscriptions instead
 * Legacy function for backward compatibility
 */
export const getallemails = getAllSubscriptions;

/**
 * @deprecated Use getSentEmails instead
 * Legacy function for backward compatibility
 */
export const getSentEmail = getSentEmails;

/**
 * @deprecated Use createContactMessage instead
 * Legacy function for backward compatibility
 */
export const sendMessage = createContactMessage;