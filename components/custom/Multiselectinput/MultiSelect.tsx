"use client";
import React, { useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
import "@/components/blocks/header/Nav/nav.css";
import { RiArrowDropDownLine } from "react-icons/ri";
import useClickOutside from "@/hooks/useClickOutside";

export const MultiSelectinput = ({
  multiselectbuttonref,
  setIsOpen,
  isOpen,
  initiallist,
  currentlist,
  setCurrentlist,
  itemName,
}) => {
  const handleChange = (event, item) => {
    if (event.target.checked) {
      setCurrentlist([...currentlist, item]);
    } else {
      setCurrentlist(currentlist.filter((i) => i.id !== parseInt(item.id)));
    }
  };

  return (
    <>
      {/* the custom select item */}
      <div
        className="py-3 px-4 rounded"
        style={{ border: "1px solid var(--bgDarkColor)" }}
      >
        <div className="d-flex justify-content-between flex-wrap">
          <div
            className="d-flex flex-wrap align-items-center"
            style={{ maxWidth: "85%" }}
          >
            {currentlist &&
              currentlist.map((option) => (
                <div
                  key={option.id}
                  className="bg-secondary-light  text-secondary px-3 py-1 rounded-pill mx-1 my-1"
                  style={{ border: "1px solid var(--secondary)" }}
                >
                  {option.subjectname}
                  <span
                    className="mx-1"
                    onClick={() => {
                      setCurrentlist(
                        currentlist.filter((i) => i.id !== parseInt(option.id))
                      );
                    }} // remove the item from the list
                    style={{ cursor: "pointer" }}
                  >
                    <FaTimes />
                  </span>
                </div>
              ))}

            <div
              className="mx-1 my-1"
              onClick={() => setIsOpen(!isOpen)}
              style={{ cursor: "pointer" }}
            >
              Select {itemName}
            </div>
          </div>

          <div className="ms-2" ref={multiselectbuttonref}>
            <RiArrowDropDownLine
              className="h4"
              onClick={() => setIsOpen(!isOpen)}
              style={{ fontSize: "30px", cursor: "pointer" }}
            />
          </div>
        </div>
      </div>

      {/* the dropdown */}
      <div className="dropdown px-4 py-2">
        <ul
          className={`dropdown-menu dropdown-menu-end dropdown-menu-arrow ${
            isOpen ? "show" : ""
          }`}
        >
          {initiallist?.length > 0 &&
            initiallist.map((item, index) => (
              <React.Fragment key={item.id}>
                <li className="dropdown-item d-flex align-items-center">
                  <input
                    type="checkbox"
                    onChange={(event) => handleChange(event, item)}
                    className="me-3 bg-primary-light"
                    checked={currentlist.some((i) => i.id === item.id)}
                    style={{ cursor: "pointer" }}
                    id={`item-${item.id}`}
                  />
                  <label htmlFor={`item-${item.id}`}>{item.subjectname}</label>
                </li>
                {index !== initiallist.length - 1 && (
                  <li key={`Divider-${index}`}>
                    <hr className="dropdown-divider" />
                  </li>
                )}
              </React.Fragment>
            ))}
        </ul>
      </div>
    </>
  );
};

// The Main Dropdown component
export const MultiSelectDropdown = ({
  initiallist, // the initial list of items
  currentlist, // the current list of items
  setCurrentlist, // update the current list of items
  itemName, // the name of the item
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const multipleselectdropdownRef = useRef(null);
  const multiselectbuttonref = useRef(null);
  useClickOutside(multipleselectdropdownRef, multiselectbuttonref, () =>
    setIsOpen(false)
  );

  return (
    <div ref={multipleselectdropdownRef}>
      <MultiSelectinput
        multiselectbuttonref={multiselectbuttonref}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        initiallist={initiallist}
        currentlist={currentlist}
        setCurrentlist={setCurrentlist}
        itemName={itemName}
      />
    </div>
  );
};
