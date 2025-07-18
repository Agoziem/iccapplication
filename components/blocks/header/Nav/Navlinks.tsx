import Link from "next/link";
import React from "react";

function Navlinks() {
  return (
    <li className="nav-item dropdown d-none d-md-block">
      <a className="nav-link nav-icon" href="#" data-bs-toggle="dropdown">
        <i className="bi bi-box-arrow-up-right"></i>
      </a>

      <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
        {/* teachers Portal */}
        <li>
          <Link
            className="dropdown-item d-flex align-items-center"
            href="/teachers-portal"
          >
            <i className="bi bi-gear"></i>
            <span>Teachers Portal</span>
          </Link>
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li>

        {/* students Portal */}
        <li>
          <Link
            className="dropdown-item d-flex align-items-center"
            href="/students-portal"
          >
            <i className="bi bi-mortarboard"></i>
            <span>Students Portal</span>
          </Link>
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li>

        {/* finance Portal */}
        <li>
          <Link
            className="dropdown-item d-flex align-items-center"
            href="/accounting-portal"
          >
            <i className="bi bi-cash-coin"></i>
            <span>Accounting Portal</span>
          </Link>
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li>

        {/* Admin Portal */}
        <li>
          <Link
            className="dropdown-item d-flex align-items-center"
            href="/admin-portal"
          >
            <i className="bi bi-lock"></i>
            <span>Admins Portal</span>
          </Link>
        </li>
      </ul>
    </li>
  );
}

export default Navlinks;
