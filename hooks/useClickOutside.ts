"use client";
import { useEffect, RefObject } from "react";

const useClickOutside = (
  ref: RefObject<HTMLElement | null>, 
  refbutton: RefObject<HTMLElement | null> | null, 
  callback: () => void
): void => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      const target = event.target as Node;
      
      if (ref.current && !ref.current.contains(target)) {
        if (
          !refbutton ||
          (refbutton &&
            refbutton.current &&
            !refbutton.current.contains(target))
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
