"use client";
import React, { useCallback, useState, useMemo } from "react";
import Modal from "@/components/custom/Modal/modal";
import FeedbackButton from "./FeedbackBtn";
import TestimonialForm from "../../features/configuration/home/TestimonialForm";
import { useCreateTestimonial, useOrganization } from "@/data/hooks/organization.hooks";
import { ORGANIZATION_ID } from "@/data/constants";

interface AddOrUpdateState {
  type: "add" | "edit";
  state: boolean;
}

const Feedback: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const { mutate: addTestimonial } = useCreateTestimonial();
  
  // Initial testimonial state
  const initialTestimonial = useMemo(() => ({
    id: undefined,
    name: "",
    content: "",
    role: "",
    rating: 0,
    img: "",
    img_url: "",
    img_name: "",
  }), []);

  const [testimonial, setTestimonial] = useState(initialTestimonial);
  const [addorupdate, setAddOrUpdate] = useState<AddOrUpdateState>({
    type: "add",
    state: true,
  });

  // Memoized form submit handler
  const handleFormSubmit = useCallback((formData: any) => {
    addTestimonial({
      organizationId: Number(ORGANIZATION_ID),
      testimonialData: {
        content: formData.content,
        name: formData.name,
        role: formData.role,
        rating: formData.rating,
        img: formData.img,
      }
    });
    closeModal();
  }, [addTestimonial]);

  // Function to close the modal and reset state
  const closeModal = useCallback(() => {
    setShowModal(false);
    setAddOrUpdate({
      type: "add",
      state: false,
    });
    setTestimonial(initialTestimonial);
  }, [initialTestimonial]);

  // Toggle modal handler
  const toggleModal = useCallback(() => {
    setShowModal(prev => !prev);
  }, []);

  return (
    <div>
      <FeedbackButton setShowModal={setShowModal} />

      <Modal showmodal={showModal} toggleModal={toggleModal}>
        <div className="modal-body">
          {addorupdate.state && (
            <TestimonialForm
              testimonial={testimonial}
              editMode={false}
              onSuccess={closeModal}
              onCancel={closeModal}
            />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Feedback;
