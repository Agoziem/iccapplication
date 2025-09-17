"use client";
import { useCart } from "@/providers/context/Cartcontext";
import React from "react";

interface CartButtonProps {
  className?: string;
  style?: React.CSSProperties;
  checkoutText?: string;
  emptyCartText?: string;
}

const CartButton: React.FC<CartButtonProps> = ({
  className = "",
  style = {},
  checkoutText = "Check out now",
  emptyCartText = "View your Cart",
}) => {
  const { cart, setShowOffCanvas } = useCart();

  const buttonText = cart.length > 0 ? checkoutText : emptyCartText;

  const defaultStyle: React.CSSProperties = {
    cursor: "pointer",
    backgroundColor: "var(--bgDarkerColor)",
    color: "var(--white)",
    borderRadius: "5px",
    ...style,
  };

  return (
    <div
      className={`px-3 py-2 position-relative mb-2 mb-md-0 ${className}`}
      style={defaultStyle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setShowOffCanvas(true);
        }
      }}
      onClick={() => setShowOffCanvas(true)}
    >
      {buttonText}
      <i className="bi bi-cart3 ms-2 h6" />
      {cart.length > 0 && (
        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
          {cart.length}
          <span className="visually-hidden">cart items</span>
        </span>
      )}
    </div>
  );
};

export default CartButton;
