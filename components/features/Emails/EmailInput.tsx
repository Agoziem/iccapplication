import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendReplyEmail } from "@/utils/mail";
import { emailResponseSchema } from "@/schemas/emails";
import { useState } from "react";
import Alert from "../../custom/Alert/Alert";
import { emailAPIendpoint, submitResponse } from "@/data/Emails/fetcher";
import { useQueryClient } from "react-query";

/**
 * @param {{message: Email}} props
 * @returns {JSX.Element}
 */
const EmailInput = ({ message }) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const queryClient = useQueryClient();

  // Initialize React Hook Form and connect it to Zod via zodResolver
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(emailResponseSchema), // Use Zod schema for validation
    mode: "onChange", // Validate on change
    defaultValues: {
      message: message.id || 1,
      recipient_email: message.email || "",
      response_subject: message.subject || "",
      response_message: "",
      created_at: "",
    },
  });

  /**
   * @async
   * @param {EmailResponse} data
   */
  const onSubmit = async (data) => {
    try {
      reset();
      const result = await sendReplyEmail(data);
      if (!result.error) {
        setSuccess(result.message);
        queryClient.invalidateQueries(["responses", message.id]);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError(error.message);
    }
    setTimeout(() => {
      setError("");
      setSuccess("");
    }, 3000);
  };

  return (
    <div>
      {success && <Alert type={"success"}>{success}</Alert>}
      {error && <Alert type={"danger"}>{error}</Alert>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <textarea
          className="form-control"
          placeholder="Type your response here..."
          rows={2}
          style={{
            border: "1.5px solid var(--bgDarkerColor)",
            background: "var(--bgDarkColor)",
            color: "white",
          }}
          // Use register to connect the textarea to React Hook Form
          {...register("response_message")}
        />
        {/* Error message */}
        {errors.response_message && (
          <p style={{ color: "red", fontSize: "12px" }}>
            {`${errors.response_message.message}`}
          </p>
        )}

        {/* Show button only if there is valid input */}
        {isValid && (
          <div className="d-flex justify-content-end mt-3">
            <button
              className="btn btn-primary rounded"
              type="submit"
              disabled={isSubmitting}
            >
              Send
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default EmailInput;
