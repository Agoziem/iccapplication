"use client";
import { useCart } from "@/data/carts/Cartcontext";
import React, { useContext, useRef } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Alert from "../Alert/Alert";
import { PulseLoader } from "react-spinners";

const OffCanvas = () => {
  const { cart, removeFromCart, resertCart, checkout, isPending, error } =
    useCart();
  const { data: session } = useSession();
  const offCanvasbuttonRef = useRef(null); // Ref for the off-canvas

  // Function to close the off-canvas using native Bootstrap event
  const closeOffCanvas = () => {
    const offCanvasButton = offCanvasbuttonRef.current;
    if (offCanvasButton) {
      offCanvasButton.click();
    }
  };

  const handleCheckout = async () => {
    await checkout(); // Perform the checkout logic
    closeOffCanvas(); // Close the off-canvas after successful checkout
  };

  return (
    <div
      className="offcanvas offcanvas-end"
      tabIndex={-1}
      id="offcanvasTop"
      aria-labelledby="offcanvasTopLabel"
      style={{ backgroundColor: "var(--bgLightColor)" }}
    >
      {/* Off-Canvas Header */}
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

      {/* Off-Canvas Body */}
      <div className="offcanvas-body py-2">
        {cart && cart.length > 0 ? (
          <div className="d-flex flex-column justify-content-between h-100">
            <ul className="list-group">
              {cart.map((item) => (
                <li
                  key={`${item.cartType}-${item.id}`}
                  className="list-group-item"
                  style={{
                    backgroundColor: "var(--bgLightColor)",
                    borderColor: "var(--bgDarkColor)",
                  }}
                >
                  <div className="d-flex justify-content-between">
                    <div className="flex-fill">{item.name || item.title}</div>
                    <div className="fw-bold">&#8358;{item.price}</div>
                  </div>
                  <div className="d-flex justify-content-between mt-2">
                    <div className="fw-bold small text-secondary">
                      {item.category.category !== "application" ? (
                        <i className="bi bi-person-fill-gear me-2 h5"></i>
                      ) : (
                        <i className="bi bi-google-play me-2"></i>
                      )}
                      {item.category.category}{" "}
                      <span className="ms-2 badge bg-primary-light text-primary">
                        {item.cartType}
                      </span>
                    </div>
                    <div
                      className="badge bg-secondary-light text-secondary ms-2"
                      style={{ cursor: "pointer" }}
                      onClick={() => removeFromCart(item.id, item.cartType)}
                    >
                      Remove
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="d-flex flex-column justify-content-between pb-4 ps-3">
              <h4 className="mb-3">
                Total:{" "}
                <span className="fw-bold">
                  &#8358;
                  {cart.reduce((acc, item) => acc + parseFloat(item.price), 0)}
                </span>
              </h4>

              {/* Alert */}
              <div>{error && <Alert type="danger">{error}</Alert>}</div>

              {/* Cart Buttons */}
              <div className="d-flex flex-md-row flex-column flex-md-fill">
                <button
                  className="btn btn-outline-danger me-0 me-md-3 mb-3 mb-md-0"
                  onClick={() => resertCart()}
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                >
                  Clear Cart
                </button>
                {session ? (
                  <button
                    className="btn btn-primary"
                    onClick={handleCheckout} // Use the handler to checkout and close
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
