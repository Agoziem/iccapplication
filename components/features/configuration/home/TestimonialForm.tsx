import ImageUploader from "@/components/custom/Imageuploader/ImageUploader";
import React from "react";

interface Testimony {
  id?: number;
  name: string;
  message: string;
  [key: string]: any;
}

interface AddOrUpdateMode {
  type: string;
  state: boolean;
}

interface TestimonialFormProps {
  addorupdate: AddOrUpdateMode;
  testimonial: Testimony;
  setTestimonial: (value: Testimony | Record<string, any>) => void;
  onSubmit: (testimonial: Testimony) => void;
  onClose: () => void;
  loading: boolean;
}

const TestimonialForm: React.FC<TestimonialFormProps> = ({
  addorupdate,
  testimonial,
  setTestimonial,
  onSubmit,
  onClose,
  loading
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTestimonial({
      ...testimonial,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(testimonial);
  };

  return (
    <div className="mt-4">
      <h4>{addorupdate.type} Feedback</h4>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <ImageUploader
            imagekey={"img"}
            imageurlkey={"img_url"}
            imagename={"img_name"}
            formData={testimonial}
            setFormData={setTestimonial}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="Name"
            name="name"
            value={testimonial?.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="role">Role</label>
          <input
            type="text"
            className="form-control"
            id="role"
            placeholder="student or Aspirant etc"
            name="role"
            value={testimonial?.role}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="content">Content</label>
          <textarea
            className="form-control"
            id="content"
            placeholder="Content"
            name="content"
            value={testimonial?.content}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="form-group mb-3">
          <label htmlFor="rating">Rating</label>
          <input
            type="number"
            className="form-control"
            id="rating"
            placeholder="Rate from 1 to 5"
            name="rating"
            max={5}
            min={1}
            value={testimonial?.rating}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-accent-secondary border-0 text-secondary mt-3 rounded"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Testimonial"}
        </button>
      </form>
    </div>
  );
};

export default TestimonialForm;
