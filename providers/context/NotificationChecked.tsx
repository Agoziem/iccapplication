import React, { createContext, useContext } from "react";
import useLocalStorage from "@/hooks/useLocalStorage"; // path to your hook

type HasCheckedContextType = {
  hasChecked: boolean;
  setHasChecked: (value: boolean) => void;
  removeHasChecked: () => void;
};

const HasCheckedContext = createContext<HasCheckedContextType | undefined>(undefined);

export const HasCheckedProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    storedValue: hasChecked,
    setValue: setHasChecked,
    removeValue: removeHasChecked,
  } = useLocalStorage<boolean>("hasChecked", false);

  return (
    <HasCheckedContext.Provider value={{ hasChecked, setHasChecked, removeHasChecked }}>
      {children}
    </HasCheckedContext.Provider>
  );
};

export const useHasChecked = () => {
  const context = useContext(HasCheckedContext);
  if (!context) {
    throw new Error("useHasChecked must be used within a HasCheckedProvider");
  }
  return context;
};
