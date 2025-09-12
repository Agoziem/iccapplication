"use client";
import React, { useState, useEffect } from "react";
import Alert from "@/components/custom/Alert/Alert";
import { CreateEmailSchema } from "@/schemas/emails";
import { useCreateEmail } from "@/data/hooks/email.hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMyProfile } from "@/data/hooks/user.hooks";
import { ORGANIZATION_ID } from "@/data/constants";
import { z } from "zod";

// Define the form data type from the schema
type ContactFormData = z.infer<typeof CreateEmailSchema>;

// Define alert types
type AlertType = "info" | "success" | "warning" | "danger";

const ContactForm = () => {
  const { data: session } = useMyProfile();
  const { mutate: createEmail, isLoading } = useCreateEmail();

  const [alert, setAlert] = useState<{
    type: AlertType;
    message: string;
    show: boolean;
  }>({
    type: "info",
    message: "",
    show: false,
  });

  // Initialize react-hook-form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
    watch,
  } = useForm<ContactFormData>({
    resolver: zodResolver(CreateEmailSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  // Auto-populate user data when session is available
  useEffect(() => {
    if (session) {
      setValue("name", session.first_name || session.username || "");
      setValue("email", session.email || "");
    }
  }, [session, setValue]);

  // Handle form submission
  const onSubmit = async (data: ContactFormData) => {
    createEmail(
      {
        organizationId: parseInt(ORGANIZATION_ID),
        messageData: data,
      },
      {
        onSuccess: () => {
          reset();
          setAlert({
            type: "success",
            message: "Message sent successfully! We'll get back to you soon.",
            show: true,
          });
          setTimeout(() => {
            setAlert({ type: "info", message: "", show: false });
          }, 5000);
        },
        onError: (error: any) => {
          setAlert({
            type: "danger",
            message: error?.message || "An error occurred. Please try again.",
            show: true,
          });
          setTimeout(() => {
            setAlert({ type: "info", message: "", show: false });
          }, 5000);
        },
      }
    );
  };
  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group my-4">
        <input
          type="text"
          className={`form-control ${errors.name ? "is-invalid" : ""}`}
          placeholder="Name"
          {...register("name")}
          required
        />
        {errors.name && (
          <div className="invalid-feedback">{errors.name.message}</div>
        )}
      </div>

      <div className="form-group my-4">
        <input
          type="email"
          className={`form-control ${errors.email ? "is-invalid" : ""}`}
          placeholder="Email"
          {...register("email")}
          required
        />
        {errors.email && (
          <div className="invalid-feedback">{errors.email.message}</div>
        )}
      </div>

      <div className="form-group my-4">
        <input
          type="text"
          className={`form-control ${errors.subject ? "is-invalid" : ""}`}
          placeholder="Subject"
          {...register("subject")}
          required
        />
        {errors.subject && (
          <div className="invalid-feedback">{errors.subject.message}</div>
        )}
      </div>

      <div className="form-group my-4">
        <textarea
          className={`form-control ${errors.message ? "is-invalid" : ""}`}
          placeholder="Message"
          rows={5}
          {...register("message")}
          required
        />
        {errors.message && (
          <div className="invalid-feedback">{errors.message.message}</div>
        )}
      </div>

      {alert.show && (
        <Alert type={alert.type} className="mb-2">
          {alert.message}
        </Alert>
      )}

      <button
        type="submit"
        className="btn btn-primary w-100 rounded"
        disabled={isSubmitting || isLoading}
      >
        {isSubmitting || isLoading ? "Sending message..." : "Send Message"}
      </button>
    </form>
  );
};

export default ContactForm;
