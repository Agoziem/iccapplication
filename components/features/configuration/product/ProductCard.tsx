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
  className = "",
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

  return (
    <div className={`col-12 col-md-4 ${className}`.trim()}>
      <div className="card shadow-sm hover-card" style={{ height: "380px" }}>
        <div className="card-body p-3">
          {/* Product Image */}
          <div className="d-flex justify-content-center mb-3 py-4 rounded bg-primary-light">
            {product.img_url ? (
              <img
                src={product.img_url}
                alt={product.name}
                className="rounded"
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
            <h6
              className="line-clamp-1"
              title={product.name}
            >
              {product.name}
            </h6>

            {/* Product Badges */}
            <div className="mb-2">
              {product.digital && (
                <span className="badge bg-info-light text-info me-1">
                  Digital
                </span>
              )}
              {product.free && (
                <span className="badge bg-success-light text-success me-1">
                  Free
                </span>
              )}
              {product.category && (
                <span className="badge bg-secondary-light text-secondary">
                  {product.category.category}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="card-text text-muted small mb-3 line-clamp-2">
              <div
                style={{ cursor: "pointer" }}
                onClick={handleViewMore}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleViewMore();
                  }
                }}
              >
                {product.description}
              </div>
            </p>

            {/* Price */}
            <div>
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
              className="badge bg-primary-light text-primary px-3 py-2 border-0 flex-fill"
              onClick={() => onEdit(product)}
              type="button"
              aria-label={`Edit ${product.name}`}
            >
              <i className="bi bi-pencil-square me-1"></i>
              Edit
            </button>
            <button
              className="badge bg-danger text-white px-3 py-2 border-0 flex-fill"
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
