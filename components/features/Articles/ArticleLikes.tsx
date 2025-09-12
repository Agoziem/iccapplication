import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useAddLike, useDeleteLike } from "@/data/hooks/articles.hooks";
import toast from "react-hot-toast";

/**
 * @param {{ article: Article;}} param0
 */
const ArticleLikes = ({ article }) => {
  const { data: session } = useSession();
  const [likes, setLikes] = useState([]);
  const { mutateAsync: addLike } = useAddLike();
  const { mutateAsync: removeLike } = useDeleteLike();

  useEffect(() => {
    if (article && article.likes) {
      setLikes(article.likes);
    }
  }, [article]);

  const handleLikeToggle = async () => {
    if (!session?.user?.id || isNaN(parseInt(session.user.id))) {
      toast.error("Invalid user session");
      return;
    }
    
    const userId = parseInt(session.user.id);
    const isLiked = likes.includes(userId);
    
    try {
      isLiked
        ? await removeLike({ Article: article, userid: userId })
        : await addLike({ Article: article, userid: userId });
      toast.success(isLiked ? "You unliked the post" : "You liked the post");
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "An error occurred");
    }
  };

  return (
    <>
      {session ? (
        <button className="btn btn-primary" onClick={handleLikeToggle}>
          {likes?.includes(
            session?.user?.id && !isNaN(parseInt(session.user.id)) 
              ? parseInt(session.user.id) 
              : -1
          ) ? "Unlike" : "Like"}
        </button>
      ) : (
        <Link
          href={`/accounts/signin?next=/articles/${article?.slug || ''}/`}
          className="btn btn-primary"
        >
          Like
        </Link>
      )}
    </>
  );
};

export default ArticleLikes;
