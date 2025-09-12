import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { notificationSchema } from "@/schemas/notifications";
import Alert from "../../custom/Alert/Alert";
import { useCreateNotification, useUpdateNotification } from "@/data/notificationsAPI/notification.hook";

/**
 * Enhanced NotificationForm component with comprehensive validation and error handling
 * @param {{ 
 *   notification: NotificationMessage; 
 *   editmode: boolean; 
 *   setEditMode: (value: boolean) => void; 
 *   formRef: React.RefObject<HTMLFormElement>; 
 * }} props
 * @returns {JSX.Element}
 */
const NotificationForm = ({ notification, editmode, setEditMode, formRef }) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Safe notification data extraction
  const notificationData = useMemo(() => {
    if (!editmode || !notification) return null;
    return {
      id: notification.id || null,
      title: notification.title || "",
      message: notification.message || "",
      created_at: notification.created_at || null,
    };
  }, [notification, editmode]);

  // Default form values
  const defaultNotificationValues = useMemo(() => ({
    title: "",
    message: "",
  }), []);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(notificationSchema),
    mode: "onChange",
    defaultValues: defaultNotificationValues,
  });

  // Watch form values
  const formValues = watch();

  // Reset form values when notification or editmode changes
  useEffect(() => {
    if (editmode && notificationData) {
      reset({
        title: notificationData.title,
        message: notificationData.message,
      });
    } else {
      reset(defaultNotificationValues);
    }
  }, [notificationData, editmode, reset, defaultNotificationValues]);

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

  // Mutation hooks
  const { mutateAsync: createNotification } = useCreateNotification();
  const { mutateAsync: updateNotification } = useUpdateNotification();

  // Enhanced form submission with comprehensive error handling
  const onSubmit = useCallback(async (data) => {
    // Validate required fields
    if (!data.title?.trim()) {
      setError("Notification title is required");
      return;
    }

    if (!data.message?.trim()) {
      setError("Notification message is required");
      return;
    }

    try {
      setError("");
      setSuccess("");

      const notificationPayload = {
        ...data,
        title: data.title.trim(),
        message: data.message.trim(),
        id: editmode && notificationData?.id 
          ? notificationData.id 
          : generateRandomId(),
        created_at: editmode && notificationData?.created_at
          ? notificationData.created_at
          : new Date().toISOString(),
        viewed: false,
      };

      if (editmode) {
        await updateNotification(notificationPayload);
        setSuccess("Notification updated successfully!");
      } else {
        await createNotification(notificationPayload);
        setSuccess("Notification created successfully!");
      }

      // Reset form and exit edit mode
      setEditMode(false);
      reset(defaultNotificationValues);
      
    } catch (error) {
      console.error("Error processing notification:", error);
      setError(
        error.message ||
        `Failed to ${editmode ? "update" : "create"} notification. Please try again.`
      );
    }
  }, [
    createNotification, 
    updateNotification, 
    editmode, 
    notificationData, 
    generateRandomId, 
    setEditMode, 
    reset, 
    defaultNotificationValues
  ]);

  // Cancel edit mode handler
  const handleCancel = useCallback(() => {
    reset(defaultNotificationValues);
    setEditMode(false);
    setError("");
    setSuccess("");
  }, [reset, defaultNotificationValues, setEditMode]);

  // Form validation status
  const isFormValid = formValues.title?.trim() && formValues.message?.trim() && isValid;

  return (
    <div
      className="container mx-auto py-2"
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
        <Alert type="danger" >
          {error}
        </Alert>
      )}

      <form
        ref={formRef}
        className="d-flex flex-column gap-3"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        {/* Form Header */}
        <div>
          <h6>
            {editmode ? "Edit Notification" : "Create Notification"}
            {editmode && (
              <small className="text-muted ms-2">
                (ID: {notificationData?.id})
              </small>
            )}
          </h6>
        </div>

        {/* Title Input */}
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Notification Title <span className="text-danger">*</span>
          </label>
          <input
            id="title"
            type="text"
            placeholder="Enter the notification title"
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

        {/* Message Input */}
        <div className="form-group">
          <label htmlFor="message" className="form-label">
            Notification Message <span className="text-danger">*</span>
          </label>
          <textarea
            id="message"
            rows={6}
            placeholder="Enter your notification message"
            className={`form-control ${errors.message ? 'is-invalid' : ''}`}
            style={{ resize: "vertical" }}
            {...register("message")}
            disabled={isSubmitting}
          />
          {errors.message && (
            <div className="invalid-feedback">
              {errors.message.message}
            </div>
          )}
          <small className="form-text text-muted">
            {formValues.message?.length || 0} characters
          </small>
        </div>

        {/* Action Buttons */}
        <div className="d-flex flex-column flex-md-row justify-content-end gap-2">
          {editmode && (
            <button
              type="button"
              className="btn btn-secondary rounded"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="btn btn-primary rounded"
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span 
                  className="spinner-border spinner-border-sm me-2" 
                  role="status" 
                  aria-hidden="true"
                />
                {editmode ? "Updating..." : "Creating..."}
              </>
            ) : (
              editmode ? "Update Notification" : "Create Notification"
            )}
          </button>
        </div>

        {/* Form validation status */}
        {!isFormValid && formValues.title && formValues.message && (
          <small className="text-warning">
            Please fix the validation errors above
          </small>
        )}
      </form>
    </div>
  );
};



export default NotificationForm;
