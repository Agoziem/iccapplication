"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Alert from "@/components/custom/Alert/Alert";
import { useCreateEmail, useSendMessage } from "@/data/emails.hook";
import { Organization } from "@/types/items";

interface ContactFormProps {
  OrganizationData?: Organization;
}

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Email address is invalid"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Your message is required"),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface AlertState {
  type: string;
  message: string;
  show: boolean;
}

const ContactForm: React.FC<ContactFormProps> = ({ OrganizationData }) => {
  const { data: session } = useSession();
  const [alert, setAlert] = useState<AlertState>({
    type: "",
    message: "",
    show: false,
  });
  const { mutate } = useSendMessage();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  useEffect(() => {
    if (session) {
      setValue("name", session.user.name || session.user.username || "");
      setValue("email", session.user.email || "");
    }
  }, [session, setValue]);

  const onSubmit = async (data: ContactFormData): Promise<void> => {
    mutate(data, {
      onSuccess: () => {
        reset();
        setAlert({
          type: "success",
          message: "Message sent successfully",
          show: true,
        });
        setTimeout(() => {
          setAlert({ type: "", message: "", show: false });
        }, 3000);
      },
      onError: (error) => {
        setAlert({
          type: "danger",
          message: "An error occurred. Please try again.",
          show: true,
        });
        setTimeout(() => {
          setAlert({ type: "", message: "", show: false });
        }, 3000);
      },
    });
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
          {...register("message")}
          required
        ></textarea>
        {errors.message && (
          <div className="invalid-feedback">{errors.message.message}</div>
        )}
      </div>
      {alert.show && (
        <Alert type={alert.type as any} className="mb-2">
          {alert.message}
        </Alert>
      )}
      <button
        type="submit"
        className="btn btn-primary w-100 rounded"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending message..." : "Send Message"}
      </button>
    </form>
  );
};

export default ContactForm;
