import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Modal from "../../custom/Modal/modal";
import { ArticleCommentDefault } from "@/data/constants";
import { useDeleteComment, useUpdateComment } from "@/data/hooks/articles.hooks";

/**
 * Article Comments
 * @param {{ comments: ArticleComments; }} param0
 */
const ArticleComments = ({
  comments,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [deletemode, setDeleteMode] = useState(false);
  /**  @type {[ArticleComment,(value: ArticleComment) => void]} */
  const [commenttoedit, setCommenttoEdit] = useState(ArticleCommentDefault);
  const { data: session } = useSession();
  const { mutate:deleteComment } = useDeleteComment();
  const {mutate: updateComment} = useUpdateComment();


  const closeModal = () => {
    setShowModal(false);
    setDeleteMode(false);
    setCommenttoEdit(ArticleCommentDefault);
  };

  /**  @param {ArticleComment} comment */
  const editComment = (comment) => {
    setCommenttoEdit(comment);
    setShowModal(true);
  };

  /**  @param {ArticleComment} comment */
  const deletecomment = (comment) => {
    setCommenttoEdit(comment);
    setDeleteMode(true);
    setShowModal(true);
  };

  // -----------------------------------------------
  // delete Comment
  // -----------------------------------------------
  const handledelete = async () => {
    if (!commenttoedit?.id) {
      console.error("No comment ID to delete");
      return;
    }
    
    try {
      deleteComment(commenttoedit.id);
    } catch (error) {
      console.error("Failed to delete comment:", error?.message || error);
    } finally {
      closeModal();
    }
  };


  // -----------------------------------------------
  // Update Comment
  // -----------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commenttoedit?.id) {
      console.error("No comment to update");
      return;
    }
    
    try {
      updateComment(commenttoedit);
    } catch (error) {
      console.error("Failed to update comment:", error?.message || error);
    } finally {
      closeModal();
    }
  };

  // Add validation for comments array
  if (!comments || !Array.isArray(comments)) {
    return (
      <div className="text-center py-4">
        <p className="text-muted">No comments to display.</p>
      </div>
    );
  }

  return (
    <div>
      {comments.map((comment, index) => {
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
                    alt="author"
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
                  >
                    {comment.user?.username?.length > 0 
                      ? comment.user.username[0].toUpperCase() 
                      : 'A'}
                  </div>
                )}
              </div>
              <div className="ms-3">
                <p className="mb-0 fw-bold">{comment.user?.username || 'Anonymous'}</p>
                <p className="mb-0">
                  {(comment.comment || '').length > 300
                    ? (comment.comment || '').slice(0, 300) + "..."
                    : (comment.comment || '')}
                </p>
                <div className="mt-2">
                  <span>
                    <small>
                      {comment.date 
                        ? new Date(comment.date).toDateString() 
                        : 'Unknown Date'}
                    </small>
                  </span>
                  {session?.user?.id && 
                   !isNaN(parseInt(session.user.id)) &&
                   parseInt(session.user.id) === comment.user?.id && (
                    <span
                      className="fw-bold text-secondary mx-3"
                      style={{ cursor: "pointer" }}
                      onClick={() => editComment(comment)}
                    >
                      <small>edit</small>
                    </span>
                  )}
                  {parseInt(session?.user?.id) === comment.user.id && (
                    <span
                      className="fw-bold text-danger"
                      style={{ cursor: "pointer" }}
                      onClick={() => deletecomment(comment)}
                    >
                      <small>delete</small>
                    </span>
                  )}
                </div>
              </div>
            </div>
            {index !== comments.length - 1 && <hr />}
          </div>
        );
      })}
      {comments.length > 6 && (
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          View all comments
        </button>
      )}

      <Modal
        showmodal={showModal}
        toggleModal={() => {
          closeModal();
        }}
      >
        {deletemode ? (
          <div className="modal-body">
            <h4 className="text-center">Delete comment</h4>
            <p className="text-center">
              Are you sure you want to delete this comment?
            </p>
            <div className="d-flex justify-content-end">
              <button
                className="btn btn-danger me-3 rounded"
                onClick={() => {
                  handledelete();
                }}
              >
                Delete
              </button>
              <button
                className="btn btn-primary rounded"
                onClick={() => {
                  closeModal();
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="modal-body">
            <h4 className="text-center">Edit comment</h4>
            <form
              onSubmit={(e) => {
                handleSubmit(e);
              }}
            >
              <div className="form-group my-3">
                <label htmlFor="comment mb-3">Comment</label>
                <textarea
                  className="form-control"
                  id="comment"
                  name="comment"
                  value={commenttoedit.comment}
                  onChange={(e) =>
                    setCommenttoEdit({
                      ...commenttoedit,
                      comment: e.target.value,
                    })
                  }
                ></textarea>
              </div>
              <div className="d-flex justify-content-end">
                <button
                  className="btn btn-secondary me-3 rounded"
                  type="submit"
                >
                  Edit
                </button>
                <button
                  className="btn btn-primary rounded"
                  onClick={() => {
                    closeModal();
                  }}
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
