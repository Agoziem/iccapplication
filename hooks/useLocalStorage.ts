import { useState, useEffect } from "react";

type UseLocalStorageReturn<T> = {
  storedValue: T;
  setValue: (value: T | ((val: T) => T)) => void;
  removeValue: () => void;
};

const useLocalStorage = <T>(key: string, initialValue: T): UseLocalStorageReturn<T> => {
  const isClient = typeof window !== "undefined";

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (isClient) {
      try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        console.error("Error parsing localStorage item:", error);
        return initialValue;
      }
    } else {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      if (isClient) {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        setStoredValue(valueToStore);
      } else {
        console.log("window object is not defined yet");
      }
    } catch (error) {
      console.error("Error setting localStorage item:", error);
    }
  };

  const removeValue = () => {
    try {
      if (isClient) {
        window.localStorage.removeItem(key);
        setStoredValue(initialValue);
      }
    } catch (error) {
      console.error("Error removing localStorage item:", error);
    }
  };

  return {
    storedValue,
    setValue,
    removeValue,
  };
};

export default useLocalStorage;
