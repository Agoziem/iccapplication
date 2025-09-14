import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateEmailMessageSchema } from "@/schemas/emails";
import { CreateEmailMessage } from "@/types/emails";
import Alert from "../../custom/Alert/Alert";
import { useCreateEmailMessage } from "@/data/hooks/email.hooks";

/**
 * Enhanced EmailForm component with comprehensive validation and error handling
 * Handles creation of email template messages with React Hook Form + Zod validation
 * Optimized with React.memo for performance
 */
const EmailForm: React.FC = React.memo(() => {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Initialize React Hook Form with enhanced validation
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
    watch,
  } = useForm<CreateEmailMessage>({
    resolver: zodResolver(CreateEmailMessageSchema),
    mode: "onChange",
    defaultValues: {
      subject: "",
      body: "",
      template: "",
    },
  });

  // Watch form values for validation feedback
  const formValues = watch();

  // Clear alerts after timeout with cleanup
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Enhanced form submission with comprehensive error handling
  const { mutateAsync: createEmailMessage } = useCreateEmailMessage();

  const onSubmit = useCallback(async (data: CreateEmailMessage) => {
    if (!data.subject?.trim()) {
      setError("Subject is required");
      return;
    }

    if (!data.body?.trim()) {
      setError("Message body is required");
      return;
    }

    try {
      setError("");
      setSuccess("");

      // Prepare email data with enhanced validation
      const emailData = {
        ...data,
        status: "pending",
        template: undefined, // Optional template field
      };

      await createEmailMessage(emailData);
      
      setSuccess("Email template created and queued for sending!");
      
      // Reset form to default values
      reset({
        subject: "",
        body: "",
      });
    } catch (error : any) {
      console.error("Error creating email template:", error);
      setError(
        error.message || 
        "Failed to create email template. Please check your input and try again."
      );
    }
  }, [createEmailMessage, reset]);

  // Form validation status
  const isFormValid = formValues.subject?.trim() && formValues.body?.trim() && isValid;

  return (
    <div
      className="container mx-auto"
      style={{
        width: "80vw",
        maxWidth: "350px",
      }}
    >
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

      <form
        className="d-flex flex-column gap-3"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        {/* Subject Input */}
        <div className="form-group">
          <label htmlFor="subject" className="form-label">
            Email Subject <span className="text-danger">*</span>
          </label>
          <input
            id="subject"
            type="text"
            placeholder="Enter the email subject"
            className={`form-control ${errors.subject ? 'is-invalid' : ''}`}
            {...register("subject")}
            disabled={isSubmitting}
          />
          {errors.subject && (
            <div className="invalid-feedback">
              {errors.subject.message}
            </div>
          )}
        </div>

        {/* Body Input */}
        <div className="form-group">
          <label htmlFor="body" className="form-label">
            Message Body <span className="text-danger">*</span>
          </label>
          <textarea
            id="body"
            rows={6}
            placeholder="Enter your email template message..."
            className={`form-control ${errors.body ? 'is-invalid' : ''}`}
            style={{ resize: "vertical" }}
            {...register("body")}
            disabled={isSubmitting}
          />
          {errors.body && (
            <div className="invalid-feedback">
              {errors.body.message}
            </div>
          )}
          
          {/* Character count helper */}
          <small className="form-text text-muted">
            {formValues.body?.length || 0} characters
          </small>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary mt-4"
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span 
                className="spinner-border spinner-border-sm me-2" 
                role="status" 
                aria-hidden="true"
              />
              Creating Template...
            </>
          ) : (
            "Create Email Template"
          )}
        </button>

        {/* Form validation status */}
        {!isFormValid && formValues.subject && formValues.body && (
          <small className="text-warning">
            Please fix the validation errors above
          </small>
        )}
      </form>
    </div>
  );
});

// Add display name for debugging
EmailForm.displayName = 'EmailForm';

export default EmailForm;
