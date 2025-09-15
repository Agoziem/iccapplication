"use client";
import React, { memo } from "react";

const NavMessage: React.FC = memo(() => {
  return (
    <li className="nav-item dropdown">
      <a 
        className="nav-link nav-icon" 
        href="#" 
        data-bs-toggle="dropdown"
        role="button"
        aria-label="View messages"
        aria-expanded="false"
      >
        <i className="bi bi-chat-left-text"></i>
        {/* <span className="badge bg-success badge-number">3</span> */}
      </a>

      <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow messages">
        <li className="dropdown-header text-primary">
          You have 0 new messages at the moment
          {/* <a href="#">
            <span className="badge rounded-pill bg-primary p-2 ms-2">
              View all
            </span>
          </a> */}
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li>

        {/* <li className="message-item">
          <a href="#">
            <img
              src="assets/img/messages-1.jpg"
              alt=""
              className="rounded-circle"
            />
            <div>
              <h4>Maria Hudson</h4>
              <p>
                Velit asperiores et ducimus soluta repudiandae labore officia
                est ut...
              </p>
              <p>4 hrs. ago</p>
            </div>
          </a>
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li> */}

        <li className="message-item">
          <a href="#">
            <div className="px-4">
              <h4>Message header</h4>
              <p>No messages yet</p>
              {/* <p>4 hrs. ago</p> */}
            </div>
          </a>
        </li>

        {/* <li className="dropdown-footer">
          <a href="#">Show all messages</a>
        </li> */}
      </ul>
    </li>
  );
});

NavMessage.displayName = 'NavMessage';

export default NavMessage;
