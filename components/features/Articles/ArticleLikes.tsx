import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAddLike, useDeleteLike } from "@/data/hooks/articles.hooks";
import toast from "react-hot-toast";
import { useMyProfile } from "@/data/hooks/user.hooks";
import { ArticleResponse } from "@/types/articles";

interface ArticleLikesProps {
  article: ArticleResponse;
}

const ArticleLikes: React.FC<ArticleLikesProps> = ({ article }) => {
  const { data: user } = useMyProfile();
  const [likes, setLikes] = useState<number[]>([]);
  const { mutateAsync: addLike } = useAddLike();
  const { mutateAsync: removeLike } = useDeleteLike();

  useEffect(() => {
    if (article?.likes) {
      setLikes(article.likes);
    }
  }, [article?.likes]);

  const handleLikeToggle = useCallback(async () => {
    if (!user?.id) {
      toast.error("Please sign in to like articles");
      return;
    }
    
    const userId = user.id;
    const isLiked = likes.includes(userId);
    
    try {
      if (isLiked) {
        await removeLike({ blogSlug: article.slug!, userId });
        toast.success("You unliked the article");
      } else {
        await addLike({ blogSlug: article.slug!, userId });
        toast.success("You liked the article");
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
      toast.error("An error occurred while updating like status");
    }
  }, [user?.id, likes, article.id, addLike, removeLike]);

  const isUserLiked = useCallback(() => {
    return user?.id ? likes.includes(user.id) : false;
  }, [user?.id, likes]);

  if (!article?.id) {
    return null;
  }

  return (
    <>
      {user ? (
        <button 
          className="btn btn-primary" 
          onClick={handleLikeToggle}
          disabled={!article.id}
        >
          {isUserLiked() ? "Unlike" : "Like"}
        </button>
      ) : (
        <Link
          href={`/accounts/signin?next=/articles/${article.slug || ''}/`}
          className="btn btn-primary"
        >
          Like
        </Link>
      )}
    </>
  );
};

export default ArticleLikes;
