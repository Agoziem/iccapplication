"use client";
import React, { useCallback, useState, useMemo } from "react";
import Modal from "@/components/custom/Modal/modal";
import FeedbackButton from "./FeedbackBtn";
import TestimonialForm from "../../features/configuration/home/TestimonialForm";
import { Testimonial } from "@/types/organizations";

interface AddOrUpdateState {
  type: "add" | "edit";
  state: boolean;
}

const Feedback: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  // Function to close the modal and reset state
  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  // Toggle modal handler
  const toggleModal = useCallback(() => {
    setShowModal((prev) => !prev);
  }, []);

  return (
    <div>
      <FeedbackButton setShowModal={setShowModal} />
      <Modal showmodal={showModal} toggleModal={toggleModal}>
        <div className="modal-body">
          <TestimonialForm
            testimonial={null}
            editMode={false}
            onSuccess={closeModal}
            onCancel={closeModal}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Feedback;
