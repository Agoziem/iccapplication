"use client";
import React, { useState } from "react";
import "./Header.css";
import Link from "next/link";
import MainHeaderLogo from "./Logo";
import { FaTimes } from "react-icons/fa";
import navlist from "./navitem";
import { useRouter } from "next/navigation";
import { useMyProfile } from "@/data/hooks/user.hooks";


type MenuProps = {
  isOpen: boolean;
  toggle: () => void;
};

const Menu: React.FC<MenuProps> = ({ isOpen, toggle }) => {
  const { data: user } = useMyProfile();
  const [activeLink, setActiveLink] = useState("/");
  const router = useRouter();
  return (
    <nav className={`menu ${isOpen ? "open" : ""}`}>
      <div className="d-flex justify-content-between px-3 pt-3">
        <MainHeaderLogo />
        <FaTimes
          onClick={toggle}
          style={{ cursor: "pointer", fontSize: "25px" }}
        />
      </div>

      <ul className="pt-4 px-3">
        {navlist.map((item) => {
          return (
            <li className="mx-3" key={item.id} style={{padding:"10px 0px"}}>
              <Link
                href={item.link}
                className={activeLink === item.link ? "active" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveLink(item.link);
                  router.push(`${item.link}`);
                  toggle();
                }}
              >
                {item.title}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="d-flex justify-content-center mt-2 px-3">
        {user ? (
          <Link
            href="/dashboard"
            className="btn btn-primary text-white font-bold w-100"
          >
            go to Dashboard
          </Link>
        ) : (
          <Link
            href="/auth/signin"
            className="btn btn-primary text-white font-bold w-100"
          >
            get Started now
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Menu;
