"use client";
import React, { useContext, useState } from "react";
import Modal from "@/components/custom/Modal/modal";
import FeedbackButton from "./FeedbackBtn";
import TestimonialForm from "../../features/configuration/home/TestimonialForm";
import { useCreateTestimonial, useFetchOrganization } from "@/data/organization/organization.hook";

const Feedback = () => {
  const [showModal, setShowModal] = useState(false);
  const { data: OrganizationData } = useFetchOrganization();
  const { mutate:addTestimonial } = useCreateTestimonial();
  
  const [testimonial, setTestimonial] = useState({
    id: null,
    name: "",
    content: "",
    role: "",
    rating: 0,
    img: null,
    img_url: "",
    img_name: "",
  });
  const [addorupdate, setAddOrUpdate] = useState({
    type: "add",
    state: true,
  });

  const handleFormSubmit = (formData) => {
    addTestimonial(formData);
    closeModal();
  };

  // -------------------------------------------------------------
  // Function to close the modal
  // -------------------------------------------------------------

  const closeModal = () => {
    setShowModal(false);
    setAddOrUpdate({
      type: "add",
      state: false,
    });
    setTestimonial({
      id: "",
      name: "",
      content: "",
      role: "",
      rating: 0,
      img: null,
      img_url: "",
      img_name: "",
    });
  };

  return (
    <div>
      <FeedbackButton setShowModal={setShowModal} />

      <Modal showmodal={showModal} toggleModal={() => setShowModal(!showModal)}>
        <div className="modal-body">
          {addorupdate.state ? (
            <TestimonialForm
              addorupdate={addorupdate}
              testimonial={testimonial}
              onSubmit={handleFormSubmit}
              onClose={closeModal}
              setTestimonial={setTestimonial}
            />
          ) : null}
        </div>
      </Modal>
    </div>
  );
};

export default Feedback;
