import React, { useMemo, useCallback } from "react";
import { useCart } from "@/providers/context/Cartcontext";
import { FaVideo } from "react-icons/fa6";
import useCurrentUser from "@/hooks/useCurrentUser";
import { Video } from "@/types/items";

interface TopSellingVideoProps {
  item: Video;
}

const TopSellingVideo: React.FC<TopSellingVideoProps> = React.memo(({ item }) => {
  const { cart, addToCart, removeFromCart } = useCart();
  const { currentUser } = useCurrentUser();

  // Memoized current user ID
  const currentUserId = useMemo(() => {
    return currentUser?.id ? parseInt(String(currentUser.id)) : null;
  }, [currentUser?.id]);

  // Memoized purchase status
  const hasPurchased = useMemo(() => {
    if (!currentUserId || !item?.userIDs_that_bought_this_video) return false;
    return item.userIDs_that_bought_this_video.includes(currentUserId);
  }, [item?.userIDs_that_bought_this_video, currentUserId]);

  // Memoized cart item
  const cartItem = useMemo(() => {
    return cart.find((video) => video.id === item.id && video.cartType === "video");
  }, [cart, item.id]);

  // Memoized formatted price
  const formattedPrice = useMemo(() => {
    const price = parseFloat(String(item?.price) || "0");
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price);
  }, [item?.price]);

  // Handle add to cart
  const handleAddToCart = useCallback(() => {
    addToCart(item, "video");
  }, [addToCart, item]);

  // Handle remove from cart
  const handleRemoveFromCart = useCallback(() => {
    if (item.id) {
      removeFromCart(item.id, "video");
    }
  }, [removeFromCart, item.id]);

  // Render action button
  const renderActionButton = useMemo(() => {
    if (hasPurchased) {
      return (
        <span className="badge bg-primary-light text-primary p-2" role="status" aria-label="Video purchased">
          <i className="bi bi-check-circle me-2" aria-hidden="true"></i>
          Purchased
        </span>
      );
    }

    if (cartItem) {
      return (
        <button
          type="button"
          className="btn badge bg-secondary-light text-secondary p-2 border-0"
          onClick={handleRemoveFromCart}
          aria-label={`Remove ${item.title} from cart`}
        >
          <i className="bi bi-cart-dash me-2" aria-hidden="true"></i>
          Remove Video
        </button>
      );
    }

    return (
      <button
        type="button"
        className="btn badge bg-success-light text-success p-2 border-0"
        onClick={handleAddToCart}
        aria-label={`Add ${item.title} to cart`}
      >
        <i className="bi bi-cart-plus me-2" aria-hidden="true"></i>
        Add Video
      </button>
    );
  }, [hasPurchased, cartItem, handleAddToCart, handleRemoveFromCart, item.title]);

  return (
    <tr role="row">
      <th scope="row">
        {item.img_url ? (
          <img 
            src={item.img_url} 
            alt={`Thumbnail of ${item.title}`}
            className="shadow-sm rounded"
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
            loading="lazy"
          />
        ) : (
          <div
            className="rounded d-flex justify-content-center align-items-center"
            style={{
              width: "50px",
              height: "50px",
              backgroundColor: "var(--bgDarkColor)",
              color: "var(--bgDarkerColor)",
            }}
            role="img"
            aria-label="Video placeholder image"
          >
            <FaVideo className="fs-5 mb-0" aria-hidden="true" />
          </div>
        )}
      </th>
      
      <td className="text-primary fw-bold" title={item.title}>
        {item.title}
      </td>
      
      <td title={item?.category?.category || "No category"}>
        {item?.category?.category || "Uncategorized"}
      </td>
      
      <td className="fw-semibold" title={`Price: ${formattedPrice}`}>
        {formattedPrice}
      </td>
      
      <td>
        {renderActionButton}
      </td>
    </tr>
  );
});

TopSellingVideo.displayName = "TopSellingVideo";

export default TopSellingVideo;
