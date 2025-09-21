import React, { useState, useCallback, useEffect, memo, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendReplyEmail } from "@/utils/mail";
import {
  CreateEmailResponseSchema,
  emailResponseSchema,
} from "@/schemas/emails";
import Alert from "../../custom/Alert/Alert";
import { useQueryClient } from "react-query";
import { Email, CreateEmailResponse } from "@/types/emails";
import { useCreateResponse } from "@/data/hooks/email.hooks";

interface EmailInputProps {
  message: Email;
}

/**
 * Enhanced EmailInput component with comprehensive error handling and validation
 */
const EmailInput: React.FC<EmailInputProps> = memo(({ message }) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const queryClient = useQueryClient();
  const { mutateAsync: saveEmailResponse } = useCreateResponse();

  // Safe message data extraction
  const messageData = useMemo(
    () => ({
      id: message?.id || null,
      email: message?.email || "",
      subject: message?.subject || "",
    }),
    [message]
  );

  // Initialize React Hook Form with enhanced validation
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
    watch,
  } = useForm<CreateEmailResponse>({
    resolver: zodResolver(CreateEmailResponseSchema),
    mode: "onChange",
    defaultValues: {
      message: undefined,
      recipient_email: "",
      response_subject: "",
      response_message: "",
    },
  });

  // Watch for changes in response_message to show/hide send button
  const responseMessage = watch("response_message");

  // set the other details
  useEffect(() => {
    if (messageData) {
      reset({
        message: messageData.id || undefined,
        recipient_email: messageData.email || undefined,
        response_subject: messageData.subject
          ? `Re: ${messageData.subject}`
          : undefined,
        response_message: "",
      });
    }
  }, [messageData, reset]);

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
   */
  const onSubmit = useCallback(
    async (data: CreateEmailResponse) => {
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

        // Enhance data with proper typing for the API
        const enhancedData: CreateEmailResponse = {
          ...data,
          message: messageData.id,
        };

        const result = await sendReplyEmail(enhancedData);

        if (result && !result.error) {
          try {
            const saveResult = await saveEmailResponse(enhancedData);
            if (saveResult) {
              setSuccess(result.message || "Response sent successfully!");
              reset();
            }
          } catch (error) {
            console.error("Error saving email response:", error);
            setError(
              "Response sent but failed to save record. Please check the responses list."
            );
          }
        } else {
          setError(result?.message || "Failed to send response");
        }
      } catch (error) {
        console.error("Error sending email response:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while sending your response. Please try again.";
        setError(errorMessage);
      }
    },
    [messageData, queryClient, reset]
  );

  // Don't render if no message data
  if (!messageData.id) {
    return (
      <div className="alert alert-warning">
        <small>Cannot reply: No message selected</small>
      </div>
    );
  }

  // Loading state during submission
  if (isSubmitting) {
    return (
      <div className="d-flex justify-content-center align-items-center py-4">
        <div className="spinner-border text-primary me-2" role="status">
          <span className="visually-hidden">Sending response...</span>
        </div>
        <span>Sending your response...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Alert messages */}
      {success && <Alert type="success">{success}</Alert>}
      {error && <Alert type="danger">{error}</Alert>}

      {/* Reply form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Hidden fields for form data */}
        <input type="hidden" {...register("message")} />
        <input type="hidden" {...register("recipient_email")} />
        <input type="hidden" {...register("response_subject")} />

        {/* Reply textarea */}
        <div className="mb-3">
          <label
            htmlFor="response_message"
            className="form-label visually-hidden"
          >
            Response Message
          </label>
          <textarea
            id="response_message"
            className={`form-control ${
              errors.response_message ? "is-invalid" : ""
            }`}
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
            Replying to:{" "}
            <strong className="text-primary">{messageData.email}</strong>
            {messageData.subject && (
              <>
                {" "}
                • Subject:{" "}
                <strong className="text-primary">
                  Re: {messageData.subject}
                </strong>
              </>
            )}
          </small>
        </div>
      </form>
    </div>
  );
});

EmailInput.displayName = "EmailInput";

export default EmailInput;
