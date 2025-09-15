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
import { User } from "@/types/users";
import { PaymentResponse } from "@/types/payments";
import { Service, ServiceUser } from "@/types/items";
import React from "react";
import { EmailResponse as EmailResponseType } from "@/types/emails";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

// Types for email functions
export interface EmailResponse {
  success: boolean;
  message: string;
  error?: string;
}

// ----------------------------------------
// Send email Verification
// ----------------------------------------
export const sendVerificationEmail = async (
  email: string,
  token: string,
  expire_time: string | Date
): Promise<EmailResponse> => {
  const confirmLink = `${process.env.NEXT_PUBLIC_URL}/accounts/new-verification?token=${token}`;
  const stringifiedDate = typeof expire_time === 'string' ? expire_time : expire_time.toISOString();
  try {
    await resend.emails.send({
      from: "ICCapp <onboarding@innovationscybercafe.com>", // Set your "from" email address
      to: email,
      subject: "Verify your email",
      react: React.createElement(VerificationEmail, { confirmLink, expire_time: stringifiedDate }),
      reply_to: "innovationscybercafe@gmail.com",
    });
    return {
      success: true,
      message:
        "We have sent you a verification email. Please check your inbox and click on the link to verify your email address.",
    };
  } catch (error: any) {
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
export const sendPasswordResetEmail = async (
  email: string,
  token: string
): Promise<EmailResponse> => {
  const resetLink = `${process.env.NEXT_PUBLIC_URL}/accounts/new-password?token=${token}`;

  try {
    await resend.emails.send({
      from: "ICCapp <onboarding@innovationscybercafe.com>",
      to: email,
      subject: "Reset your password",
      react: React.createElement(PasswordReset, { resetLink }),
      reply_to: "innovationscybercafe@gmail.com",
    });
    return {
      success: true,
      message:
        "We have sent you a password reset email. Please check your inbox and click on the link to reset your password.",
    };
  } catch (error: any) {
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
export const sendReplyEmail = async (
  response: EmailResponseType
): Promise<EmailResponse> => {
  const { response_message, response_subject, recipient_email } = response;
  try {
    await resend.emails.send({
      from: "ICCapp <admin@innovationscybercafe.com>",
      to: recipient_email,
      subject: response_subject,
      react: React.createElement(EmailResponse, { message: response_message }),
      reply_to: "innovationscybercafe@gmail.com",
    });
    return {
      success: true,
      message: "We have sent your message successfully.",
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to send message",
      error: error.message,
    };
  }
};

// ------------------------------------------------
// Send Bulk Emails to subscribers
// ------------------------------------------------
export const sendMultipleEmails = async (
  email: string | string[],
  message: string,
  subject: string,
  group: string = "admin"
): Promise<EmailResponse> => {
  try {
    await resend.emails.send({
      from: `ICCapp <${group}@innovationscybercafe.com>`,
      to: email,
      subject: subject,
      react: React.createElement(BulkEmail, { message }),
      reply_to: "innovationscybercafe@gmail.com",
    });
    return {
      success: true,
      message: "We have sent your message successfully.",
    };
  } catch (error: any) {
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
export const sendOnboardingMessage = async (user: User): Promise<EmailResponse> => {
  try {
    await resend.emails.send({
      from: `ICCapp <onboarding@innovationscybercafe.com>`,
      to: user.email,
      subject: `Welcome onboard ${user.username || user.first_name}`,
      react: React.createElement(Onboarding, { user }),
      reply_to: "innovationscybercafe@gmail.com",
    });
    return {
      success: true,
      message: "We have sent your message successfully.",
    };
  } catch (error: any) {
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
export const sendPaymentSuccessfulEmail = async (order: PaymentResponse): Promise<EmailResponse> => {
  try {
    if (!order.customer || !order.customer.email) {
      return {
        success: false,
        message: "Customer email is required for payment confirmation",
      };
    }

    await resend.emails.send({
      from: `ICCapp <customer@innovationscybercafe.com>`,
      to: order.customer.email,
      subject: "thank you for your Order",
      react: React.createElement(PaymentSuccesful, { order }),
      reply_to: "innovationscybercafe@gmail.com",
    });
    return {
      success: true,
      message: "We have sent your message successfully.",
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to send message",
      error: error.message,
    };
  }
};

// ------------------------------------------------
// Send Template Message for Payment Rejection
// ------------------------------------------------
export const sendPaymentRejectionMessage = async (order: PaymentResponse): Promise<EmailResponse> => {
  try {
    if (!order.customer?.email) {
      return {
        success: false,
        message: "Customer email is required for payment rejection notification",
      };
    }

    await resend.emails.send({
      from: `ICCapp <customer@innovationscybercafe.com>`,
      to: order.customer.email,
      subject: "Order Cancellation",
      react: React.createElement(PaymentRejection),
      reply_to: "innovationscybercafe@gmail.com",
    });
    return {
      success: true,
      message: "We have sent your message successfully.",
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to send message",
      error: error.message,
    };
  }
};



// ------------------------------------------------
// Send Template Message for Service Started
// ------------------------------------------------
export const sendServiceStartedEmail = async (service: Service, user: ServiceUser): Promise<EmailResponse> => {
  try {
    await resend.emails.send({
      from: `ICCapp <admin@innovationscybercafe.com>`,
      to: user.email,
      subject: "Service Started",
      react: React.createElement(ServiceStarted, { service, user }),
      reply_to: "innovationscybercafe@gmail.com",
    });
    return {
      success: true,
      message: "We have sent your message successfully.",
    };
  } catch (error: any) {
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
export const sendServiceCompletedEmail = async (service: Service, user: ServiceUser): Promise<EmailResponse> => {
  try {
    await resend.emails.send({
      from: `ICCapp <admin@innovationscybercafe.com>`,
      to: user.email,
      subject: "Service Completed",
      react: React.createElement(ServiceCompleted, { service, user }),
      reply_to: "innovationscybercafe@gmail.com",
    });
    return {
      success: true,
      message: "We have sent your message successfully.",
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to send message",
      error: error.message,
    };
  }
};
