import React from "react";

const NavMessage: React.FC = () => {
  return (
    <li className="nav-item dropdown">
      <a className="nav-link nav-icon" href="#" data-bs-toggle="dropdown">
        <i className="bi bi-chat-left-text"></i>
      </a>

      <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow messages">
        <li className="dropdown-header text-primary">
          You have 0 new messages at the moment
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li>

        <li className="message-item">
          <a href="#">
            <div className="px-4">
              <h4>Message header</h4>
              <p>No messages yet</p>
            </div>
          </a>
        </li>
      </ul>
    </li>
  );
};

export default NavMessage;
