import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { WATemplateSchema } from "@/schemas/whatsapp";
import Alert from "../../custom/Alert/Alert";
import { useCreateTemplateMessage } from "@/data/whatsappAPI/whatsapp.hook";

/**
 * Enhanced WhatsApp Template Form with comprehensive validation and error handling
 * Handles creation of WhatsApp template messages with React Hook Form + Zod validation
 */
const WATemplateForm = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showLink, setShowLink] = useState(false);

  // Form schema for WhatsApp templates
  const formSchema = useMemo(() => 
    WATemplateSchema.pick({
      template: true,
      title: true,
      link: true,
      text: true,
    }),
    []
  );

  // Template options with proper validation
  const templateOptions = useMemo(() => [
    { value: "", label: "Select a Template type" },
    { value: "hello_world", label: "Hello World" },
    { value: "textonly", label: "Text Only" },
    { value: "textwithimage", label: "Text with Image" },
    { value: "textwithvideo", label: "Text with Video" },
    { value: "textwithaudio", label: "Text with Audio" },
    { value: "textwithdocument", label: "Text with Document" },
    { value: "textwithCTA", label: "Text with CTA" },
  ], []);

  const { mutateAsync: createTemplateMessage } = useCreateTemplateMessage();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      template: "",
      title: "",
      link: "",
      text: "",
    },
  });

  // Watch form values
  const selectedTemplate = watch("template");
  const formValues = watch();

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

  // Control link field visibility based on template type
  useEffect(() => {
    const textOnlyTemplates = ["textonly", "", "hello_world"];
    setShowLink(!textOnlyTemplates.includes(selectedTemplate));
  }, [selectedTemplate]);

  // Safe random ID generation
  const generateRandomId = useCallback(() => {
    try {
      const randomBuffer = new Uint32Array(1);
      window.crypto.getRandomValues(randomBuffer);
      const randomNumber = randomBuffer[0] / (0xffffffff + 1);
      return Math.floor(randomNumber * 900_000) + 100_000;
    } catch {
      // Fallback if crypto is not available
      return Math.floor(Math.random() * 900_000) + 100_000;
    }
  }, []);

  // Enhanced form submission with comprehensive error handling
  const onSubmit = useCallback(async (data) => {
    // Validate required fields
    if (!data.title?.trim()) {
      setError("Template title is required");
      return;
    }

    if (!data.template) {
      setError("Please select a template type");
      return;
    }

    // Validate link if required for template type
    if (showLink && data.template !== "textonly" && data.link && !isValidUrl(data.link)) {
      setError("Please enter a valid URL for the media link");
      return;
    }

    try {
      setError("");
      setSuccess("");

      // Prepare template data with validation
      const templateData = {
        ...data,
        id: generateRandomId(),
        status: "pending",
        created_at: new Date().toISOString(),
        // Ensure link is null if not needed
        link: showLink && data.link?.trim() ? data.link.trim() : null,
        // Ensure text is properly formatted
        text: data.text?.trim() || null,
      };

      await createTemplateMessage(templateData);
      
      setSuccess("WhatsApp template created and queued for broadcast!");
      
      // Reset form to default values
      reset({
        template: "",
        title: "",
        link: "",
        text: "",
      });
    } catch (error) {
      console.error("Error creating WhatsApp template:", error);
      setError(
        error.message || 
        "Failed to create WhatsApp template. Please check your input and try again."
      );
    }
  }, [createTemplateMessage, generateRandomId, reset, showLink]);

  // URL validation helper
  const isValidUrl = useCallback((string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  }, []);

  // Form validation status
  const isFormValid = useMemo(() => {
    const hasRequiredFields = formValues.title?.trim() && formValues.template;
    const hasValidLink = !showLink || !formValues.link || isValidUrl(formValues.link);
    return hasRequiredFields && hasValidLink && isValid;
  }, [formValues, showLink, isValid, isValidUrl]);

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
        {/* Title Input */}
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Template Title <span className="text-danger">*</span>
          </label>
          <input
            id="title"
            type="text"
            placeholder="Enter the template title"
            className={`form-control ${errors.title ? 'is-invalid' : ''}`}
            {...register("title")}
            disabled={isSubmitting}
          />
          {errors.title && (
            <div className="invalid-feedback">
              {errors.title.message}
            </div>
          )}
        </div>

        {/* Template Type Selection */}
        <div className="form-group">
          <label htmlFor="template" className="form-label">
            Template Type <span className="text-danger">*</span>
          </label>
          <select
            id="template"
            className={`form-select ${errors.template ? 'is-invalid' : ''}`}
            {...register("template")}
            disabled={isSubmitting}
          >
            {templateOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.template && (
            <div className="invalid-feedback">
              {errors.template.message}
            </div>
          )}
        </div>

        {/* Template Text */}
        <div className="form-group">
          <label htmlFor="text" className="form-label">
            Template Text
          </label>
          <textarea
            id="text"
            rows={4}
            placeholder="Enter the template message text (optional)"
            className={`form-control ${errors.text ? 'is-invalid' : ''}`}
            style={{ resize: "vertical" }}
            {...register("text")}
            disabled={isSubmitting}
          />
          {errors.text && (
            <div className="invalid-feedback">
              {errors.text.message}
            </div>
          )}
          <small className="form-text text-muted">
            {formValues.text?.length || 0} characters
          </small>
        </div>

        {/* Conditional Media Link Input */}
        {showLink && (
          <div className="form-group">
            <label htmlFor="link" className="form-label">
              Media Link
              {selectedTemplate !== "textwithCTA" && <small className="text-muted"> (optional)</small>}
            </label>
            <input
              id="link"
              type="url"
              placeholder="Enter the media URL (e.g., https://example.com/image.jpg)"
              className={`form-control ${errors.link ? 'is-invalid' : ''}`}
              {...register("link")}
              disabled={isSubmitting}
            />
            {errors.link && (
              <div className="invalid-feedback">
                {errors.link.message}
              </div>
            )}
            <small className="form-text text-muted">
              Must be a valid URL starting with http:// or https://
            </small>
          </div>
        )}

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
            "Create WhatsApp Template"
          )}
        </button>

        {/* Form validation status */}
        {!isFormValid && formValues.title && formValues.template && (
          <small className="text-warning">
            Please fix the validation errors above
          </small>
        )}
      </form>
    </div>
  );
};

export default WATemplateForm;
