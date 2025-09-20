import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NotificationCreateSchema } from "@/schemas/notifications";
import Alert from "../../custom/Alert/Alert";
import {
  NotificationCreate,
  NotificationResponse,
} from "@/types/notifications";
import {
  useCreateNotification,
  useUpdateNotification,
} from "@/data/hooks/notifications.hooks";
import { imageSchema } from "@/schemas/custom-validation";
import ImageUploader from "@/components/custom/Imageuploader/ImageUploader";
import { useMyProfile } from "@/data/hooks/user.hooks";

type NotificationFormProps = {
  notification?: NotificationResponse;
  editmode: boolean;
  setEditMode: (value: boolean) => void;
  formRef: React.RefObject<HTMLFormElement | null>;
};

/**
 * Enhanced NotificationForm component with comprehensive validation and error handling
 * Optimized with React.memo for performance
 */
const NotificationForm: React.FC<NotificationFormProps> = React.memo(
  ({ notification, editmode, setEditMode, formRef }) => {
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const { data: user } = useMyProfile();

    const {
      register,
      handleSubmit,
      formState: { errors, isValid, isSubmitting },
      reset,
      watch,
      control,
    } = useForm<NotificationCreate>({
      resolver: zodResolver(NotificationCreateSchema),
      mode: "onChange",
      defaultValues: {
        title: "",
        message: "",
        image: "",
        sender: null,
        link: "",
        user_ids: [],
      },
    });

    // Watch form values
    const formValues = watch();

    // Reset form values when notification or editmode changes
    useEffect(() => {
      if (!user) return;
      if (editmode && notification) {
        reset({
          title: notification.title,
          message: notification.message,
          image: notification.image_url || "",
          sender: notification.sender.id || user.id,
          link: notification.link || "",
          user_ids:
            notification.recipients?.map((recipient) => recipient.id) || [],
        });
      } else {
        reset({
          title: "",
          message: "",
          image: "",
          sender: user.id,
          link: "",
          user_ids: [],
        });
      }
    }, [notification, editmode, reset, user]);

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

    // Mutation hooks
    const { mutateAsync: createNotification } = useCreateNotification();
    const { mutateAsync: updateNotification } = useUpdateNotification();

    // Enhanced form submission with comprehensive error handling
    const onSubmit = useCallback(
      async (data: NotificationCreate) => {
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
          };

          if (editmode) {
            if (!notification?.id) {
              throw new Error("Notification ID is required for updating");
            }
            await updateNotification({
              notificationId: notification.id,
              updateData: {
                ...notificationPayload,
                id: notification.id,
              },
            });
            setSuccess("Notification updated successfully!");
          } else {
            await createNotification(notificationPayload);
            setSuccess("Notification created successfully!");
          }

          // Reset form and exit edit mode
          setEditMode(false);
          reset();
        } catch (error: any) {
          console.error("Error processing notification:", error);
          setError(
            error.message ||
              `Failed to ${
                editmode ? "update" : "create"
              } notification. Please try again.`
          );
        }
      },
      [createNotification, updateNotification, editmode, setEditMode, reset]
    );

    // Cancel edit mode handler
    const handleCancel = useCallback(() => {
      reset();
      setEditMode(false);
      setError("");
      setSuccess("");
    }, [reset, setEditMode]);

    // Form validation status
    const isFormValid =
      formValues.title?.trim() && formValues.message?.trim() && isValid;

    return (
      <div
        className="container mx-auto py-2"
        style={{
          width: "80vw",
          maxWidth: "350px",
        }}
      >
        {/* Alert messages */}
        {success && <Alert type="success">{success}</Alert>}
        {error && <Alert type="danger">{error}</Alert>}

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
                  (ID: {notification?.id})
                </small>
              )}
            </h6>
          </div>

          {/* image uploader */}
          <div className="form-group">
            <label htmlFor="image" className="form-label">
              Notification Image
            </label>
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <ImageUploader
                  name="image"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="Upload notification image"
                />
              )}
            />
            {errors.image && (
              <div className="invalid-feedback">{errors.image.message}</div>
            )}
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
              className={`form-control ${errors.title ? "is-invalid" : ""}`}
              {...register("title")}
              disabled={isSubmitting}
            />
            {errors.title && (
              <div className="invalid-feedback">{errors.title.message}</div>
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
              className={`form-control ${errors.message ? "is-invalid" : ""}`}
              style={{ resize: "vertical" }}
              {...register("message")}
              disabled={isSubmitting}
            />
            {errors.message && (
              <div className="invalid-feedback">{errors.message.message}</div>
            )}
            <small className="form-text text-muted">
              {formValues.message?.length || 0} characters
            </small>
          </div>

          {/* Link Input  */}
          <div className="form-group">
            <label htmlFor="link" className="form-label">
              Notification Link
            </label>
            <input
              id="link"
              type="url"
              placeholder="Enter the notification link"
              className={`form-control ${errors.link ? "is-invalid" : ""}`}
              {...register("link")}
              disabled={isSubmitting}
            />
            {errors.link && (
              <div className="invalid-feedback">{errors.link.message}</div>
            )}
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
              ) : editmode ? (
                "Update Notification"
              ) : (
                "Create Notification"
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
  }
);

// Add display name for debugging
NotificationForm.displayName = "NotificationForm";

export default NotificationForm;
