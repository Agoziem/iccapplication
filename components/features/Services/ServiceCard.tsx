import React, { useMemo, useCallback } from "react";
import ServicesPlaceholder from "@/components/custom/ImagePlaceholders/ServicesPlaceholder";
import { useMyProfile } from "@/data/hooks/user.hooks";
import { useAdminContext } from "@/providers/context/Admincontextdata";
import { useCart } from "@/providers/context/Cartcontext";
import { Service } from "@/types/items";

interface ServiceCardProps {
  service: Service;
}

/**
 * Enhanced ServiceCard component with comprehensive error handling and safety checks
 * Displays service information with cart management and purchase status
 * Optimized with React.memo for performance
 */
const ServiceCard: React.FC<ServiceCardProps> = React.memo(({
  service
}) => {
  const { data: user } = useMyProfile();
  const { cart, addToCart, removeFromCart } = useCart();
  const adminCtx = useAdminContext();

  // Safe user ID processing
  const safeUserId = useMemo(() => {
    if (!user?.id) return null;
    return typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
  }, [user?.id]);

  // Safe service price formatting
  const formattedPrice = useMemo(() => {
    if (!service?.price) return '0.00';
    const price = typeof service.price === 'string' ? parseFloat(service.price) : service.price;
    return isNaN(price) ? '0.00' : price.toFixed(2);
  }, [service?.price]);

  // Check if service is purchased but not completed
  const isPurchased = useMemo(() => {
    if (!service?.userIDs_that_bought_this_service || !safeUserId) return false;
    const wasPurchased = service.userIDs_that_bought_this_service.includes(safeUserId);
    const isCompleted = service.userIDs_whose_services_have_been_completed?.includes(safeUserId) || false;
    return wasPurchased && !isCompleted;
  }, [service?.userIDs_that_bought_this_service, service?.userIDs_whose_services_have_been_completed, safeUserId]);

  // Check if service is in cart
  const isInCart = useMemo(() => {
    return cart.some(item => item.id === service.id && item.cartType === "service");
  }, [cart, service.id]);

  // Safe description truncation
  const safeDescription = useMemo(() => {
    const desc = service?.description || 'No description available';
    return desc.length > 80 ? `${desc.substring(0, 80)}...` : desc;
  }, [service?.description]);

  // Handle view more click
  const handleViewMore = useCallback(() => {
    if (adminCtx?.openModal) {
      adminCtx.openModal(service);
    }
  }, [adminCtx, service]);

  // Handle cart operations
  const handleRemoveFromCart = useCallback(() => {
    if (service?.id) {
      removeFromCart(service.id, "service");
    }
  }, [removeFromCart, service?.id]);

  const handleAddToCart = useCallback(() => {
    addToCart(service, "service");
  }, [addToCart, service]);

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
      aria-label={`Service: ${service?.name || 'Unknown service'}`}
      onKeyDown={handleKeyDown}
    >
      <div className="d-flex align-items-center">
        <div className="me-3">
          {service?.preview ? (
            <img
              src={service.img_url || ''}
              alt={`${service.name || 'Service'} preview`}
              width={68}
              height={68}
              className="rounded-circle object-fit-cover"
              style={{ objectPosition: "center" }}
              loading="lazy"
            />
          ) : (
            <ServicesPlaceholder />
          )}
        </div>

        <div
          className="flex-fill d-flex flex-column justify-content-between"
          style={{ height: "100%" }}
        >
          <h6 className="flex-grow-1">{service?.name || 'Untitled Service'}</h6>
          <p className="text-primary mb-1">
            {service?.description && service.description.length > 80 ? (
              <span>
                {safeDescription}{" "}
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
                  aria-label="Service purchased"
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
                  aria-label="Remove service from cart"
                >
                  remove Service {"  "}
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
                  aria-label="Add service to cart"
                >
                  Add Service {"  "}
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

ServiceCard.displayName = 'ServiceCard';

export default ServiceCard;
