"use client";
import React, { useEffect, useState } from "react";
import Menu from "./HambugerMenu";
import "./Header.css";
import "../logo.css";
import Link from "next/link";
import { IoMenu } from "react-icons/io5";
import MainHeaderLogo from "./Logo";
import navlist from "./navitem";
import Image from "next/image";
import { MdOutlineShoppingCart } from "react-icons/md";
import { useCart } from "@/providers/context/Cartcontext";
import Cartbutton from "@/components/custom/Cartbutton/cart-button";
import { logoutUser, useMyProfile } from "@/data/hooks/user.hooks";
import { useRouter } from "next/navigation";

const MainHeader = () => {
  const { cart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("/");
  const { data: user } = useMyProfile();
  const router = useRouter();
  // const [toggleDropdown, setToggleDropdown] = useState(false);

  const handleActive = (link: string) => {
    setActiveLink(link);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleScroll = () => {
        const header = document.getElementById("header");
        const scrollPosition = window.scrollY;

        if (header) {
          if (scrollPosition > 0) {
            header.style.backgroundColor = "#FFF2FC";
          } else {
            header.style.backgroundColor = "transparent";
          }
        }
      };

      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async(e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    try {
      await logoutUser();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav
      id="header"
      className="header fixed-top d-flex align-items-center justify-content-between py-3 px-2 px-md-5"
      style={{
        backgroundColor: "transparent",
      }}
    >
      <MainHeaderLogo />

      <div className="d-none d-lg-block">
        <ul className="d-flex list-unstyled align-items-center mb-0">
          {navlist.map((item) => {
            return (
              <li className="mx-3" key={item.id}>
                <Link
                  href={item.link}
                  className={activeLink === item.link ? "active" : ""}
                  onClick={() => handleActive(item.link)}
                >
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* large Screen */}
      <div className="mainnav-link d-none d-lg-flex align-items-center">
        <div className="font-bold me-4">
          <Cartbutton />
        </div>
        <div className="d-flex">
          <Link href={"/dashboard"}>
            <button
              className="btn btn-primary text-white font-bold me-2 text-nowrap"
              style={{
                padding: "7px 22px",
                borderRadius: "25px",
              }}
            >
              {user ? "Dashboard" : "Get Started"}
            </button>
          </Link>
          {user && (
            <div className="dropdown">
              <a href="#" data-bs-toggle="dropdown">
                {user?.avatar_url ? (
                  <Image
                    src={user.avatar_url}
                    alt="Profile"
                    width={38}
                    height={38}
                    className="rounded-circle object-fit-cover"
                    style={{ objectPosition: "top center" }}
                  />
                ) : (
                  <div
                    className="rounded-circle text-white d-flex justify-content-center align-items-center"
                    style={{
                      width: 40,
                      height: 40,
                      fontSize: 20,
                      backgroundColor: "var(--secondary)",
                    }}
                  >
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                )}
              </a>
              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow mt-3">
                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center"
                    href={`/terms-of-use`}
                  >
                    <i className="bi bi-person-lock"></i>
                    <span>Terms of Use</span>
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center"
                    href={`/privacy-policy`}
                  >
                    <i className="bi bi-shield-shaded"></i>
                    <span>Privacy Policy</span>
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center"
                    href={`/`}
                    onClick={(e) => {
                      handleLogout(e);
                    }}
                  >
                    <i className="bi bi-box-arrow-right"></i>
                    <span>log out</span>
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <>
        {/* small screen */}
        <div className="d-flex d-lg-none align-items-center">
          <div
            className="position-relative me-3"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasTop"
            aria-controls="offcanvasTop"
            style={{ cursor: "pointer" }}
          >
            <MdOutlineShoppingCart
              className="text-primary"
              style={{ fontSize: "25px" }}
            />
            {cart.length > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cart.length}
                <span className="visually-hidden">cart items</span>
              </span>
            )}
          </div>

          <IoMenu
            className="text-primary me-2"
            onClick={toggleMenu}
            style={{ cursor: "pointer", fontSize: "28px" }}
          />
          {user && (
            <div className="dropdown d-inline">
              <a href="#" data-bs-toggle="dropdown">
                {user.avatar_url ? (
                  <Image
                    src={user.avatar_url}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="rounded-circle object-fit-cover me-2"
                    style={{ objectPosition: "top center" }}
                  />
                ) : (
                  <div
                    className="rounded-circle text-white d-flex justify-content-center align-items-center me-2"
                    style={{
                      width: 32,
                      height: 32,
                      fontSize: 15,
                      backgroundColor: "var(--secondary)",
                    }}
                  >
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                )}
              </a>
              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow mt-3">
                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center"
                    href={`/terms-of-use`}
                  >
                    <i className="bi bi-person-lock"></i>
                    <span>Terms of Use</span>
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center"
                    href={`/privacy-policy`}
                  >
                    <i className="bi bi-shield-shaded"></i>
                    <span>Privacy Policy</span>
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center"
                    href={`/`}
                    onClick={(e) => {
                      handleLogout(e);
                    }}
                  >
                    <i className="bi bi-box-arrow-right"></i>
                    <span>log out</span>
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>

        <Menu isOpen={isOpen} toggle={toggleMenu} />
      </>
    </nav>
  );
};

export default MainHeader;
