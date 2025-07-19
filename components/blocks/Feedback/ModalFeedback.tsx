"use client";
import React, { useState } from "react";
import Modal from "@/components/custom/Modal/modal";
import FeedbackButton from "./FeedbackBtn";
import TestimonialForm from "../../features/configuration/home/TestimonialForm";
import { useCreateTestimonial, useFetchOrganization } from "@/data/organization/organization.hook";

interface TestimonialData {
  id: string | null;
  name: string;
  content: string;
  role: string;
  rating: number;
  img: File | null;
  img_url: string;
  img_name: string;
}

interface AddOrUpdateState {
  type: "add" | "update";
  state: boolean;
}

const Feedback: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const { data: OrganizationData } = useFetchOrganization();
  const { mutate: addTestimonial, isLoading } = useCreateTestimonial();
  
  const [testimonial, setTestimonial] = useState<TestimonialData>({
    id: null,
    name: "",
    content: "",
    role: "",
    rating: 0,
    img: null,
    img_url: "",
    img_name: "",
  });
  
  const [addorupdate, setAddOrUpdate] = useState<AddOrUpdateState>({
    type: "add",
    state: true,
  });

  const handleFormSubmit = (formData: any): void => {
    addTestimonial(formData);
    closeModal();
  };

  const closeModal = (): void => {
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
              loading={isLoading}
            />
          ) : null}
        </div>
      </Modal>
    </div>
  );
};

export default Feedback;
