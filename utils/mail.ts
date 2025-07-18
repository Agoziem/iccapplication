"use server";

import BulkEmail from "@/components/blocks/Templates/BulkEmail";
import EmailResponse from "@/components/blocks/Templates/EmailResponse";
import Onboarding from "@/components/blocks/Templates/Onboarding";
import PasswordReset from "@/components/blocks/Templates/PasswordReset";
import PaymentRejection from "@/components/blocks/Templates/PaymentRejection";
import PaymentSuccesful from "@/components/blocks/Templates/PaymentSuccesful";
import ServiceCompleted from "@/components/blocks/Templates/ServiceCompleted";
import ServiceStarted from "@/components/blocks/Templates/ServiceStarted";
import VerificationEmail from "@/components/blocks/Templates/VerificationEmail";
import { Resend } from "resend";
const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

// ----------------------------------------
// Send email Verification
// ----------------------------------------
export const sendVerificationEmail = async (email, token) => {
  const confirmLink = `${process.env.NEXT_PUBLIC_URL}/accounts/new-verification?token=${token}`;

  try {
    await resend.emails.send({
      from: "ICCapp <onboarding@innovationscybercafe.com>", // Set your "from" email address
      to: email,
      subject: "Verify your email",
      react: <VerificationEmail confirmLink={confirmLink} />,
      reply_to: "innovationscybercafe@gmail.com",
    });
    return {
      success: true,
      message:
        "We have sent you a verification email. Please check your inbox and click on the link to verify your email address.",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to send verification email",
      error: error.message,
    };
  }
};

// ----------------------------------------
// Send Password Reset Email
// ----------------------------------------
export const sendPasswordResetEmail = async (email, token) => {
  const resetLink = `${process.env.NEXT_PUBLIC_URL}/accounts/new-password?token=${token}`;

  try {
    await resend.emails.send({
      from: "ICCapp <onboarding@innovationscybercafe.com>",
      to: email,
      subject: "Reset your password",
      react: <PasswordReset resetLink={resetLink} />,
      reply_to: "innovationscybercafe@gmail.com",
    });
    return {
      success: true,
      message:
        "We have sent you a password reset email. Please check your inbox and click on the link to reset your password.",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to send password reset email",
      error: error.message,
    };
  }
};

// ------------------------------------------------
// Send Email Response
// ------------------------------------------------
/**
 * @async
 * @param {EmailResponse} response
 */
export const sendReplyEmail = async (response) => {
  const { response_message, response_subject, recipient_email } = response;
  try {
    await resend.emails.send({
      from: "ICCapp <admin@innovationscybercafe.com>",
      to: recipient_email,
      subject: response_subject,
      react: <EmailResponse message={response_message} />,
      reply_to: "innovationscybercafe@gmail.com",
    });
    return {
      success: true,
      message: "We have sent your message successfully.",
    };
  } catch (error) {
    return {
      error: true,
      message: "Failed to send message",
    };
  }
};

// ------------------------------------------------
// Send Bulk Emails to subscribers
// ------------------------------------------------
export const sendMultipleEmails = async (
  email,
  message,
  subject,
  group = "admin"
) => {
  try {
    await resend.emails.send({
      from: `ICCapp <${group}@innovationscybercafe.com>`,
      to: email,
      subject: subject,
      react: <BulkEmail message={message} />,
      reply_to: "innovationscybercafe@gmail.com",
    });
    return {
      success: true,
      message: "We have sent your message successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to send message",
      error: error.message,
    };
  }
};

// ------------------------------------------------
// Send Template Message for Onboarding User
// ------------------------------------------------

/**
 * @async
 * @param {User} user
 */
export const sendOnboardingMessage = async (user) => {
  try {
    await resend.emails.send({
      from: `ICCapp <onboarding@innovationscybercafe.com>`,
      to: user.email,
      subject: `Welcome onboard ${user.username || user.first_name}`,
      react: <Onboarding user={user} />,
      reply_to: "innovationscybercafe@gmail.com",
    });
    return {
      success: true,
      message: "We have sent your message successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to send message",
      error: error.message,
    };
  }
};

// ------------------------------------------------
// Send Template Message for Payment Successful
// ------------------------------------------------

/**
 * @async
 * @param {Order} order
 */
export const sendPaymentSuccessfulEmail = async (order) => {
  try {
    await resend.emails.send({
      from: `ICCapp <customer@innovationscybercafe.com>`,
      to: order.customer.email,
      subject: "thank you for your Order",
      react: <PaymentSuccesful order={order} />,
      reply_to: "innovationscybercafe@gmail.com",
    });
    return {
      success: true,
      message: "We have sent your message successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to send message",
      error: error.message,
    };
  }
};

// ------------------------------------------------
// Send Template Message for Payment Successful
// ------------------------------------------------

/**
 * @async
 * @param {Order} order
 */
export const sendPaymentRejectionMessage = async (order) => {
  try {
    await resend.emails.send({
      from: `ICCapp <customer@innovationscybercafe.com>`,
      to: order.customer.email,
      subject: "Order Cancellation",
      react: <PaymentRejection />,
      reply_to: "innovationscybercafe@gmail.com",
    });
    return {
      success: true,
      message: "We have sent your message successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to send message",
      error: error.message,
    };
  }
};



// ------------------------------------------------
// Send Template Message for Service Completed
// ------------------------------------------------

/**
 * @async
 * @param {Service} service
 * @param {ServiceUser} user
 */
export const sendServiceStartedEmail = async (service, user) => {
  try {
    await resend.emails.send({
      from: `ICCapp <admin@innovationscybercafe.com>`,
      to: user.email,
      subject: "Service Started",
      react: <ServiceStarted service={service} user={user} />,
      reply_to: "innovationscybercafe@gmail.com",
    });
    return {
      success: true,
      message: "We have sent your message successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to send message",
      error: error.message,
    };
  }
};


// ------------------------------------------------
// Send Template Message for Service Completed
// ------------------------------------------------

/**
 * @async
 * @param {Service} service
 * @param {ServiceUser} user
 */
export const sendServiceCompletedEmail = async (service, user) => {
  try {
    await resend.emails.send({
      from: `ICCapp <admin@innovationscybercafe.com>`,
      to: user.email,
      subject: "Service Completed",
      react: <ServiceCompleted service={service} user={user} />,
      reply_to: "innovationscybercafe@gmail.com",
    });
    return {
      success: true,
      message: "We have sent your message successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to send message",
      error: error.message,
    };
  }
};
