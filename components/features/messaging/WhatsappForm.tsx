import { WATemplateSchema } from "@/schemas/whatsapp";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Alert from "../../custom/Alert/Alert";
import { createTemplateMessageOptions } from "@/data/whatsappAPI/fetcherOptions";
import { useCreateTemplateMessage } from "@/data/whatsappAPI/whatsapp.hook";

const WATemplateForm = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showLink, setShowLink] = useState(false);

  const { mutateAsync: createTemplateMessage } = useCreateTemplateMessage();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
    watch, // Watch the value of template
  } = useForm({
    resolver: zodResolver(
      WATemplateSchema.pick({
        template: true,
        title: true,
        link: true,
        text: true,
      })
    ), // Use Zod schema for validation
    mode: "onChange", // Validate on change
    defaultValues: {
      template: "",
      title: "",
      link: "",
      text: "",
    },
  });

  const getRandomInt = (min, max) => {
    const randomBuffer = new Uint32Array(1);
    window.crypto.getRandomValues(randomBuffer);
    const randomNumber = randomBuffer[0] / (0xffffffff + 1);
    return Math.floor(randomNumber * (max - min)) + min;
  };

  const onSubmit = async (data) => {
    try {
      setError("");
      setSuccess("");
      /**
       * @type {WATemplate}
       */
      const templateData = {
        ...data,
        id: getRandomInt(100_000, 1_000_000),
        status: "pending",
        created_at: new Date().toISOString(),
      };
      await createTemplateMessage(templateData)
      setSuccess("WA Broadcast sent successfully!");
      reset();
    } catch (error) {
      console.log(error);
      setError("Failed to send WA Broadcast. Please try again.");
    } finally {
      setTimeout(() => {
        setError("");
        setSuccess("");
      }, 3000);
    }
  };

  // Watch the value of the "template" field
  const selectedTemplate = watch("template");

  // Set the showLink state based on the selected template
  useEffect(() => {
    if (selectedTemplate === "textonly" || selectedTemplate === "") {
      setShowLink(false);
    } else {
      setShowLink(true);
    }
  }, [selectedTemplate]); // Effect triggers when selectedTemplate changes

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
        {/* Title Input */}
        <div className="form-group">
          <label htmlFor="title" className="block font-medium">
            Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="Enter the Template title"
            className="form-control w-full"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-danger small">{errors.title.message}</p>
          )}
        </div>

        {/* Template Input as a Select Dropdown */}
        <div className="form-group">
          <label htmlFor="template" className="block font-medium">
            Template
          </label>
          <select
            id="template"
            className="form-select w-full"
            {...register("template")}
          >
            <option value="">Select a Template type</option>
            <option value="hello_world">Hello World</option>
            <option value="textonly">Text Only</option>
            <option value="textwithimage">Text with Image</option>
            <option value="textwithvideo">Text with Video</option>
            <option value="textwithaudio">Text with Audio</option>
            <option value="textwithdocument">Text with Document</option>
            <option value="textwithCTA">Text with CTA</option>
          </select>
          {errors.template && (
            <p className="text-danger small">{errors.template.message}</p>
          )}
        </div>

        {/* Text Input */}
        <div className="form-group">
          <label htmlFor="text" className="block font-medium">
            Template Text
          </label>
          <textarea
            id="text"
            rows={6}
            placeholder="Enter the Template text (Optional)"
            className="form-control w-full"
            {...register("text")}
          />
          {errors.text && (
            <p className="text-danger small">{errors.text.message}</p>
          )}
        </div>

        {/* Conditionally render the Link input based on showLink */}
        {showLink && (
          <div className="form-group">
            <label htmlFor="link" className="block font-medium">
              Link
            </label>
            <input
              id="link"
              type="text"
              placeholder="Enter the Template Media link (Optional)"
              className="form-control w-full"
              {...register("link")}
            />
            {errors.link && (
              <p className="text-danger small">{errors.link.message}</p>
            )}
          </div>
        )}

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

export default WATemplateForm;
