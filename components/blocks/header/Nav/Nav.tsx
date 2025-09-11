"use client";
import "./nav.css";
// import Navlinks from './Navlinks'
// import NavSearch from './NavSearch';
import NavNotice from "./NavNotice";
import NavMessage from "./NavMessage";
import NavAvatar from "./NavAvatar";
import Cartbutton from "@/components/custom/Cartbutton/cart-button";

function Nav() {
  return (
    <nav className="header-nav ms-auto">
      <ul className="d-flex align-items-center">
        {/* <Navlinks /> */}
        {/* <NavSearch /> */}
        <div className="me-4">
          <Cartbutton />
        </div>
        <NavNotice />
        <NavMessage />
        <NavAvatar />
      </ul>
    </nav>
  );
}

export default Nav;
