"use client";
import TestimonialForm from "@/components/features/configuration/home/TestimonialForm";
import React, { useContext, useState } from "react";
import { converttoformData } from "@/utils/formutils";
import Alert from "@/components/custom/Alert/Alert";
import { testimonialDefault } from "@/constants";
import {
  useCreateTestimonial,
  useUpdateTestimonial,
} from "@/data/organization/organization.hook";

const FeedbackPage = () => {
  const [testimonial, setTestimonial] = useState(testimonialDefault);
  const [addorupdate, setAddOrUpdate] = useState({
    type: "add",
    state: true,
  });
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "",
  });

  const { mutateAsync: addTestimonial, isLoading: isCreating } =
    useCreateTestimonial();
  const { mutateAsync: updateTestimonial, isLoading: isUpdating } =
    useUpdateTestimonial();

  const handleFormSubmit = async (formData) => {
    try {
      if (addorupdate.type === "add") {
        await addTestimonial(formData);
      } else {
        await updateTestimonial(formData);
      }
      setAlert({
        show: true,
        message: `Testimonial ${addorupdate.type}ed successfully`,
        type: "success",
      });
      setTimeout(() => {
        setAlert({
          show: false,
          message: "",
          type: "",
        });
      }, 3000);
    } catch (error) {
      console.log(error);
      setAlert({
        show: true,
        message: "Something went wrong",
        type: "danger",
      });
    } finally {
      resetForm();
    }
  };

  const resetForm = () => {
    setTestimonial(testimonialDefault);
    setAddOrUpdate({
      type: "add",
      state: true,
    });
  };

  return (
    <div className="container">
      <div
        className="card p-3 mx-auto my-5 px-3 px-md-5 py-3 pb-5"
        style={{
          maxWidth: "600px",
        }}
      >
        {alert.show && <Alert type={alert.type}>{alert.message}</Alert>}
        <TestimonialForm
          addorupdate={addorupdate}
          testimonial={testimonial}
          setTestimonial={setTestimonial}
          onSubmit={handleFormSubmit}
          onClose={resetForm}
          loading={isCreating || isUpdating}
        />
      </div>
    </div>
  );
};

export default FeedbackPage;
