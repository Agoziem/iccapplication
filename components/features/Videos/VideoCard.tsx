import React, { useMemo, useCallback } from "react";
import VideosPlaceholder from "../../custom/ImagePlaceholders/Videosplaceholder";
import { shortenMessage } from "@/utils/utilities";
import { Video } from "@/types/items";
import { useMyProfile } from "@/data/hooks/user.hooks";
import { useCart } from "@/providers/context/Cartcontext";
import { useAdminContext } from "@/providers/context/Admincontextdata";

type VideoCardProps = {
  video: Video;
};

/**
 * Enhanced VideoCard component with comprehensive error handling and safety checks
 * Displays video information with cart management and purchase status
 * Optimized with React.memo for performance
 */
const VideoCard: React.FC<VideoCardProps> = React.memo(({ video }) => {
  const { data: user } = useMyProfile();
  const { cart, addToCart, removeFromCart } = useCart();
  const adminCtx = useAdminContext();

  // Safe user ID processing
  const safeUserId = useMemo(() => {
    if (!user?.id) return null;
    return typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
  }, [user?.id]);

  // Safe video price formatting
  const formattedPrice = useMemo(() => {
    if (!video?.price) return '0.00';
    const price = typeof video.price === 'string' ? parseFloat(video.price) : video.price;
    return isNaN(price) ? '0.00' : price.toFixed(2);
  }, [video?.price]);

  // Check if video is purchased
  const isPurchased = useMemo(() => {
    if (!video?.userIDs_that_bought_this_video || !safeUserId) return false;
    return video.userIDs_that_bought_this_video.includes(safeUserId);
  }, [video?.userIDs_that_bought_this_video, safeUserId]);

  // Check if video is in cart
  const isInCart = useMemo(() => {
    return cart.some(item => item.id === video.id && item.cartType === "video");
  }, [cart, video.id]);

  // Safe description truncation
  const safeDescription = useMemo(() => {
    const desc = video?.description || 'No description available';
    return desc.length > 80 ? shortenMessage(desc, 80) : desc;
  }, [video?.description]);

  // Handle view more click
  const handleViewMore = useCallback(() => {
    if (adminCtx?.openModal) {
      adminCtx.openModal(video);
    }
  }, [adminCtx, video]);

  // Handle cart operations
  const handleRemoveFromCart = useCallback(() => {
    removeFromCart(video.id, "video");
  }, [removeFromCart, video.id]);

  const handleAddToCart = useCallback(() => {
    addToCart(video, "video");
  }, [addToCart, video]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleViewMore();
    }
  }, [handleViewMore]);

  return (
    <div 
      className="card p-4 py-4" 
      tabIndex={0}
      role="button"
      aria-label={`Video: ${video?.title || 'Unknown video'}`}
      onKeyDown={handleKeyDown}
    >
      <div className="d-flex align-items-center">
        <div className="me-3">
          {video?.thumbnail ? (
            <img
              src={video.img_url || ''}
              alt={`${video.title || 'Video'} thumbnail`}
              width={68}
              height={68}
              className="rounded-circle object-fit-cover"
              style={{ objectPosition: "center" }}
              loading="lazy"
            />
          ) : (
            <VideosPlaceholder />
          )}
        </div>

        <div
          className="flex-fill d-flex flex-column justify-content-between"
          style={{ height: "100%" }}
        >
          <h6 className="flex-grow-1">{video?.title || 'Untitled Video'}</h6>
          <p className="text-primary mb-1">
            {safeDescription.length > 80 ? (
              <span>
                {safeDescription}
                <span
                  className="text-secondary fw-bold"
                  style={{ cursor: "pointer" }}
                  onClick={handleViewMore}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleViewMore();
                    }
                  }}
                  aria-label="View more details"
                >
                  view more
                </span>
              </span>
            ) : (
              safeDescription
            )}
          </p>
          <div className="d-flex justify-content-between mt-3 flex-wrap">
            <span className="fw-bold text-primary me-2">
              &#8358;{formattedPrice}
            </span>

            <div className="me-2 me-md-3">
              {isPurchased ? (
                <span 
                  className="badge bg-primary-light text-primary p-2"
                  aria-label="Video purchased"
                >
                  Purchased
                  <i className="bi bi-check-circle ms-2" aria-hidden="true"></i>
                </span>
              ) : isInCart ? (
                <span
                  className="badge bg-secondary-light text-secondary p-2"
                  style={{ cursor: "pointer" }}
                  onClick={handleRemoveFromCart}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleRemoveFromCart();
                    }
                  }}
                  aria-label="Remove video from cart"
                >
                  remove video {"  "}
                  <i className="bi bi-cart-dash" aria-hidden="true"></i>
                </span>
              ) : (
                <span
                  className="badge bg-success-light text-success p-2"
                  style={{ cursor: "pointer" }}
                  onClick={handleAddToCart}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleAddToCart();
                    }
                  }}
                  aria-label="Add video to cart"
                >
                  Add video {"  "}
                  <i className="bi bi-cart-plus" aria-hidden="true"></i>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

VideoCard.displayName = 'VideoCard';

export default VideoCard;
