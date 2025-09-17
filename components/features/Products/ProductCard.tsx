import React, { useMemo, useCallback } from "react";
import ProductPlaceholder from "../../custom/ImagePlaceholders/Productplaceholder";
import { useMyProfile } from "@/data/hooks/user.hooks";
import { Product } from "@/types/items";
import { useCart } from "@/providers/context/Cartcontext";
import { useAdminContext } from "@/providers/context/Admincontextdata";

interface ProductCardProps {
  product: Product;
}

/**
 * Enhanced ProductCard component with comprehensive error handling and safety checks
 * Displays product information with cart management and purchase status
 * Optimized with React.memo for performance
 */
const ProductCard: React.FC<ProductCardProps> = React.memo(({
  product
}) => {
  const { data: user } = useMyProfile();
  const { cart, addToCart, removeFromCart } = useCart();
  const adminCtx = useAdminContext();

  // Safe user ID processing
  const safeUserId = useMemo(() => {
    if (!user?.id) return null;
    return typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
  }, [user?.id]);

  // Safe product price formatting
  const formattedPrice = useMemo(() => {
    if (!product?.price) return '0.00';
    const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
    return isNaN(price) ? '0.00' : price.toFixed(2);
  }, [product?.price]);

  // Check if product is purchased
  const isPurchased = useMemo(() => {
    if (!product?.userIDs_that_bought_this_product || !safeUserId) return false;
    return product.userIDs_that_bought_this_product.includes(safeUserId);
  }, [product?.userIDs_that_bought_this_product, safeUserId]);

  // Check if product is in cart
  const isInCart = useMemo(() => {
    return cart.some(item => item.id === product.id && item.cartType === "product");
  }, [cart, product.id]);

  // Safe description truncation
  const safeDescription = useMemo(() => {
    const desc = product?.description || 'No description available';
    return desc.length > 80 ? desc.substring(0, 80) + '...' : desc;
  }, [product?.description]);

  // Handle view more click
  const handleViewMore = useCallback(() => {
    if (adminCtx?.openModal) {
      adminCtx.openModal(product);
    }
  }, [adminCtx, product]);

  // Handle cart operations
  const handleRemoveFromCart = useCallback(() => {
    removeFromCart(product.id, "product");
  }, [removeFromCart, product.id]);

  const handleAddToCart = useCallback(() => {
    addToCart(product, "product");
  }, [addToCart, product]);
  return (
    <div className="card p-4 py-4" style={{ height: "205px" }}>
      <div className="d-flex align-items-center">
        <div className="me-3">
          {product.preview ? (
            <img
              src={product.img_url}
              alt="products"
              width={68}
              height={68}
              className="rounded-circle object-fit-cover"
              style={{ objectPosition: "center" }}
            />
          ) : (
            <ProductPlaceholder />
          )}
        </div>

        <div
          className="flex-fill d-flex flex-column justify-content-between gap-1"
          style={{ height: "100%" }}
        >
          <h6 className="flex-grow-1 line-clamp-1">{product?.name || 'Unnamed Product'}</h6>
          <p className="text-primary mb-1">
            {product?.description && product.description.length > 80 ? (
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
                  aria-label="View more product details"
                >
                  view more
                </span>
              </span>
            ) : (
              product?.description || 'No description available'
            )}
          </p>
          <div className="d-flex justify-content-between gap-1 flex-wrap">
            <span className="fw-bold text-primary me-2">
              &#8358;{formattedPrice}
            </span>

            <div className="me-2 me-md-3">
              {isPurchased ? (
                <span className="badge bg-primary-light text-primary p-2">
                  Purchased
                  <i className="bi bi-check-circle ms-2"></i>
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
                  aria-label="Remove product from cart"
                >
                  remove product {"  "}
                  <i className="bi bi-cart-dash"></i>
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
                  aria-label="Add product to cart"
                >
                  Add product {"  "}
                  <i className="bi bi-cart-plus"></i>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// Add display name for debugging
ProductCard.displayName = 'ProductCard';

export default ProductCard;
