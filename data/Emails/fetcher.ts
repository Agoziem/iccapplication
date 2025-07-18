import axios from "axios";
import type {
  Email,
  EmailArrays,
  EmailResponse,
  EmailResponseArray,
  EmailMessage,
  EmailMessageArray,
  Message,
} from "@/types/emails";
import type { Subscription, Subscriptions } from "@/types/organizations";
import { sendMultipleEmails } from "@/utils/mail";

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}`,
});

export const emailAPIendpoint = "/emailsapi";
const OrganizationID = process.env.NEXT_PUBLIC_ORGANIZATION_ID;

/**
 * Fetch all emails
 */
export const fetchEmails = async (): Promise<any> => {
  const response = await axiosInstance.get(
    `${emailAPIendpoint}/emails/${OrganizationID}/`
  );
  return response.data;
};

/**
 * Delete an email
 */
export const deleteEmail = async (emailid: number): Promise<number> => {
  await axiosInstance.delete(
    `${emailAPIendpoint}/subscription/delete/${emailid}/`
  );
  return emailid;
};

/**
 * Get responses to a message from the database
 */
export const getResponses = async (data: Email): Promise<any> => {
  const response = await axiosInstance.get(
    `${emailAPIendpoint}/emails/${data.id}/responses/`
  );
  return response.data;
};

/**
 * Submit response to database
 */
export const submitResponse = async (
  data: Omit<EmailResponse, "id" | "created_at">
): Promise<any> => {
  const response = await axiosInstance.post(
    `${emailAPIendpoint}/emails/createresponse/`,
    data
  );
  return response.data;
};

/**
 * Get sent emails
 */
export const getSentEmail = async (): Promise<any> => {
  const response = await axiosInstance.get(
    `${emailAPIendpoint}/emails/getsentemails/`
  );
  return response.data;
};

/**
 * Create and send emails to customers
 */
export const createEmail = async (
  data: Omit<EmailMessage, "id" | "created_at">
): Promise<any> => {
  const allsubscriptions = await getallemails();
  if (!allsubscriptions?.length) return;

  await Promise.all(
    allsubscriptions.map((subscription: Subscription) =>
      sendMultipleEmails(subscription.email, data.body, data.subject)
    )
  );

  const response = await axiosInstance.post(
    `${emailAPIendpoint}/emails/createsendemails/`,
    data
  );
  return response.data;
};

/**
 * Get all email subscriptions
 */
export const getallemails = async (): Promise<any> => {
  const response = await axiosInstance.get(
    `${emailAPIendpoint}/subscriptions/${OrganizationID}/`
  );
  return response.data;
};

/**
 * Send a message
 */
export const sendMessage = async (data: Message): Promise<any> => {
  const response = await axiosInstance.post(
    `${emailAPIendpoint}/add_email/${OrganizationID}/`,
    data
  );
  return response.data;
};
