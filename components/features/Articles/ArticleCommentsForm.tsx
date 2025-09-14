import React, { useState, useCallback } from "react";
import Modal from "../../custom/Modal/modal";
import Link from "next/link";
import Alert from "@/components/custom/Alert/Alert";
import { useCreateComment } from "@/data/hooks/articles.hooks";
import { useMyProfile } from "@/data/hooks/user.hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCommentSchema } from "@/schemas/articles";
import { ArticleResponse, CreateComment, CommentResponse } from "@/types/articles";

interface ArticleCommentsFormProps {
  article: ArticleResponse;
  comments?: CommentResponse;
  className?: string;
  style?: React.CSSProperties;
  onCommentAdded?: () => void;
}



const ArticleCommentsForm: React.FC<ArticleCommentsFormProps> = ({ 
  article, 
  comments,
  className = "",
  style = {},
  onCommentAdded
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  
  const { data: user } = useMyProfile();
  const { mutateAsync: createComment, isLoading: isSubmittingComment } = useCreateComment();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<CreateComment>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      comment: ""
    }
  });

  const closeModal = useCallback(() => {
    setShowModal(false);
    setError("");
    setSuccess("");
    reset();
  }, [reset]);

  const openModal = useCallback(() => {
    setShowModal(true);
    setError("");
    setSuccess("");
  }, []);

  const onSubmit = useCallback(async (data: CreateComment) => {
    if (!article?.id) {
      setError("Article information is missing");
      return;
    }

    if (!user?.id) {
      setError("You must be logged in to comment");
      return;
    }

    const commentData: CreateComment = {
      comment: data.comment.trim()
    };

    try {
      setError("");
      setSuccess("");
      await createComment({
        blogId: article.id,
        userId: user.id,
        commentData
      });
      
      setSuccess("Comment submitted successfully!");
      reset();
      
      // Call optional callback
      onCommentAdded?.();
      
      // Auto-close modal after success
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (error: any) {
      console.error("Failed to create comment:", error);
      setError(error?.message || "Failed to submit comment. Please try again.");
    }
  }, [article?.id, user, createComment, reset, onCommentAdded, closeModal]);

  return (
    <div className={className} style={style}>
      {user ? (
        <button
          type="button"
          className="btn btn-primary me-3"
          onClick={openModal}
          disabled={isSubmittingComment}
        >
          {isSubmittingComment ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Adding Comment...
            </>
          ) : (
            "Add Comment"
          )}
        </button>
      ) : (
        <Link
          href={`/accounts/signin?next=/articles/${article.slug || ""}`}
          className="btn btn-primary me-3"
        >
          Login to Comment
        </Link>
      )}

      <Modal showmodal={showModal} toggleModal={closeModal}>
        <div className="modal-body">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h4 className="mb-0">Add Comment</h4>
            <button
              type="button"
              className="btn-close"
              onClick={closeModal}
              aria-label="Close"
            />
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* User Info Display */}
            <div className="d-flex align-items-center mb-3">
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={`${user.username || 'User'} avatar`}
                  className="rounded-circle me-3"
                  style={{ width: 40, height: 40, objectFit: 'cover' }}
                />
              ) : (
                <div
                  className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center me-3"
                  style={{ width: 40, height: 40, fontSize: '16px' }}
                >
                  {user?.username?.[0]?.toUpperCase() || 'A'}
                </div>
              )}
              <div>
                <p className="mb-0 fw-semibold">{user?.username || 'Anonymous'}</p>
                <small className="text-muted">Commenting as</small>
              </div>
            </div>

            {/* Comment Input */}
            <div className="form-group mb-3">
              <label htmlFor="comment" className="form-label">
                Your Comment *
              </label>
              <textarea
                {...register("comment")}
                className={`form-control ${errors.comment ? 'is-invalid' : ''}`}
                id="comment"
                rows={4}
                placeholder="Share your thoughts about this article..."
                disabled={isSubmitting || isSubmittingComment}
              />
              {errors.comment && (
                <div className="invalid-feedback">
                  {errors.comment.message}
                </div>
              )}
              <div className="form-text">
                Be respectful and constructive in your comments.
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeModal}
                disabled={isSubmitting || isSubmittingComment}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting || isSubmittingComment}
              >
                {isSubmitting || isSubmittingComment ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Posting...
                  </>
                ) : (
                  "Post Comment"
                )}
              </button>
            </div>

            {/* Error and Success Messages */}
            {error && (
              <div className="mt-3">
                <Alert type="danger">{error}</Alert>
              </div>
            )}

            {success && (
              <div className="mt-3">
                <Alert type="success">{success}</Alert>
              </div>
            )}
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default ArticleCommentsForm;
