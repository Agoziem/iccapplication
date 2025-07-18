"use client";
import { useEffect, RefObject } from "react";

interface UseClickOutsideProps {
  ref: RefObject<HTMLElement>;
  refbutton?: RefObject<HTMLElement> | null;
  callback: () => void;
}

const useClickOutside = ({ ref, refbutton, callback }: UseClickOutsideProps): void => {
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
