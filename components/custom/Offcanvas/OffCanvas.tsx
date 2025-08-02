"use client";
import { useCart } from "@/data/Cartcontext";
import React, { useRef } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Alert from "../Alert/Alert";
import { PulseLoader } from "react-spinners";

const OffCanvas = () => {
  const { cart, removeFromCart, resetCart, checkout, isPending, error } = useCart();
  const { data: session } = useSession();
  const offCanvasbuttonRef = useRef<HTMLButtonElement>(null);

  const closeOffCanvas = () => {
    const offCanvasButton = offCanvasbuttonRef.current;
    if (offCanvasButton) {
      offCanvasButton.click();
    }
  };

  const handleCheckout = async () => {
    await checkout();
    closeOffCanvas();
  };

  const handleClearCart = () => {
    resetCart();
  };

  const handleRemoveItem = (itemId: string | number, cartType: "service" | "product" | "video") => {
    removeFromCart(String(itemId), cartType);
  };

  const calculateTotal = () => {
    return cart.reduce((acc, item) => {
      let price = "0";
      switch (item.cartType) {
        case "service":
          price = item.service.price;
          break;
        case "product":
          price = item.product.price;
          break;
        case "video":
          price = item.video.price;
          break;
      }
      return acc + parseFloat(price);
    }, 0);
  };

  const getItemDetails = (item: any) => {
    switch (item.cartType) {
      case "service":
        return {
          id: item.service.id,
          name: item.service.name,
          price: item.service.price,
          category: item.service.category,
        };
      case "product":
        return {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          category: item.product.category,
        };
      case "video":
        return {
          id: item.video.id,
          name: item.video.title,
          price: item.video.price,
          category: item.video.category,
        };
      default:
        return { id: 0, name: "", price: "0", category: { category: "" } };
    }
  };

  return (
    <div
      className="offcanvas offcanvas-end"
      tabIndex={-1}
      id="offcanvasTop"
      aria-labelledby="offcanvasTopLabel"
      style={{ backgroundColor: "var(--bgLightColor)" }}
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="offcanvasTopLabel">
          Shopping Cart
        </h5>
        <button
          ref={offCanvasbuttonRef}
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>

      <div className="offcanvas-body py-2">
        {cart && cart.length > 0 ? (
          <div className="d-flex flex-column justify-content-between h-100">
            <ul className="list-group">
              {cart.map((item) => {
                const itemDetails = getItemDetails(item);
                return (
                  <li
                    key={`${item.cartType}-${itemDetails.id}`}
                    className="list-group-item"
                    style={{
                      backgroundColor: "var(--bgLightColor)",
                      borderColor: "var(--bgDarkColor)",
                    }}
                  >
                    <div className="d-flex justify-content-between">
                      <div className="flex-fill">{itemDetails.name}</div>
                      <div className="fw-bold">&#8358;{itemDetails.price}</div>
                    </div>
                    <div className="d-flex justify-content-between mt-2">
                      <div className="fw-bold small text-secondary">
                        {itemDetails.category?.category !== "application" ? (
                          <i className="bi bi-person-fill-gear me-2 h5"></i>
                        ) : (
                          <i className="bi bi-google-play me-2"></i>
                        )}
                        {itemDetails.category?.category}{" "}
                        <span className="ms-2 badge bg-primary-light text-primary">
                          {item.cartType}
                        </span>
                      </div>
                      <div
                        className="badge bg-secondary-light text-secondary ms-2"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleRemoveItem(itemDetails.id, item.cartType)}
                      >
                        Remove
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="d-flex flex-column justify-content-between pb-4 ps-3">
              <h4 className="mb-3">
                Total:{" "}
                <span className="fw-bold">
                  &#8358;{calculateTotal()}
                </span>
              </h4>

              <div>{error && <Alert type="danger">{error}</Alert>}</div>

              <div className="d-flex flex-md-row flex-column flex-md-fill">
                <button
                  className="btn btn-outline-danger me-0 me-md-3 mb-3 mb-md-0"
                  onClick={handleClearCart}
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                >
                  Clear Cart
                </button>
                {session ? (
                  <button
                    className="btn btn-primary"
                    onClick={handleCheckout}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <div className="d-inline-flex align-items-center justify-content-center gap-2">
                        <div>Checking out</div>
                        <PulseLoader
                          size={8}
                          color={"#12000d"}
                          loading={true}
                        />
                      </div>
                    ) : (
                      "Checkout"
                    )}
                  </button>
                ) : (
                  <Link className="btn btn-primary" href="/accounts/signin">
                    Login to Checkout
                  </Link>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p>Your cart is empty</p>
        )}
      </div>
    </div>
  );
};

export default OffCanvas;
