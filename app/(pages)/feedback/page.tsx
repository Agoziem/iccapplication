"use client";
import TestimonialForm from "@/components/features/configuration/home/TestimonialForm";
import React, { useContext, useState } from "react";
import { Testimonial } from "@/types/organizations";

const FeedbackPage = () => {
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null);

  return (
    <div className="container">
      <div
        className="card p-3 mx-auto my-5 px-3 px-md-5 py-3 pb-5"
        style={{
          maxWidth: "600px",
        }}
      >
        <TestimonialForm testimonial={testimonial} />
      </div>
    </div>
  );
};

export default FeedbackPage;
