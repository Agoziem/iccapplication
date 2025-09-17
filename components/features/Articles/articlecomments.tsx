import React, { useState, useCallback, useEffect } from "react";
import Modal from "../../custom/Modal/modal";
import {
  useDeleteComment,
  useUpdateComment,
} from "@/data/hooks/articles.hooks";
import { Comment, UpdateComment } from "@/types/articles";
import { useMyProfile } from "@/data/hooks/user.hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateCommentSchema } from "@/schemas/articles";

interface ArticleCommentsProps {
  comments: Comment[];
  className?: string;
  style?: React.CSSProperties;
  maxInitialComments?: number;
}

const ArticleComments: React.FC<ArticleCommentsProps> = ({
  comments,
  className = "",
  style = {},
  maxInitialComments = 6,
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  const [commentToEdit, setCommentToEdit] = useState<Comment | null>(null);
  const [showAllComments, setShowAllComments] = useState<boolean>(false);

  const { data: user } = useMyProfile();
  const { mutate: deleteComment, isLoading: isDeletingComment } =
    useDeleteComment();
  const { mutate: updateComment, isLoading: isUpdatingComment } =
    useUpdateComment();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UpdateComment>({
    resolver: zodResolver(updateCommentSchema),
    defaultValues: {
      comment: "",
    },
  });

  const closeModal = useCallback(() => {
    setShowModal(false);
    setDeleteMode(false);
    setCommentToEdit(null);
    reset();
  }, [reset]);

  useEffect(() => {
    if (commentToEdit) {
      reset({ comment: commentToEdit.comment });
      setShowModal(true);
    }
  }, [commentToEdit, reset]);

  const deleteCommentHandler = useCallback((comment: Comment) => {
    setCommentToEdit(comment);
    setDeleteMode(true);
    setShowModal(true);
  }, []);

  // Delete Comment Handler
  const handleDelete = useCallback(async () => {
    if (!commentToEdit?.id) {
      console.error("No comment ID to delete");
      return;
    }

    try {
      deleteComment(commentToEdit.id, {
        onSuccess: () => {
          closeModal();
        },
        onError: (error) => {
          console.error("Failed to delete comment:", error);
        },
      });
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  }, [commentToEdit, deleteComment, closeModal]);

  // Update Comment Handler
  const handleUpdateComment = useCallback(
    async (data: UpdateComment) => {
      if (!commentToEdit?.id) {
        console.error("No comment to update");
        return;
      }

      const updateData: UpdateComment & { id: number } = {
        id: commentToEdit.id,
        comment: data.comment,
      };

      try {
        updateComment(updateData, {
          onSuccess: () => {
            closeModal();
          },
          onError: (error) => {
            console.error("Failed to update comment:", error);
          },
        });
      } catch (error) {
        console.error("Failed to update comment:", error);
      }
    },
    [commentToEdit, updateComment, closeModal]
  );

  const canEditComment = useCallback(
    (comment: Comment): boolean => {
      return (
        user?.id !== undefined &&
        comment.user?.id !== undefined &&
        user.id === comment.user.id
      );
    },
    [user?.id]
  );

  // Validation for comments array
  if (!comments || !Array.isArray(comments)) {
    return (
      <div className={`text-center py-4 ${className}`} style={style}>
        <p className="text-muted">No comments to display.</p>
      </div>
    );
  }

  const displayComments = showAllComments
    ? comments
    : comments.slice(0, maxInitialComments);
  const hasMoreComments = comments.length > maxInitialComments;

  return (
    <div className={`article-comments ${className}`} style={style}>
      {displayComments.map((comment, index) => {
        // Add null safety for each comment
        if (!comment || !comment.id) {
          return null;
        }

        return (
          <div key={comment.id} className="mb-4">
            <div className="d-flex">
              <div>
                {comment.user?.img ? (
                  <img
                    src={comment.user.img}
                    alt={`${comment.user.username || "User"} avatar`}
                    className="rounded-circle object-fit-cover me-3"
                    style={{
                      width: 50,
                      height: 50,
                      objectPosition: "top center",
                    }}
                  />
                ) : (
                  <div
                    className="rounded-circle text-white d-flex justify-content-center align-items-center"
                    style={{
                      width: 50,
                      height: 50,
                      fontSize: "20px",
                      backgroundColor: "var(--bgDarkerColor)",
                    }}
                    aria-label="User avatar"
                  >
                    {comment.user?.username?.[0]?.toUpperCase() || "A"}
                  </div>
                )}
              </div>

              <div className="ms-3 flex-grow-1">
                <div className="d-flex justify-content-between align-items-start">
                  <p className="mb-0 fw-bold">
                    {comment.user?.username || "Anonymous"}
                  </p>
                  <small className="text-muted">
                    {comment.date
                      ? new Date(comment.date).toDateString()
                      : "Unknown Date"}
                  </small>
                </div>

                <p className="mb-2 mt-1">
                  {(comment.comment || "").length > 300
                    ? (comment.comment || "").slice(0, 300) + "..."
                    : comment.comment || ""}
                </p>

                {canEditComment(comment) && (
                  <div className="d-flex gap-3">
                    <button
                      type="button"
                      className="btn btn-sm btn-link p-0 text-secondary fw-bold"
                      onClick={() => setCommentToEdit(comment)}
                      disabled={isUpdatingComment}
                    >
                      <small>Edit</small>
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-link p-0 text-danger fw-bold"
                      onClick={() => deleteCommentHandler(comment)}
                      disabled={isDeletingComment}
                    >
                      <small>Delete</small>
                    </button>
                  </div>
                )}
              </div>
            </div>
            {index !== displayComments.length - 1 && <hr />}
          </div>
        );
      })}

      {hasMoreComments && !showAllComments && (
        <div className="text-center mt-4">
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => setShowAllComments(true)}
          >
            View all {comments.length} comments
          </button>
        </div>
      )}

      {hasMoreComments && showAllComments && (
        <div className="text-center mt-4">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => setShowAllComments(false)}
          >
            Show fewer comments
          </button>
        </div>
      )}

      {/* Modal for Edit/Delete Comments */}
      <Modal showmodal={showModal} toggleModal={closeModal}>
        {deleteMode ? (
          <div className="modal-body">
            <h4 className="text-center mb-4">Delete Comment</h4>
            <p className="text-center mb-4">
              Are you sure you want to delete this comment? This action cannot
              be undone.
            </p>
            <div className="d-flex justify-content-end gap-3">
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={isDeletingComment}
              >
                {isDeletingComment ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeModal}
                disabled={isDeletingComment}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="modal-body">
            <h4 className="text-center mb-4">Edit Comment</h4>
            <form onSubmit={handleSubmit(handleUpdateComment)}>
              <div className="form-group mb-3">
                <label htmlFor="editComment" className="form-label">
                  Comment
                </label>
                <textarea
                  {...register("comment")}
                  className={`form-control ${
                    errors.comment ? "is-invalid" : ""
                  }`}
                  id="editComment"
                  rows={4}
                  placeholder="Edit your comment..."
                />
                {errors.comment && (
                  <div className="invalid-feedback">
                    {errors.comment.message}
                  </div>
                )}
              </div>

              <div className="d-flex justify-content-end gap-3">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting || isUpdatingComment}
                >
                  {isSubmitting || isUpdatingComment ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Updating...
                    </>
                  ) : (
                    "Update Comment"
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                  disabled={isSubmitting || isUpdatingComment}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ArticleComments;
