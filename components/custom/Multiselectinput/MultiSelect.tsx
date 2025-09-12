"use client";
import React, { useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
import "@/components/blocks/header/Nav/nav.css";
import { RiArrowDropDownLine } from "react-icons/ri";
import useClickOutside from "@/hooks/useClickOutside";

interface MultiSelectItem {
  id: number;
  subjectname: string;
}

interface MultiSelectInputProps {
  multiselectbuttonref: React.RefObject<HTMLDivElement | null>;
  setIsOpen: (isOpen: boolean) => void;
  isOpen: boolean;
  initiallist: MultiSelectItem[];
  currentlist: MultiSelectItem[];
  setCurrentlist: (list: MultiSelectItem[]) => void;
  itemName: string;
  disabled?: boolean;
  placeholder?: string;
}

export const MultiSelectinput: React.FC<MultiSelectInputProps> = ({
  multiselectbuttonref,
  setIsOpen,
  isOpen,
  initiallist,
  currentlist,
  setCurrentlist,
  itemName,
  disabled = false,
  placeholder
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, item: MultiSelectItem) => {
    if (disabled) return;
    
    if (event.target.checked) {
      setCurrentlist([...currentlist, item]);
    } else {
      setCurrentlist(currentlist.filter((i) => i.id !== item.id));
    }
  };

  const handleRemoveItem = (itemId: number) => {
    if (disabled) return;
    setCurrentlist(currentlist.filter((i) => i.id !== itemId));
  };

  const toggleDropdown = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* the custom select item */}
      <div
        className={`py-3 px-4 rounded ${disabled ? 'opacity-50' : ''}`}
        style={{ 
          border: "1px solid var(--bgDarkColor)",
          cursor: disabled ? "not-allowed" : "default"
        }}
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
                  className="bg-secondary-light text-secondary px-3 py-1 rounded-pill mx-1 my-1"
                  style={{ border: "1px solid var(--secondary)" }}
                >
                  {option.subjectname}
                  <span
                    className="mx-1"
                    onClick={() => handleRemoveItem(option.id)}
                    style={{ 
                      cursor: disabled ? "not-allowed" : "pointer",
                      opacity: disabled ? 0.5 : 1
                    }}
                  >
                    <FaTimes />
                  </span>
                </div>
              ))}

            <div
              className="mx-1 my-1"
              onClick={toggleDropdown}
              style={{ 
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.5 : 1
              }}
            >
              {placeholder || `Select ${itemName}`}
            </div>
          </div>

          <div className="ms-2" ref={multiselectbuttonref}>
            <RiArrowDropDownLine
              className="h4"
              onClick={toggleDropdown}
              style={{ 
                fontSize: "30px", 
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.5 : 1
              }}
            />
          </div>
        </div>
      </div>

      {/* the dropdown */}
      <div className="dropdown px-4 py-2">
        <ul
          className={`dropdown-menu dropdown-menu-end dropdown-menu-arrow ${
            isOpen && !disabled ? "show" : ""
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
                    disabled={disabled}
                    style={{ 
                      cursor: disabled ? "not-allowed" : "pointer"
                    }}
                    id={`item-${item.id}`}
                  />
                  <label 
                    htmlFor={`item-${item.id}`}
                    style={{ 
                      cursor: disabled ? "not-allowed" : "pointer",
                      opacity: disabled ? 0.5 : 1
                    }}
                  >
                    {item.subjectname}
                  </label>
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

interface MultiSelectDropdownProps {
  initiallist: MultiSelectItem[];
  currentlist: MultiSelectItem[];
  setCurrentlist: (list: MultiSelectItem[]) => void;
  itemName: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

// The Main Dropdown component
export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  initiallist,
  currentlist,
  setCurrentlist,
  itemName,
  disabled = false,
  placeholder,
  className = "",
  style = {}
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const multipleselectdropdownRef = useRef<HTMLDivElement>(null);
  const multiselectbuttonref = useRef<HTMLDivElement>(null);
  
  useClickOutside(multipleselectdropdownRef, multiselectbuttonref, () =>
    setIsOpen(false)
  );

  return (
    <div ref={multipleselectdropdownRef} className={className} style={style}>
      <MultiSelectinput
        multiselectbuttonref={multiselectbuttonref}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        initiallist={initiallist}
        currentlist={currentlist}
        setCurrentlist={setCurrentlist}
        itemName={itemName}
        disabled={disabled}
        placeholder={placeholder}
      />
    </div>
  );
};
