import { createEmail, emailAPIendpoint } from "@/data/Emails/fetcher";
import { emailMessageSchema } from "@/schemas/emails";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Alert from "../../custom/Alert/Alert";
import { createEmailOptions } from "@/data/Emails/fetcherOptions";
import { useCreateEmail } from "@/data/Emails/emails.hook";

const EmailForm = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // -----------------------------------------------------------------
  // Initialize React Hook Form and connect it to Zod via zodResolver
  // -----------------------------------------------------------------
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(
      emailMessageSchema.omit({
        id: true,
        created_at: true,
        template: true,
        status: true,
      })
    ), // Use Zod schema for validation
    mode: "onChange", // Validate on change
    defaultValues: {
      subject: "",
      body: "",
    },
  });

  const getRandomInt = (min, max) => {
    const randomBuffer = new Uint32Array(1);
    window.crypto.getRandomValues(randomBuffer);
    const randomNumber = randomBuffer[0] / (0xffffffff + 1);
    return Math.floor(randomNumber * (max - min)) + min;
  };

  // --------------------------------------
  // Submit function to send the email
  // --------------------------------------
  const { mutateAsync: createEmail } = useCreateEmail();
  const onSubmit = async (data) => {
    try {
      setError("");
      setSuccess("");
      /** @type {EmailMessage} */
      const emailData = {
        ...data,
        id: getRandomInt(100_000, 1_000_000),
        created_at: new Date().toISOString(),
        status: "pending",
      };
      await createEmail(emailData);
      // Send the Email to the subscribed emails later
      setSuccess("Email sent successfully!");
      reset();
    } catch (error) {
      console.log(error);
      setError("Failed to send the email. Please try again.");
    } finally {
      setTimeout(() => {
        setError("");
        setSuccess("");
      }, 3000);
    }
  };

  return (
    <div
      className="container mx-auto"
      style={{
        width: "80vw",
        maxWidth: "350px",
      }}
    >
      <form
        className="d-flex flex-column gap-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Subject Input */}
        <div className="form-group">
          <label htmlFor="subject" className="block font-medium">
            Subject
          </label>
          <input
            id="subject"
            type="text"
            placeholder="Enter the email subject"
            className="form-control w-full"
            {...register("subject")}
          />
          {errors.subject && (
            <p className="text-danger text-sm">{errors.subject.message}</p>
          )}
        </div>

        {/* Body Input */}
        <div className="form-group">
          <label htmlFor="body" className="block font-medium">
            Body
          </label>
          <textarea
            id="body"
            rows={6}
            placeholder="Enter your message"
            className="form-control w-full"
            {...register("body")}
          />
          {errors.body && (
            <p className="text-danger text-sm">{errors.body.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`btn btn-primary mt-4 ${isSubmitting ? "loading" : ""}`}
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Email"}
        </button>

        {/* Error Message */}
        {error && <Alert type={"danger"}>{error}</Alert>}

        {/* Success Message */}
        {success && <Alert type={"success"}>{success}</Alert>}
      </form>
    </div>
  );
};

export default EmailForm;
