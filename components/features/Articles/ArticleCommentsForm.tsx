import React, { useState, FormEvent, ChangeEvent } from "react";
import Modal from "../../custom/Modal/modal";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Alert from "@/components/custom/Alert/Alert";
import { ArticleCommentDefault } from "@/constants";
import { useCreateComment } from "@/data/articles/articles.hook";
import { Article, ArticleComment } from "@/types/articles";

interface ArticleCommentsFormProps {
  article: Article;
  comments: any;
}

const ArticleCommentsForm: React.FC<ArticleCommentsFormProps> = ({ article, comments }) => {
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [commenttoedit, setCommenttoEdit] = useState<ArticleComment>(ArticleCommentDefault);
  const { mutateAsync:createComment } = useCreateComment();
  
  const addComment = async (e: FormEvent) => {
    e.preventDefault();
    const { blog, user, ...restdata } = commenttoedit;
    const datatosubmit = {
      ...restdata,
      blog: article.id || 0,
      user: {
        id: parseInt(session?.user?.id || "0"),
        username: session?.user?.username || "",
        img: session?.user?.avatar_url || null,
      },
    };
    try {
      await createComment(datatosubmit);
      setSuccess("submitted successfully!");
    } catch (error) {
      console.log((error as Error).message);
      setError("failed to Submit!, try again");
    } finally {
      setCommenttoEdit(ArticleCommentDefault);
      setShowModal(false);
      setTimeout(() => {
        setError("");
        setSuccess("");
      }, 3000);
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
          <form onSubmit={addComment}>
            <div className="form-group my-3">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={session?.user?.username}
                readOnly
              />
            </div>
            <div className="form-group my-3">
              <label htmlFor="comment">Comment</label>
              <textarea
                className="form-control"
                id="comment"
                value={commenttoedit.comment}
                onChange={(e) => {
                  setCommenttoEdit({
                    ...commenttoedit,
                    comment: e.target.value,
                  });
                }}
              ></textarea>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100 rounded mt-3"
            >
              Add Comment
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
