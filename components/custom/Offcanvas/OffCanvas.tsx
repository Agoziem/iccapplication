"use client";
import { useCart } from "@/providers/context/Cartcontext";
import React, { useRef, useState } from "react";
import Link from "next/link";
import Alert from "../Alert/Alert";
import { PulseLoader } from "react-spinners";
import { useMyProfile } from "@/data/hooks/user.hooks";
import Offcanvas from "react-bootstrap/Offcanvas";

const OffCanvasComponent: React.FC = () => {
  const { cart, removeFromCart, resetCart, checkout, isPending, showOffCanvas, setShowOffCanvas } =
    useCart();
  const { data: session } = useMyProfile();

  // Function to close the off-canvas using native Bootstrap event
  const closeOffCanvas = () => {
    setShowOffCanvas(false);
  };

  const handleCheckout = async () => {
    try {
      await checkout(); // Perform the checkout logic
      closeOffCanvas(); // Close the off-canvas after checkout  
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  const handleClearCart = () => {
    resetCart();
    closeOffCanvas();
  };

  const getItemDisplayName = (item: any): string => {
    return item.name || item.title || "Item";
  };

  const getItemPrice = (item: any): number => {
    const price =
      typeof item.price === "string" ? parseFloat(item.price) : item.price;
    return isNaN(price) ? 0 : price;
  };

  const getTotalPrice = (): number => {
    return cart.reduce((acc, item) => acc + getItemPrice(item), 0);
  };

  return (
    <Offcanvas
      placement="end"
      show={showOffCanvas}
      onHide={closeOffCanvas}
      style={{ backgroundColor: "var(--bgLightColor)" }}
    >
      {/* Off-Canvas Header */}
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="offcanvasTopLabel">
          Shopping Cart
        </h5>
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={closeOffCanvas}
        />
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
                    <div className="flex-fill">{getItemDisplayName(item)}</div>
                    <div className="fw-bold">&#8358;{getItemPrice(item)}</div>
                  </div>
                  <div className="d-flex justify-content-between mt-2">
                    <div className="fw-bold small text-secondary">
                      {item.category &&
                      item.category.category !== "application" ? (
                        <i className="bi bi-person-fill-gear me-2 h5" />
                      ) : (
                        <i className="bi bi-google-play me-2" />
                      )}
                      {item.category?.category || "Unknown"}{" "}
                      <span className="ms-2 badge bg-primary-light text-primary">
                        {item.cartType}
                      </span>
                    </div>
                    <div
                      className="badge bg-secondary-light text-secondary ms-2"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        item.cartType && removeFromCart(item.id!, item.cartType)
                      }
                    >
                      Remove
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="d-flex flex-column justify-content-between pb-4 ps-3">
              <h4 className="mb-3">
                Total: <span className="fw-bold">&#8358;{getTotalPrice()}</span>
              </h4>

              {/* Cart Buttons */}
              <div className="d-flex flex-md-row flex-column flex-md-fill">
                <button
                  className="btn btn-outline-danger me-0 me-md-3 mb-3 mb-md-0"
                  onClick={handleClearCart}
                  disabled={isPending}
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
    </Offcanvas>
  );
};

export default OffCanvasComponent;
