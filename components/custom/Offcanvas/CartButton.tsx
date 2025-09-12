"use client";
import { useCart } from "@/providers/context/Cartcontext";
import React from "react";

const CartButton = () => {
  const { cart } = useCart();
  return (
    <div
      className="px-3 py-2 position-relative mb-2 mb-md-0"
      style={{
        cursor: "pointer",
        backgroundColor: "var(--bgDarkerColor)",
        color: "var(--white)",
        borderRadius: "5px",
      }}
      data-bs-toggle="offcanvas"
      data-bs-target="#offcanvasTop"
      aria-controls="offcanvasTop"
    >
      {cart.length > 0 ? "Check out now " : "View your Cart"}
      <i className="bi bi-cart3 ms-2 h6"></i>
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
