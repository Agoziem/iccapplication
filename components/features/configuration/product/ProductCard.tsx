import React from "react";
import ProductPlaceholder from "@/components/custom/ImagePlaceholders/Productplaceholder";
import { Product } from "@/types/items";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onView?: (product: Product) => void;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onEdit, 
  onDelete, 
  onView,
  className = "" 
}) => {
  const handleViewMore = () => {
    if (onView) {
      onView(product);
    }
  };

  const formatPrice = (price: string | number): string => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(numPrice);
  };

  const truncateDescription = (text: string, maxLength: number = 80): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className={`col-12 col-md-4 ${className}`.trim()}>
      <div className="card h-100 shadow-sm hover-card">
        <div className="card-body p-3">
          {/* Product Image */}
          <div className="d-flex justify-content-center mb-3">
            {product.img_url ? (
              <img
                src={product.img_url}
                alt={product.name}
                className="rounded-circle"
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                }}
              />
            ) : (
              <ProductPlaceholder />
            )}
          </div>

          {/* Product Info */}
          <div className="text-center">
            <h6 className="card-title fw-bold text-truncate" title={product.name}>
              {product.name}
            </h6>
            
            {/* Product Badges */}
            <div className="mb-2">
              {product.digital && (
                <span className="badge bg-info text-dark me-1">Digital</span>
              )}
              {product.free && (
                <span className="badge bg-success me-1">Free</span>
              )}
              {product.category && (
                <span className="badge bg-secondary">{product.category.category}</span>
              )}
            </div>

            {/* Description */}
            <p className="card-text text-muted small mb-3">
              {product.description.length > 80 ? (
                <>
                  {truncateDescription(product.description)}
                  {onView && (
                    <span
                      className="text-primary fw-bold ms-1"
                      style={{ cursor: "pointer" }}
                      onClick={handleViewMore}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleViewMore();
                        }
                      }}
                    >
                      view more
                    </span>
                  )}
                </>
              ) : (
                product.description
              )}
            </p>

            {/* Price */}
            <div className="mb-3">
              <span className="h5 text-primary fw-bold">
                {product.free ? "Free" : formatPrice(product.price)}
              </span>
            </div>
          </div>
        </div>

        {/* Card Footer with Actions */}
        <div className="card-footer bg-transparent border-top-0 pt-0">
          <div className="d-flex gap-2 justify-content-center">
            <button
              className="btn btn-sm btn-outline-primary flex-fill"
              onClick={() => onEdit(product)}
              type="button"
              aria-label={`Edit ${product.name}`}
            >
              <i className="bi bi-pencil-square me-1"></i>
              Edit
            </button>
            <button
              className="btn btn-sm btn-outline-danger flex-fill"
              onClick={() => onDelete(product)}
              type="button"
              aria-label={`Delete ${product.name}`}
            >
              <i className="bi bi-trash me-1"></i>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
