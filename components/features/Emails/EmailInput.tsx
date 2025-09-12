import React, { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendReplyEmail } from "@/utils/mail";
import { emailResponseSchema } from "@/schemas/emails";
import Alert from "../../custom/Alert/Alert";
import { emailAPIendpoint, submitResponse } from "@/data/hooks/email.hooks";
import { useQueryClient } from "react-query";

/**
 * Enhanced EmailInput component with comprehensive error handling and validation
 * @param {{message: Email}} props
 * @returns {JSX.Element}
 */
const EmailInput = ({ message }) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const queryClient = useQueryClient();

  // Safe message data extraction
  const messageData = {
    id: message?.id || null,
    email: message?.email || "",
    subject: message?.subject || "",
  };

  // Initialize React Hook Form with enhanced validation
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(emailResponseSchema),
    mode: "onChange",
    defaultValues: {
      message: messageData.id,
      recipient_email: messageData.email,
      response_subject: messageData.subject ? `Re: ${messageData.subject}` : "",
      response_message: "",
      created_at: new Date().toISOString(),
    },
  });

  // Watch for changes in response_message to show/hide send button
  const responseMessage = watch("response_message");

  // Clear alerts after timeout
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  /**
   * Enhanced form submission with comprehensive error handling
   * @param {EmailResponse} data - Form data
   */
  const onSubmit = useCallback(async (data) => {
    if (!messageData.id) {
      setError("Cannot send reply: Invalid message ID");
      return;
    }

    if (!messageData.email) {
      setError("Cannot send reply: No recipient email");
      return;
    }

    try {
      setError("");
      setSuccess("");

      // Enhance data with current timestamp
      const enhancedData = {
        ...data,
        created_at: new Date().toISOString(),
        message: messageData.id,
      };

      const result = await sendReplyEmail(enhancedData);
      
      if (result && !result.error) {
        setSuccess(result.message || "Response sent successfully!");
        reset({
          message: messageData.id,
          recipient_email: messageData.email,
          response_subject: messageData.subject ? `Re: ${messageData.subject}` : "",
          response_message: "",
          created_at: new Date().toISOString(),
        });
        
        // Invalidate queries to refresh the UI
        await queryClient.invalidateQueries(["responses", messageData.id]);
      } else {
        setError(result?.message || "Failed to send response");
      }
    } catch (error) {
      console.error("Error sending email response:", error);
      setError(
        error.message || 
        "An unexpected error occurred while sending your response. Please try again."
      );
    }
  }, [messageData, queryClient, reset]);

  // Don't render if no message data
  if (!messageData.id) {
    return (
      <div className="alert alert-warning">
        <small>Cannot reply: No message selected</small>
      </div>
    );
  }

  return (
    <div>
      {/* Alert messages */}
      {success && (
        <Alert type="success">
          {success}
        </Alert>
      )}
      {error && (
        <Alert type="danger">
          {error}
        </Alert>
      )}

      {/* Reply form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Hidden fields for form data */}
        <input type="hidden" {...register("message")} />
        <input type="hidden" {...register("recipient_email")} />
        <input type="hidden" {...register("response_subject")} />
        <input type="hidden" {...register("created_at")} />

        {/* Reply textarea */}
        <div className="mb-3">
          <label htmlFor="response_message" className="form-label visually-hidden">
            Response Message
          </label>
          <textarea
            id="response_message"
            className={`form-control ${errors.response_message ? 'is-invalid' : ''}`}
            placeholder="Type your response here..."
            rows={4}
            style={{
              border: "1.5px solid var(--bgDarkerColor)",
              background: "var(--bgDarkColor)",
              color: "white",
              resize: "vertical",
            }}
            {...register("response_message")}
            disabled={isSubmitting}
          />
          
          {/* Validation error */}
          {errors.response_message && (
            <div className="invalid-feedback d-block">
              {errors.response_message.message}
            </div>
          )}
        </div>

        {/* Send button - show only if there is valid input and not submitting */}
        {responseMessage?.trim() && isValid && (
          <div className="d-flex justify-content-end">
            <button
              className="btn btn-primary rounded"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span 
                    className="spinner-border spinner-border-sm me-2" 
                    role="status" 
                    aria-hidden="true"
                  />
                  Sending...
                </>
              ) : (
                "Send Response"
              )}
            </button>
          </div>
        )}

        {/* Recipient info */}
        <div className="mt-2">
          <small className="text-muted">
            Replying to: <strong>{messageData.email}</strong>
            {messageData.subject && (
              <> • Subject: <strong>Re: {messageData.subject}</strong></>
            )}
          </small>
        </div>
      </form>
    </div>
  );
};

export default EmailInput;
