import { useCart } from "@/providers/context/Cartcontext";
import React from "react";
import "./cartbutton.css"

const Cartbutton = () => {
  const { cart } = useCart();
  return (
    <div
      className="position-relative"
      data-bs-toggle="offcanvas"
      data-bs-target="#offcanvasTop"
      aria-controls="offcanvasTop"
      style={{ cursor: "pointer" }}
    >
      <i className="text-primary bi bi-cart3" style={{ fontSize: "26px" }}></i>
      {cart.length > 0 && (
        <span className="badge bg-danger badge-number">
          {cart.length}
          <span className="visually-hidden">cart items</span>
        </span>
      )}
    </div>
  );
};

export default Cartbutton;
