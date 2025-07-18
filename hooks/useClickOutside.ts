"use client";
import { useEffect } from "react";

const useClickOutside = (ref, refbutton, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        if (
          !refbutton ||
          (refbutton &&
            refbutton.current &&
            !refbutton.current.contains(event.target))
        ) {
          callback();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, refbutton, callback]);
};

export default useClickOutside;
