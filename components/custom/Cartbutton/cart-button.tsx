import { useCart } from "@/providers/context/Cartcontext";
import React from "react";
import "./cartbutton.css"

const Cartbutton = () => {
  const { cart,setShowOffCanvas } = useCart();
  return (
    <div
      className="position-relative"
      style={{ cursor: "pointer" }}
      onClick={() => setShowOffCanvas(true)}
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
