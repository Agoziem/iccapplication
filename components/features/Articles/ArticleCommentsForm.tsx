import React, { useState } from "react";
import Modal from "../../custom/Modal/modal";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Alert from "@/components/custom/Alert/Alert";
import { ArticleCommentDefault } from "@/constants";
import { useCreateComment } from "@/data/articles/articles.hook";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentSchema } from "@/schemas/articles";

/**
 * @param {{ article: Article; comments: any; }} param0
 */
const ArticleCommentsForm = ({ article, comments }) => {
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { mutateAsync: createComment } = useCreateComment();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue
  } = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      comment: "",
      blog: article?.id || null,
      user: {
        id: session?.user?.id || null,
        username: session?.user?.username || "",
        img: session?.user?.avatar_url || "",
      }
    }
  });

  const onSubmit = async (data) => {
    if (!article?.id || !session?.user?.id) {
      setError("Missing article or user information");
      return;
    }

    const datatosubmit = {
      comment: data.comment,
      blog: article.id,
      user: {
        id: session.user.id,
        username: session.user.username,
        img: session.user.avatar_url,
      },
    };

    try {
      setError("");
      setSuccess("");
      await createComment(datatosubmit);
      setSuccess("Comment submitted successfully!");
      reset(); // Reset form after successful submission
      setTimeout(() => {
        setSuccess("");
        setShowModal(false);
      }, 2000);
    } catch (error) {
      console.log(error.message);
      setError(error?.message || "Failed to submit comment. Please try again.");
    }
  };

  return (
    <>
      {session ? (
        <button
          className="btn btn-primary me-3"
          onClick={(e) => {
            e.preventDefault();
            setShowModal(true);
          }}
        >
          Add Comment
        </button>
      ) : (
        <Link
          href={`/accounts/signin?next=/articles/${article.slug}/`}
          className="btn btn-primary me-3"
        >
          Add Comment
        </Link>
      )}
      <Modal showmodal={showModal} toggleModal={() => setShowModal(false)}>
        <div className="modal-body">
          <h4 className="text-center">Add comment</h4>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group my-3">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={session?.user?.username || 'Anonymous'}
                readOnly
              />
            </div>
            <div className="form-group my-3">
              <label htmlFor="comment">Comment</label>
              <textarea
                className={`form-control ${errors.comment ? 'is-invalid' : ''}`}
                id="comment"
                placeholder="Write your comment here..."
                {...register("comment")}
              ></textarea>
              {errors.comment && (
                <div className="invalid-feedback">
                  {errors.comment.message}
                </div>
              )}
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100 rounded mt-3"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Adding Comment...
                </>
              ) : (
                "Add Comment"
              )}
            </button>
            {/* Error Message */}
            {error && <Alert type={"danger"}>{error}</Alert>}

            {/* Success Message */}
            {success && <Alert type={"success"}>{success}</Alert>}
          </form>
        </div>
      </Modal>
    </>
  );
};

export default ArticleCommentsForm;
