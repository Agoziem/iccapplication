import axios from "axios";
import {
  emailMessagesArraySchema,
  emailMessageSchema,
  emailResponseArraySchema,
  emailResponseSchema,
  emailsResponseSchema,
} from "@/schemas/emails";
import { subscriptionArraySchema, subscriptionSchema } from "@/schemas/organizations";
import { sendMultipleEmails } from "@/utils/mail";

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}`,
});

export const emailAPIendpoint = "/emailsapi";

const OrganizationID = process.env.NEXT_PUBLIC_ORGANIZATION_ID

// fetch all the emails
export const fetchEmails = async () => {
  const response = await axiosInstance.get(
    `${emailAPIendpoint}/emails/${OrganizationID}/`
  );
  const validation = emailsResponseSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};


/**
 * @async
 * @param {number} emailid
 * @returns {Promise<number>}
 */
export const deleteEmail = async (emailid) => {
  await axiosInstance.delete(`${emailAPIendpoint}/subscription/delete/${emailid}/`);
  return emailid;
};

/**
 * fetches all Responses to a Message from the database
 * @async
 * @param {Email} data
 * @returns {Promise<EmailResponseArray>}
 */
export const getResponses = async (data) => {
  const response = await axiosInstance.get(
    `${emailAPIendpoint}/emails/${data.id}/responses/`
  );
  const validation = emailResponseArraySchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * submits Responses to database and updates the Ui optimistically
 * @async
 * @param {EmailResponse} data
 * @returns {Promise<EmailResponse>}
 */
export const submitResponse = async (data) => {
  const response = await axiosInstance.post(
    `${emailAPIendpoint}/emails/createresponse/`,
    data
  );
  const validation = emailResponseSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

export const getSentEmail = async () => {
  const response = await axiosInstance.get(
    `${emailAPIendpoint}/emails/getsentemails/`
  );
  const validation = emailMessagesArraySchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * create and send emails to the customers
 * @async
 * @param {EmailMessage} data
 * @returns {Promise<EmailMessage>}
 */
export const createEmail = async (data) => {
  const allsubscriptions = await getallemails();
  if (!allsubscriptions?.length) return;
  
  await Promise.all(
    allsubscriptions.map((subscription) =>
      sendMultipleEmails(subscription.email, data.body, data.subject)
    )
  );

  const response = await axiosInstance.post(
    `${emailAPIendpoint}/emails/createsendemails/`,
    data
  );
  const validation = emailMessageSchema.safeParse(response.data);
  if (!validation.success) {
    console.error(validation.error.issues);
    throw new Error("Email validation failed.");
  }

  return validation.data;
};



export const getallemails = async () => {
  const response = await axiosInstance.get(
    `${emailAPIendpoint}/subscriptions/${OrganizationID}/`
  );
  const validation = subscriptionArraySchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
}

/**
 * @async
 * @param {Message} data
 */
export const sendMessage = async (data) => {
  const response = await axiosInstance.post(
    `${emailAPIendpoint}/add_email/${OrganizationID}/`,
    data
  );
  return response.data;
}