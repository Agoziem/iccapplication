"use client";
import React, { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiMail, FiTrash2, FiCornerUpLeft, FiUser } from "react-icons/fi";
import { MdAlternateEmail } from "react-icons/md";
import { PulseLoader } from "react-spinners";
import Modal from "@/components/custom/Modal/modal";
import Alert from "@/components/custom/Alert/Alert";
import Pagination from "@/components/custom/Pagination/Pagination";
import { useEmails, useDeleteEmail } from "@/data/hooks/email.hooks";
import { Email } from "@/types/emails";
import { ORGANIZATION_ID } from "@/data/constants";
import * as z from "zod";

// Reply schema
const ReplySchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

type ReplyFormData = {
  subject: string;
  message: string;
};

type AlertState = {
  show: boolean;
  message: string;
  type: "info" | "success" | "warning" | "danger";
};

const Messages = () => {
  const [message, setMessage] = useState<Email | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [alert, setAlert] = useState<AlertState>({ show: false, message: "", type: "info" });

  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "1";
  const pageSize = "10";
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDeletion] = useTransition();

  // Hooks
  const { mutateAsync: deleteEmail } = useDeleteEmail();

  // Fetch Messages
  const { data: messages, isLoading: loadingMessages } = useEmails(
    parseInt(ORGANIZATION_ID || "0", 10),
    {
      page: parseInt(page, 10),
      page_size: parseInt(pageSize, 10),
    }
  );

  // Form setup for reply
  const {
    control,
    handleSubmit: handleFormSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<ReplyFormData>({
    resolver: zodResolver(ReplySchema),
    defaultValues: {
      subject: "",
      message: "",
    },
  });

  // Handle alert display
  const handleAlert = (message: string, type: AlertState["type"]) => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "info" });
    }, 5000);
  };

  // Handle page change
  const handlePageChange = (newPage: string | number) => {
    const pageNum = typeof newPage === "string" ? parseInt(newPage) : newPage;
    router.push(`?page=${pageNum}&page_size=${pageSize}`, { scroll: false });
  };

  // Handle message deletion
  const handleDelete = async (messageId: number) => {
    startDeletion(async () => {
      try {
        await deleteEmail(messageId);
        handleAlert("Message deleted successfully!", "success");
        setShowDeleteModal(false);
        setMessage(null);
      } catch (error) {
        handleAlert(
          error instanceof Error ? error.message : "Failed to delete message",
          "danger"
        );
      }
    });
  };

  // Handle reply modal
  const handleReply = (message: Email) => {
    setMessage(message);
    setDeleteMode(false);
    setValue("subject", `Re: ${message.subject || "Your Message"}`);
    setValue("message", "");
    setShowModal(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = (message: Email) => {
    setMessage(message);
    setDeleteMode(true);
    setShowDeleteModal(true);
  };

  // Close modals
  const closeModal = () => {
    setShowModal(false);
    setShowDeleteModal(false);
    setMessage(null);
    setDeleteMode(false);
    reset();
  };

  // Handle reply submission
  const onSubmitReply = async (data: ReplyFormData) => {
    startTransition(async () => {
      try {
        // Here you would implement the actual email sending logic
        console.log("Reply data:", {
          to: message?.email,
          subject: data.subject,
          message: data.message,
        });
        handleAlert("Reply sent successfully!", "success");
        closeModal();
      } catch (error) {
        handleAlert(
          error instanceof Error ? error.message : "Failed to send reply",
          "danger"
        );
      }
    });
  };

  if (loadingMessages) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <PulseLoader color="#0d6efd" size={15} />
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="d-flex align-items-center">
            <FiMail size={32} className="text-primary me-2" />
            <h4 className="mb-0">Messages</h4>
          </div>
        </div>
      </div>

      {/* Messages Header */}
      <div className="row mb-3 align-items-center">
        <div className="col-md-6">
          <h5 className="mb-1">All Messages</h5>
          <p className="mb-0 text-primary">
            {(messages?.count ?? 0)} Message{(messages?.count ?? 0) !== 1 ? "s" : ""} in Total
          </p>
        </div>
      </div>

      {/* Alert */}
      {alert.show && <Alert type={alert.type}>{alert.message}</Alert>}

      {/* Messages List */}
      <div className="row">
        {loadingMessages ? (
          <div className="col-12 d-flex justify-content-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : messages?.results?.length === 0 ? (
          <div className="col-12 text-center py-5">
            <FiMail size={64} className="text-muted mb-3" />
            <h5 className="text-muted">No messages found</h5>
            <p className="text-muted">You haven't received any messages yet</p>
          </div>
        ) : (
          <div className="col-12">
            {messages?.results?.map((messageItem) => (
              <div key={messageItem.id} className="mb-3">
                {/* Message Card */}
                <div className="card border-0 shadow-sm">
                  <div className="card-body p-4">
                    {/* Message Header */}
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle d-flex justify-content-center align-items-center text-white me-3"
                          style={{
                            width: "50px",
                            height: "50px",
                            fontSize: "1.5rem",
                            backgroundColor: "var(--bs-primary)",
                          }}
                        >
                          {messageItem.name?.charAt(0).toUpperCase() || <FiUser size={20} />}
                        </div>
                        <div>
                          <h6 className="mb-1 fw-bold">{messageItem.name}</h6>
                          <p className="mb-0 text-muted small">{messageItem.email}</p>
                        </div>
                      </div>
                      <div className="text-end">
                        <MdAlternateEmail className="text-primary mb-2" size={24} />
                        <p className="text-muted mb-0 small">
                          {new Date(messageItem.created_at || "").toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Message Content */}
                    <div className="mb-3">
                      {messageItem.subject && (
                        <h6 className="fw-bold mb-2">Subject: {messageItem.subject}</h6>
                      )}
                      <p className="text-muted mb-0">{messageItem.message}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="d-flex flex-wrap justify-content-between align-items-center">
                      <div className="text-primary small">
                        Received on {new Date(messageItem.created_at || "").toDateString()}
                      </div>
                      <div className="d-flex gap-2 mt-2 mt-md-0">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleReply(messageItem)}
                          title="Reply to Message"
                        >
                          <FiCornerUpLeft size={14} className="me-1" />
                          Reply
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteConfirm(messageItem)}
                          title="Delete Message"
                        >
                          <FiTrash2 size={14} className="me-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {messages && messages.count > parseInt(pageSize) && (
        <div className="row mt-4">
          <div className="col-12">
            <Pagination
              currentPage={parseInt(page)}
              totalPages={Math.ceil(messages.count / parseInt(pageSize))}
              handlePageChange={handlePageChange}
            />
          </div>
        </div>
      )}

      {/* Reply Modal */}
      <Modal showmodal={showModal} toggleModal={closeModal} overlayclose={false}>
        <div className="p-3">
          <h5 className="text-center mb-3">Reply to Message</h5>
          <div className="text-center mb-3">
            <p className="mb-1 text-muted small">Replying to: {message?.name}</p>
            <p className="mb-0 text-primary">{message?.email}</p>
          </div>
          <hr />
          
          <form onSubmit={handleFormSubmit(onSubmitReply)}>
            {/* Subject */}
            <div className="mb-3">
              <label htmlFor="subject" className="form-label fw-bold">
                Subject <span className="text-danger">*</span>
              </label>
              <Controller
                name="subject"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className={`form-control ${errors.subject ? "is-invalid" : ""}`}
                    id="subject"
                    placeholder="Enter reply subject"
                  />
                )}
              />
              {errors.subject && (
                <div className="invalid-feedback">{errors.subject.message}</div>
              )}
            </div>

            {/* Message */}
            <div className="mb-4">
              <label htmlFor="message" className="form-label fw-bold">
                Message <span className="text-danger">*</span>
              </label>
              <Controller
                name="message"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    className={`form-control ${errors.message ? "is-invalid" : ""}`}
                    id="message"
                    rows={5}
                    placeholder="Type your reply here..."
                  />
                )}
              />
              {errors.message && (
                <div className="invalid-feedback">{errors.message.message}</div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeModal}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="d-inline-flex align-items-center justify-content-center gap-2">
                    <div>Sending Reply...</div>
                    <PulseLoader size={8} color={"#ffffff"} loading={true} />
                  </div>
                ) : (
                  "Send Reply"
                )}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal showmodal={showDeleteModal} toggleModal={closeModal}>
        <div className="p-3">
          <p className="text-center">Delete Message</p>
          <hr />
          <h5 className="text-center mb-4">
            Message from {message?.name}
          </h5>
          <p className="text-center text-muted mb-4">
            Are you sure you want to delete this message? This action cannot be undone.
          </p>
          <div className="d-flex justify-content-center gap-2">
            <button
              className="btn btn-danger"
              onClick={() => message?.id && handleDelete(message.id)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="d-inline-flex align-items-center justify-content-center gap-2">
                  <div>Deleting...</div>
                  <PulseLoader size={8} color={"#ffffff"} loading={true} />
                </div>
              ) : (
                "Delete"
              )}
            </button>
            <button
              className="btn btn-secondary"
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Messages;
