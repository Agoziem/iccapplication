import React from "react";
import ProductPlaceholder from "../../custom/ImagePlaceholders/Productplaceholder";
import { useSession } from "next-auth/react";

const ProductCard = ({
  product,
  openModal,
  cart,
  addToCart,
  removeFromCart,
}) => {
  const { data: session } = useSession();
  return (
    <div className="card p-4 py-4">
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
          className="flex-fill d-flex flex-column justify-content-between"
          style={{ height: "100%" }}
        >
          <h6 className="flex-grow-1">{product.name}</h6>
          <p className="text-primary mb-1">
            {product.description.length > 80 ? (
              <span>
                {product.description.substring(0, 80)}...{" "}
                <span
                  className="text-secondary fw-bold"
                  style={{ cursor: "pointer" }}
                  onClick={() => openModal(product)}
                >
                  view more
                </span>
              </span>
            ) : (
              product.description
            )}
          </p>
          <div className="d-flex justify-content-between mt-3 flex-wrap">
            <span className="fw-bold text-primary me-2">
              &#8358;{parseFloat(product.price)}
            </span>

            <div className="me-2 me-md-3">
              {product.userIDs_that_bought_this_product.includes(
                parseInt(session?.user?.id)
              ) ? (
                <span className="badge bg-primary-light text-primary p-2">
                  Purchased
                  <i className="bi bi-check-circle ms-2"></i>
                </span>
              ) : cart.find(
                  (item) =>
                    item.id === product.id && item.cartType === "product"
                ) ? (
                <span
                  className="badge bg-secondary-light text-secondary p-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => removeFromCart(product.id, "product")}
                >
                  remove product {"  "}
                  <i className="bi bi-cart-dash"></i>
                </span>
              ) : (
                <span
                  className="badge bg-success-light text-success p-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => addToCart(product, "product")}
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
};

export default ProductCard;
