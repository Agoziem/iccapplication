"use client";
import React from "react";
import "./nav.css";
import NavNotice from "./NavNotice";
import NavMessage from "./NavMessage";
import NavAvatar from "./NavAvatar";
import Cartbutton from "@/components/custom/Cartbutton/cart-button";

const Nav: React.FC = () => {
  return (
    <nav className="header-nav ms-auto">
      <ul className="d-flex align-items-center">
        <div className="me-4">
          <Cartbutton />
        </div>
        <NavNotice />
        <NavMessage />
        <NavAvatar />
      </ul>
    </nav>
  );
};

export default Nav;
