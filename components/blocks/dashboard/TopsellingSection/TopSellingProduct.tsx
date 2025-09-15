import React, { useMemo, useCallback } from "react";
import { useCart } from "@/providers/context/Cartcontext";
import { RiShoppingBasketFill } from "react-icons/ri";
import useCurrentUser from "@/hooks/useCurrentUser";
import { Product } from "@/types/items";

interface TopSellingProductProps {
  item: Product;
}

const TopSellingProduct: React.FC<TopSellingProductProps> = React.memo(({ item }) => {
  const { cart, addToCart, removeFromCart } = useCart();
  const { currentUser } = useCurrentUser();

  // Memoized current user ID
  const currentUserId = useMemo(() => {
    return currentUser?.id ? parseInt(String(currentUser.id)) : null;
  }, [currentUser?.id]);

  // Memoized purchase status
  const hasPurchased = useMemo(() => {
    if (!currentUserId || !item?.userIDs_that_bought_this_product) return false;
    return item.userIDs_that_bought_this_product.includes(currentUserId);
  }, [item?.userIDs_that_bought_this_product, currentUserId]);

  // Memoized cart item
  const cartItem = useMemo(() => {
    return cart.find((product) => product.id === item.id && product.cartType === "product");
  }, [cart, item.id]);

  // Memoized formatted price
  const formattedPrice = useMemo(() => {
    const price = parseFloat(item?.price || "0");
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price);
  }, [item?.price]);

  // Handle add to cart
  const handleAddToCart = useCallback(() => {
    addToCart(item, "product");
  }, [addToCart, item]);

  // Handle remove from cart
  const handleRemoveFromCart = useCallback(() => {
    if (item.id) {
      removeFromCart(item.id, "product");
    }
  }, [removeFromCart, item.id]);

  // Render action button
  const renderActionButton = useMemo(() => {
    if (hasPurchased) {
      return (
        <span className="badge bg-primary-light text-primary p-2" role="status" aria-label="Product purchased">
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
          aria-label={`Remove ${item.name} from cart`}
        >
          <i className="bi bi-cart-dash me-2" aria-hidden="true"></i>
          Remove Product
        </button>
      );
    }

    return (
      <button
        type="button"
        className="btn badge bg-success-light text-success p-2 border-0"
        onClick={handleAddToCart}
        aria-label={`Add ${item.name} to cart`}
      >
        <i className="bi bi-cart-plus me-2" aria-hidden="true"></i>
        Add Product
      </button>
    );
  }, [hasPurchased, cartItem, handleAddToCart, handleRemoveFromCart, item.name]);

  return (
    <tr role="row">
      <th scope="row">
        {item.img_url ? (
          <img 
            src={item.img_url} 
            alt={`Preview of ${item.name}`}
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
            aria-label="Product placeholder image"
          >
            <RiShoppingBasketFill className="fs-4 mb-0" aria-hidden="true" />
          </div>
        )}
      </th>
      
      <td className="text-primary fw-bold" title={item.name}>
        {item.name}
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

TopSellingProduct.displayName = "TopSellingProduct";

export default TopSellingProduct;
